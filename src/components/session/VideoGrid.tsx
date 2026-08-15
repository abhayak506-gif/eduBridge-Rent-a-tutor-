'use client';

import React from 'react';
import Image from 'next/image';
import { Mic, MicOff, Video, VideoOff, Award, Sparkles, UserCheck } from 'lucide-react';

interface VideoGridProps {
  tutorName: string;
  tutorAvatar: string;
  studentName: string;
  studentAvatar: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  isWhiteboardActive: boolean;
  subjectTitle: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  tutorName,
  tutorAvatar,
  studentName,
  studentAvatar,
  isMicOn,
  isCameraOn,
  isWhiteboardActive,
  subjectTitle,
}) => {
  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[540px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-4 sm:p-6">
      {/* Top Session Status Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-400 font-bold">LIVE 1-ON-1</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium truncate max-w-xs">{subjectTitle}</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>REC 1080p HD</span>
        </div>
      </div>

      {/* Main Screen: Tutor or Interactive Whiteboard Feed */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isWhiteboardActive ? (
          /* Simulated Interactive Whiteboard Feed */
          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-900/50 text-brand-400 flex items-center justify-center border border-brand-700/60">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-lg font-bold text-white">
                Live Collaborative Digital Whiteboard
              </h4>
              <p className="text-xs text-slate-400">
                Dr. Priya Sharma is writing formula derivations in real-time. Both tutor and student can annotate.
              </p>
            </div>
            {/* Whiteboard canvas sketch mock */}
            <div className="w-full max-w-lg h-36 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 font-mono text-emerald-400 text-xs text-left relative overflow-hidden flex flex-col justify-center">
              <div className="text-amber-300 font-bold mb-1">// Electromagnetic Induction:</div>
              <div>$\mathcal&#123;\mathcal&#123;E&#125;&#125; = -\frac&#123;d\Phi_B&#125;&#123;dt&#125; = -N \frac&#123;d(B \cdot A \cdot \cos\theta)&#125;&#123;dt&#125;$</div>
              <div className="text-slate-400 mt-2 text-[11px] font-sans">
                ✍️ Tutor Note: Notice the negative sign indicates Lenz&apos;s Law (opposition to change in flux).
              </div>
            </div>
          </div>
        ) : (
          /* Tutor Live Video Feed */
          <div className="relative w-full h-full">
            <Image
              src={tutorAvatar}
              alt={tutorName}
              fill
              className="object-cover opacity-90"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Tutor Name Plate */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-white z-10">
              <span className="font-bold">{tutorName}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Educator
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Picture-in-Picture (Student Video Feed) */}
      <div className="absolute bottom-6 right-6 w-32 sm:w-44 h-24 sm:h-32 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl z-20 transition-all hover:scale-105">
        {isCameraOn ? (
          <div className="relative w-full h-full">
            <Image
              src={studentAvatar}
              alt={studentName}
              fill
              className="object-cover"
              sizes="176px"
            />
            <div className="absolute bottom-1.5 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-white font-medium">
              You ({studentName.split(' ')[0]})
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900 text-xs space-y-1">
            <VideoOff className="w-6 h-6 text-slate-600" />
            <span className="text-[10px]">Camera Off</span>
          </div>
        )}

        <div className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-white">
          {isMicOn ? (
            <Mic className="w-3 h-3 text-emerald-400" />
          ) : (
            <MicOff className="w-3 h-3 text-rose-400" />
          )}
        </div>
      </div>
    </div>
  );
};
