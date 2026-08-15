# EduBridge — Rent a Tutor

EduBridge is a Smart India Hackathon 2026 MVP that helps students discover verified tutors, receive explainable recommendations, and request a session. The Next.js frontend remains a self-contained demo with local mock data; the Express/MongoDB backend is ready to be connected when the team is ready.

## Run locally

Requirements: Node.js 18+ and a MongoDB Atlas connection string.

```powershell
# Frontend
npm install
npm run dev

# In another terminal: backend
cd backend
npm install
# Copy backend/.env.example to backend/.env, then set MONGO_URI to your MongoDB Atlas URI
npm run dev
```

Seed the demo tutors once (with the backend stopped or in a separate terminal):

```powershell
cd backend
node seed/tutors.js
```

The API runs at `http://localhost:5000`. Never commit `backend/.env`; it is ignored by Git.

## API

### Tutors

- `GET /api/tutors` — all tutors
- `GET /api/tutors?subject=Mathematics&language=Hindi&classLevel=10&maxRate=300&minRating=4&online=true&availability=Evening&sort=rating` — search/filter/sort. `q` (or `search`), `grade`, and `maxBudget` are also accepted for frontend-friendly naming.
- `GET /api/tutors/:id` — one tutor
- `POST /api/tutors/recommendations` — transparent scoring recommendation service

Example recommendation request:

```json
{
  "subject": "Mathematics",
  "classLevel": "10",
  "language": "Hindi",
  "maxBudget": 350,
  "availability": "Evening",
  "minRating": 4.5,
  "online": true
}
```

This endpoint is intentionally a **rule-based, AI-ready recommendation service**, not a machine-learning model. It returns every tutor ordered by an explainable score: subject (30), class (20), language (15), budget (15), availability (10), and rating (10), plus a per-tutor breakdown.

### Bookings

- `POST /api/bookings` — create a pending booking. The server calculates `totalAmount` from the tutor's hourly rate and requested duration.
- `GET /api/bookings` — list bookings; filter with `?studentId=...`, `?tutorId=...`, or `?status=pending`.
- `PATCH /api/bookings/:id/status` — update a booking status (`pending`, `confirmed`, `completed`, `cancelled`, or `rejected`).

Example booking request:

```json
{
  "tutorId": "<MongoDB tutor id>",
  "studentId": "stu-101",
  "studentName": "Aarav Kumar",
  "studentPhone": "9876543210",
  "subject": "Mathematics",
  "bookingDate": "2026-08-17",
  "timeSlot": "6:00 PM - 7:00 PM",
  "durationMinutes": 60,
  "mode": "online",
  "topicDoubt": "Quadratic equations revision"
}
```

All errors use a consistent JSON response with `success: false` and a safe message. Authentication and payment processing are intentionally outside this hackathon MVP scope.
