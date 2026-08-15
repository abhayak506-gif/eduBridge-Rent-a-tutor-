'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TutorService, BookingService } from '@/services/api';
import { Tutor, Booking, BookingStatus } from '@/types';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Rating } from '@/components/ui/Rating';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Calendar,
  IndianRupee,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  MapPin,
  Filter,
  RefreshCw,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'online' | 'local'>('all');

  const loadAdminData = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [tutorsData, bookingsData] = await Promise.all([
        TutorService.getTutors(),
        BookingService.getBookings(),
      ]);
      setTutors(tutorsData);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleVerification = async (tutor: Tutor) => {
    setTogglingId(tutor.id);
    try {
      const nextStatus = !tutor.isVerified;
      const updated = await TutorService.toggleVerification(tutor.id, nextStatus);

      setTutors((prev) =>
        prev.map((t) => (t.id === tutor.id ? { ...t, isVerified: updated.isVerified, verificationBadge: updated.verificationBadge } : t))
      );

      setToastMessage(
        updated.isVerified
          ? `Verified badge granted to ${tutor.name}`
          : `Verification badge removed for ${tutor.name}`
      );
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Failed to toggle verification status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  // Metrics calculations
  const totalTutors = tutors.length;
  const verifiedTutors = tutors.filter((t) => t.isVerified).length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const totalBookingValue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const uniqueStudents = new Set(bookings.map((b) => b.studentId || b.studentName)).size;

  // Filtered Tutors
  const filteredTutors = tutors.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.qualification.toLowerCase().includes(q) ||
      t.subjects.some((s) => s.toLowerCase().includes(q));

    const matchesVerification =
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && t.isVerified) ||
      (verificationFilter === 'unverified' && !t.isVerified);

    const matchesMode =
      modeFilter === 'all' ||
      (modeFilter === 'online' && t.mode === 'online') ||
      (modeFilter === 'local' && t.mode === 'local');

    return matchesSearch && matchesVerification && matchesMode;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Completed
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            {status === 'rejected' ? 'Declined' : 'Cancelled'}
          </span>
        );
    }
  };

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
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              EduBridge Administrative Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
              Platform Administration & Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time directory stats, tutor verification controls, and booking audit trail.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              isLoading={isRefreshing}
              onClick={() => loadAdminData(true)}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            >
              Refresh Platform Data
            </Button>
            <Link href="/tutors">
              <Button variant="primary" size="sm">
                View Live Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        {/* Key Metrics Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Registered Tutors"
            value={`${totalTutors} Educators`}
            subtitle={`${verifiedTutors} background verified`}
            icon={<GraduationCap className="w-5 h-5 text-brand-600" />}
          />
          <DashboardCard
            title="Verified Tutor Ratio"
            value={`${totalTutors > 0 ? Math.round((verifiedTutors / totalTutors) * 100) : 0}%`}
            subtitle={`${verifiedTutors} of ${totalTutors} verified`}
            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            trend={{ value: 'Govt ID & Degree Check', isPositive: true }}
          />
          <DashboardCard
            title="Total Platform Bookings"
            value={`${totalBookings} Sessions`}
            subtitle={`${pendingBookings} pending • ${confirmedBookings} active`}
            icon={<Calendar className="w-5 h-5 text-amber-500" />}
          />
          <DashboardCard
            title="Total Booking Volume"
            value={`₹${totalBookingValue.toLocaleString('en-IN')}`}
            subtitle={`${uniqueStudents || 1} active student users`}
            icon={<IndianRupee className="w-5 h-5 text-emerald-600" />}
          />
        </div>

        {/* Tutor Management & Verification Control Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-600" />
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  Educator Management & Verification ({filteredTutors.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review educator profiles, rating performance, subject expertise, and toggle official verification status.
              </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 w-48 sm:w-60"
                />
              </div>

              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value as 'all' | 'verified' | 'unverified')}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>

              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value as 'all' | 'online' | 'local')}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Formats</option>
                <option value="online">Online Mode</option>
                <option value="local">In-Person Local</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading educator database..." />
          ) : filteredTutors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Educator</th>
                    <th className="py-3 px-4">Subjects Taught</th>
                    <th className="py-3 px-4">Rating & Experience</th>
                    <th className="py-3 px-4">Mode / Rate</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTutors.map((tutor) => (
                    <tr key={tutor.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Educator Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 ring-1 ring-slate-200 bg-slate-100">
                            <Image
                              src={tutor.avatar}
                              alt={tutor.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <Link href={`/tutors/${tutor.id}`} className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
                              {tutor.name}
                            </Link>
                            <div className="text-[11px] text-slate-500">{tutor.qualification}</div>
                          </div>
                        </div>
                      </td>

                      {/* Subjects */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {tutor.subjects.map((sub, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-semibold text-[11px]">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Rating & Exp */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Rating value={tutor.rating} size="sm" />
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {tutor.experienceYears}+ yrs exp ({tutor.totalStudents || 40}+ students)
                        </div>
                      </td>

                      {/* Mode & Rate */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">₹{tutor.hourlyRate}/hr</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          {tutor.mode === 'online' ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Video className="w-3 h-3" /> Online
                            </span>
                          ) : (
                            <span className="text-brand-700 font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> Local / Hybrid
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        <VerificationBadge type={tutor.verificationBadge} size="sm" />
                      </td>

                      {/* Admin Toggle Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant={tutor.isVerified ? 'outline' : 'success'}
                          size="sm"
                          isLoading={togglingId === tutor.id}
                          onClick={() => handleToggleVerification(tutor)}
                          className={tutor.isVerified ? 'text-slate-600 border-slate-300 hover:bg-slate-100' : 'font-bold'}
                        >
                          {tutor.isVerified ? 'Revoke Verification' : 'Verify Educator'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="tutor"
              title="No Tutors Found"
              description="No educators match your search or filter criteria."
            />
          )}
        </section>

        {/* Recent Bookings Audit Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                Recent Student Bookings Log ({bookings.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit trail of student session requests, schedule times, and transaction amounts.
              </p>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading booking logs..." />
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Ref ID</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Subject / Topic</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                        {booking.id.slice(-8)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{booking.studentName}</div>
                        <div className="text-[11px] text-slate-500">{booking.studentGrade || 'Class Student'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-brand-700">{booking.tutorSubject}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{booking.topicDoubt || 'General Tutoring'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{booking.date}</div>
                        <div className="text-[11px] text-slate-500">{booking.timeSlot} ({booking.durationMinutes}m)</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        ₹{booking.totalAmount}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(booking.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="booking"
              title="No Bookings Recorded"
              description="Student booking requests will appear in this audit log."
            />
          )}
        </section>
      </div>
    </div>
  );
}
