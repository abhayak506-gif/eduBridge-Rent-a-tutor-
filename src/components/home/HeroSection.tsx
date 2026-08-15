'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { InstantTutorModal } from '../common/InstantTutorModal';
import { 
  Search, 
  Zap, 
  ShieldCheck, 
  Star, 
  Users, 
  GraduationCap, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tutors?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/tutors');
    }
  };

  const quickSubjects = ['Physics', 'Maths', 'Chemistry', 'Biology', 'Python', 'Vedic Math'];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50/50 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60">
      {/* Background Subtle Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-brand-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Smart India Hackathon 2026 Initiative</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-display leading-[1.15]">
              Instant Access to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                Verified Tutors
              </span>{' '}
              for Every Student in India.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect 1-on-1 with India’s top educators from IITs, AIIMS, and Central Universities. Book scheduled weekly mastery or get instant <strong>15-minute doubt solving</strong> in under 60 seconds.
            </p>

            {/* Interactive Hero Search Form */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200/80 max-w-2xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Subject, exam (e.g. JEE, NEET), or topic..."
                    className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="sm:w-auto w-full py-3"
                >
                  Search Tutors
                </Button>
              </form>

              {/* Quick tags */}
              <div className="pt-2.5 px-2 flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Popular:</span>
                {quickSubjects.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => router.push(`/tutors?subject=${encodeURIComponent(s)}`)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-[11px] font-medium transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs: Find a Tutor / Become a Tutor / 15-Min SOS */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/tutors">
                <Button variant="primary" size="lg" className="shadow-lg shadow-brand-600/25">
                  Find a Tutor
                </Button>
              </Link>

              <Button
                variant="saffron"
                size="lg"
                onClick={() => setIsInstantModalOpen(true)}
                leftIcon={<Zap className="w-5 h-5 fill-slate-950 text-slate-950" />}
              >
                15-Min Instant SOS
              </Button>

              <Link href="/auth/login">
                <Button variant="secondary" size="lg">
                  Teach on EduBridge
                </Button>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Degrees</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>&lt; 60s Instant Connect</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>₹0 Platform Fee for Students</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Floating Live Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Featured Card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/90 relative z-10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-emerald-700">Live Doubt Solver Active</span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    98% AI Match
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 ring-2 ring-brand-100">
                    <Image
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                      alt="Dr. Priya Sharma"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Dr. Priya Sharma</h4>
                    <p className="text-xs text-slate-500">Ph.D. Applied Physics, IIT Delhi</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                      <span className="text-amber-500 font-bold">★ 4.95 (142 reviews)</span>
                      <span>•</span>
                      <span>9+ yrs exp</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="font-bold text-slate-700">Recent Student Doubt Resolved:</div>
                  <p className="text-slate-600 italic text-[11px]">
                    &quot;Explain Lenz&apos;s Law with 3D induction coil in 10 minutes&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-lg font-black text-slate-900">₹600</span>
                    <span className="text-xs text-slate-500">/hr (or ₹180 / 15m)</span>
                  </div>
                  <Link href="/tutors/tut-001">
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Floating Pill 1: Verified */}
              <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-200/80 z-20 hidden sm:flex items-center gap-3 animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-xl bg-academic-100 text-academic-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Aadhaar & Degree Verified</div>
                  <div className="text-[10px] text-slate-500">Top 5% shortlisted faculty</div>
                </div>
              </div>

              {/* Floating Pill 2: Instant Booking */}
              <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-200/80 z-20 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">15-Min SOS Tutor</div>
                  <div className="text-[10px] text-slate-500">Connected in 42 seconds</div>
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
    </section>
  );
};
