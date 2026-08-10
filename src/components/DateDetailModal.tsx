import React from 'react';
import { useStore } from '../store/StoreContext';
import { formatDayHeader, calculateDailyScore } from '../utils/dateUtils';
import { X, CheckSquare, Dumbbell, BookOpen, FileText, Droplets, Calendar as CalendarIcon } from 'lucide-react';

export function DateDetailModal() {
  const {
    selectedDateModal,
    setSelectedDateModal,
    tasks,
    workoutSessions,
    learningEntries,
    notes,
    waterLogs,
    user,
    toggleTask,
  } = useStore();

  if (!selectedDateModal) return null;

  const dateStr = selectedDateModal;

  const dayTasks = tasks.filter((t) => t.date === dateStr);
  const daySessions = workoutSessions.filter((s) => s.date === dateStr);
  const dayEntries = learningEntries.filter((e) => e.date === dateStr);
  const dayNotes = notes.filter((n) => n.updatedAt === dateStr || n.createdAt?.startsWith(dateStr));
  const dayWaterLogs = waterLogs.filter((w) => w.date === dateStr);
  const totalWaterMl = dayWaterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);

  const score = calculateDailyScore(
    dateStr,
    tasks,
    workoutSessions,
    learningEntries,
    waterLogs,
    user?.dailyWaterGoalMl || 3000
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#0a0a0a] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white/90">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 block font-sans">
                Day Performance Summary
              </span>
              <h3 className="text-lg font-serif italic text-white font-normal">{formatDayHeader(dateStr)}</h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/50 mt-0.5">
                Daily Score: <span className="text-amber-300 font-bold">{score.totalScore}/100</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedDateModal(null)}
            className="p-2 text-white/40 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 rounded-full transition duration-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
                <CheckSquare className="w-3.5 h-3.5 text-white/70" />
                Tasks ({dayTasks.filter((t) => t.completed).length}/{dayTasks.length})
              </span>
            </div>
            {dayTasks.length === 0 ? (
              <p className="text-xs text-white/40 font-serif italic bg-white/[0.02] p-4 rounded-xl border border-white/10">
                No tasks scheduled for this date.
              </p>
            ) : (
              <div className="space-y-2">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleTask(t.id)}
                        className="w-4 h-4 accent-white rounded cursor-pointer shrink-0"
                      />
                      <span
                        className={`text-xs ${
                          t.completed ? 'line-through text-white/40' : 'text-white/90 font-medium'
                        } truncate`}
                      >
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-white/10 text-white/60 rounded-full border border-white/10 shrink-0">
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fitness Activity */}
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-3">
              <Dumbbell className="w-3.5 h-3.5 text-white/70" />
              Conditioning Activity
            </span>
            {daySessions.length === 0 ? (
              <p className="text-xs text-white/40 font-serif italic bg-white/[0.02] p-4 rounded-xl border border-white/10">
                No workouts logged for this date.
              </p>
            ) : (
              <div className="space-y-2">
                {daySessions.map((s) => (
                  <div key={s.id} className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-serif italic text-white/90">{s.planName}</h4>
                      <span className="text-[10px] uppercase font-mono text-emerald-400">
                        {s.completed ? '✓ Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-white/50 space-y-1">
                      {s.exercises.map((ex) => (
                        <div key={ex.id} className="flex justify-between border-t border-white/5 pt-1.5 text-[11px]">
                          <span>{ex.name}</span>
                          <span className="font-mono text-white/80">
                            {ex.weight}kg × {ex.reps} reps ({ex.sets} sets)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skill Journal */}
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              Journal Entries
            </span>
            {dayEntries.length === 0 ? (
              <p className="text-xs text-white/40 font-serif italic bg-white/[0.02] p-4 rounded-xl border border-white/10">
                No journal logs recorded.
              </p>
            ) : (
              <div className="space-y-2">
                {dayEntries.map((e) => (
                  <div key={e.id} className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                    <span className="text-xs font-mono font-medium text-amber-300">{e.skillName}</span>
                    <p className="text-xs text-white/80 mt-1 leading-relaxed font-sans">{e.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes & Water Intake */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-2">
                <FileText className="w-3.5 h-3.5 text-white/70" />
                Notes ({dayNotes.length})
              </span>
              {dayNotes.length === 0 ? (
                <p className="text-xs text-white/40 italic">No notes.</p>
              ) : (
                <ul className="text-xs text-white/80 space-y-1 truncate">
                  {dayNotes.map((n) => (
                    <li key={n.id} className="truncate">• {n.title || 'Untitled note'}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-2">
                <Droplets className="w-3.5 h-3.5 text-white/70" />
                Water Log
              </span>
              <p className="text-xl font-serif italic text-white">
                {(totalWaterMl / 1000).toFixed(1)}L
                <span className="text-xs font-sans not-italic text-white/40 ml-1.5">
                  / {((user?.dailyWaterGoalMl || 3000) / 1000).toFixed(1)}L
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#0a0a0a] border-t border-white/10 flex justify-end">
          <button
            onClick={() => setSelectedDateModal(null)}
            className="px-5 py-2 bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white text-[11px] font-mono uppercase tracking-widest rounded-full transition duration-300 cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
