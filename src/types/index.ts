export type UserRole = 'student' | 'tutor';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  grade?: string;
  board?: string;
  city?: string;
  preferredLanguages?: string[];
}

export type VerificationType = 'Government ID & Degree' | 'Top Tier Institute' | 'Background Verified';
export type TeachingMode = 'online' | 'local' | 'both';

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  qualification: string;
  experienceYears: number;
  subjects: string[];
  grades: string[];
  boards: string[];
  languages: string[];
  hourlyRate: number;
  instantRate15Min: number;
  rating: number;
  reviewCount: number;
  totalStudents: number;
  totalHours: number;
  isVerified: boolean;
  verificationBadge: VerificationType;
  mode: TeachingMode;
  location: {
    city: string;
    state: string;
    locality?: string;
  };
  bio: string;
  methodology: string;
  highlights: string[];
  isAvailableNow: boolean;
  availableDays: string[];
  availableSlots: {
    day: string;
    times: string[];
  }[];
  matchScore?: number;
  matchReasons?: string[];
}

export interface Review {
  id: string;
  tutorId: string;
  studentName: string;
  studentAvatar?: string;
  studentGrade: string;
  rating: number;
  date: string;
  comment: string;
  subject: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  tutorTitle: string;
  tutorSubject: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentPhone?: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  mode: 'online' | 'local';
  status: BookingStatus;
  totalAmount: number;
  topicDoubt?: string;
  meetUrl?: string;
  notesAttachment?: string;
  createdAt: string;
}

export interface TutorRecommendation {
  tutor: Tutor;
  matchScore: number;
  reasons: string[];
}

export interface RecommendationRequest {
  studentId?: string;
  subject: string;
  grade: string;
  language: string;
  maxBudget: number;
  mode?: TeachingMode;
  isUrgent?: boolean;
}

export interface TutorFilterState {
  query: string;
  subject: string;
  grade: string;
  board: string;
  language: string;
  mode: 'all' | 'online' | 'local';
  maxPrice: number;
  minRating: number;
  availableNowOnly: boolean;
  sortBy: 'match' | 'rating' | 'price_asc' | 'price_desc' | 'experience';
}

export interface TutorStats {
  totalEarnings: number;
  monthlyEarnings: number;
  completedSessions: number;
  totalHoursTaught: number;
  activeStudents: number;
  acceptanceRate: number;
  averageRating: number;
}
