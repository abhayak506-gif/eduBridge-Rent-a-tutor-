const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tutor",
            required: true
        },
        studentId: {
            type: String,
            required: true,
            trim: true
        },
        studentName: {
            type: String,
            required: true,
            trim: true
        },
        studentPhone: {
            type: String,
            trim: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        bookingDate: {
            type: Date,
            required: true
        },
        timeSlot: {
            type: String,
            required: true,
            trim: true
        },
        durationMinutes: {
            type: Number,
            required: true,
            min: 15,
            max: 480
        },
        mode: {
            type: String,
            enum: ["online", "local"],
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
            default: "pending"
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        topicDoubt: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        meetUrl: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
