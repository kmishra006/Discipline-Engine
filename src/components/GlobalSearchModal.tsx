import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/StoreContext';
import { Search, X, CheckSquare, Dumbbell, BookOpen, FileText, Calendar, ArrowRight } from 'lucide-react';

interface Props {
  onNavigateTab: (tab: string) => void;
}

export function GlobalSearchModal({ onNavigateTab }: Props) {
  const { globalSearchOpen, setGlobalSearchOpen, searchGlobal, setSelectedDateModal } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (globalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [globalSearchOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      } else if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const results = searchGlobal(query);

  const getIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="w-4 h-4 text-white/80" />;
      case 'workout_plan':
      case 'workout_session':
        return <Dumbbell className="w-4 h-4 text-white/80" />;
      case 'skill':
      case 'learning_entry':
        return <BookOpen className="w-4 h-4 text-amber-300" />;
      case 'note':
        return <FileText className="w-4 h-4 text-white/80" />;
      default:
        return <Search className="w-4 h-4 text-white/40" />;
    }
  };

  const handleSelect = (item: any) => {
    setGlobalSearchOpen(false);
    if (item.date) {
      setSelectedDateModal(item.date);
    }
    onNavigateTab(item.linkTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#0a0a0a]">
          <Search className="w-5 h-5 text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, workouts, skills, notes..."
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="text-[10px] font-mono text-white/50 hover:text-white bg-white/10 border border-white/10 px-2 py-1 rounded-full"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-xs uppercase tracking-widest text-white/40 font-mono">
              Type to query database (e.g., &quot;Java&quot;, &quot;Bench Press&quot;, &quot;Graph&quot;)
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm font-serif italic text-white/60">
              No entries found matching &quot;{query}&quot;
            </div>
          ) : (
            results.map((res) => (
              <button
                key={`${res.type}-${res.id}`}
                onClick={() => handleSelect(res)}
                className="w-full text-left p-3.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="p-2 rounded-full bg-white/5 border border-white/10 shrink-0">
                    {getIcon(res.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-white group-hover:text-white/90 transition truncate">
                      {res.title}
                    </h4>
                    <p className="text-xs text-white/50 truncate mt-0.5">{res.subtitle}</p>
                    {res.date && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-white/40 mt-1 font-mono">
                        <Calendar className="w-3 h-3 text-white/30" />
                        {res.date}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 opacity-0 group-hover:opacity-100 transition duration-300" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40 font-mono">
          <span>Global Search Query Engine</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
