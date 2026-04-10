'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Share2, Paperclip, ArrowUp, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [input, setInput] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const handleStartChat = (prompt?: string) => {
    const finalInput = prompt || input;
    if (!finalInput.trim() || isStarting) return;

    setIsStarting(true);
    const mockThreadId = Math.random().toString(36).substring(7);
    router.push(`/chat/${mockThreadId}?q=${encodeURIComponent(finalInput)}`);
  };

  const suggestions = [
    "Research a market trend",
    "Refine my draft",
    "Explain a concept"
  ];

  return (
    <div className="flex-1 flex flex-col relative h-full">
      {/* TopAppBar */}
      <header className="w-full h-16 flex items-center justify-between px-6 z-10 bg-transparent">
        <div className="flex items-center gap-2 bg-slate-300/50 rounded-full">
          <span className="font-headline font-semibold text-lg text-slate-900 uppercase tracking-tighter opacity-70"></span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:opacity-70 transition-opacity cursor-pointer p-2 rounded-full hover:bg-slate-200/20">
            <Settings size={20} />
          </button>
          <button className="text-slate-400 hover:opacity-70 transition-opacity cursor-pointer p-2 rounded-full hover:bg-slate-200/20">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      {/* Centered Starter Interface */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 space-y-2"
        >
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-background opacity-90">
            How can I help?
          </h2>
          <p className="font-body text-on-surface-variant text-lg">
            IntellixChat is ready for your next project.
          </p>
        </motion.div>

        {/* Sleek Glassmorphic Input */}
        <div className="w-full max-w-2xl group">
          <form
            onSubmit={(e) => { e.preventDefault(); handleStartChat(); }}
            className={cn(
              "relative bg-surface-container-lowest/40 backdrop-blur-2xl rounded-full p-1 shadow-[0_8px_32px_rgba(43,52,55,0.06)] border border-white/20 transition-all duration-500",
              isStarting ? "opacity-50 pointer-events-none scale-[0.98]" : "focus-within:shadow-[0_12px_48px_rgba(0,122,255,0.08)] focus-within:scale-[1.01]"
            )}
          >
            <div className="flex items-center px-6 h-14 md:h-16 gap-4">
              {/* <button type="button" className="text-on-surface-variant opacity-50 hover:opacity-100 transition-opacity">
                <Paperclip size={20} />
              </button> */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStarting}
                className="flex-1 bg-transparent border-none focus:ring-0 text-on-background font-body text-lg placeholder:text-on-surface-variant/40 outline-none"
                placeholder={isStarting ? "Initializing chat..." : "Ask me anything..."}
                type="text"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStarting}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-tertiary to-tertiary-container text-white shadow-lg shadow-tertiary/20 hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                {isStarting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowUp size={20} className="md:size-[24px]" />
                )}
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                disabled={isStarting}
                onClick={() => handleStartChat(suggestion)}
                className="px-4 py-2 rounded-full bg-surface-container-high/50 text-on-surface text-sm hover:bg-surface-container-highest transition-colors duration-300 border border-white/10 active:scale-95 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Ethereal Blobs */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 -right-24 w-64 h-64 bg-slate-200/40 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
