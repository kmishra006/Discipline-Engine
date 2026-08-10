import React from 'react';
import { useStore } from '../store/StoreContext';
import { LayoutDashboard, CheckSquare, Dumbbell, BookOpen, FileText, Settings, Search, Flame, GraduationCap } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: Props) {
  const { user, streak, setGlobalSearchOpen } = useStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'todo', label: 'To-Do', icon: CheckSquare },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0a0a] border-r border-white/10 h-screen sticky top-0 shrink-0 select-none z-30">
        {/* Logo & App Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center font-serif italic text-white text-base shadow-sm">
              D
            </div>
            <div>
              <h1 className="text-lg font-serif italic tracking-tight text-white">
                DISCIPLINE
              </h1>
              <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/40">
                COMMAND ENGINE
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Shortcut Trigger */}
        <div className="px-4 py-4">
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-full text-[11px] uppercase tracking-wider transition duration-300 group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
              <span>Search...</span>
            </span>
            <kbd className="text-[9px] font-mono bg-white/10 text-white/50 px-2 py-0.5 rounded-full border border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Main Nav Items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                    : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-white/40'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-white/50" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User & Streak Status */}
        <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
          <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white font-serif italic text-xs shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/90 truncate">{user?.name || 'User'}</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40 font-mono">Discipline Mode</p>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-300 text-xs font-mono font-medium shrink-0">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{streak.currentStreak}d</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2.5">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] uppercase tracking-wider font-medium mt-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
