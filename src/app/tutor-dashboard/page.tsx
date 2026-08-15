'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { TutorService, BookingService } from '@/services/api';
import { Booking, TutorStats, BookingStatus } from '@/types';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { BookingCard } from '@/components/ui/BookingCard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  GraduationCap, 
  IndianRupee, 
  Clock, 
  Calendar, 
  Users, 
  Star, 
  Zap, 
  CheckCircle2, 
  Bell, 
  Video, 
  TrendingUp, 
  ShieldCheck,
  Settings,
  ArrowRight
} from 'lucide-react';

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TutorStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInstantActive, setIsInstantActive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadTutorData() {
      setIsLoading(true);
      try {
        const [statsData, bookingsData] = await Promise.all([
          TutorService.getTutorStats('tut-001'),
          BookingService.getBookings('tut-001', 'tutor'),
        ]);
        setStats(statsData);
        setBookings(bookingsData);
      } finally {
        setIsLoading(false);
      }
    }
    loadTutorData();
  }, []);

  const handleBookingStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
      const updated = await BookingService.updateBookingStatus(bookingId, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updated : b))
      );
      setToastMessage(
        status === 'confirmed'
          ? `Session accepted successfully! Meeting link generated.`
          : `Session request declined.`
      );
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Error updating booking status', err);
    }
  };

  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const upcomingSessions = bookings.filter((b) => b.status === 'confirmed');
  const completedSessions = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden relative ring-4 ring-emerald-500/30 shrink-0 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                alt="Dr. Priya Sharma"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Top Educator
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
                Dr. Priya Sharma
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Senior Physics Faculty • Ph.D. IIT Delhi • ₹600/hr
              </p>
            </div>
          </div>

          {/* Instant SOS Availability Toggle */}
          <div className="bg-slate-800/90 rounded-2xl p-3 sm:p-4 border border-slate-700 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>15-Min Instant SOS Mode</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isInstantActive ? 'Active — Students can match instantly' : 'Paused — No instant alerts'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsInstantActive(!isInstantActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isInstantActive ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isInstantActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        {/* Tutor Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Net Earnings"
            value="₹42,800"
            subtitle="₹18,400 earned this month"
            icon={<IndianRupee className="w-5 h-5 text-emerald-600" />}
            trend={{ value: '+24% this week', isPositive: true }}
          />
          <DashboardCard
            title="Completed Sessions"
            value="52 Classes"
            subtitle="142 hours of 1-on-1 teaching"
            icon={<GraduationCap className="w-5 h-5 text-brand-600" />}
          />
          <DashboardCard
            title="Educator Rating"
            value="4.95 ★"
            subtitle="142 verified student reviews"
            icon={<Star className="w-5 h-5 text-amber-500 fill-amber-400" />}
          />
          <DashboardCard
            title="Booking Acceptance Rate"
            value="98%"
            subtitle="Avg response time: 2 mins"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          />
        </div>

        {/* 1. Pending Booking Requests with Accept/Reject */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 mb-1">
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                Action Required
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Pending Booking Requests ({pendingRequests.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Respond promptly for higher AI match score</span>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Fetching booking queue..." />
          ) : pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isTutorView={true}
                  onStatusChange={handleBookingStatusChange}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="booking"
              title="All Caught Up!"
              description="You have no pending booking requests right now. Your profile is active and visible."
            />
          )}
        </section>

        {/* 2. Today's Upcoming Live Sessions & Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upcoming confirmed */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                Scheduled Live Sessions ({upcomingSessions.length})
              </h3>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isTutorView={true}
                    onStatusChange={handleBookingStatusChange}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="calendar"
                title="No Upcoming Scheduled Sessions"
                description="Accepted sessions will appear here with one-click classroom launch links."
              />
            )}
          </div>

          {/* Completed / Payout history */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Recent Completed Classes ({completedSessions.length})
              </h3>
            </div>

            {completedSessions.length > 0 ? (
              <div className="space-y-4">
                {completedSessions.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isTutorView={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="booking"
                title="No Past Sessions Recorded"
                description="Completed sessions and ratings will show here."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
