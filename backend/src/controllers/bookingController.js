const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Tutor = require("../models/Tutor");

const TIME_SLOT_REGEX = /^\d{1,2}:\d{2}\s?(AM|PM)\s-\s\d{1,2}:\d{2}\s?(AM|PM)$/i;

const normalizeString = (value) => String(value || "").trim();

const createBooking = async (req, res, next) => {
    try {
        const {
            tutorId,
            studentId,
            studentName,
            studentPhone,
            subject,
            bookingDate,
            timeSlot,
            durationMinutes,
            mode,
            topicDoubt
        } = req.body;

        if (!tutorId || !studentId || !studentName || !subject || !bookingDate || !timeSlot || !durationMinutes || !mode) {
            return res.status(400).json({
                success: false,
                message: "tutorId, studentId, studentName, subject, bookingDate, timeSlot, durationMinutes, and mode are required"
            });
        }

        const safeStudentId = normalizeString(studentId);
        const safeStudentName = normalizeString(studentName);
        const safeSubject = normalizeString(subject);
        const safeTimeSlot = normalizeString(timeSlot);
        const safeMode = normalizeString(mode).toLowerCase();
        const safeTopicDoubt = normalizeString(topicDoubt);

        if (!safeStudentId || safeStudentId.length < 3) {
            return res.status(400).json({ success: false, message: "studentId must be at least 3 characters" });
        }

        if (!safeStudentName || safeStudentName.length < 2) {
            return res.status(400).json({ success: false, message: "studentName must be at least 2 characters" });
        }

        if (!safeSubject || safeSubject.length < 2) {
            return res.status(400).json({ success: false, message: "subject is required" });
        }

        if (!safeTimeSlot || !TIME_SLOT_REGEX.test(safeTimeSlot)) {
            return res.status(400).json({ success: false, message: "timeSlot must be in format like 06:00 PM - 07:00 PM" });
        }

        if (!mongoose.isValidObjectId(tutorId)) {
            return res.status(400).json({ success: false, message: "Invalid tutorId" });
        }

        const parsedDate = new Date(bookingDate);
        const parsedDuration = Number(durationMinutes);

        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({ success: false, message: "bookingDate must be a valid date" });
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const requestedDate = new Date(parsedDate);
        requestedDate.setHours(0, 0, 0, 0);
        if (requestedDate < now) {
            return res.status(400).json({ success: false, message: "bookingDate cannot be in the past" });
        }

        if (!Number.isInteger(parsedDuration) || parsedDuration < 15 || parsedDuration > 480) {
            return res.status(400).json({ success: false, message: "durationMinutes must be an integer between 15 and 480" });
        }

        if (!["online", "local"].includes(safeMode)) {
            return res.status(400).json({ success: false, message: "mode must be online or local" });
        }

        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor not found" });
        }

        if (safeMode === "online" && !tutor.isOnline) {
            return res.status(400).json({ success: false, message: "This tutor is not available for online bookings" });
        }

        const tutorHasSlot = tutor.availability.some((slot) => slot.toLowerCase() === "morning" || slot.toLowerCase() === "afternoon" || slot.toLowerCase() === "evening" || slot.toLowerCase() === "night");
        if (!tutorHasSlot) {
            return res.status(400).json({ success: false, message: "Tutor availability is not configured for booking" });
        }

        const totalAmount = Number(((tutor.hourlyRate * parsedDuration) / 60).toFixed(2));
        const booking = await Booking.create({
            tutor: tutor._id,
            studentId: safeStudentId,
            studentName: safeStudentName,
            studentPhone: normalizeString(studentPhone),
            subject: safeSubject,
            bookingDate: parsedDate,
            timeSlot: safeTimeSlot,
            durationMinutes: parsedDuration,
            mode: safeMode,
            totalAmount,
            topicDoubt: safeTopicDoubt,
            meetUrl: safeMode === "online" ? `/session/${Date.now()}` : undefined
        });

        res.status(201).json({ success: true, message: "Booking created successfully", booking });
    } catch (error) {
        next(error);
    }
};

const getBookings = async (req, res, next) => {
    try {
        const { tutorId, studentId, status } = req.query;
        const filter = {};

        if (tutorId) {
            if (!mongoose.isValidObjectId(tutorId)) {
                return res.status(400).json({ success: false, message: "Invalid tutorId" });
            }
            filter.tutor = tutorId;
        }
        if (studentId) filter.studentId = studentId;
        if (status) {
            const allowedStatuses = ["pending", "confirmed", "completed", "cancelled", "rejected"];
            if (!allowedStatuses.includes(String(status))) {
                return res.status(400).json({ success: false, message: "Invalid booking status filter" });
            }
            filter.status = status;
        }

        const bookings = await Booking.find(filter)
            .populate("tutor", "name qualification hourlyRate")
            .sort({ bookingDate: 1, createdAt: -1 });

        res.json({ success: true, count: bookings.length, bookings });
    } catch (error) {
        next(error);
    }
};

const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["pending", "confirmed", "completed", "cancelled", "rejected"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "A valid booking status is required" });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate("tutor", "name qualification hourlyRate");

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, booking });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getBookings, updateBookingStatus };
