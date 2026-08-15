'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tutor } from '@/types';
import { Rating } from './Rating';
import { VerificationBadge } from './VerificationBadge';
import { MatchScore } from './MatchScore';
import { Button } from './Button';
import { MapPin, Clock, Globe, Zap, ArrowRight } from 'lucide-react';

interface TutorCardProps {
  tutor: Tutor;
  showMatchScore?: boolean;
  onInstantBook?: (tutor: Tutor) => void;
  className?: string;
}

export const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  showMatchScore = true,
  onInstantBook,
  className = '',
}) => {
  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-cardHover hover:border-brand-300 transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${className}`}
    >
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-indigo-600" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: Photo, Status, Name, Match Score */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-slate-100 group-hover:ring-brand-200 transition-all relative">
              <Image
                src={tutor.avatar}
                alt={tutor.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 64px, 80px"
              />
            </div>
            {tutor.isAvailableNow && (
              <span
                title="Available for 15-min instant session right now"
                className="absolute -bottom-1 -right-1 flex h-4 w-4"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-brand-600 transition-colors flex items-center gap-1.5 flex-wrap">
                  {tutor.name}
                  {tutor.isVerified && (
                    <VerificationBadge type={tutor.verificationBadge} size="sm" showText={false} />
                  )}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {tutor.qualification}
                </p>
              </div>

              {showMatchScore && tutor.matchScore && (
                <MatchScore
                  score={tutor.matchScore}
                  reasons={tutor.matchReasons}
                  size="sm"
                />
              )}
            </div>

            {/* Rating and Experience */}
            <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
              <Rating value={tutor.rating} count={tutor.reviewCount} size="sm" />
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {tutor.experienceYears}+ yrs exp
              </span>
            </div>
          </div>
        </div>

        {/* Subjects taught */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tutor.subjects.slice(0, 3).map((sub, idx) => (
            <span
              key={idx}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-brand-50/80 text-brand-700 border border-brand-100/80"
            >
              {sub}
            </span>
          ))}
          {tutor.subjects.length > 3 && (
            <span className="text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
              +{tutor.subjects.length - 3} more
            </span>
          )}
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {tutor.bio}
        </p>

        {/* Meta Info: Location, Languages, Mode */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{tutor.location.city}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{tutor.languages.join(', ')}</span>
          </div>
          <div className="col-span-2 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-700">Classes:</span> {tutor.grades.join(', ')}
          </div>
          <div className="col-span-2 text-[11px] text-slate-600 flex items-center justify-between gap-2">
            <span>
              <span className="font-semibold text-slate-700">Availability:</span> {tutor.availableDays.join(', ') || 'Flexible'}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-semibold ${tutor.mode === 'online' || tutor.mode === 'both' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${tutor.mode === 'online' || tutor.mode === 'both' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
              {tutor.mode === 'online' || tutor.mode === 'both' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Pricing and Actions */}
      <div className="px-5 py-4 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">
              ₹{tutor.hourlyRate}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ hour</span>
          </div>
          {tutor.isAvailableNow && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span>₹{tutor.instantRate15Min} for 15m SOS</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/tutors/${tutor.id}`}>
            <Button variant="secondary" size="sm" className="bg-white">
              Profile
            </Button>
          </Link>
          <Link href={`/book/${tutor.id}`}>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
