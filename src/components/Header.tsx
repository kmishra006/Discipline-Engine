import React from 'react';
import { useStore } from '../store/StoreContext';
import { Search, Flame, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  activeTab: string;
}

export function Header({ activeTab }: Props) {
  const { streak, setGlobalSearchOpen } = useStore();

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Command Dashboard';
      case 'academics':
        return 'Academic & Attendance Command';
      case 'todo':
        return 'Task & Objective Matrix';
      case 'fitness':
        return 'Physical Conditioning';
      case 'skills':
        return 'Skills & Journal';
      case 'notes':
        return 'Scratchpad Notes';
      case 'settings':
        return 'System Configuration';
      default:
        return 'Dashboard';
    }
  };

  const todayStr = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <header className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-20 px-6 md:px-10 py-4 flex items-center justify-between">
      {/* Title & Date */}
      <div>
        <h2 className="text-xl md:text-2xl font-serif italic text-white tracking-tight flex items-center gap-2">
          {getPageTitle(activeTab)}
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 flex items-center gap-1.5 mt-0.5">
          <CalendarIcon className="w-3 h-3 text-white/30" />
          {todayStr}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Search button */}
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="p-2.5 bg-white/[0.03] border border-white/10 hover:border-white/30 text-white/70 hover:text-white rounded-full transition duration-300 cursor-pointer"
          title="Search (⌘K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Streak Badge */}
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-medium text-white/90">
            {streak.currentStreak} <span className="text-white/40 uppercase text-[10px] tracking-widest hidden sm:inline">Days Streak</span>
          </span>
        </div>
      </div>
    </header>
  );
}
