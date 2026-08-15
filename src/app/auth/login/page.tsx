'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { 
  GraduationCap, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsTutor, loginCustom } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor'>('student');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('aarav.sharma@example.in');
  const [otp, setOtp] = useState('1234');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'student') {
        if (authMethod === 'phone') {
          loginCustom(phone, 'Aarav Sharma', 'student');
        } else {
          loginCustom(email, 'Aarav Sharma', 'student');
        }
        router.push('/dashboard');
      } else {
        if (authMethod === 'phone') {
          loginCustom(phone, 'Dr. Priya Sharma', 'tutor');
        } else {
          loginCustom(email, 'Dr. Priya Sharma', 'tutor');
        }
        router.push('/tutor-dashboard');
      }
    }, 600);
  };

  const handleQuickStudentLogin = () => {
    loginAsStudent();
    router.push('/dashboard');
  };

  const handleQuickTutorLogin = () => {
    loginAsTutor();
    router.push('/tutor-dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30 group-hover:scale-105 transition-all">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 font-display">
              Edu<span className="text-brand-600">Bridge</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to EduBridge
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access verified 1-on-1 tutoring and instant doubt solving
          </p>
        </div>

        {/* 1-Click Hackathon Demo Login Presets */}
        <div className="bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 p-4 rounded-2xl border border-amber-200/80 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              SIH Judge Quick Demo Login:
            </span>
            <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded-full text-amber-900">
              1-Click Demo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickStudentLogin}
              className="p-2.5 bg-white hover:bg-brand-50 rounded-xl border border-brand-200 text-left transition-all group flex items-center gap-2.5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0 ring-1 ring-brand-300">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                  alt="Aarav"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 group-hover:text-brand-700 truncate">
                  Student Login
                </div>
                <div className="text-[10px] text-slate-500 truncate">Aarav (Class 11)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleQuickTutorLogin}
              className="p-2.5 bg-white hover:bg-emerald-50 rounded-xl border border-emerald-200 text-left transition-all group flex items-center gap-2.5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0 ring-1 ring-emerald-300">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                  alt="Dr. Priya"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                  Tutor Login
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Priya (Physics)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-slate-200/90 space-y-5">
          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`py-2.5 rounded-xl transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              I am a Student / Parent
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('tutor')}
              className={`py-2.5 rounded-xl transition-all ${
                selectedRole === 'tutor'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              I am an Educator / Tutor
            </button>
          </div>

          {/* Phone / Email Toggle */}
          <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
            <span className="font-semibold text-slate-600">Sign in with:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`font-bold transition-colors ${
                  authMethod === 'phone' ? 'text-brand-600 underline' : 'text-slate-400'
                }`}
              >
                Mobile Number
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`font-bold transition-colors ${
                  authMethod === 'email' ? 'text-brand-600 underline' : 'text-slate-400'
                }`}
              >
                Email Address
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMethod === 'phone' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Indian Mobile Number
                </label>
                <div className="flex items-center">
                  <span className="px-3.5 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-bold text-slate-600 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* OTP Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Enter 4-Digit OTP
                </label>
                <span className="text-[11px] text-brand-600 font-semibold cursor-pointer">
                  Resend OTP
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1 2 3 4"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                For demo testing, enter any 4 digits (e.g. 1234)
              </p>
            </div>

            <Button
              type="submit"
              variant={selectedRole === 'student' ? 'primary' : 'success'}
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to {selectedRole === 'student' ? 'Student Dashboard' : 'Tutor Portal'}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>By proceeding, you agree to EduBridge&apos;s </span>
            <span className="text-brand-600 font-semibold cursor-pointer">Terms & Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
