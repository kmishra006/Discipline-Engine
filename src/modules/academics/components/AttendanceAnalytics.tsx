import React, { useState } from 'react';
import { useStore } from '../../../store/StoreContext';
import {
  calculateSubjectStats,
  calculateMissNextClassEffect,
  calculateClassesNeededToTarget,
  calculateClassesCanMiss,
  calculateWhatIf,
  calculateAttendancePercentage,
} from '../calculations/attendanceEngine';
import {
  BarChart3,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calculator,
  History,
  TrendingUp,
  Filter,
  Check,
  X,
  Slash,
} from 'lucide-react';
import { AttendanceStatus, Subject } from '../types';
import { format, parseISO } from 'date-fns';

interface Props {
  selectedSubjectId?: string;
}

export function AttendanceAnalytics({ selectedSubjectId }: Props) {
  const { subjects, classSessions, recordAttendance } = useStore();

  const [activeSubId, setActiveSubId] = useState<string>(
    selectedSubjectId || subjects[0]?.id || ''
  );

  // History Filters
  const [historySubjectFilter, setHistorySubjectFilter] = useState<string>('ALL');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('ALL');

  // What-If Custom Inputs
  const [whatIfAttend, setWhatIfAttend] = useState<number>(5);
  const [whatIfMiss, setWhatIfMiss] = useState<number>(0);

  const selectedSubject = subjects.find((s) => s.id === activeSubId);
  const subjectStats = selectedSubject
    ? calculateSubjectStats(selectedSubject, classSessions)
    : null;

  // Calculators outputs
  const missNextEffect =
    selectedSubject && subjectStats
      ? calculateMissNextClassEffect(
          subjectStats.attended,
          subjectStats.conducted,
          subjectStats.target
        )
      : null;

  const classesNeeded =
    selectedSubject && subjectStats
      ? calculateClassesNeededToTarget(
          subjectStats.attended,
          subjectStats.conducted,
          subjectStats.target
        )
      : 0;

  const classesCanMiss =
    selectedSubject && subjectStats
      ? calculateClassesCanMiss(
          subjectStats.attended,
          subjectStats.conducted,
          subjectStats.target
        )
      : 0;

  const whatIfRes =
    selectedSubject && subjectStats
      ? calculateWhatIf(
          subjectStats.attended,
          subjectStats.conducted,
          whatIfAttend + whatIfMiss,
          whatIfAttend
        )
      : null;

  const simulated =
    whatIfRes && subjectStats
      ? {
          projectedPercentage: whatIfRes.projectedPct,
          meetsTarget: whatIfRes.projectedPct >= subjectStats.target,
        }
      : null;

  const remainingInSemester = selectedSubject
    ? classSessions.filter(
        (s) => s.subjectId === selectedSubject.id && s.status === 'not_recorded'
      ).length
    : 0;

  const projection =
    selectedSubject && subjectStats
      ? {
          totalRemainingInSemester: remainingInSemester,
          if100PercentRate: calculateAttendancePercentage(
            subjectStats.attended + remainingInSemester,
            subjectStats.conducted + remainingInSemester
          ),
          if90PercentRate: calculateAttendancePercentage(
            subjectStats.attended + Math.round(remainingInSemester * 0.9),
            subjectStats.conducted + remainingInSemester
          ),
          if80PercentRate: calculateAttendancePercentage(
            subjectStats.attended + Math.round(remainingInSemester * 0.8),
            subjectStats.conducted + remainingInSemester
          ),
          if70PercentRate: calculateAttendancePercentage(
            subjectStats.attended + Math.round(remainingInSemester * 0.7),
            subjectStats.conducted + remainingInSemester
          ),
        }
      : null;

  // Filtered History
  const filteredSessions = classSessions
    .filter((s) => {
      if (historySubjectFilter !== 'ALL' && s.subjectId !== historySubjectFilter) return false;
      if (historyStatusFilter !== 'ALL' && s.status !== historyStatusFilter) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-1">
            <BarChart3 className="w-4 h-4 text-amber-300" />
            ATTENDANCE INTELLIGENCE • MATHEMATICAL ENGINES
          </div>
          <h2 className="text-2xl font-serif italic text-white font-normal">
            Attendance Analytics & Simulators
          </h2>
        </div>

        {/* Subject Selector */}
        {subjects.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
              SELECT SUBJECT:
            </span>
            <select
              value={activeSubId}
              onChange={(e) => setActiveSubId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-serif italic text-white focus:outline-none focus:border-white/30"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id} className="bg-neutral-900 text-white font-sans">
                  {s.name} ({s.code || 'Subject'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedSubject && subjectStats && missNextEffect && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. "CAN I MISS THE NEXT CLASS?" WIDGET */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 lg:col-span-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                CAN I MISS THE NEXT CLASS?
              </span>
              <span className="text-[10px] font-mono text-white/40">
                Target: {selectedSubject.targetAttendance}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] font-mono text-white/40 block">IF YOU ATTEND</span>
                  <span className="text-xl font-serif italic text-emerald-300">
                    {missNextEffect.attendNextPct.toFixed(1)}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-white/40 block">IF YOU MISS</span>
                  <span
                    className={`text-xl font-serif italic ${
                      missNextEffect.canAbsenceMaintainTarget ? 'text-white/80' : 'text-rose-300'
                    }`}
                  >
                    {missNextEffect.missNextPct.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${
                  missNextEffect.status === 'safe'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : missNextEffect.status === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  {missNextEffect.canAbsenceMaintainTarget ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>
                    {missNextEffect.canAbsenceMaintainTarget
                      ? 'You can miss the next class'
                      : 'Cannot miss next class'}
                  </span>
                </div>
                <p className="text-[10px] font-sans opacity-90 leading-relaxed">
                  {missNextEffect.statement}
                </p>
              </div>
            </div>
          </div>

          {/* 2. "CLASSES NEEDED & CLASSES CAN MISS" WIDGETS */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 lg:col-span-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 flex items-center gap-1.5 border-b border-white/10 pb-3">
              <Calculator className="w-3.5 h-3.5" />
              SOLVER ENGINE • MARGIN ANALYSIS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Classes Needed Card */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block">
                  CLASSES NEEDED
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif italic text-white font-normal">
                    {classesNeeded}
                  </span>
                  <span className="text-xs text-white/50">consecutive classes</span>
                </div>
                <p className="text-[11px] text-white/40 font-serif italic">
                  Number of future classes you must attend continuously to reach or maintain{' '}
                  {selectedSubject.targetAttendance}%.
                </p>
              </div>

              {/* Classes Can Miss Card */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block">
                  SAFE MARGIN MISSES
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif italic text-emerald-300 font-normal">
                    {classesCanMiss}
                  </span>
                  <span className="text-xs text-white/50">classes can miss</span>
                </div>
                <p className="text-[11px] text-white/40 font-serif italic">
                  Maximum number of upcoming classes you can miss while remaining above{' '}
                  {selectedSubject.targetAttendance}%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. WHAT-IF SIMULATOR & SEMESTER PROJECTION */}
      {selectedSubject && simulated && projection && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What-If Simulator */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 flex items-center gap-1.5 border-b border-white/10 pb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              WHAT-IF ATTENDANCE SIMULATOR
            </span>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-mono text-white/40 self-center">PRESETS:</span>
              <button
                onClick={() => {
                  setWhatIfAttend(5);
                  setWhatIfMiss(0);
                }}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono text-white/80"
              >
                Attend Next 5
              </button>
              <button
                onClick={() => {
                  setWhatIfAttend(0);
                  setWhatIfMiss(2);
                }}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono text-white/80"
              >
                Miss Next 2
              </button>
              <button
                onClick={() => {
                  setWhatIfAttend(8);
                  setWhatIfMiss(2);
                }}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono text-white/80"
              >
                80% Future Rate
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-mono uppercase text-white/50 block mb-1">
                  Future Classes Attended
                </label>
                <input
                  type="number"
                  min="0"
                  value={whatIfAttend}
                  onChange={(e) => setWhatIfAttend(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-white/50 block mb-1">
                  Future Classes Missed
                </label>
                <input
                  type="number"
                  min="0"
                  value={whatIfMiss}
                  onChange={(e) => setWhatIfMiss(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-white/40 block">PROJECTED PERCENTAGE</span>
                <span className="text-2xl font-serif italic text-amber-200">
                  {simulated.projectedPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/40 block">VS TARGET</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    simulated.meetsTarget ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {simulated.meetsTarget ? '✓ MEETS TARGET' : '✕ BELOW TARGET'}
                </span>
              </div>
            </div>
          </div>

          {/* Semester Projection */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 flex items-center gap-1.5 border-b border-white/10 pb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              SEMESTER END PROJECTION
            </span>

            <p className="text-xs text-white/50 font-serif italic">
              Estimated {projection.totalRemainingInSemester} remaining classes scheduled for the rest of the semester.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <span className="text-[9px] font-mono text-white/40 block mb-1">100% ATTENDANCE</span>
                <span className="text-lg font-serif italic text-emerald-300">
                  {projection.if100PercentRate.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <span className="text-[9px] font-mono text-white/40 block mb-1">90% ATTENDANCE</span>
                <span className="text-lg font-serif italic text-white">
                  {projection.if90PercentRate.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <span className="text-[9px] font-mono text-white/40 block mb-1">80% ATTENDANCE</span>
                <span className="text-lg font-serif italic text-amber-200">
                  {projection.if80PercentRate.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <span className="text-[9px] font-mono text-white/40 block mb-1">70% ATTENDANCE</span>
                <span className="text-lg font-serif italic text-rose-300">
                  {projection.if70PercentRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ATTENDANCE HISTORY LOGS */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-300" />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/70">
              ATTENDANCE HISTORY LOGS ({filteredSessions.length} RECORDS)
            </h3>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-white/40" />
              <select
                value={historySubjectFilter}
                onChange={(e) => setHistorySubjectFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value="ALL" className="bg-neutral-900">
                  All Subjects
                </option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id} className="bg-neutral-900">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              <option value="ALL" className="bg-neutral-900">
                All Statuses
              </option>
              <option value="present" className="bg-neutral-900">
                Present
              </option>
              <option value="absent" className="bg-neutral-900">
                Absent
              </option>
              <option value="cancelled" className="bg-neutral-900">
                Cancelled
              </option>
              <option value="not_recorded" className="bg-neutral-900">
                Not Recorded
              </option>
            </select>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-white/40 font-serif italic">
            No attendance history records match your selected filters.
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-96 overflow-y-auto pr-1">
            {filteredSessions.map((sess) => {
              const sub = subjects.find((s) => s.id === sess.subjectId);
              return (
                <div
                  key={sess.id}
                  className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition rounded-xl"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif italic text-white font-medium">
                        {sub?.name || 'Class'}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">
                        ({sess.date}) • {sess.startTime} – {sess.endTime}
                      </span>
                    </div>
                    {sess.notes && (
                      <p className="text-[10px] text-white/50 italic mt-0.5">{sess.notes}</p>
                    )}
                  </div>

                  {/* Status Change Toggles */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => recordAttendance(sess.id, 'present')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition border ${
                        sess.status === 'present'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                          : 'bg-white/5 text-white/50 border-white/10 hover:text-emerald-300'
                      }`}
                    >
                      ✓ PRESENT
                    </button>
                    <button
                      onClick={() => recordAttendance(sess.id, 'absent')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition border ${
                        sess.status === 'absent'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                          : 'bg-white/5 text-white/50 border-white/10 hover:text-rose-300'
                      }`}
                    >
                      ✕ ABSENT
                    </button>
                    <button
                      onClick={() => recordAttendance(sess.id, 'cancelled')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition border ${
                        sess.status === 'cancelled'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                          : 'bg-white/5 text-white/30 border-white/10'
                      }`}
                      title="Cancelled"
                    >
                      ⊘
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
