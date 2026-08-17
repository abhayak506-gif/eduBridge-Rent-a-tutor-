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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface BackendTutor {
  _id: string;
  name: string;
  email: string;
  qualification: string;
  subjects: string[];
  classes: string[];
  languages: string[];
  hourlyRate: number;
  experience: number;
  rating: number;
  isVerified: boolean;
  isOnline: boolean;
  availability: string[];
  bio?: string;
}

interface BackendTutorsResponse {
  success: boolean;
  count: number;
  tutors: BackendTutor[];
}

interface BackendTutorResponse {
  success: boolean;
  tutor: BackendTutor;
}

interface BackendRecommendationsResponse {
  success: boolean;
  recommendations: Array<{
    tutor: BackendTutor;
    matchScore: number;
    reasons: string[];
  }>;
}

interface BackendBookingTutor {
  _id?: string;
  name?: string;
  qualification?: string;
  hourlyRate?: number;
}

interface BackendBooking {
  _id: string;
  tutor: string | BackendBookingTutor;
  studentId: string;
  studentName: string;
  studentPhone?: string;
  subject: string;
  bookingDate: string;
  timeSlot: string;
  durationMinutes: number;
  mode: 'online' | 'local';
  status: BookingStatus;
  totalAmount: number;
  topicDoubt?: string;
  meetUrl?: string;
  createdAt: string;
}

interface BackendBookingsResponse {
  success: boolean;
  count: number;
  bookings: BackendBooking[];
}

interface BackendBookingResponse {
  success: boolean;
  message?: string;
  booking: BackendBooking;
}

function classLabel(value: string): string {
  if (/^\d+$/.test(value)) {
    return `Class ${value}`;
  }
  return value;
}

function extractClassLevel(grade?: string): string | undefined {
  if (!grade || grade === 'All Classes') return undefined;
  const numericMatch = grade.match(/\d+/);
  if (numericMatch) return numericMatch[0];
  return grade.replace(/^class\s+/i, '').split('(')[0].trim();
}

function buildAvailableSlots(availability: string[]) {
  const slotMap: Record<string, string[]> = {
    Morning: ['08:00 AM', '09:00 AM', '10:00 AM'],
    Afternoon: ['01:00 PM', '02:00 PM', '03:00 PM'],
    Evening: ['05:00 PM', '06:00 PM', '07:00 PM'],
    Night: ['08:00 PM', '09:00 PM'],
  };

  const windows = availability.length > 0 ? availability : ['Evening'];
  const todayTimes = windows.flatMap((window) => slotMap[window] || ['06:00 PM']);
  const tomorrowTimes = windows.flatMap((window) => slotMap[window] || ['07:00 PM']).slice(0, 3);

  return [
    { day: 'Today', times: todayTimes.length > 0 ? todayTimes : ['06:00 PM'] },
    { day: 'Tomorrow', times: tomorrowTimes.length > 0 ? tomorrowTimes : ['07:00 PM'] },
    { day: 'Saturday', times: ['10:00 AM', '05:00 PM'] },
  ];
}

function isMongoId(value: string | undefined): boolean {
  return Boolean(value && /^[a-f\d]{24}$/i.test(value));
}

function toDateLabel(dateInput: string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return dateInput;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function resolveBookingDateLabelToISO(value: string): string {
  const cleaned = value.split(',')[0].trim();
  const lowered = cleaned.toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lowered === 'today') return formatDateYMD(today);
  if (lowered === 'tomorrow') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateYMD(tomorrow);
  }

  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const weekdayIndex = weekdays.indexOf(lowered);
  if (weekdayIndex !== -1) {
    const candidate = new Date(today);
    const diff = (weekdayIndex - today.getDay() + 7) % 7 || 7;
    candidate.setDate(candidate.getDate() + diff);
    return formatDateYMD(candidate);
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return formatDateYMD(parsed);

  return formatDateYMD(today);
}

