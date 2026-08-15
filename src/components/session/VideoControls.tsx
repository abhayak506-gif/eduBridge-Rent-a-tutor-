'use client';

import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  ScreenShare, 
  PenTool, 
  MessageSquare, 
  Hand, 
  PhoneOff, 
  FileDown,
  Volume2
} from 'lucide-react';

interface VideoControlsProps {
  isMicOn: boolean;
  onToggleMic: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  isScreenSharing: boolean;
  onToggleScreenShare: () => void;
  isWhiteboardActive: boolean;
  onToggleWhiteboard: () => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  isHandRaised: boolean;
  onToggleHand: () => void;
  onEndSession: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isMicOn,
  onToggleMic,
  isCameraOn,
  onToggleCamera,
  isScreenSharing,
  onToggleScreenShare,
  isWhiteboardActive,
  onToggleWhiteboard,
  isChatOpen,
  onToggleChat,
  isHandRaised,
  onToggleHand,
  onEndSession,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-800 shadow-xl flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      {/* Mic toggle */}
      <button
        onClick={onToggleMic}
        className={`p-3 rounded-xl transition-all ${
          isMicOn
            ? 'bg-slate-800 hover:bg-slate-700 text-white'
            : 'bg-rose-600 hover:bg-rose-700 text-white'
        }`}
        title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
      >
        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      {/* Camera toggle */}
      <button
        onClick={onToggleCamera}
        className={`p-3 rounded-xl transition-all ${
          isCameraOn
            ? 'bg-slate-800 hover:bg-slate-700 text-white'
            : 'bg-rose-600 hover:bg-rose-700 text-white'
        }`}
        title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
      >
        {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </button>

      <div className="h-6 w-px bg-slate-800 hidden sm:block" />

      {/* Screen share */}
      <button
        onClick={onToggleScreenShare}
        className={`p-3 rounded-xl transition-all ${
          isScreenSharing
            ? 'bg-brand-600 text-white'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
        title="Share Screen"
      >
        <ScreenShare className="w-5 h-5" />
      </button>

      {/* Whiteboard Mode */}
      <button
        onClick={onToggleWhiteboard}
        className={`px-3 py-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
          isWhiteboardActive
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
        title="Interactive Whiteboard"
      >
        <PenTool className="w-5 h-5" />
        <span className="hidden md:inline">Whiteboard</span>
      </button>

      {/* Hand Raise */}
      <button
        onClick={onToggleHand}
        className={`p-3 rounded-xl transition-all ${
          isHandRaised
            ? 'bg-yellow-500 text-slate-950 animate-bounce'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
        title="Raise Hand for Doubt"
      >
        <Hand className="w-5 h-5" />
      </button>

      {/* Chat toggle */}
      <button
        onClick={onToggleChat}
        className={`relative p-3 rounded-xl transition-all ${
          isChatOpen
            ? 'bg-brand-600 text-white'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
        title="Toggle Doubt Chat"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
      </button>

      <div className="h-6 w-px bg-slate-800" />

      {/* End Session Button */}
      <button
        onClick={onEndSession}
        className="px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-rose-600/30"
      >
        <PhoneOff className="w-4 h-4" />
        <span>End Class</span>
      </button>
    </div>
  );
};
