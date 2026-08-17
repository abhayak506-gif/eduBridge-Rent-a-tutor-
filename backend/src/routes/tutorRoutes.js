const express = require("express");
const {
    getTutors,
    getTutorById,
    recommendTutors,
    toggleTutorVerification
} = require("../controllers/tutorController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getTutors);
router.post("/recommendations", recommendTutors);
router.get("/:id", getTutorById);
router.patch("/:id/verify", protect, admin, toggleTutorVerification);

module.exports = router;
