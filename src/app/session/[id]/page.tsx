'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { VideoGrid } from '@/components/session/VideoGrid';
import { VideoControls } from '@/components/session/VideoControls';
import { SessionChat } from '@/components/session/SessionChat';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/Button';
import { 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  PhoneOff, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function VideoSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, role } = useAuth();
  const sessionId = params.id as string;

  // Video State
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  // Live session timer in seconds
  const [sessionSeconds, setSessionSeconds] = useState(240); // starts at 4 mins in for demo feel

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndClassroom = () => {
    setIsEndModalOpen(false);
    if (role === 'tutor') {
      router.push('/tutor-dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const tutorInfo = {
    name: 'Dr. Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    subject: 'Physics: Faraday’s Law & Lenz Law Masterclass',
  };

  const studentInfo = {
    name: user?.name || 'Aarav Sharma',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link href={role === 'tutor' ? '/tutor-dashboard' : '/dashboard'} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-sm font-display tracking-tight hidden sm:inline">
              Edu<span className="text-brand-400">Bridge</span> Live Classroom
            </span>
          </Link>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold">{tutorInfo.name}</span>
          </div>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(sessionSeconds)}</span>
          </div>

          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all"
          >
            Leave Class
          </button>
        </div>
      </header>

      {/* Main Classroom Area: Video Feed + Chat Side Drawer */}
      <main className="flex-1 p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto w-full h-[calc(100vh-140px)]">
        {/* Video Area Container */}
        <div className={`${isChatOpen ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} flex flex-col justify-between h-full gap-3 transition-all duration-300`}>
          {/* Main Grid View */}
          <div className="flex-1 h-full min-h-0">
            <VideoGrid
              tutorName={tutorInfo.name}
              tutorAvatar={tutorInfo.avatar}
              studentName={studentInfo.name}
              studentAvatar={studentInfo.avatar}
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              isWhiteboardActive={isWhiteboardActive}
              subjectTitle={tutorInfo.subject}
            />
          </div>

          {/* Bottom Floating Control Bar */}
          <VideoControls
            isMicOn={isMicOn}
            onToggleMic={() => setIsMicOn(!isMicOn)}
            isCameraOn={isCameraOn}
            onToggleCamera={() => setIsCameraOn(!isCameraOn)}
            isScreenSharing={isScreenSharing}
            onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
            isWhiteboardActive={isWhiteboardActive}
            onToggleWhiteboard={() => setIsWhiteboardActive(!isWhiteboardActive)}
            isChatOpen={isChatOpen}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            isHandRaised={isHandRaised}
            onToggleHand={() => setIsHandRaised(!isHandRaised)}
            onEndSession={() => setIsEndModalOpen(true)}
          />
        </div>

        {/* Live Chat Side Drawer */}
        {isChatOpen && (
          <div className="lg:col-span-4 xl:col-span-3 h-full hidden lg:block animate-in fade-in slide-in-from-right-4 duration-200">
            <SessionChat
              tutorName={tutorInfo.name}
              studentName={studentInfo.name}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        )}
      </main>

      {/* End Session Confirmation Modal */}
      <Modal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        maxWidth="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <PhoneOff className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              End Live Tutoring Session?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your session duration ({formatTimer(sessionSeconds)}) and notes will be saved to your dashboard.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsEndModalOpen(false)}
            >
              Stay in Class
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleEndClassroom}
            >
              End & Exit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
