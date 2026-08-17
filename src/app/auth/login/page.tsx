'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User as UserIcon,
  Phone,
  ArrowRight, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor'>('student');
  
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (activeTab === 'register' && !name)) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const url = activeTab === 'login' 
      ? `${API_BASE_URL}/api/auth/login` 
      : `${API_BASE_URL}/api/auth/register`;
    const payload = activeTab === 'login' 
      ? { email, password, role: selectedRole }
      : { name, email, password, role: selectedRole, phone };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${activeTab === 'login' ? 'Login' : 'Registration'} failed.`);
      }

      // Successful Auth
      login(data.token, data.user);
      setMessage({ 
        type: 'success', 
        text: activeTab === 'login' ? 'Login successful! Redirecting...' : 'Registration successful! Logging in...' 
      });

      setTimeout(() => {
        if (data.user.role === 'tutor') {
          router.push('/tutor-dashboard');
        } else if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 800);

    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An authentication error occurred. Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
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
            Secure Authentication Portal
          </h2>
          <p className="text-xs text-slate-500">
            Sign in or create an account with email and password.
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-slate-200/90 space-y-5">
          
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setMessage(null);
              }}
              className={`py-2 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'login'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setMessage(null);
              }}
              className={`py-2 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'register'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Register
            </button>
          </div>

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
              Student / Parent Portal
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
              Educator / Tutor Portal
            </button>
          </div>

          {message && (
            <div className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
              message.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

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
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Mobile number (optional)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant={selectedRole === 'student' ? 'primary' : 'success'}
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {activeTab === 'login' ? 'Sign In' : 'Create Account'}
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
