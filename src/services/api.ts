import { 
  Tutor, 
  Review, 
  Booking, 
  TutorRecommendation, 
  RecommendationRequest, 
  TutorFilterState,
  TutorStats,
  BookingStatus
} from '@/types';
import { 
  MOCK_TUTORS, 
  MOCK_REVIEWS, 
  MOCK_BOOKINGS, 
  MOCK_TUTOR_STATS 
} from '@/data/mockData';

// Local storage key constants for interactive hackathon demo persistence
const STORAGE_KEYS = {
  BOOKINGS: 'edubridge_bookings',
  TUTORS: 'edubridge_tutors',
  CURRENT_USER: 'edubridge_user',
};

// Helper to initialize or retrieve from localStorage in browser
function getStoredBookings(): Booking[] {
  if (typeof window === 'undefined') return MOCK_BOOKINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(MOCK_BOOKINGS));
      return MOCK_BOOKINGS;
    }
    return JSON.parse(data);
  } catch {
    return MOCK_BOOKINGS;
  }
}

function saveBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (err) {
    console.error('Failed to save bookings to localStorage', err);
  }
}

/**
 * Service layer prepared for future Backend REST APIs
 */
export const TutorService = {
  /**
   * Future endpoint: GET /api/tutors
   */
  async getTutors(filters?: Partial<TutorFilterState>): Promise<Tutor[]> {
    // Simulated network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 80));

    let results = [...MOCK_TUTORS];

    if (!filters) return results;

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.qualification.toLowerCase().includes(q) ||
          t.location.city.toLowerCase().includes(q) ||
          t.subjects.some((s) => s.toLowerCase().includes(q)) ||
          t.languages.some((l) => l.toLowerCase().includes(q))
      );
    }

    if (filters.subject && filters.subject !== 'All Subjects') {
      results = results.filter((t) =>
        t.subjects.some((s) => s.toLowerCase().includes(filters.subject!.toLowerCase()))
      );
    }

    if (filters.grade && filters.grade !== 'All Classes') {
      const gradeTerm = filters.grade.split(' ')[0]; // e.g. "Class 11"
      results = results.filter((t) =>
        t.grades.some((g) => g.toLowerCase().includes(gradeTerm.toLowerCase()))
      );
    }

    if (filters.board && filters.board !== 'All Boards') {
      results = results.filter((t) =>
        t.boards.some((b) => b.toLowerCase().includes(filters.board!.toLowerCase()))
      );
    }

    if (filters.language && filters.language !== 'All Languages') {
      results = results.filter((t) =>
        t.languages.some((l) => l.toLowerCase().includes(filters.language!.toLowerCase()))
      );
    }

    if (filters.mode && filters.mode !== 'all') {
      results = results.filter((t) => t.mode === filters.mode || t.mode === 'both');
    }

    if (filters.maxPrice && filters.maxPrice > 0) {
      results = results.filter((t) => t.hourlyRate <= filters.maxPrice!);
    }

    if (filters.minRating && filters.minRating > 0) {
      results = results.filter((t) => t.rating >= filters.minRating!);
    }

    if (filters.availableNowOnly) {
      results = results.filter((t) => t.isAvailableNow);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_asc':
          results.sort((a, b) => a.hourlyRate - b.hourlyRate);
          break;
        case 'price_desc':
          results.sort((a, b) => b.hourlyRate - a.hourlyRate);
          break;
        case 'experience':
          results.sort((a, b) => b.experienceYears - a.experienceYears);
          break;
        case 'match':
        default:
          results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
          break;
      }
    }

    return results;
  },

  /**
   * Future endpoint: GET /api/tutors/:id
   */
  async getTutorById(id: string): Promise<Tutor | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const tutor = MOCK_TUTORS.find((t) => t.id === id);
    return tutor || null;
  },

  /**
   * Future endpoint: POST /api/recommend-tutors
   * AI Recommendation pipeline connector
   */
  async getRecommendedTutors(req?: Partial<RecommendationRequest>): Promise<TutorRecommendation[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Curate top matches from dataset
    const topTutors = MOCK_TUTORS.filter((t) => (t.matchScore || 0) >= 80).sort(
      (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
    );

    return topTutors.map((tutor) => ({
      tutor,
      matchScore: tutor.matchScore || 92,
      reasons: tutor.matchReasons || [
        `Same subject: ${req?.subject || tutor.subjects[0]}`,
        `Preferred language: ${req?.language || tutor.languages[0]}`,
        `Fits your budget of ₹${req?.maxBudget || 700}/hr`,
        tutor.isAvailableNow ? 'Available for instant session right now' : 'High student satisfaction rating',
      ],
    }));
  },

  /**
   * Future endpoint: GET /api/tutors/:id/reviews
   */
  async getReviewsForTutor(tutorId: string): Promise<Review[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const reviews = MOCK_REVIEWS.filter((r) => r.tutorId === tutorId);
    return reviews.length > 0 ? reviews : MOCK_REVIEWS.slice(0, 2);
  },

  /**
   * Future endpoint: GET /api/tutors/:id/stats
   */
  async getTutorStats(tutorId: string): Promise<TutorStats> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_TUTOR_STATS;
  },
};

export const BookingService = {
  /**
   * Future endpoint: GET /api/bookings
   */
  async getBookings(userId?: string, role: 'student' | 'tutor' = 'student'): Promise<Booking[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const allBookings = getStoredBookings();
    if (!userId) return allBookings;

    if (role === 'tutor') {
      return allBookings.filter((b) => b.tutorId === userId || b.tutorId === 'tut-001');
    }
    return allBookings.filter((b) => b.studentId === userId || b.studentId === 'stu-101');
  },

  /**
   * Future endpoint: POST /api/bookings
   */
  async createBooking(
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>
  ): Promise<Booking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const allBookings = getStoredBookings();

    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: 'Just now',
      meetUrl: `/session/session-${Date.now().toString().slice(-4)}`,
    };

    const updated = [newBooking, ...allBookings];
    saveBookings(updated);
    return newBooking;
  },

  /**
   * Future endpoint: PATCH /api/bookings/:id/accept or PATCH /api/bookings/:id/reject
   */
  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const allBookings = getStoredBookings();
    const index = allBookings.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    const updatedBooking = { ...allBookings[index], status };
    allBookings[index] = updatedBooking;
    saveBookings(allBookings);
    return updatedBooking;
  },
};
