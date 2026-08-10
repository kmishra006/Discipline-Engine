import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { getRandomQuote } from '../data/quotes';
import { ArrowRight, Database, Sparkles } from 'lucide-react';

export function WelcomePage() {
  const { loginUser, loadDemoData } = useStore();
  const [name, setName] = useState('');
  const [quote] = useState(() => getRandomQuote());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    loginUser(name);
  };

  const handleDemo = () => {
    loadDemoData();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Background subtle atmospheric radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <header className="flex items-center justify-between z-10 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center font-serif italic text-white text-lg">
            D
          </div>
          <div>
            <h1 className="text-xl font-serif italic tracking-tight text-white">
              DISCIPLINE ENGINE
            </h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-mono">
              Sophisticated Command Center
            </p>
          </div>
        </div>

        <button
          onClick={handleDemo}
          className="flex items-center gap-2 px-5 py-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white hover:text-black rounded-full text-[11px] uppercase tracking-widest text-white/80 transition-all duration-300 cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Seed Demo</span>
        </button>
      </header>

      {/* Main Form Center */}
      <main className="my-auto py-12 max-w-xl mx-auto w-full z-10 text-center">
        {/* Headline */}
        <div className="space-y-4 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 block font-mono">
            Unforgiving Performance Standard
          </span>

          <h2 className="text-4xl sm:text-6xl font-serif italic font-light tracking-tight text-white leading-tight">
            Ethereal Standard.<br />
            Unwavering Discipline.
          </h2>

          <p className="text-base text-white/60 font-serif italic max-w-md mx-auto">
            Curating daily habits, fitness conditioning, and active knowledge mastery.
          </p>
        </div>

        {/* Featured Motivational Quote Card */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 mb-8 text-left relative overflow-hidden shadow-2xl">
          <p className="text-base sm:text-lg font-serif italic text-white/90 leading-relaxed">
            &quot;{quote.text}&quot;
          </p>
          <span className="inline-block mt-3 text-[9px] font-mono tracking-[0.3em] text-white/40 uppercase">
            — {quote.theme.toUpperCase()} PRINCIPLE
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-2">
              Identify Yourself
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Krishna"
              className="w-full bg-[#121212] border border-white/15 focus:border-white/40 text-white text-base rounded-2xl px-5 py-4 focus:outline-none transition placeholder-white/30 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-white hover:bg-neutral-200 disabled:opacity-40 text-black font-mono font-bold uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 text-xs shadow-2xl transition duration-300 cursor-pointer active:scale-98"
          >
            <span>ENTER COMMAND ENGINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </main>

      {/* Footer Disclaimer */}
      <footer className="text-center text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono z-10 border-t border-white/10 pt-6">
        <span>Local Encrypted Storage • Zero Lock-In • PWA Offline Ready</span>
      </footer>
    </div>
  );
}
