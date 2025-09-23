import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserModel from "../Models/User.js";
import { authenticateUser, authorizeRoles } from "../middleware/authenticateUser.js";
import passport from "passport";
import csurf from "csurf";

const router = express.Router();

const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // frontend should be able to read CSRF cookie (or you can use CSRF endpoint response)
    secure: false,
    sameSite: "lax",
  },
});

// Generate Tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, type: user.type }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const setAuthCookies = (res, accessToken, refreshToken) => {
 const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd, // only secure in production
    sameSite: isProd ? "none" : "lax", // lax for local dev
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   maxAge: 15 * 60 * 1000, // 15 min
  // });

  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });
};

// REGISTER
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("mobile").isLength({ min: 10 }).withMessage("Mobile must be at least 10 digits"),
    body("gender").isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
    body("type").optional().isIn(["user", "admin", "doctor"])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, mobile, type, gender, password } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already registered" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new UserModel({
        name,
        email,
        mobile,
        type: type || "user",
        gender,
        password: hashedPassword
      });

      await user.save();
      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Error registering user", error: err.message });
    }
  }
);


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, type: user.type }
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

router.get("/getUser", authenticateUser, async (req, res) => {
  try {
    const userId = req.userId; // set by authenticateUser middleware
    const user = await UserModel.findById(userId).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching user", error: err.message });
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    setAuthCookies(res, newAccessToken, refreshToken);

    res.json({ message: "Token refreshed" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }});

// LOGOUT
router.post("/logout", authenticateUser, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error logging out" });
  }
});

// ADMIN - Get all users
router.get("/getAllUsers", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await UserModel.find().select("-password -refreshToken");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users" });
  }
});
// UPDATE USER PROFILE
router.put(
  "/update/:id",
  authenticateUser,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("mobile")
      .optional()
      .isLength({ min: 10 })
      .withMessage("Mobile must be at least 10 digits"),
    body("gender")
      .optional()
      .isIn(["male", "female", "other"])
      .withMessage("Invalid gender"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("type")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Invalid role (only admin can assign roles)")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, mobile, gender, password, type } = req.body;

    try {
      // If user is not admin, they can only update their own profile
      if (req.role !== "admin" && req.userId !== id) {
        return res.status(403).json({
          message: "Unauthorized: You can only update your own profile"
        });
      }

      const updates = {};
      if (name) updates.name = name;
      if (mobile) updates.mobile = mobile;
      if (gender) updates.gender = gender;

      // If password is provided, hash it
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.password = hashedPassword;
      }

      // Only admin can update role (type)
      if (req.role === "admin" && type) {
        updates.type = type;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      }).select("-password -refreshToken");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (err) {
      res.status(500).json({ message: "Error updating user", error: err.message });
    }
  }
);


// // Start Google OAuth flow
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// // Callback URL after Google Auth
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
//   (req, res) => {
//     const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.redirect(`http://localhost:5173/dashboard?token=${token}`);
//   }
// );


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// GOOGLE OAUTH CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  async (req, res) => {
    try {
      const user = req.user;

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      setAuthCookies(res, accessToken, refreshToken);

      // Redirect frontend without exposing tokens
      // res.redirect("http://localhost:5173/Userhome");
      // google/callback
res.redirect("http://localhost:5173/Userhome?googleLogin=success");

    } catch (err) {
      res.redirect("http://localhost:5173/login?error=auth_failed");
    }
  }
);

export default router;