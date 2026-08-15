'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { TutorService, BookingService } from '@/services/api';
import { Tutor, Booking } from '@/types';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  CalendarCheck,
  Download,
  Share2
} from 'lucide-react';

function BookingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const tutorId = params.id as string;

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form selections
  const [mode, setMode] = useState<'online' | 'local'>('online');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [selectedDate, setSelectedDate] = useState<string>(searchParams.get('day') || 'Today, 05:30 PM');
  const [selectedSlot, setSelectedSlot] = useState<string>(searchParams.get('slot') || '05:30 PM - 06:30 PM');
  const [doubtTopic, setDoubtTopic] = useState<string>('');

  useEffect(() => {
    async function loadTutor() {
      setIsLoading(true);
      try {
        const data = await TutorService.getTutorById(tutorId);
        setTutor(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadTutor();
  }, [tutorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading booking session details..." />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Tutor Not Found</h2>
        <Link href="/tutors" className="mt-4">
          <Button variant="primary" size="sm">
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const hourlyRate = tutor.hourlyRate;
  const calculatedFee = Math.round((hourlyRate / 60) * durationMinutes);
  const platformFee = 0; // ₹0 for students
  const totalPayable = calculatedFee + platformFee;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const created = await BookingService.createBooking({
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorAvatar: tutor.avatar,
        tutorTitle: tutor.title,
        tutorSubject: `${tutor.subjects[0]} - ${doubtTopic.trim() || 'General Concept Mastery'}`,
        studentId: user?.id || 'stu-101',
        studentName: user?.name || 'Aarav Sharma',
        studentGrade: user?.grade || 'Class 11 (PCM)',
        studentPhone: user?.phone || '+91 98765 43210',
        date: selectedDate,
        timeSlot: selectedSlot,
        durationMinutes,
        mode,
        totalAmount: totalPayable,
        topicDoubt: doubtTopic.trim() || 'Comprehensive concept explanation and doubt solving.',
      });

      setConfirmedBooking(created);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create booking right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If booking is confirmed, display confirmation receipt screen
  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Banner Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-100 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Booking Confirmed & Scheduled!
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-3">
                You’re All Set with {tutor.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                Booking Reference ID: <strong className="text-slate-800">{confirmedBooking.id}</strong>. A confirmation SMS & calendar invite have been sent.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left space-y-3 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
                <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                  <Image
                    src={tutor.avatar}
                    alt={tutor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{tutor.name}</h4>
                  <p className="text-[11px] text-slate-500">{tutor.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Date & Time</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    {confirmedBooking.date} ({confirmedBooking.timeSlot})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Session Format</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Video className="w-3.5 h-3.5 text-brand-600" />
                    {confirmedBooking.mode === 'online' ? 'Live 1-on-1 Video' : 'In-Person'} ({confirmedBooking.durationMinutes}m)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between font-bold text-slate-800">
                <span>Total Amount Paid:</span>
                <span className="text-base text-brand-700">₹{confirmedBooking.totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={confirmedBooking.meetUrl || `/session/session-live-${confirmedBooking.id}`} className="w-full sm:w-auto">
                <Button
                  variant="saffron"
                  size="lg"
                  className="w-full sm:w-auto font-bold shadow-lg"
                  leftIcon={<Video className="w-5 h-5" />}
                >
                  Enter Live Classroom
                </Button>
              </Link>

              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Go to Student Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="text-xs text-slate-500 font-medium">
          <Link href="/tutors" className="hover:text-brand-600">
            Tutors
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/tutors/${tutor.id}`} className="hover:text-brand-600">
            {tutor.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-bold">Book 1-on-1 Session</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Booking Options */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                  Book 1-on-1 Tutoring Session
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Choose your preferred format, slot duration, and describe your doubts for {tutor.name}.
                </p>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-6">
                {/* 1. Select Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Select Session Format
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('online')}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        mode === 'online'
                          ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-brand-100 text-brand-700 shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Live 1-on-1 Video Class</div>
                        <p className="text-xs text-slate-500 mt-0.5">Interactive pen whiteboard, screen-share & recording.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('local')}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        mode === 'local'
                          ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">In-Person Home / Center</div>
                        <p className="text-xs text-slate-500 mt-0.5">In {tutor.location.city} ({tutor.location.locality || 'City Center'}).</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Select Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Select Duration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { mins: 15, label: '15 Mins SOS', desc: 'Urgent doubt' },
                      { mins: 30, label: '30 Mins', desc: 'Topic revision' },
                      { mins: 60, label: '60 Mins (1 hr)', desc: 'Standard class' },
                      { mins: 120, label: '120 Mins (2 hrs)', desc: 'Deep dive' },
                    ].map((d) => (
                      <button
                        key={d.mins}
                        type="button"
                        onClick={() => setDurationMinutes(d.mins)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          durationMinutes === d.mins
                            ? 'border-brand-600 bg-brand-600 text-white shadow-md'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-sm font-bold">{d.label}</div>
                        <div className={`text-[10px] mt-0.5 ${durationMinutes === d.mins ? 'text-brand-100' : 'text-slate-400'}`}>
                          {d.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Select Date & Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      3. Select Day / Date
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    >
                      <option value="Today">Today (Immediate)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      4. Select Time Slot
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    >
                      <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                      <option value="05:30 PM - 06:30 PM">05:30 PM - 06:30 PM</option>
                      <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                      <option value="08:30 PM - 09:30 PM">08:30 PM - 09:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* 4. Describe Doubts */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>5. Specific Topic or Question to Cover (Optional)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Helps tutor prepare custom examples</span>
                  </label>
                  <textarea
                    rows={3}
                    value={doubtTopic}
                    onChange={(e) => setDoubtTopic(e.target.value)}
                    placeholder="e.g. Need step-by-step clarity on Lenz Law in electromagnetic induction and previous year JEE numericals..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-2">
                  {submitError && (
                    <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                      {submitError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full font-extrabold shadow-lg shadow-brand-600/25"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Confirm & Schedule Session (₹{totalPayable})
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Summary & Tutor Card */}
          <div className="lg:col-span-4 space-y-5">
            {/* Tutor Overview Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/90 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 ring-1 ring-slate-200">
                  <Image
                    src={tutor.avatar}
                    alt={tutor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1 flex-wrap">
                    {tutor.name}
                    <VerificationBadge type={tutor.verificationBadge} size="sm" showText={false} />
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{tutor.qualification}</p>
                  <div className="mt-1">
                    <Rating value={tutor.rating} count={tutor.reviewCount} size="sm" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="text-slate-500 font-medium">Teaching Focus:</div>
                <div className="text-slate-800 font-semibold truncate">{tutor.subjects.join(', ')}</div>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/90 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Payment Summary (INR ₹)
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tutor Hourly Base:</span>
                  <span className="font-semibold text-slate-800">₹{hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Session Duration ({durationMinutes} mins):</span>
                  <span className="font-semibold text-slate-800">₹{calculatedFee}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Student Platform Fee:</span>
                  <span>₹0 (Free)</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm font-extrabold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-xl text-brand-600">₹{totalPayable}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Risk: 100% Refund if not satisfied.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading booking form..." />}>
      <BookingContent />
    </Suspense>
  );
}
