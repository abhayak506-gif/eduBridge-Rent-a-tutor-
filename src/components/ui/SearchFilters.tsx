'use client';

import React from 'react';
import { TutorFilterState } from '@/types';
import { 
  SUBJECT_OPTIONS, 
  CLASS_OPTIONS, 
  BOARD_OPTIONS, 
  LANGUAGE_OPTIONS 
} from '@/data/mockData';
import { Search, Filter, RotateCcw, Zap, SlidersHorizontal } from 'lucide-react';
import { Button } from './Button';

interface SearchFiltersProps {
  filters: TutorFilterState;
  onChange: (filters: TutorFilterState) => void;
  onReset: () => void;
  totalCount?: number;
  isCompact?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
  isCompact = false,
}) => {
  const update = (key: keyof TutorFilterState, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-5">
      {/* Top Bar: Search Query and Quick Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => update('query', e.target.value)}
            placeholder="Search by tutor name, topic (e.g. Calculus, NEET, Python), or city..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
            Sort by:
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => update('sortBy', e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            <option value="match">✨ Best AI Match</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="price_asc">₹ Price: Low to High</option>
            <option value="price_desc">₹ Price: High to Low</option>
            <option value="experience">🎓 Most Experienced</option>
          </select>
        </div>
      </div>

      {/* Grid of Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        {/* Subject */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Subject
          </label>
          <select
            value={filters.subject}
            onChange={(e) => update('subject', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Class / Grade */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Class / Target
          </label>
          <select
            value={filters.grade}
            onChange={(e) => update('grade', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            {CLASS_OPTIONS.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        {/* Board */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Board
          </label>
          <select
            value={filters.board}
            onChange={(e) => update('board', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            {BOARD_OPTIONS.map((board) => (
              <option key={board} value={board}>
                {board}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Language
          </label>
          <select
            value={filters.language}
            onChange={(e) => update('language', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Row: Budget Slider, Mode Toggle, Instant available, Reset */}
      <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Budget Slider */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Max Budget: <span className="text-brand-600 font-extrabold">₹{filters.maxPrice}/hr</span>
          </div>
          <input
            type="range"
            min="300"
            max="1200"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => update('maxPrice', Number(e.target.value))}
            className="w-32 accent-brand-600 cursor-pointer"
          />
        </div>

        {/* Mode Toggle & Instant Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => update('mode', 'all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filters.mode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              All Modes
            </button>
            <button
              type="button"
              onClick={() => update('mode', 'online')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filters.mode === 'online' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Online 1-on-1
            </button>
            <button
              type="button"
              onClick={() => update('mode', 'local')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filters.mode === 'local' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              In-Person
            </button>
          </div>

          {/* Instant Available Toggle */}
          <button
            type="button"
            onClick={() => update('availableNowOnly', !filters.availableNowOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filters.availableNowOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${filters.availableNowOnly ? 'fill-emerald-500 text-emerald-600' : 'text-slate-400'}`} />
            <span>Available Now</span>
          </button>

          {/* Reset Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Reset
          </Button>
        </div>
      </div>

      {totalCount !== undefined && (
        <div className="text-xs font-semibold text-slate-500 flex items-center justify-between pt-1">
          <span>
            Showing <strong className="text-slate-900">{totalCount}</strong> verified Indian tutors
          </span>
          <span className="text-[11px] text-academic-700 bg-academic-50 px-2 py-0.5 rounded-md border border-academic-200">
            ✓ 100% Background & Credentials Verified
          </span>
        </div>
      )}
    </div>
  );
};
