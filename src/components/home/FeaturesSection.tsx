import React from 'react';
import { ShieldCheck, Zap, HeartHandshake, Laptop, Users2, Sparkles, Award, Clock } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
      title: '100% Verified Educators',
      description: 'Every educator undergoes strict Aadhaar identity verification, degree checks (IIT/NIT/DU/AIIMS), and background scrutiny.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
      title: '15-Min Instant SOS Doubt Solving',
      description: 'Stuck late at night before an exam? Tap one button to connect live with an online expert for rapid 15-minute doubt clearance.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-600" />,
      bg: 'bg-brand-50 border-brand-100',
      title: 'AI Smart Tutor Recommendation',
      description: 'Our matching algorithm analyzes your syllabus (CBSE/ICSE/State), native language (Hindi, Tamil, Marathi, etc.), and budget.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-100',
      title: 'No Platform Surcharge for Students',
      description: 'Students pay the exact hourly or 15-minute fee set by the tutor without hidden surge pricing or mandatory lock-in subscriptions.',
    },
    {
      icon: <Laptop className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-100',
      title: 'Built-in Interactive Classroom',
      description: 'High-definition video, digital pen-tablet whiteboard support, live doubt chat, and downloadable post-session PDF notes.',
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
      title: 'Tier-2 & Tier-3 Regional Reach',
      description: 'Quality education is no longer restricted to metro cities. Affordable top-tier tutoring accessible from every district in India.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5" />
            Key Benefits of EduBridge
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Why Students & Parents Across India Trust EduBridge
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Designed to solve the acute problem of affordable, verified, and on-demand tutoring for Indian school and competitive exam curricula.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-card hover:shadow-cardHover hover:border-brand-200 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
