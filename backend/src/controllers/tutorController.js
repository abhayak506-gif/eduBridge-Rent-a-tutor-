const mongoose = require("mongoose");
const Tutor = require("../models/Tutor");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isTrue = (value) => value === "true" || value === true;

const toNumber = (value, fieldName) => {
    if (value === undefined) return undefined;
    const number = Number(value);
    if (!Number.isFinite(number)) {
        const error = new Error(`${fieldName} must be a number`);
        error.statusCode = 400;
        throw error;
    }
    return number;
};

// GET /api/tutors - searchable directory with practical frontend-ready filters.
const getTutors = async (req, res, next) => {
    try {
        const { q, search, subject, language, maxRate, maxBudget, minRating, classLevel, grade, online, availability, verified, sort } = req.query;
        const filter = {};
        const searchTerm = q || search;

        if (searchTerm) {
            const regex = new RegExp(escapeRegex(searchTerm), "i");
            filter.$or = [{ name: regex }, { qualification: regex }, { subjects: regex }, { languages: regex }, { bio: regex }];
        }
        if (subject) filter.subjects = new RegExp(escapeRegex(subject), "i");
        if (language) filter.languages = new RegExp(escapeRegex(language), "i");
        if (classLevel || grade) {
            const normalizedClass = String(classLevel || grade).replace(/^class\s+/i, "");
            filter.classes = new RegExp(`^${escapeRegex(normalizedClass)}$`, "i");
        }
        if (availability) filter.availability = new RegExp(`^${escapeRegex(availability)}$`, "i");
        if (online !== undefined) filter.isOnline = isTrue(online);
        if (verified !== undefined) filter.isVerified = isTrue(verified);

        const rate = toNumber(maxRate || maxBudget, "maxRate");
        const rating = toNumber(minRating, "minRating");
        if (rate !== undefined && rate < 0) return res.status(400).json({ success: false, message: "maxRate must be zero or greater" });
        if (rating !== undefined && (rating < 0 || rating > 5)) return res.status(400).json({ success: false, message: "minRating must be between 0 and 5" });
        if (rate !== undefined) filter.hourlyRate = { $lte: rate };
        if (rating !== undefined) filter.rating = { $gte: rating };

        const sortOptions = {
            rating: { rating: -1, hourlyRate: 1 },
            price_asc: { hourlyRate: 1, rating: -1 },
            price_desc: { hourlyRate: -1, rating: -1 },
            experience: { experience: -1, rating: -1 }
        };
        const tutors = await Tutor.find(filter).sort(sortOptions[sort] || { rating: -1, experience: -1 });

        res.json({ success: true, count: tutors.length, tutors });
    } catch (error) {
        next(error);
    }
};

const getTutorById = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid tutor id" });
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) return res.status(404).json({ success: false, message: "Tutor not found" });
        res.json({ success: true, tutor });
    } catch (error) {
        next(error);
    }
};

const matches = (items, value) => !value || items.some((item) => item.toLowerCase() === String(value).toLowerCase());

// POST /api/tutors/recommendations. This is transparent rule-based scoring, not an ML model.
const recommendTutors = async (req, res, next) => {
    try {
        const { subject, classLevel, grade, language, maxBudget, availability, minRating, online } = req.body;
        const requestedClass = classLevel || grade;
        const budget = toNumber(maxBudget, "maxBudget");
        const requestedRating = toNumber(minRating, "minRating");

        if (!subject || !requestedClass || !language || budget === undefined) {
            return res.status(400).json({ success: false, message: "subject, classLevel (or grade), language, and maxBudget are required" });
        }
        if (budget < 0 || (requestedRating !== undefined && (requestedRating < 0 || requestedRating > 5))) {
            return res.status(400).json({ success: false, message: "Use a non-negative budget and a rating between 0 and 5" });
        }

        const tutors = await Tutor.find(online === undefined ? {} : { isOnline: isTrue(online) });
        const recommendations = tutors.map((tutor) => {
            const parts = [
                { key: "subject", points: 30, matched: matches(tutor.subjects, subject), label: `Teaches ${subject}` },
                { key: "class", points: 20, matched: matches(tutor.classes, requestedClass), label: `Teaches class ${requestedClass}` },
                { key: "language", points: 15, matched: matches(tutor.languages, language), label: `Speaks ${language}` },
                { key: "budget", points: 15, matched: tutor.hourlyRate <= budget, label: `₹${tutor.hourlyRate}/hr is within your ₹${budget} budget` },
                { key: "availability", points: 10, matched: !availability || matches(tutor.availability, availability), label: availability ? `Available in the ${availability}` : "Availability not restricted" },
                { key: "rating", points: 10, matched: requestedRating === undefined ? tutor.rating >= 4 : tutor.rating >= requestedRating, label: `Rating ${tutor.rating}/5${requestedRating === undefined ? " (4+ preferred)" : ` meets your ${requestedRating}+ preference`}` }
            ];
            const score = parts.reduce((total, part) => total + (part.matched ? part.points : 0), 0);
            return {
                tutor,
                matchScore: score,
                reasons: parts.filter((part) => part.matched).map((part) => part.label),
                scoreBreakdown: parts.map(({ key, points, matched }) => ({ key, points: matched ? points : 0, maximumPoints: points, matched }))
            };
        });

        recommendations.sort((a, b) => b.matchScore - a.matchScore || b.tutor.rating - a.tutor.rating);
        res.json({
            success: true,
            engine: "rule-based AI-ready recommendation service",
            scoring: { subject: 30, class: 20, language: 15, budget: 15, availability: 10, rating: 10 },
            count: recommendations.length,
            recommendations
        });
    } catch (error) {
        next(error);
    }
};

const toggleTutorVerification = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid tutor id" });
        }
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor not found" });
        }

        const { isVerified } = req.body;
        tutor.isVerified = typeof isVerified === "boolean" ? isVerified : !tutor.isVerified;
        await tutor.save();

        res.json({
            success: true,
            message: `Verification status updated for ${tutor.name}`,
            tutor
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTutors, getTutorById, recommendTutors, toggleTutorVerification };