function normalizeTimeSlot(slot: string, durationMinutes: number): string {
  const trimmed = slot.trim();
  if (/^\d{1,2}:\d{2}\s?(AM|PM)\s-\s\d{1,2}:\d{2}\s?(AM|PM)$/i.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return '05:30 PM - 06:30 PM';

  const [, rawHours, rawMinutes, period] = match;
  let hours24 = Number(rawHours) % 12;
  if (period.toUpperCase() === 'PM') hours24 += 12;
  const minutes = Number(rawMinutes);

  const start = new Date();
  start.setHours(hours24, minutes, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + durationMinutes);

  const format12 = (date: Date) => {
    let h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, '0');
    const p = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${m} ${p}`;
  };

  return `${format12(start)} - ${format12(end)}`;
}

function mapBackendBookingToBooking(booking: BackendBooking): Booking {
  const tutorData = typeof booking.tutor === 'object' && booking.tutor !== null ? booking.tutor : {};
  const tutorId = typeof booking.tutor === 'string' ? booking.tutor : tutorData._id || '';
  const tutorName = tutorData.name || 'Tutor';

  return {
    id: booking._id,
    tutorId,
    tutorName,
    tutorAvatar: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(tutorName)}`,
    tutorTitle: tutorData.qualification || 'Verified Tutor',
    tutorSubject: booking.subject,
    studentId: booking.studentId,
    studentName: booking.studentName,
    studentGrade: 'Class Not Provided',
    studentPhone: booking.studentPhone,
    date: toDateLabel(booking.bookingDate),
    timeSlot: booking.timeSlot,
    durationMinutes: booking.durationMinutes,
    mode: booking.mode,
    status: booking.status,
    totalAmount: booking.totalAmount,
    topicDoubt: booking.topicDoubt,
    meetUrl: booking.meetUrl,
    createdAt: toDateLabel(booking.createdAt),
  };
}

