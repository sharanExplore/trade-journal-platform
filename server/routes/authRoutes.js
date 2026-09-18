const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

// Get current user route
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            message: "Server error while fetching user",
        });
    }
});

//register route
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    //check if all required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email, and password are required",
        });
    }

    try {
        //check if the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

//login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});


module.exports = router;