'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Booking, BookingStatus } from '@/types';
import { Button } from './Button';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  FileText, 
  ExternalLink,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  isTutorView?: boolean;
  onStatusChange?: (bookingId: string, status: BookingStatus) => void;
  className?: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isTutorView = false,
  onStatusChange,
  className = '',
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Pending Request
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
            Completed
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            {booking.status === 'rejected' ? 'Declined' : 'Cancelled'}
          </span>
        );
    }
  };

  const handleAction = async (newStatus: BookingStatus) => {
    if (!onStatusChange) return;
    setLoadingAction(newStatus);
    try {
      await onStatusChange(booking.id, newStatus);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-cardHover transition-all p-5 sm:p-6 space-y-4 ${className}`}
    >
      {/* Top row: Status, Mode, Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
            {booking.mode === 'online' ? (
              <>
                <Video className="w-3.5 h-3.5" />
                Live 1-on-1
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5" />
                In-Person Local
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          <span>{booking.date}</span>
        </div>
      </div>

      {/* Main info: Person and Subject */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 relative shrink-0 ring-1 ring-slate-200">
          <Image
            src={isTutorView ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' : booking.tutorAvatar}
            alt={isTutorView ? booking.studentName : booking.tutorName}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-base leading-tight">
                {isTutorView ? `Student: ${booking.studentName}` : booking.tutorName}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isTutorView ? booking.studentGrade : booking.tutorTitle}
              </p>
            </div>
            <div className="text-right">
              <div className="text-base font-extrabold text-slate-900">
                ₹{booking.totalAmount}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {booking.durationMinutes} mins
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs font-semibold text-brand-700 bg-brand-50/70 px-3 py-1.5 rounded-xl border border-brand-100/60 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span className="truncate">{booking.tutorSubject}</span>
          </div>
        </div>
      </div>

      {/* Doubt/Topic description */}
      {booking.topicDoubt && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            Specific Topic / Doubt to Cover:
          </span>
          <p className="text-slate-600 leading-relaxed pl-5">
            {booking.topicDoubt}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Slot: {booking.timeSlot}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Tutor pending actions */}
          {isTutorView && booking.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                isLoading={loadingAction === 'rejected'}
                onClick={() => handleAction('rejected')}
              >
                Decline
              </Button>
              <Button
                variant="success"
                size="sm"
                isLoading={loadingAction === 'confirmed'}
                onClick={() => handleAction('confirmed')}
                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
              >
                Accept Session
              </Button>
            </>
          )}

          {/* Join Classroom Button */}
          {booking.status === 'confirmed' && (
            <Link href={booking.meetUrl || `/session/session-live-${booking.id}`}>
              <Button
                variant="saffron"
                size="sm"
                leftIcon={<Video className="w-4 h-4" />}
              >
                {isTutorView ? 'Launch Live Classroom' : 'Join Classroom Now'}
              </Button>
            </Link>
          )}

          {/* Notes download for completed */}
          {booking.status === 'completed' && booking.notesAttachment && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => alert(`Downloading session study notes: ${booking.notesAttachment}`)}
            >
              Session Notes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
