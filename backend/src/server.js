const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const tutorRoutes = require("./routes/tutorRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tutors", tutorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "EduBridge Backend is running 🚀"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`EduBridge server running on http://localhost:${PORT}`);
});

app.use(notFound);
app.use(errorHandler);
