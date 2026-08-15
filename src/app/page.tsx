import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { SubjectCategoriesSection } from '@/components/home/SubjectCategoriesSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { ImpactStatsSection } from '@/components/home/ImpactStatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { Button } from '@/components/ui/Button';
import { GraduationCap, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Subject & Curriculum Categories */}
      <SubjectCategoriesSection />

      {/* 3. Key Benefits / Features */}
      <FeaturesSection />

      {/* 4. How It Works */}
      <HowItWorksSection />

      {/* 5. Statistics & Impact */}
      <ImpactStatsSection />

      {/* 6. Student & Parent Testimonials */}
      <TestimonialsSection />

      {/* 7. Bottom CTA Strip */}
      <section className="py-16 bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-amber-300 text-xs font-bold border border-white/20">
            <Zap className="w-4 h-4 fill-amber-300" />
            Join 50,000+ Students Learning Smarter
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
            Ready to Clear Every Doubt in Minutes?
          </h2>
          <p className="text-base sm:text-lg text-brand-100 max-w-2xl mx-auto">
            Find the right verified educator for your curriculum, or start an instant 15-minute doubt solving session right away.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/tutors">
              <Button variant="saffron" size="lg" className="text-slate-950 font-bold shadow-xl">
                Find a Verified Tutor
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                Join as an Educator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
