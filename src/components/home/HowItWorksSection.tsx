import React from 'react';
import { Search, CalendarCheck, Video, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Search or Get AI Match',
      desc: 'Filter by CBSE/ICSE board, subject, regional language, and hourly fee, or let our AI recommend the top 3 best fits for your exact doubts.',
      icon: <Search className="w-6 h-6 text-brand-600" />,
      badge: 'Step 1: Discover',
    },
    {
      step: '02',
      title: 'Instant SOS or Scheduled Slot',
      desc: 'Need urgent help right now? Select 15-min Instant SOS. Or pick a weekly scheduled slot from the tutor’s live calendar with zero hassle.',
      icon: <Zap className="w-6 h-6 text-amber-500 fill-amber-400" />,
      badge: 'Step 2: Connect',
    },
    {
      step: '03',
      title: 'Learn in Live 1-on-1 Classroom',
      desc: 'Join the built-in interactive video classroom with digital whiteboard, screen-share, live notes, and 100% doubt resolution guarantee.',
      icon: <Video className="w-6 h-6 text-emerald-600" />,
      badge: 'Step 3: Excel',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            How Rent-A-Tutor Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From feeling stuck on a complex formula to mastering concepts in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                    {s.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-200 font-display">
                    {s.step}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-brand-700 tracking-wider uppercase">
                    {s.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {s.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-brand-600">
                <span>Fast, Safe & Verified</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/tutors">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Verified Tutors Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
