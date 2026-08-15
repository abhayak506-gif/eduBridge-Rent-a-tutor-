const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const { getTutors, getTutorById, recommendTutors, toggleTutorVerification } = require("../src/controllers/tutorController");
const { createBooking, getBookings, updateBookingStatus } = require("../src/controllers/bookingController");

function mockReqRes({ body = {}, query = {}, params = {} } = {}) {
    const req = { body, query, params };
    const res = {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };
    let capturedError = null;
    const next = (err) => {
        capturedError = err;
    };
    return { req, res, getError: () => capturedError };
}

test("tutorController.getTutors validation", async (t) => {
    await t.test("rejects negative maxRate with status 400", async () => {
        const { req, res, getError } = mockReqRes({ query: { maxRate: "-50" } });
        await getTutors(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /maxRate/);
    });

    await t.test("rejects minRating out of range (> 5) with status 400", async () => {
        const { req, res, getError } = mockReqRes({ query: { minRating: "6" } });
        await getTutors(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /minRating/);
    });
});

test("tutorController.getTutorById validation", async (t) => {
    await t.test("rejects invalid Mongo ID with status 400", async () => {
        const { req, res, getError } = mockReqRes({ params: { id: "not-a-mongo-id" } });
        await getTutorById(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /Invalid tutor id/);
    });
});

test("tutorController.toggleTutorVerification validation", async (t) => {
    await t.test("rejects invalid Mongo ID with status 400", async () => {
        const { req, res, getError } = mockReqRes({ params: { id: "not-a-mongo-id" } });
        await toggleTutorVerification(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /Invalid tutor id/);
    });
});

test("tutorController.recommendTutors validation", async (t) => {
    await t.test("rejects request missing required fields with status 400", async () => {
        const { req, res, getError } = mockReqRes({ body: { subject: "Physics" } });
        await recommendTutors(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /required/);
    });

    await t.test("rejects negative budget with status 400", async () => {
        const { req, res, getError } = mockReqRes({
            body: {
                subject: "Physics",
                classLevel: "11",
                language: "English",
                maxBudget: -100
            }
        });
        await recommendTutors(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
    });
});

test("bookingController.createBooking validation", async (t) => {
    const validMongoId = new mongoose.Types.ObjectId().toString();

    await t.test("rejects missing mandatory fields with status 400", async () => {
        const { req, res, getError } = mockReqRes({ body: { tutorId: validMongoId } });
        await createBooking(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
    });

    await t.test("rejects invalid tutorId with status 400", async () => {
        const { req, res, getError } = mockReqRes({
            body: {
                tutorId: "invalid-id",
                studentId: "stu-101",
                studentName: "Aarav",
                subject: "Physics",
                bookingDate: "2026-10-10",
                timeSlot: "06:00 PM - 07:00 PM",
                durationMinutes: 60,
                mode: "online"
            }
        });
        await createBooking(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /Invalid tutorId/);
    });

    await t.test("rejects invalid timeSlot format with status 400", async () => {
        const { req, res, getError } = mockReqRes({
            body: {
                tutorId: validMongoId,
                studentId: "stu-101",
                studentName: "Aarav",
                subject: "Physics",
                bookingDate: "2026-10-10",
                timeSlot: "Evening Slot",
                durationMinutes: 60,
                mode: "online"
            }
        });
        await createBooking(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /timeSlot/);
    });

    await t.test("rejects past bookingDate with status 400", async () => {
        const { req, res, getError } = mockReqRes({
            body: {
                tutorId: validMongoId,
                studentId: "stu-101",
                studentName: "Aarav",
                subject: "Physics",
                bookingDate: "2020-01-01",
                timeSlot: "06:00 PM - 07:00 PM",
                durationMinutes: 60,
                mode: "online"
            }
        });
        await createBooking(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /past/);
    });
});

test("bookingController.getBookings validation", async (t) => {
    await t.test("rejects non-mongo tutorId filter with status 400", async () => {
        const { req, res, getError } = mockReqRes({ query: { tutorId: "invalid-tutor-id" } });
        await getBookings(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /Invalid tutorId/);
    });

    await t.test("rejects invalid status query with status 400", async () => {
        const { req, res, getError } = mockReqRes({ query: { status: "unknown-status" } });
        await getBookings(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /status/);
    });
});

test("bookingController.updateBookingStatus validation", async (t) => {
    await t.test("rejects invalid status update with status 400", async () => {
        const { req, res, getError } = mockReqRes({
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: { status: "invalid-status" }
        });
        await updateBookingStatus(req, res, getError);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /status/);
    });
});
