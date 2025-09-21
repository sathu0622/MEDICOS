import express from "express";
import UserModel from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
const router = express.Router();

// CORS Middleware
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
});

// Authentication Middleware
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication token required' 
      });
    }
  
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
};

// Registration Endpoint
router.post("/register", async (req, res) => {
    const { name, email, mobile, type, gender, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new UserModel({
            name,
            email,
            mobile,
            type,
            gender,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user!" });
    }
});

// Get All Users
router.get("/getAllUsers", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving users" });
    }
});

// Delete User
router.delete("/deleteUser/:id", async (req, res) => { 
    const id = req.params.id;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err });
    }
});

// Login Endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token - using the same JWT_SECRET constant
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Error logging in", error: err });
    }
});

// Get User Profile
router.get("/getUser", authenticateUser, async (req, res) => {
    try {
      const user = await UserModel.findById(req.userId)
        .select('-password -__v -createdAt -updatedAt');
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      res.json({
        success: true,
        data: user
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({
        success: false,
        message: "Error fetching user profile",
        error: err.message
      });
    }
});

// Update User Profile
router.put("/update/:id", authenticateUser, async (req, res) => {
    const { id } = req.params;

    if (id !== req.userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only update your own profile"
        });
    }

    try {
        const { name, mobile, gender } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (mobile) updates.mobile = mobile;
        if (gender) updates.gender = gender;

        const updatedUser = await UserModel.findByIdAndUpdate(
          id,
          updates,
          { new: true, runValidators: true }
        ).select('-password -__v -createdAt -updatedAt');

        if (!updatedUser) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }

        res.json({
          success: true,
          message: "Profile updated successfully",
          data: updatedUser
        });
    } catch (err) {
        console.error('Error updating user:', err);
        if (err.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            error: err.message
          });
        }
        res.status(500).json({
          success: false,
          message: "Error updating profile",
          error: err.message
        });
    }
});


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