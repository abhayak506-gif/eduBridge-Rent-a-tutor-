import React from 'react';
import Link from 'next/link';
import { 
  Atom, 
  Calculator, 
  FlaskConical, 
  Dna, 
  Code2, 
  BookOpen, 
  TrendingUp, 
  Brain, 
  Globe, 
  Cpu,
  ArrowRight
} from 'lucide-react';

export const SubjectCategoriesSection: React.FC = () => {
  const categories = [
    {
      name: 'Physics & Mechanics',
      exam: 'JEE Main & Adv, NEET, CBSE 11-12',
      icon: <Atom className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-200/80',
      tutorCount: '1,420+ Tutors',
      query: 'Physics',
    },
    {
      name: 'Mathematics & Calculus',
      exam: 'Olympiad, JEE, CBSE 10 & 12',
      icon: <Calculator className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-200/80',
      tutorCount: '1,890+ Tutors',
      query: 'Mathematics',
    },
    {
      name: 'Chemistry (Organic & Physical)',
      exam: 'NEET, JEE, Board Conversions',
      icon: <FlaskConical className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80',
      tutorCount: '1,120+ Tutors',
      query: 'Chemistry',
    },
    {
      name: 'NEET Biology & Botany',
      exam: '360/360 NCERT Line-by-Line',
      icon: <Dna className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200/80',
      tutorCount: '980+ Tutors',
      query: 'Biology',
    },
    {
      name: 'Computer Science & Python',
      exam: 'CBSE CS 12, AI, Web Coding',
      icon: <Code2 className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200/80',
      tutorCount: '750+ Tutors',
      query: 'Computer+Science',
    },
    {
      name: 'Accountancy & Economics',
      exam: 'Commerce CBSE 11-12, CA Inter',
      icon: <TrendingUp className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50 hover:bg-teal-100/80 border-teal-200/80',
      tutorCount: '620+ Tutors',
      query: 'Accountancy',
    },
    {
      name: 'Vedic & Speed Mental Math',
      exam: 'Fast Calculation for Kids & Exams',
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200/80',
      tutorCount: '410+ Tutors',
      query: 'Vedic',
    },
    {
      name: 'Robotics & STEM Tinkering',
      exam: 'Arduino, IoT, School Science Projects',
      icon: <Cpu className="w-6 h-6 text-cyan-600" />,
      bg: 'bg-cyan-50 hover:bg-cyan-100/80 border-cyan-200/80',
      tutorCount: '340+ Tutors',
      query: 'Robotics',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Curriculum & Subjects
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display mt-2">
              Browse Tutors by Subject & Exam
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Find verified educators matching your exact syllabus and grade level.
            </p>
          </div>

          <Link
            href="/tutors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors shrink-0"
          >
            <span>View All Subjects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/tutors?subject=${cat.query}`}
              className={`p-5 rounded-2xl border transition-all duration-200 ${cat.bg} flex flex-col justify-between group`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                  {cat.exam}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{cat.tutorCount}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