function mapBackendTutorToTutor(
  tutor: BackendTutor,
  extras?: { matchScore?: number; matchReasons?: string[] }
): Tutor {
  const grades = tutor.classes.map(classLabel);
  const hourlyRate = tutor.hourlyRate;
  const instantRate15Min = Math.max(99, Math.round(hourlyRate * 0.3));

  return {
    id: tutor._id,
    name: tutor.name,
    avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(tutor.name)}`,
    title: `${tutor.subjects.slice(0, 2).join(' & ')} Tutor`,
    qualification: tutor.qualification,
    experienceYears: tutor.experience,
    subjects: tutor.subjects,
    grades,
    boards: ['CBSE', 'ICSE', 'State Board'],
    languages: tutor.languages,
    hourlyRate,
    instantRate15Min,
    rating: tutor.rating,
    reviewCount: Math.max(8, Math.round(tutor.rating * 18)),
    totalStudents: Math.max(30, tutor.experience * 45),
    totalHours: Math.max(120, tutor.experience * 160),
    isVerified: tutor.isVerified,
    verificationBadge: tutor.isVerified ? 'Government ID & Degree' : 'Background Verified',
    mode: tutor.isOnline ? 'online' : 'local',
    location: {
      city: 'India',
      state: 'India',
      locality: tutor.isOnline ? 'Online' : 'Local',
    },
    bio: tutor.bio || `${tutor.name} teaches ${tutor.subjects.join(', ')} with student-first sessions.`,
    methodology: 'Concept-first teaching, guided examples, and focused practice based on student pace.',
    highlights: [
      `${tutor.experience}+ years teaching experience`,
      `Specializes in ${tutor.subjects.slice(0, 2).join(' and ')}`,
      tutor.isOnline ? 'Online classes available' : 'Local in-person sessions available',
    ],
    isAvailableNow: tutor.isOnline,
    availableDays: tutor.availability,
    availableSlots: buildAvailableSlots(tutor.availability),
    matchScore: extras?.matchScore,
    matchReasons: extras?.matchReasons,
  };
}

function buildTutorQueryParams(filters?: Partial<TutorFilterState>): URLSearchParams {
  const params = new URLSearchParams();
  if (!filters) return params;

  if (filters.query?.trim()) params.set('q', filters.query.trim());
  if (filters.subject && filters.subject !== 'All Subjects') params.set('subject', filters.subject);

  const classLevel = extractClassLevel(filters.grade);
  if (classLevel) params.set('classLevel', classLevel);

  if (filters.language && filters.language !== 'All Languages') params.set('language', filters.language);
  if (filters.availability && filters.availability !== 'All Times') params.set('availability', filters.availability);
  if (filters.maxPrice && filters.maxPrice > 0) params.set('maxRate', String(filters.maxPrice));
  if (filters.minRating && filters.minRating > 0) params.set('minRating', String(filters.minRating));

  if (filters.onlineOnly) {
    params.set('online', 'true');
  } else if (filters.mode === 'online') {
    params.set('online', 'true');
  } else if (filters.mode === 'local') {
    params.set('online', 'false');
  }

  if (filters.sortBy && filters.sortBy !== 'match') {
    params.set('sort', filters.sortBy);
  }

  return params;
}

function filterMockTutors(filters?: Partial<TutorFilterState>): Tutor[] {
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
    const gradeTerm = extractClassLevel(filters.grade) || filters.grade;
    results = results.filter((t) =>
      t.grades.some((g) => g.toLowerCase().includes(gradeTerm.toLowerCase()))
    );
  }

  if (filters.language && filters.language !== 'All Languages') {
    results = results.filter((t) =>
      t.languages.some((l) => l.toLowerCase().includes(filters.language!.toLowerCase()))
    );
  }

  if (filters.maxPrice && filters.maxPrice > 0) {
    results = results.filter((t) => t.hourlyRate <= filters.maxPrice!);
  }

  if (filters.minRating && filters.minRating > 0) {
    results = results.filter((t) => t.rating >= filters.minRating!);
  }

  if (filters.onlineOnly) {
    results = results.filter((t) => t.mode === 'online' || t.mode === 'both');
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
}

/**
 * Environment flag to control fallback to mock data in non-production environments.
 */
const ENABLE_MOCK_FALLBACK = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_MOCK_FALLBACK === 'true';

/**
 * Service layer with backend-first integration and mock fallback for demo resiliency.
 */
export const TutorService = {
  async getTutors(filters?: Partial<TutorFilterState>): Promise<Tutor[]> {
    const params = buildTutorQueryParams(filters);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tutors${params.toString() ? `?${params.toString()}` : ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tutors: ${response.status}`);
      }

      const payload = (await response.json()) as BackendTutorsResponse;
      if (!payload.success || !Array.isArray(payload.tutors)) {
        throw new Error('Invalid tutors payload');
      }

      return payload.tutors.map((tutor) => mapBackendTutorToTutor(tutor));
    } catch (error) {
      console.error('Tutor API unavailable:', error);
      if (ENABLE_MOCK_FALLBACK) {
        console.warn('Falling back to mock tutor data in development.');
        return filterMockTutors(filters);
      }
      throw error;
    }
  },

  async getTutorById(id: string): Promise<Tutor | null> {
    // If not a MongoDB ObjectId and mock fallback is allowed, resolve mock directly
    if (!isMongoId(id)) {
      if (ENABLE_MOCK_FALLBACK) {
        const tutor = MOCK_TUTORS.find((t) => t.id === id);
        return tutor || null;
      }
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tutors/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404 || response.status === 400) return null;
        throw new Error(`Failed to fetch tutor ${id}: ${response.status}`);
      }

      const payload = (await response.json()) as BackendTutorResponse;
      if (!payload.success || !payload.tutor) {
        throw new Error('Invalid tutor payload');
      }

      return mapBackendTutorToTutor(payload.tutor);
    } catch (error) {
      console.error(`Tutor details API unavailable for ID ${id}:`, error);
      if (ENABLE_MOCK_FALLBACK) {
        console.warn('Falling back to mock tutor details in development.');
        const tutor = MOCK_TUTORS.find((t) => t.id === id);
        return tutor || null;
      }
      throw error;
    }
  },

  async getRecommendedTutors(req?: Partial<RecommendationRequest>): Promise<TutorRecommendation[]> {
    const hasRequiredParams = req?.subject && req?.grade && req?.language && typeof req.maxBudget === 'number';

    if (hasRequiredParams) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tutors/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: req.subject,
            classLevel: extractClassLevel(req.grade),
            language: req.language,
            maxBudget: req.maxBudget,
            online: req.mode === 'online' ? true : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.status}`);
        }

        const payload = (await response.json()) as BackendRecommendationsResponse;
        if (!payload.success || !Array.isArray(payload.recommendations)) {
          throw new Error('Invalid recommendations payload');
        }

        return payload.recommendations.map((item) => ({
          tutor: mapBackendTutorToTutor(item.tutor, {
            matchScore: item.matchScore,
            matchReasons: item.reasons,
          }),
          matchScore: item.matchScore,
          reasons: item.reasons,
        }));
      } catch (error) {
        console.error('Recommendation API unavailable:', error);
        if (!ENABLE_MOCK_FALLBACK) {
          throw error;
        }
      }
    }

    if (!ENABLE_MOCK_FALLBACK) {
      throw new Error('Failed to fetch recommendations from backend and mock data is disabled.');
    }

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

  async toggleVerification(tutorId: string, isVerified?: boolean): Promise<Tutor> {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('edubridge_current_user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    const adminToken = user?.token || null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tutors/${tutorId}/verify`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ isVerified }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle verification: ${response.status}`);
      }

      const payload = (await response.json()) as BackendTutorResponse;
      if (!payload.success || !payload.tutor) {
        throw new Error('Invalid toggle verification payload');
      }

      return mapBackendTutorToTutor(payload.tutor);
    } catch (error) {
      console.error('Tutor verification API error:', error);
      if (ENABLE_MOCK_FALLBACK) {
        console.warn('Updating local mock state in development.');
        const tutor = MOCK_TUTORS.find((t) => t.id === tutorId);
        if (!tutor) {
          throw new Error(`Tutor ${tutorId} not found`);
        }
        tutor.isVerified = typeof isVerified === 'boolean' ? isVerified : !tutor.isVerified;
        tutor.verificationBadge = tutor.isVerified ? 'Government ID & Degree' : 'Background Verified';
        return tutor;
      }
      throw error;
    }
  },
};

export const BookingService = {
  async getBookings(userId?: string, role: 'student' | 'tutor' = 'student'): Promise<Booking[]> {
    try {
      const params = new URLSearchParams();
      if (role === 'student' && userId) {
        params.set('studentId', userId);
      } else if (role === 'tutor' && isMongoId(userId)) {
        params.set('tutorId', userId!);
      }

      const response = await fetch(`${API_BASE_URL}/api/bookings${params.toString() ? `?${params.toString()}` : ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const payload = (await response.json()) as BackendBookingsResponse;
      if (!payload.success || !Array.isArray(payload.bookings)) {
        throw new Error('Invalid bookings payload');
      }

      return payload.bookings.map(mapBackendBookingToBooking);
    } catch (error) {
      console.error('Booking API unavailable:', error);
      if (ENABLE_MOCK_FALLBACK) {
        console.warn('Using empty booking array fallback in development.');
        return [];
      }
      throw error;
    }
  },

  async createBooking(
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>
  ): Promise<Booking> {
    const payload = {
      tutorId: bookingData.tutorId,
      studentId: bookingData.studentId,
      studentName: bookingData.studentName,
      studentPhone: bookingData.studentPhone,
      subject: bookingData.tutorSubject,
      bookingDate: resolveBookingDateLabelToISO(bookingData.date),
      timeSlot: normalizeTimeSlot(bookingData.timeSlot, bookingData.durationMinutes),
      durationMinutes: bookingData.durationMinutes,
      mode: bookingData.mode,
      topicDoubt: bookingData.topicDoubt,
    };

    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseData = (await response.json()) as BackendBookingResponse | { message?: string };
    if (!response.ok) {
      throw new Error(responseData?.message || `Failed to create booking: ${response.status}`);
    }

    const apiPayload = responseData as BackendBookingResponse;
    if (!apiPayload.success || !apiPayload.booking) {
      throw new Error('Invalid booking creation response');
    }

    const mapped = mapBackendBookingToBooking(apiPayload.booking);
    return {
      ...mapped,
      tutorAvatar: bookingData.tutorAvatar,
      tutorTitle: bookingData.tutorTitle,
      tutorSubject: bookingData.tutorSubject,
      studentGrade: bookingData.studentGrade,
      date: bookingData.date,
      timeSlot: payload.timeSlot,
    };
  },

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const responseData = (await response.json()) as BackendBookingResponse | { message?: string };
    if (!response.ok) {
      throw new Error(responseData?.message || `Failed to update booking status: ${response.status}`);
    }

    const apiPayload = responseData as BackendBookingResponse;
    if (!apiPayload.success || !apiPayload.booking) {
      throw new Error('Invalid booking status update response');
    }

    return mapBackendBookingToBooking(apiPayload.booking);
  },
};
