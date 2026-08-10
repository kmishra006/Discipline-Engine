import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { getRandomQuote, MotivationalQuote } from '../data/quotes';
import { WaterReminderCard } from '../components/WaterReminderCard';
import { getCalendarGrid, getTodayStr, formatDateDisplay } from '../utils/dateUtils';
import {
  Flame,
  RotateCw,
  CheckSquare,
  Dumbbell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  GraduationCap,
  Clock,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { format, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';

interface Props {
  onNavigateTab: (tab: string) => void;
}

export function DashboardPage({ onNavigateTab }: Props) {
  const {
    user,
    streak,
    tasks,
    workoutSessions,
    learningEntries,
    todayScore,
    toggleTask,
    setSelectedDateModal,
    addTask,
    classSessions,
    subjects,
    recordAttendance,
  } = useStore();

  const [quote, setQuote] = useState<MotivationalQuote>(() => getRandomQuote());
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  const todayStr = getTodayStr();

  const handleRefreshQuote = () => {
    setQuote(getRandomQuote());
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask({
      title: quickTaskTitle.trim(),
      date: todayStr,
      priority: 'Medium',
      category: 'Study',
      completed: false,
    });
    setQuickTaskTitle('');
  };

  // Calendar Grid setup
  const year = calendarDate.getFullYear();
  const monthIndex = calendarDate.getMonth();
  const calendarDays = getCalendarGrid(year, monthIndex, user?.weekStartsOn === 'mon');

  const todayTasks = tasks.filter((t) => t.date === todayStr);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. HEADER & MOTIVATIONAL QUOTE */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-white font-normal">
              {getTimeGreeting()}, {user?.name || 'Champion'}.
            </h1>
            <p className="text-[11px] text-white/50 font-mono uppercase tracking-[0.25em] mt-1">
              Command Engine • {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>

          {/* Streak Banner */}
          <div className="flex items-center gap-3 bg-[#121212] border border-white/10 rounded-2xl px-5 py-3 shadow-2xl shrink-0">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white/90">
              <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-serif italic text-white">
                  {streak.currentStreak}
                </span>
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">
                  DAY STREAK
                </span>
              </div>
              <p className="text-[10px] font-mono text-white/40">
                Record Best: <span className="text-white/80">{streak.bestStreak} days</span>
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Quote Banner */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 block">
              DAILY REFLECTION • {quote.theme}
            </span>
            <p className="text-base sm:text-lg font-serif italic text-white/90 leading-relaxed">
              &quot;{quote.text}&quot;
            </p>
          </div>
          <button
            onClick={handleRefreshQuote}
            title="Refresh quote"
            className="self-start sm:self-center p-2.5 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-white/60 hover:text-black rounded-full transition-all duration-300 cursor-pointer shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2. TOP METRICS & DAILY SCORE */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Score Card */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-300" />
              TODAY&apos;S SCORE
            </span>
            <button
              onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
              className="text-[10px] font-mono uppercase tracking-wider text-white/60 hover:text-white underline cursor-pointer"
            >
              {showScoreBreakdown ? 'Hide Breakdown' : 'View Breakdown'}
            </button>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-4xl font-serif italic text-white font-normal">
              {todayScore.totalScore}
            </span>
            <span className="text-xs font-sans text-white/40">/ 100</span>
          </div>

          {/* Breakdown progress bar */}
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10 mb-3">
            <div
              className="bg-white/80 h-full rounded-full transition-all duration-500"
              style={{ width: `${todayScore.totalScore}%` }}
            />
          </div>

          {showScoreBreakdown ? (
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/[0.03] p-3 rounded-xl border border-white/10 mt-2">
              <div>Tasks: <span className="text-white font-medium">{todayScore.tasksScore}/{todayScore.tasksMax}</span></div>
              <div>Fitness: <span className="text-white font-medium">{todayScore.fitnessScore}/{todayScore.fitnessMax}</span></div>
              <div>Skills: <span className="text-white font-medium">{todayScore.skillsScore}/{todayScore.skillsMax}</span></div>
              <div>Habits: <span className="text-white font-medium">{todayScore.habitsScore}/{todayScore.habitsMax}</span></div>
            </div>
          ) : (
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
              Aggregated from completed tasks, workouts, skills, and hydration.
            </p>
          )}
        </div>

        {/* Water Reminder Card */}
        <WaterReminderCard />

        {/* Today's Quick Summary & Actions */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 block mb-3">
              COMMAND SHORTCUTS
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigateTab('academics')}
                className="p-3 bg-white/[0.03] hover:bg-white hover:text-black border border-white/10 rounded-xl text-left transition-all duration-300 cursor-pointer group"
              >
                <GraduationCap className="w-4 h-4 text-amber-300 mb-1 group-hover:text-black transition" />
                <span className="block text-xs font-medium">Academics</span>
                <span className="text-[10px] font-mono text-white/40 group-hover:text-black/60">Timetable & Attendance</span>
              </button>

              <button
                onClick={() => onNavigateTab('todo')}
                className="p-3 bg-white/[0.03] hover:bg-white hover:text-black border border-white/10 rounded-xl text-left transition-all duration-300 cursor-pointer group"
              >
                <CheckSquare className="w-4 h-4 text-white/70 mb-1 group-hover:text-black transition" />
                <span className="block text-xs font-medium">To-Do List</span>
                <span className="text-[10px] font-mono text-white/40 group-hover:text-black/60">{todayTasks.filter(t=>!t.completed).length} pending</span>
              </button>

              <button
                onClick={() => onNavigateTab('fitness')}
                className="p-3 bg-white/[0.03] hover:bg-white hover:text-black border border-white/10 rounded-xl text-left transition-all duration-300 cursor-pointer group"
              >
                <Dumbbell className="w-4 h-4 text-white/70 mb-1 group-hover:text-black transition" />
                <span className="block text-xs font-medium">Workouts</span>
                <span className="text-[10px] font-mono text-white/40 group-hover:text-black/60">Log Session</span>
              </button>

              <button
                onClick={() => onNavigateTab('skills')}
                className="p-3 bg-white/[0.03] hover:bg-white hover:text-black border border-white/10 rounded-xl text-left transition-all duration-300 cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 text-white/70 mb-1 group-hover:text-black transition" />
                <span className="block text-xs font-medium">Skill Journal</span>
                <span className="text-[10px] font-mono text-white/40 group-hover:text-black/60">Active Study</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TODAY'S CLASSES ONE-TAP ATTENDANCE WIDGET */}
      {(() => {
        const todayClasses = classSessions.filter((s) => s.date === todayStr);
        if (todayClasses.length === 0) return null;

        return (
          <section className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/80">
                  TODAY&apos;S CLASSES • ONE-TAP ATTENDANCE
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('academics')}
                className="text-[10px] font-mono uppercase tracking-wider text-white/50 hover:text-white flex items-center gap-1 transition cursor-pointer"
              >
                <span>Academics Hub</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayClasses.map((sess) => {
                const sub = subjects.find((s) => s.id === sess.subjectId);
                return (
                  <div
                    key={sess.id}
                    className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-1">
                        <span>{sess.startTime} – {sess.endTime}</span>
                        {sess.room && <span className="text-white/70">{sess.room}</span>}
                      </div>
                      <h4 className="text-sm font-serif italic text-white font-medium">
                        {sub?.name || 'Class'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => recordAttendance(sess.id, 'present')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition cursor-pointer border ${
                          sess.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                            : 'bg-white/5 text-white/60 border-white/10 hover:text-emerald-300'
                        }`}
                      >
                        ✓ PRESENT
                      </button>
                      <button
                        onClick={() => recordAttendance(sess.id, 'absent')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition cursor-pointer border ${
                          sess.status === 'absent'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                            : 'bg-white/5 text-white/60 border-white/10 hover:text-rose-300'
                        }`}
                      >
                        ✕ ABSENT
                      </button>
                      <button
                        onClick={() => recordAttendance(sess.id, 'cancelled')}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition cursor-pointer border ${
                          sess.status === 'cancelled'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                            : 'bg-white/5 text-white/40 border-white/10'
                        }`}
                        title="Mark Cancelled"
                      >
                        ⊘
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* 3. TODAY'S TASKS & MONTHLY CALENDAR GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* TODAY'S TASKS CHECKLIST (7 cols) */}
        <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-white/70" />
                TODAY&apos;S TASKS
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mt-0.5">
                {todayTasks.filter((t) => t.completed).length} of {todayTasks.length} tasks completed
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('todo')}
              className="text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white underline cursor-pointer"
            >
              View All Tasks →
            </button>
          </div>

          {/* Quick Task Input Form */}
          <form onSubmit={handleQuickAddTask} className="flex gap-2">
            <input
              type="text"
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              placeholder="+ Add task due today..."
              className="flex-1 bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-full px-4 py-2.5 focus:outline-none placeholder-white/30"
            />
            <button
              type="submit"
              disabled={!quickTaskTitle.trim()}
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-full transition cursor-pointer"
            >
              ADD
            </button>
          </form>

          {/* Task List */}
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                <p className="text-xs font-serif italic text-white/60">No tasks scheduled for today.</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Add priority items to stay aligned.</p>
              </div>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/10 rounded-xl hover:border-white/20 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 accent-white rounded cursor-pointer shrink-0"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-xs ${
                          task.completed ? 'line-through text-white/40' : 'text-white/90 font-medium'
                        } truncate`}
                      >
                        {task.title}
                      </p>
                      {task.time && (
                        <span className="text-[10px] font-mono text-white/40">At {task.time}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-white/5 text-white/60 rounded-full border border-white/10">
                      {task.category}
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MONTHLY CALENDAR GRID (5 cols) */}
        <div className="lg:col-span-5 bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-serif italic text-white font-normal">
              {format(calendarDate, 'MMMM yyyy')}
            </h3>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCalendarDate(subMonths(calendarDate, 1))}
                className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCalendarDate(new Date())}
                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-white/5 text-white/60 hover:text-white rounded-full border border-white/10"
              >
                Today
              </button>
              <button
                onClick={() => setCalendarDate(addMonths(calendarDate, 1))}
                className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-medium text-white/40 uppercase tracking-widest">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dStr = format(day, 'yyyy-MM-dd');
              const isCurrMonth = isSameMonth(day, calendarDate);
              const isTodayDay = isSameDay(day, new Date());

              // Check indicators
              const hasTask = tasks.some((t) => t.date === dStr);
              const hasWorkout = workoutSessions.some((s) => s.date === dStr && s.completed);
              const hasSkill = learningEntries.some((e) => e.date === dStr);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateModal(dStr)}
                  className={`aspect-square p-1 rounded-xl flex flex-col items-center justify-between border transition cursor-pointer relative ${
                    isTodayDay
                      ? 'bg-white text-black font-bold border-white shadow-lg'
                      : isCurrMonth
                      ? 'bg-white/[0.03] border-white/10 hover:border-white/30 text-white/90'
                      : 'bg-transparent border-transparent text-white/20'
                  }`}
                >
                  <span className="text-xs font-mono">{format(day, 'd')}</span>

                  {/* Activity Indicator Dots */}
                  <div className="flex gap-0.5 items-center justify-center min-h-[6px] mb-0.5">
                    {hasTask && <div className={`w-1 h-1 rounded-full ${isTodayDay ? 'bg-black' : 'bg-white'}`} />}
                    {hasWorkout && <div className={`w-1 h-1 rounded-full ${isTodayDay ? 'bg-black/60' : 'bg-white/60'}`} />}
                    {hasSkill && <div className={`w-1 h-1 rounded-full ${isTodayDay ? 'bg-black/40' : 'bg-amber-300'}`} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-around text-[9px] font-mono uppercase tracking-widest text-white/40">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white" /> Task
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" /> Workout
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300" /> Skill
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
