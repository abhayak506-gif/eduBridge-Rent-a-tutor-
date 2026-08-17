const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tutor = require("../models/Tutor");

/**
 * Helper to generate JWT Token
 */
const generateToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is missing.");
    }
    return jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};

/**
 * @desc    Registers a new user (student or tutor) with email/password
 * @route   POST /api/auth/register
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, password, and role"
            });
        }

        if (!["student", "tutor"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "A user with this email address already exists"
            });
        }

        // Create the user (password hashing is handled in pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            role,
            phone: phone || ""
        });

        // If registering as a tutor, also initialize their public Tutor Directory record
        if (role === "tutor") {
            const tutorExists = await Tutor.findOne({ email });
            if (!tutorExists) {
                await Tutor.create({
                    name: user.name,
                    email: user.email,
                    qualification: "Degree Details Required",
                    subjects: ["General Academic"],
                    classes: ["General"],
                    languages: ["English"],
                    hourlyRate: 500,
                    experience: 1,
                    rating: 4.5,
                    isVerified: false, // verification pending admin approval
                    isOnline: true,
                    availability: ["Evening"],
                    bio: `Profile initialized for tutor: ${user.name}. Verification pending.`
                });
            }
        }

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message.includes("JWT_SECRET") 
                ? "Configuration error: token secret missing"
                : `Registration failed: ${error.message}`
        });
    }
};

/**
 * @desc    Authenticates user and returns token
 * @route   POST /api/auth/login
 */
const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, password, and role"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Role verification (prevent role mismatched access attempts)
        if (user.role !== role && role !== "admin") {
            return res.status(403).json({
                success: false,
                message: `Role mismatch: This account is registered as a ${user.role}.`
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message.includes("JWT_SECRET")
                ? "Configuration error: token secret missing"
                : `Login failed: ${error.message}`
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};
