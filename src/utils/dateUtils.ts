import { format, parseISO, isSameDay, subDays, differenceInCalendarDays, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { Task, WorkoutSession, LearningEntry, WaterLog, DailyScoreBreakdown, StreakInfo } from '../types';

export function getTodayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateDisplay(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatDayHeader(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'EEEE, MMMM d');
  } catch {
    return dateStr;
  }
}

// Calculate Daily Performance Score (0 - 100)
export function calculateDailyScore(
  dateStr: string,
  tasks: Task[],
  sessions: WorkoutSession[],
  entries: LearningEntry[],
  waterLogs: WaterLog[],
  dailyWaterGoalMl: number = 3000
): DailyScoreBreakdown {
  // 1. Tasks (Max 40 points)
  const dayTasks = tasks.filter((t) => t.date === dateStr);
  let tasksScore = 0;
  const tasksMax = 40;
  if (dayTasks.length > 0) {
    const completedTasks = dayTasks.filter((t) => t.completed).length;
    tasksScore = Math.round((completedTasks / dayTasks.length) * tasksMax);
  } else {
    tasksScore = 20; // Default baseline if no tasks scheduled
  }

  // 2. Fitness (Max 25 points)
  const daySessions = sessions.filter((s) => s.date === dateStr && s.completed);
  const fitnessMax = 25;
  const fitnessScore = daySessions.length > 0 ? 25 : 0;

  // 3. Skills (Max 20 points)
  const dayEntries = entries.filter((e) => e.date === dateStr);
  const skillsMax = 20;
  const skillsScore = dayEntries.length > 0 ? 20 : 0;

  // 4. Water / Habits (Max 15 points)
  const dayWater = waterLogs.filter((w) => w.date === dateStr).reduce((acc, w) => acc + w.amountMl, 0);
  const habitsMax = 15;
  const habitsScore = Math.min(habitsMax, Math.round((dayWater / Math.max(1, dailyWaterGoalMl)) * habitsMax));

  const totalScore = Math.min(100, tasksScore + fitnessScore + skillsScore + habitsScore);

  return {
    date: dateStr,
    totalScore,
    tasksScore,
    tasksMax,
    fitnessScore,
    fitnessMax,
    skillsScore,
    skillsMax,
    habitsScore,
    habitsMax,
  };
}

// Recalculate Streak Info based on user activity across days
export function updateStreakCalculation(
  existingStreak: StreakInfo,
  tasks: Task[],
  sessions: WorkoutSession[],
  entries: LearningEntry[]
): StreakInfo {
  const activeDatesSet = new Set<string>();

  tasks.filter((t) => t.completed && t.date).forEach((t) => activeDatesSet.add(t.date));
  sessions.filter((s) => s.completed && s.date).forEach((s) => activeDatesSet.add(s.date));
  entries.filter((e) => e.date).forEach((e) => activeDatesSet.add(e.date));

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

  let currentStreak = 0;
  let checkDate = activeDatesSet.has(todayStr) ? today : subDays(today, 1);

  while (activeDatesSet.has(format(checkDate, 'yyyy-MM-dd'))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }

  const bestStreak = Math.max(existingStreak.bestStreak || 0, currentStreak);

  return {
    currentStreak,
    bestStreak,
    lastActiveDate: activeDatesSet.has(todayStr) ? todayStr : (activeDatesSet.has(yesterdayStr) ? yesterdayStr : existingStreak.lastActiveDate),
    taskStreak: currentStreak,
    fitnessStreak: currentStreak,
    skillStreak: currentStreak,
  };
}

// Generate Calendar Days grid for a given month
export function getCalendarGrid(year: number, monthIndex: number, weekStartsOnMon: boolean = true) {
  const monthStart = startOfMonth(new Date(year, monthIndex, 1));
  const monthEnd = endOfMonth(monthStart);
  
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: weekStartsOnMon ? 1 : 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: weekStartsOnMon ? 1 : 0 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}
