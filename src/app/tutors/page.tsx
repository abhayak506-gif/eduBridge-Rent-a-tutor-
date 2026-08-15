'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TutorService } from '@/services/api';
import { Tutor, TutorFilterState } from '@/types';
import { TutorCard } from '@/components/ui/TutorCard';
import { SearchFilters } from '@/components/ui/SearchFilters';
import { TutorCardSkeleton, LoadingSpinner } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ShieldCheck, Sparkles, Zap, GraduationCap } from 'lucide-react';

const DEFAULT_FILTERS: TutorFilterState = {
  query: '',
  subject: 'All Subjects',
  grade: 'All Classes',
  board: 'All Boards',
  language: 'All Languages',
  mode: 'all',
  maxPrice: 1200,
  minRating: 0,
  availableNowOnly: false,
  sortBy: 'match',
};

function TutorsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<TutorFilterState>(() => {
    return {
      ...DEFAULT_FILTERS,
      query: searchParams.get('q') || '',
      subject: searchParams.get('subject') || 'All Subjects',
      grade: searchParams.get('grade') || 'All Classes',
      language: searchParams.get('lang') || 'All Languages',
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 1200,
      availableNowOnly: searchParams.get('available') === 'true',
    };
  });

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTutors() {
      setIsLoading(true);
      try {
        const data = await TutorService.getTutors(filters);
        setTutors(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTutors();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Pan-India Verified Educator Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Find Verified Tutors Across India
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search by subject, competitive exam (JEE/NEET), curriculum board, native language, or hourly budget.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Aadhaar & Academic Degree Verified</span>
          </div>
        </div>

        {/* Filter Controls Component */}
        <SearchFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalCount={tutors.length}
        />

        {/* Tutors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[...Array(6)].map((_, i) => (
              <TutorCardSkeleton key={i} />
            ))}
          </div>
        ) : tutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {tutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                showMatchScore={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No Tutors Found Matching Your Criteria"
            description="Try increasing your budget limit, clearing filters, or searching for broader terms like 'Physics', 'Mathematics', or 'English'."
            actionText="Reset All Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading tutors directory..." />}>
      <TutorsContent />
    </Suspense>
  );
}
