import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Heart, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      {/* Top Value Strip */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-900/80 text-brand-400 flex items-center justify-center border border-brand-700/50">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">100% Verified</h4>
                <p className="text-[11px] text-slate-400">Govt ID & academic degree checks</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/50">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">15-Min SOS Match</h4>
                <p className="text-[11px] text-slate-400">Instant doubt solving in &lt;60s</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/50">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Tier 2/3 Reach</h4>
                <p className="text-[11px] text-slate-400">Affordable quality for every district</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/50">
                <Heart className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Zero Student Fees</h4>
                <p className="text-[11px] text-slate-400">Pay only tutor fee, no platform fee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight font-display">
                Edu<span className="text-brand-400">Bridge</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Instant Access to Verified Tutors for Every Student, Anywhere in India. Bridging the gap between premier educators and ambitious students across CBSE, ICSE, State Boards & Competitive Exams.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>New Delhi • Bengaluru • Kota • Hyderabad • Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                <span>support@edubridge.in</span>
              </div>
            </div>
          </div>

          {/* Col 1: Popular Subjects */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Top Subjects</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tutors?subject=Physics" className="hover:text-white transition-colors">Physics (JEE / NEET)</Link></li>
              <li><Link href="/tutors?subject=Mathematics" className="hover:text-white transition-colors">Mathematics & Calculus</Link></li>
              <li><Link href="/tutors?subject=Chemistry" className="hover:text-white transition-colors">Organic Chemistry</Link></li>
              <li><Link href="/tutors?subject=Biology" className="hover:text-white transition-colors">NEET Biology</Link></li>
              <li><Link href="/tutors?subject=Computer+Science" className="hover:text-white transition-colors">Python & Coding</Link></li>
              <li><Link href="/tutors?subject=Vedic+Mathematics" className="hover:text-white transition-colors">Vedic Speed Maths</Link></li>
            </ul>
          </div>

          {/* Col 2: For Students */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">For Students</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tutors" className="hover:text-white transition-colors">Find a Verified Tutor</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link href="/dashboard#matches" className="hover:text-white transition-colors">AI Match Engine</Link></li>
              <li><Link href="/tutors?available=true" className="hover:text-white transition-colors">15-Min Instant SOS</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Student Sign In</Link></li>
            </ul>
          </div>

          {/* Col 3: For Tutors & Trust */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Educator Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tutor-dashboard" className="hover:text-white transition-colors">Tutor Dashboard</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Educator Registration</Link></li>
              <li><Link href="/tutor-dashboard" className="hover:text-white transition-colors">Manage Requests</Link></li>
              <li><Link href="/tutor-dashboard" className="hover:text-white transition-colors">Earnings & Analytics</Link></li>
              <li><Link href="/tutors" className="hover:text-white transition-colors">Verified Badge Program</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} EduBridge (Rent-A-Tutor). Built for Smart India Hackathon.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Tutor Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
