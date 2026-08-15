'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TutorService, BookingService } from '@/services/api';
import { Tutor, Booking, TutorRecommendation } from '@/types';
import { 
  SUBJECT_OPTIONS, 
  CLASS_OPTIONS, 
  LANGUAGE_OPTIONS 
} from '@/data/mockData';
import { TutorCard } from '@/components/ui/TutorCard';
import { BookingCard } from '@/components/ui/BookingCard';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { InstantTutorModal } from '@/components/common/InstantTutorModal';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  Zap, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Video, 
  Award, 
  CheckCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);

  // Search filter bar states
  const [searchSubject, setSearchSubject] = useState('Physics');
  const [searchGrade, setSearchGrade] = useState('Class 11 (Senior Secondary)');
  const [searchLanguage, setSearchLanguage] = useState('English');
  const [searchBudget, setSearchBudget] = useState(700);

  // Data states
  const [recommendedMatches, setRecommendedMatches] = useState<TutorRecommendation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [recommendations, allBookings] = await Promise.all([
          TutorService.getRecommendedTutors({
            subject: searchSubject,
            grade: searchGrade,
            language: searchLanguage,
            maxBudget: searchBudget,
          }),
          BookingService.getBookings(user?.id || 'stu-101', 'student'),
        ]);
        setRecommendedMatches(recommendations);
        setBookings(allBookings);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user, searchSubject, searchGrade, searchLanguage, searchBudget]);

  const handleFilterSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/tutors?subject=${encodeURIComponent(searchSubject)}&grade=${encodeURIComponent(
        searchGrade
      )}&lang=${encodeURIComponent(searchLanguage)}&maxPrice=${searchBudget}`
    );
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const recentBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden relative ring-4 ring-white/15 shrink-0 shadow-lg">
              <Image
                src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Aarav'}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/30 text-brand-200 text-xs font-bold border border-brand-400/30 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Student Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
                Namaste, {user?.name || 'Aarav Sharma'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-brand-200 mt-0.5">
                {user?.grade || 'Class 11 (PCM)'} • {user?.board || 'CBSE Board'} • {user?.city || 'New Delhi'}
              </p>
            </div>
          </div>

          {/* Instant SOS Action in Header */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="saffron"
              size="lg"
              onClick={() => setIsInstantModalOpen(true)}
              leftIcon={<Zap className="w-5 h-5 fill-slate-950 text-slate-950" />}
              className="font-extrabold shadow-lg shadow-amber-500/20 text-slate-950"
            >
              15-Min Instant Tutor SOS
            </Button>
            <Link href="/tutors">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse All Tutors
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Next Confirmed Session"
            value="Today, 5:30 PM"
            subtitle="Electromagnetic Induction with Dr. Priya"
            icon={<Video className="w-5 h-5" />}
            badge="Upcoming"
          />
          <DashboardCard
            title="Total Doubt Sessions"
            value="14 Sessions"
            subtitle="Physics (8), Maths (4), Chem (2)"
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <DashboardCard
            title="Study Hours Logged"
            value="18.5 Hours"
            subtitle="100% doubt resolution rate"
            icon={<Clock className="w-5 h-5" />}
          />
          <DashboardCard
            title="Active AI Match Score"
            value="98% Match"
            subtitle="Tailored for Class 11 PCM"
            icon={<Sparkles className="w-5 h-5 text-amber-500" />}
          />
        </div>

        {/* Search & Filter Toolbar Card */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-600" />
                Find the Best Tutor for Your Doubts
              </h2>
              <p className="text-xs text-slate-500">
                Filter by subject, standard, native language, and your hourly budget.
              </p>
            </div>
            <Link
              href="/tutors"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Advanced Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <form onSubmit={handleFilterSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Subject
              </label>
              <select
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                {SUBJECT_OPTIONS.filter((s) => s !== 'All Subjects').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Target Class
              </label>
              <select
                value={searchGrade}
                onChange={(e) => setSearchGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                {CLASS_OPTIONS.filter((c) => c !== 'All Classes').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Language
              </label>
              <select
                value={searchLanguage}
                onChange={(e) => setSearchLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                {LANGUAGE_OPTIONS.filter((l) => l !== 'All Languages').map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">
                  Max Budget
                </label>
                <span className="text-xs font-extrabold text-brand-600">₹{searchBudget}/hr</span>
              </div>
              <input
                type="range"
                min="300"
                max="1200"
                step="50"
                value={searchBudget}
                onChange={(e) => setSearchBudget(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold"
                rightIcon={<Search className="w-4 h-4" />}
              >
                Find Best Tutor
              </Button>
            </div>
          </form>
        </div>

        {/* 5. AI RECOMMENDATION SECTION: Best Matches for You */}
        <section id="matches" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                AI Recommendation Engine (Connected via /api/recommend-tutors)
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display mt-1">
                Best Matches for You
              </h2>
              <p className="text-xs text-slate-500">
                Hand-picked educators based on your syllabus (Class 11 PCM), Hindi/English preference, and budget.
              </p>
            </div>

            <Link
              href="/tutors"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All 14+ Verified Tutors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Computing AI compatibility matrix for Class 11 PCM..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedMatches.slice(0, 3).map((rec) => (
                <TutorCard
                  key={rec.tutor.id}
                  tutor={{
                    ...rec.tutor,
                    matchScore: rec.matchScore,
                    matchReasons: rec.reasons,
                  }}
                  showMatchScore={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Bookings Section: Upcoming & Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upcoming Sessions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                Upcoming Live Sessions ({upcomingBookings.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">Auto-syncs with Calendar</span>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isTutorView={false}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="calendar"
                title="No Upcoming Sessions Scheduled"
                description="Book a 1-on-1 scheduled session or launch an instant 15-minute doubt solving class."
                actionText="Find a Tutor"
                onAction={() => router.push('/tutors')}
              />
            )}
          </div>

          {/* Right Column: Recent Sessions & Study Notes */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Recent Sessions & Notes ({recentBookings.length})
              </h3>
            </div>

            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isTutorView={false}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="booking"
                title="No Past Sessions"
                description="Completed sessions and handwritten notes will appear here."
              />
            )}
          </div>
        </div>
      </div>

      <InstantTutorModal
        isOpen={isInstantModalOpen}
        onClose={() => setIsInstantModalOpen(false)}
      />
    </div>
  );
}
