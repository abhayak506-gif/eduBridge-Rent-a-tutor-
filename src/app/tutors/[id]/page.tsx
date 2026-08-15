'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { TutorService } from '@/services/api';
import { Tutor, Review } from '@/types';
import { Rating } from '@/components/ui/Rating';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { MatchScore } from '@/components/ui/MatchScore';
import { Button } from '@/components/ui/Button';
import { InstantTutorModal } from '@/components/common/InstantTutorModal';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { 
  MapPin, 
  Clock, 
  Globe, 
  Award, 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  Calendar, 
  Video, 
  ShieldCheck, 
  MessageSquare,
  ArrowRight,
  Share2,
  Heart
} from 'lucide-react';

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const tutorId = params.id as string;

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>('Today');
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);

  useEffect(() => {
    async function loadTutorData() {
      setIsLoading(true);
      try {
        const [tutorData, reviewsData] = await Promise.all([
          TutorService.getTutorById(tutorId),
          TutorService.getReviewsForTutor(tutorId),
        ]);
        setTutor(tutorData);
        setReviews(reviewsData);
        if (tutorData?.availableSlots?.[0]?.day) {
          setSelectedDay(tutorData.availableSlots[0].day);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadTutorData();
  }, [tutorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading tutor credentials & schedule..." />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Tutor Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The educator profile requested does not exist.</p>
        <Link href="/tutors">
          <Button variant="primary" size="sm">
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  const currentSlots = tutor.availableSlots.find((s) => s.day === selectedDay)?.times || [];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Link href="/tutors" className="hover:text-brand-600">
              Tutors Directory
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{tutor.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigator.clipboard && navigator.clipboard.writeText(window.location.href)}
              className="flex items-center gap-1.5 hover:text-slate-900 text-slate-600"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Content: Profile Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden relative ring-4 ring-slate-100 shadow-md">
                    <Image
                      src={tutor.avatar}
                      alt={tutor.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      priority
                    />
                  </div>
                  {tutor.isAvailableNow && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white"></span>
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                        {tutor.name}
                      </h1>
                      <VerificationBadge type={tutor.verificationBadge} size="md" />
                    </div>

                    {tutor.matchScore && (
                      <MatchScore score={tutor.matchScore} reasons={tutor.matchReasons} size="md" />
                    )}
                  </div>

                  <p className="text-sm font-semibold text-brand-700">
                    {tutor.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {tutor.qualification}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
                    <Rating value={tutor.rating} count={tutor.reviewCount} size="md" />
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {tutor.experienceYears}+ Years Experience
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      {tutor.totalStudents}+ Students Guided
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Location & Mode</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    {tutor.location.city} ({tutor.mode === 'both' ? 'Online + Local' : tutor.mode})
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Languages Spoken</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                    <Globe className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    {tutor.languages.join(', ')}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Total Hours Taught</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                    {tutor.totalHours}+ Hours
                  </span>
                </div>
              </div>
            </div>

            {/* About & Teaching Methodology */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                  About the Educator
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {tutor.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                  Teaching Methodology & Style
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {tutor.methodology}
                </p>
              </div>

              {/* Key Highlights */}
              {tutor.highlights.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Notable Highlights & Achievements
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {tutor.highlights.map((h, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-2xl bg-academic-50/70 border border-academic-200/70 text-xs font-semibold text-academic-900"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Subjects & Curriculum Coverage */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Subjects & Target Curricula
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                    Subjects Taught
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                    Classes & Target Exams
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {tutor.grades.map((g, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Verified Student & Parent Reviews ({reviews.length})
                  </h3>
                  <p className="text-xs text-slate-500">From students across CBSE, ICSE & NEET/JEE</p>
                </div>
                <div className="flex items-center gap-2">
                  <Rating value={tutor.rating} size="lg" />
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{rev.studentName}</div>
                        <div className="text-[11px] text-slate-500">{rev.studentGrade} • {rev.subject}</div>
                      </div>
                      <div className="text-right">
                        <Rating value={rev.rating} size="sm" showValue={false} />
                        <span className="text-[10px] text-slate-400 block mt-0.5">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-5">
              {/* Pricing Header */}
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-3xl font-black text-slate-900 font-display">
                    ₹{tutor.hourlyRate}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> / hour</span>
                </div>
                {tutor.isAvailableNow && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online Now
                  </span>
                )}
              </div>

              {/* Instant 15-Min SOS Promo */}
              {tutor.isAvailableNow && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
                      <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                      15-Min Urgent Doubt SOS
                    </div>
                    <span className="text-xs font-black text-amber-900">₹{tutor.instantRate15Min} only</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Need instant clarity before exam? Connect with {tutor.name.split(' ')[0]} live right now.
                  </p>
                  <Button
                    variant="saffron"
                    size="sm"
                    className="w-full font-bold shadow-sm"
                    onClick={() => setIsInstantModalOpen(true)}
                  >
                    Launch Instant Session (₹{tutor.instantRate15Min})
                  </Button>
                </div>
              )}

              {/* Availability Calendar Quick Select */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    Available Time Slots
                  </label>
                  <span className="text-[11px] text-slate-500">Live Slots</span>
                </div>

                {/* Day selector tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  {tutor.availableSlots.map((slot) => (
                    <button
                      key={slot.day}
                      type="button"
                      onClick={() => setSelectedDay(slot.day)}
                      className={`py-1.5 rounded-lg transition-all ${
                        selectedDay === slot.day
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {slot.day}
                    </button>
                  ))}
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {currentSlots.map((time, idx) => (
                    <Link key={idx} href={`/book/${tutor.id}?slot=${encodeURIComponent(time)}&day=${encodeURIComponent(selectedDay)}`}>
                      <button
                        type="button"
                        className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 transition-all text-center"
                      >
                        {time}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Booking Action */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <Link href={`/book/${tutor.id}`}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full font-bold shadow-lg shadow-brand-600/20"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Book Scheduled Session
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Money-Back Doubt Guarantee</span>
                </div>
              </div>
            </div>
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
