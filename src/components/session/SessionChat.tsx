'use client';

import React, { useState } from 'react';
import { Send, Image as ImageIcon, Paperclip, X, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  sender: 'tutor' | 'student';
  senderName: string;
  text: string;
  time: string;
  isFormula?: boolean;
}

interface SessionChatProps {
  tutorName: string;
  studentName: string;
  onClose: () => void;
}

export const SessionChat: React.FC<SessionChatProps> = ({
  tutorName,
  studentName,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'tutor',
      senderName: tutorName,
      text: 'Namaste Aarav! Let’s break down Faraday’s law and Lenz’s direction rule today. Feel free to ask questions here anytime.',
      time: '10:02 AM',
    },
    {
      id: 'm-2',
      sender: 'student',
      senderName: studentName,
      text: 'Yes ma’am! I am confused why the induced current opposes the flux change when the magnet moves away.',
      time: '10:04 AM',
    },
    {
      id: 'm-3',
      sender: 'tutor',
      senderName: tutorName,
      text: 'Great question! That directly follows the Law of Conservation of Energy. If it attracted the magnet instead, you would get free kinetic energy without doing mechanical work.',
      time: '10:05 AM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'student',
      senderName: studentName,
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Simulated tutor auto-reply after 2 seconds
    setTimeout(() => {
      const tutorReply: Message = {
        id: `m-${Date.now() + 1}`,
        sender: 'tutor',
        senderName: tutorName,
        text: 'Got it! Look at the whiteboard now — let’s draw the magnetic field vectors step by step.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorReply]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>Live Doubt Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </h4>
          <p className="text-[11px] text-slate-400">Encrypted 1-on-1 Classroom Channel</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender === 'student';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-slate-400 mb-1 px-1">
                {msg.senderName} • {msg.time}
              </div>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/90">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type doubt question..."
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
