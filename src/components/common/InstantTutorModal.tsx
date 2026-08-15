'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from './Modal';
import { Button } from '../ui/Button';
import { SUBJECT_OPTIONS, MOCK_TUTORS } from '@/data/mockData';
import { Zap, Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowRight, Video } from 'lucide-react';
import Image from 'next/image';

interface InstantTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstantTutorModal: React.FC<InstantTutorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [subject, setSubject] = useState('Physics');
  const [doubtText, setDoubtText] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchedTutor, setMatchedTutor] = useState<typeof MOCK_TUTORS[0] | null>(null);

  const handleStartMatching = () => {
    if (!doubtText.trim()) return;
    setIsMatching(true);

    // Simulate AI Instant Match algorithm
    setTimeout(() => {
      // Find an available online tutor
      const available = MOCK_TUTORS.find(
        (t) => t.isAvailableNow && t.subjects.some((s) => s.toLowerCase().includes(subject.toLowerCase()))
      ) || MOCK_TUTORS[0];

      setMatchedTutor(available);
      setIsMatching(false);
    }, 1800);
  };

  const handleJoinInstantSession = () => {
    onClose();
    router.push(`/session/session-instant-${Date.now().toString().slice(-4)}`);
  };

  const handleReset = () => {
    setMatchedTutor(null);
    setIsMatching(false);
    setDoubtText('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      maxWidth="md"
    >
      {!matchedTutor && !isMatching && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                15-Min Instant Tutor SOS
              </h3>
              <p className="text-xs text-slate-500">
                Connect live with an online verified expert in under 60 seconds
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Subject for Urgent Help
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                {SUBJECT_OPTIONS.filter((s) => s !== 'All Subjects').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Describe your Doubt or Problem
              </label>
              <textarea
                rows={3}
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder="e.g. Stuck on Lenz Law numerical in Class 12 Physics, or need help with definite integral King's rule..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none"
              />
            </div>

            <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>15 Minutes Focused Doubt Solving</span>
              </div>
              <span className="font-extrabold text-amber-800 text-sm">₹150 only</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                handleReset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="saffron"
              size="md"
              disabled={!doubtText.trim()}
              onClick={handleStartMatching}
              rightIcon={<Zap className="w-4 h-4 fill-slate-950" />}
            >
              Find Available Tutor Now
            </Button>
          </div>
        </div>
      )}

      {/* Loading matching screen */}
      {isMatching && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin flex items-center justify-center" />
            <Sparkles className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              Scanning 4,800+ Verified Indian Tutors...
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Matching your doubt in {subject} with an active top-ranked educator online now.
            </p>
          </div>
        </div>
      )}

      {/* Matched Tutor Result */}
      {matchedTutor && !isMatching && (
        <div className="space-y-5 animate-in fade-in zoom-in-95">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Tutor Matched in 1.4 seconds!
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Ready for Instant Live Session
            </h3>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 ring-2 ring-emerald-500">
              <Image
                src={matchedTutor.avatar}
                alt={matchedTutor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-bold text-slate-900 text-base">{matchedTutor.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-academic-100 text-academic-800">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{matchedTutor.qualification}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                <span className="text-amber-500 font-bold">★ {matchedTutor.rating}</span>
                <span>•</span>
                <span>{matchedTutor.experienceYears}+ yrs exp</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">Online Now</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Satisfaction Guarantee
            </div>
            <p className="text-emerald-800 text-[11px]">
              If your doubt is not resolved within the 15-minute slot, full refund is credited instantly.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleReset}
            >
              Try Another Tutor
            </Button>
            <Button
              variant="saffron"
              size="md"
              onClick={handleJoinInstantSession}
              leftIcon={<Video className="w-4 h-4" />}
            >
              Enter Classroom Now (₹{matchedTutor.instantRate15Min})
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
