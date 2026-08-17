const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Set required environment variables for testing
process.env.JWT_SECRET = "mock-test-jwt-secret";

// Import Auth Controller and Middleware
const { registerUser, loginUser } = require("../src/controllers/authController");
const { protect, admin } = require("../src/middleware/authMiddleware");

// Import Mongoose Models to Mock
const User = require("../src/models/User");
const Tutor = require("../src/models/Tutor");

// Mock Mongoose model methods to avoid actual DB connections
let userDatabaseMock = [];
User.findOne = async (query) => {
    return userDatabaseMock.find(u => u.email === query.email) || null;
};
User.create = async (data) => {
    // Simulate pre-save hook for password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        isActive: true,
        ...data,
        password: hashedPassword,
        matchPassword: async function (enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
        }
    };
    userDatabaseMock.push(newUser);
    return newUser;
};

let tutorDatabaseMock = [];
Tutor.findOne = async () => null;
Tutor.create = async (data) => {
    const newTutor = { _id: new mongoose.Types.ObjectId().toString(), ...data };
    tutorDatabaseMock.push(newTutor);
    return newTutor;
};

// Helper function to mock Express req, res, and next
function mockReqRes({ body = {}, query = {}, params = {}, headers = {} } = {}) {
    const req = { body, query, params, headers };
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
    let nextCalled = false;
    let nextError = null;
    const next = (err) => {
        nextCalled = true;
        nextError = err;
    };
    return { req, res, next, wasNextCalled: () => nextCalled, getNextError: () => nextError };
}

// Reset mocks before each test
function resetMocks() {
    userDatabaseMock = [];
    tutorDatabaseMock = [];
}

test("Email/Password Registration & Login Flows", async (t) => {

    await t.test("Registers a new student user successfully", async () => {
        resetMocks();
        const { req, res } = mockReqRes({
            body: { name: "Aarav Sharma", email: "aarav@gmail.com", password: "password123", role: "student" }
        });
        await registerUser(req, res);
        assert.equal(res.statusCode, 201);
        assert.equal(res.body.success, true);
        assert.equal(res.body.user.role, "student");
        assert.equal(res.body.user.email, "aarav@gmail.com");

        // Verify signed token
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        assert.equal(decoded.role, "student");
        assert.equal(decoded.name, "Aarav Sharma");
    });

    await t.test("Registers a new tutor user and initializes tutor profile", async () => {
        resetMocks();
        const { req, res } = mockReqRes({
            body: { name: "Dr. Priya", email: "priya@tutor.com", password: "password123", role: "tutor" }
        });
        await registerUser(req, res);
        assert.equal(res.statusCode, 201);
        assert.equal(res.body.success, true);
        assert.equal(res.body.user.role, "tutor");
        
        // Ensure tutor profile was created in parallel
        assert.equal(tutorDatabaseMock.length, 1);
        assert.equal(tutorDatabaseMock[0].email, "priya@tutor.com");
        assert.equal(tutorDatabaseMock[0].isVerified, false);
    });

    await t.test("Rejects registration if email already exists", async () => {
        resetMocks();
        // Seed first user
        await User.create({ name: "Existing", email: "aarav@gmail.com", password: "password", role: "student" });

        const { req, res } = mockReqRes({
            body: { name: "Aarav Sharma", email: "aarav@gmail.com", password: "password123", role: "student" }
        });
        await registerUser(req, res);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /already exists/);
    });

    await t.test("Logs in existing user with correct credentials", async () => {
        resetMocks();
        // Seed user
        await User.create({ name: "Aarav Sharma", email: "aarav@gmail.com", password: "password123", role: "student" });

        const { req, res } = mockReqRes({
            body: { email: "aarav@gmail.com", password: "password123", role: "student" }
        });
        await loginUser(req, res);
        assert.equal(res.statusCode, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.user.email, "aarav@gmail.com");
    });

    await t.test("Rejects login with incorrect password", async () => {
        resetMocks();
        await User.create({ name: "Aarav Sharma", email: "aarav@gmail.com", password: "password123", role: "student" });

        const { req, res } = mockReqRes({
            body: { email: "aarav@gmail.com", password: "wrongpassword", role: "student" }
        });
        await loginUser(req, res);
        assert.equal(res.statusCode, 401);
        assert.equal(res.body.success, false);
    });

    await t.test("Rejects login with mismatching role", async () => {
        resetMocks();
        await User.create({ name: "Aarav Sharma", email: "aarav@gmail.com", password: "password123", role: "student" });

        const { req, res } = mockReqRes({
            body: { email: "aarav@gmail.com", password: "password123", role: "tutor" }
        });
        await loginUser(req, res);
        assert.equal(res.statusCode, 403);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /role mismatch/i);
    });
});

test("Admin Middleware & Authorization Checks", async (t) => {

    await t.test("unauthenticated requests to /admin are denied access", async () => {
        const { req, res, next, wasNextCalled } = mockReqRes({
            headers: {}
        });
        await protect(req, res, next);
        assert.equal(res.statusCode, 401);
        assert.equal(res.body.success, false);
        assert.equal(wasNextCalled(), false);
    });

    await t.test("student JWT token to /admin is denied access", async () => {
        const studentToken = jwt.sign(
            { id: "student-123", name: "Aarav", role: "student" },
            process.env.JWT_SECRET
        );
        const { req, res, next, wasNextCalled } = mockReqRes({
            headers: { authorization: `Bearer ${studentToken}` }
        });
        
        await protect(req, res, next);
        assert.equal(wasNextCalled(), true);
        
        const { req: adminReq, res: adminRes, next: adminNext, wasNextCalled: wasAdminNextCalled } = mockReqRes();
        adminReq.user = req.user;
        
        await admin(adminReq, adminRes, adminNext);
        assert.equal(adminRes.statusCode, 403);
        assert.equal(adminRes.body.success, false);
        assert.equal(wasAdminNextCalled(), false);
    });

    await t.test("admin JWT token to /admin is allowed access", async () => {
        const adminToken = jwt.sign(
            { id: "admin-123", name: "Administrator", role: "admin" },
            process.env.JWT_SECRET
        );
        const { req, res, next, wasNextCalled } = mockReqRes({
            headers: { authorization: `Bearer ${adminToken}` }
        });
        
        await protect(req, res, next);
        assert.equal(wasNextCalled(), true);
        
        const { req: adminReq, res: adminRes, next: adminNext, wasNextCalled: wasAdminNextCalled } = mockReqRes();
        adminReq.user = req.user;
        
        await admin(adminReq, adminRes, adminNext);
        assert.equal(wasAdminNextCalled(), true);
    });

    await t.test("missing JWT_SECRET fails safely", async () => {
        const savedSecret = process.env.JWT_SECRET;
        delete process.env.JWT_SECRET;
        
        const testToken = jwt.sign(
            { id: "admin-123", name: "Admin", role: "admin" },
            savedSecret
        );
        const { req, res, next, wasNextCalled } = mockReqRes({
            headers: { authorization: `Bearer ${testToken}` }
        });
        
        await protect(req, res, next);
        assert.equal(res.statusCode, 500);
        assert.equal(res.body.success, false);
        assert.equal(wasNextCalled(), false);
        
        process.env.JWT_SECRET = savedSecret;
    });
});
