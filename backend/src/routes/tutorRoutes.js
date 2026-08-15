const express = require("express");
const {
    getTutors,
    getTutorById,
    recommendTutors,
    toggleTutorVerification
} = require("../controllers/tutorController");

const router = express.Router();

router.get("/", getTutors);
router.post("/recommendations", recommendTutors);
router.get("/:id", getTutorById);
router.patch("/:id/verify", toggleTutorVerification);

module.exports = router;
