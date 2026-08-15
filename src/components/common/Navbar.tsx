'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { InstantTutorModal } from './InstantTutorModal';
import { Button } from '../ui/Button';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  Zap, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ArrowRightLeft,
  LayoutDashboard,
  Video,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, switchRole, logout } = useAuth();
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        {/* Top Mini Banner for SIH & Trust */}
        <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 text-center font-medium hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Verified Indian Educators
            </span>
            <span className="text-slate-600">|</span>
            <span>Govt ID & Degree Verified • Instant 15-Min Doubt Sessions • Zero Platform Fees for Students</span>
          </div>

          {/* Quick Demo Switcher Indicator */}
          <div className="flex items-center gap-1.5 ml-auto text-xs">
            <span className="text-slate-400 text-[10px]">Demo Persona:</span>
            <button
              onClick={() => {
                const nextRole = role === 'student' ? 'tutor' : 'student';
                switchRole(nextRole);
                router.push(nextRole === 'tutor' ? '/tutor-dashboard' : '/dashboard');
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold transition-all border border-slate-700"
              title="Click to quickly toggle demo persona between Student and Tutor"
            >
              <ArrowRightLeft className="w-3 h-3" />
              {role === 'student' ? 'Student View (Aarav)' : 'Tutor View (Dr. Priya)'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30 group-hover:scale-105 transition-all">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                    Edu<span className="text-brand-600">Bridge</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                    Rent-A-Tutor
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:inline">
                  Instant Verified Tutors for India
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/tutors"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/tutors')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Find Tutors
              </Link>

              <Link
                href="/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/dashboard')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-500" />
                Student Hub
              </Link>

              <Link
                href="/tutor-dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/tutor-dashboard')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-academic-600" />
                Tutor Portal
              </Link>
            </nav>

            {/* Right Action buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* 15-Min Instant SOS Button */}
              <Button
                variant="saffron"
                size="sm"
                onClick={() => setIsInstantOpen(true)}
                leftIcon={<Zap className="w-4 h-4 fill-slate-950 text-slate-950" />}
                className="font-bold shadow-sm"
              >
                15-Min Instant Tutor
              </Button>

              {/* User / Profile Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-brand-300 bg-slate-50/80 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden relative ring-1 ring-slate-200">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {user.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium capitalize">
                        {user.role}
                      </div>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="p-3 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                          {user.role === 'student' ? 'Student Account' : 'Verified Tutor'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href={user.role === 'tutor' ? '/tutor-dashboard' : '/dashboard'}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>
                        <Link
                          href="/tutors"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50"
                        >
                          <Search className="w-4 h-4 text-slate-400" />
                          Browse All Tutors
                        </Link>
                        <button
                          onClick={() => {
                            const newRole = user.role === 'student' ? 'tutor' : 'student';
                            switchRole(newRole);
                            setUserDropdownOpen(false);
                            router.push(newRole === 'tutor' ? '/tutor-dashboard' : '/dashboard');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            Switch to {user.role === 'student' ? 'Tutor Mode' : 'Student Mode'}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            router.push('/auth/login');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 rounded-xl hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/tutors">
                    <Button variant="primary" size="sm">
                      Find Tutor
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsInstantOpen(true)}
                className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                title="15-Min Instant Tutor"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-xl">
            <nav className="space-y-1">
              <Link
                href="/tutors"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                <Search className="w-4 h-4 text-brand-600" />
                Find Tutors
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-600" />
                Student Dashboard
              </Link>
              <Link
                href="/tutor-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                <GraduationCap className="w-4 h-4 text-academic-600" />
                Tutor Portal
              </Link>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  const newRole = role === 'student' ? 'tutor' : 'student';
                  switchRole(newRole);
                  setMobileMenuOpen(false);
                  router.push(newRole === 'tutor' ? '/tutor-dashboard' : '/dashboard');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Switch to {role === 'student' ? 'Tutor View' : 'Student View'}
              </button>

              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  {user ? 'Manage Account' : 'Student & Tutor Login'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Instant 15-Min SOS Modal */}
      <InstantTutorModal
        isOpen={isInstantOpen}
        onClose={() => setIsInstantOpen(false)}
      />
    </>
  );
};
