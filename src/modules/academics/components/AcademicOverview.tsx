import React, { useState } from 'react';
import { useStore } from '../../../store/StoreContext';
import {
  calculateOverallAttendance,
  calculateSubjectStats,
} from '../calculations/attendanceEngine';
import {
  CheckCircle2,
  XCircle,
  Slash,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { AttendanceStatus, Subject } from '../types';
import { getTodayStr } from '../../../utils/dateUtils';
import { format, parseISO, isSameDay } from 'date-fns';

interface Props {
  onSelectSubject: (subject: Subject) => void;
  onNavigateSubTab: (subTab: 'overview' | 'timetable' | 'attendance' | 'subjects') => void;
}

export function AcademicOverview({ onSelectSubject, onNavigateSubTab }: Props) {
  const { subjects, classSessions, recordAttendance } = useStore();
  const todayStr = getTodayStr();

  // Calculate stats
  const overall = calculateOverallAttendance(classSessions);
  const subjectStatsList = subjects.map((sub) => calculateSubjectStats(sub, classSessions));

  // Today's classes
  const todaySessions = classSessions.filter((s) => s.date === todayStr);

  // This week's classes count
  const todayDate = new Date();
  const weekSessions = classSessions.filter((s) => {
    try {
      const d = parseISO(s.date);
      const diffTime = Math.abs(todayDate.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    } catch {
      return false;
    }
  });

  const weekAttended = weekSessions.filter((s) => s.status === 'present').length;
  const weekMissed = weekSessions.filter((s) => s.status === 'absent').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. TOP HEADER / OVERVIEW CARD */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-white/50 font-mono text-[10px] uppercase tracking-[0.25em] mb-1">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              ACADEMICS • COMMAND OVERVIEW
            </div>
            <h2 className="text-2xl md:text-3xl font-serif italic text-white font-normal">
              Attendance Overview
            </h2>
          </div>

          {/* Overall Percentage Badge */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 flex items-baseline gap-3 shrink-0">
            <span className="text-3xl md:text-4xl font-serif italic text-white font-normal">
              {overall.overallPercentage.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
              OVERALL ATTENDANCE
            </span>
          </div>
        </div>

        {/* Weekly Quick Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-1">
              CLASSES THIS WEEK
            </span>
            <span className="text-2xl font-serif italic text-white">{weekSessions.length}</span>
          </div>

          <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/70 block mb-1">
              CLASSES ATTENDED
            </span>
            <span className="text-2xl font-serif italic text-emerald-300">{weekAttended}</span>
          </div>

          <div className="bg-rose-500/[0.03] border border-rose-500/10 rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400/70 block mb-1">
              CLASSES MISSED
            </span>
            <span className="text-2xl font-serif italic text-rose-300">{weekMissed}</span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S CLASSES QUICK ATTENDANCE */}
      <section className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300" />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/70">
              TODAY&apos;S SCHEDULED CLASSES • {format(new Date(), 'EEEE, MMM d')}
            </h3>
          </div>
          <button
            onClick={() => onNavigateSubTab('timetable')}
            className="text-[10px] font-mono uppercase tracking-wider text-white/50 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <span>View Full Timetable</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {todaySessions.length === 0 ? (
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl text-center space-y-2">
            <Calendar className="w-8 h-8 text-white/20 mx-auto" />
            <p className="text-xs text-white/50 font-serif italic">
              No classes scheduled for today. Rest up or catch up on study notes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaySessions.map((sess) => {
              const sub = subjects.find((s) => s.id === sess.subjectId);
              return (
                <div
                  key={sess.id}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-[10px] text-white/50">
                        {sess.startTime} – {sess.endTime}
                      </span>
                      {sess.room && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-white/10 text-white/70 rounded-full border border-white/10">
                          {sess.room}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-white truncate">
                      {sub?.name || 'Subject Class'}
                    </h4>
                    {sub?.professor && (
                      <p className="text-[10px] text-white/40">{sub.professor}</p>
                    )}
                  </div>

                  {/* One-Tap Status Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => recordAttendance(sess.id, 'present')}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition cursor-pointer border ${
                        sess.status === 'present'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                          : 'bg-white/5 text-white/60 border-white/10 hover:bg-emerald-500/10 hover:text-emerald-300'
                      }`}
                    >
                      ✓ PRESENT
                    </button>
                    <button
                      onClick={() => recordAttendance(sess.id, 'absent')}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition cursor-pointer border ${
                        sess.status === 'absent'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                          : 'bg-white/5 text-white/60 border-white/10 hover:bg-rose-500/10 hover:text-rose-300'
                      }`}
                    >
                      ✕ ABSENT
                    </button>
                    <button
                      onClick={() => recordAttendance(sess.id, 'cancelled')}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition cursor-pointer border ${
                        sess.status === 'cancelled'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                          : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                      title="Mark as Cancelled"
                    >
                      ⊘
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. SUBJECT CARDS LIST */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/70">
            SUBJECT ATTENDANCE BREAKDOWN ({subjects.length} SUBJECTS)
          </h3>
          <button
            onClick={() => onNavigateSubTab('subjects')}
            className="text-[10px] font-mono uppercase tracking-wider text-white/50 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <span>Manage Subjects</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {subjectStatsList.length === 0 ? (
          <div className="p-8 bg-[#121212] border border-white/10 rounded-2xl text-center space-y-3">
            <p className="text-sm font-serif italic text-white/60">
              No subjects added yet. Add subjects to start tracking attendance!
            </p>
            <button
              onClick={() => onNavigateSubTab('subjects')}
              className="px-4 py-2 bg-white text-black hover:bg-white/90 text-xs font-mono uppercase tracking-wider rounded-xl font-medium transition cursor-pointer"
            >
              Add First Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectStatsList.map((stat) => {
              const { subject, attended, conducted, percentage, target, riskStatus, statusMessage } = stat;

              let badgeStyle = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
              let Icon = ShieldCheck;

              if (riskStatus === 'WARNING') {
                badgeStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
                Icon = AlertTriangle;
              } else if (riskStatus === 'CRITICAL') {
                badgeStyle = 'bg-orange-500/10 text-orange-300 border-orange-500/20';
                Icon = AlertCircle;
              } else if (riskStatus === 'BELOW TARGET') {
                badgeStyle = 'bg-rose-500/10 text-rose-300 border-rose-500/20';
                Icon = XCircle;
              }

              return (
                <div
                  key={subject.id}
                  onClick={() => onSelectSubject(subject)}
                  className="bg-[#121212] border border-white/10 hover:border-white/30 rounded-2xl p-6 shadow-2xl transition duration-300 cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                        {subject.code || 'SUBJECT'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${badgeStyle}`}
                      >
                        <Icon className="w-3 h-3" />
                        {riskStatus}
                      </span>
                    </div>

                    <h4 className="text-xl font-serif italic text-white group-hover:text-amber-200 transition-colors">
                      {subject.name}
                    </h4>

                    {subject.professor && (
                      <p className="text-xs text-white/50">{subject.professor}</p>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-serif italic text-white">
                        {percentage.toFixed(1)}%
                      </span>
                      <span className="text-[10px] font-mono text-white/50">
                        {attended} / {conducted} classes attended
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                      <span>Target: {target}%</span>
                      <span>{statusMessage}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          riskStatus === 'SAFE'
                            ? 'bg-emerald-400'
                            : riskStatus === 'WARNING'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
