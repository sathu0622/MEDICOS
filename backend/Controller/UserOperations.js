import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserModel from "../Models/User.js";
import { authenticateUser, authorizeRoles } from "../middleware/authenticateUser.js";
import passport from "passport";


const router = express.Router();

// Generate Tokens
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.type }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.type }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in .env");
    }

    const token = jwt.sign(
      { id: user._id, type: user.type }, // include type for convenience
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Optional: send as HttpOnly cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



// REFRESH TOKEN
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

// LOGOUT
router.post("/logout", authenticateUser, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
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


// Start Google OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback URL after Google Auth
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);


export default router;