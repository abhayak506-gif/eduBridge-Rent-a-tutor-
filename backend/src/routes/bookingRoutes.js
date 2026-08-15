const express = require("express");
const {
    createBooking,
    getBookings,
    updateBookingStatus
} = require("../controllers/bookingController");

const router = express.Router();

router.route("/").get(getBookings).post(createBooking);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
