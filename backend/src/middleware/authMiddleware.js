const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Cryptographically verifies real JWT Bearer tokens using process.env.JWT_SECRET.
 * Rejects requests safely if JWT_SECRET is not configured in the environment.
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) {
                console.error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing.");
                return res.status(500).json({
                    success: false,
                    message: "Internal configuration error: authentication service unavailable"
                });
            }

            // Cryptographically verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = {
                id: decoded.id,
                name: decoded.name,
                role: decoded.role // 'student' | 'tutor' | 'admin'
            };

            return next();
        } catch (error) {
            console.error("JWT Verification failed:", error.message);
            return res.status(401).json({
                success: false,
                message: "Not authorized, token verification failed"
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token required"
        });
    }
};

/**
 * Admin Authorization Middleware
 * Restricts access to users with the 'admin' role.
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Administrative access required"
        });
    }
};

module.exports = { protect, admin };
