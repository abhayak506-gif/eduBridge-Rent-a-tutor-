const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        qualification: {
            type: String,
            required: true
        },

        subjects: {
            type: [String],
            required: true
        },

        classes: {
            type: [String],
            required: true
        },

        languages: {
            type: [String],
            required: true
        },

        hourlyRate: {
            type: Number,
            required: true,
            min: 0
        },

        experience: {
            type: Number,
            default: 0
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        isOnline: {
            type: Boolean,
            default: true
        },

        availability: {
            type: [String],
            default: []
        },

        bio: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Tutor", tutorSchema);