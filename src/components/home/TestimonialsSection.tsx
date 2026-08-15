import React from 'react';
import Image from 'next/image';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Rating } from '../ui/Rating';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rohan Mehra',
      location: 'Delhi (Class 12 CBSE)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      subject: 'Physics & JEE Mechanics',
      text: 'I used to struggle so badly with Rotational Dynamics. With Dr. Priya Sharma on EduBridge, within 3 sessions of 1-on-1 problem solving, I scored 92% in my physics pre-boards. The 15-min instant session before exams is unmatched!',
    },
    {
      name: 'Mrs. Sunita Dixit (Parent)',
      location: 'Lucknow, UP',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      subject: 'Parent of Class 10 Student',
      text: 'Finding verified teachers in Lucknow who can teach in both Hindi and English at an affordable ₹350/hr rate seemed impossible. EduBridge gave us access to top quality educators right from our living room.',
    },
    {
      name: 'Tanvi Agarwal',
      location: 'Jaipur, Rajasthan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      subject: 'NEET 2026 Aspirant',
      text: 'The AI match engine paired me with Ananya ma’am for Organic Chemistry reaction mechanisms. The notes are provided immediately after class and the zero-platform fee model makes it so student-friendly.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Student & Parent Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Loved by 50,000+ Learners Across India
          </h2>
          <p className="text-sm text-slate-600">
            Hear from students in metro cities and tier-2/tier-3 towns who transformed their scores with EduBridge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Rating value={t.rating} size="sm" />
                  <Quote className="w-6 h-6 text-brand-200" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &quot;{t.text}&quot;
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden relative ring-2 ring-brand-100 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    {t.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {t.location} • <span className="text-brand-600 font-semibold">{t.subject}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
