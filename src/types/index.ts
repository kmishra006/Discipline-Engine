export type TaskCategory = 'Study' | 'College' | 'Work' | 'Fitness' | 'Personal' | 'Other';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO format YYYY-MM-DD
  time?: string; // HH:mm
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  subtasks?: TaskSubtask[];
  createdAt: string;
  completedAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number; // in kg or lbs
  restSeconds?: number;
  notes?: string;
  completed?: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainingDays?: string[]; // e.g. ["Mon", "Wed", "Fri"]
  exercises: Exercise[];
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  planId?: string;
  planName: string;
  date: string; // YYYY-MM-DD
  exercises: Exercise[];
  completed: boolean;
  durationMinutes?: number;
  notes?: string;
}

export interface SubSkill {
  id: string;
  title: string;
  completed: boolean;
}

export interface LearningEntry {
  id: string;
  skillId: string;
  skillName: string;
  date: string; // YYYY-MM-DD
  content: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  targetGoal?: string;
  subSkills: SubSkill[];
  progressPercent: number; // 0 - 100
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WaterLog {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  amountMl: number;
}

export interface UserProfile {
  name: string;
  createdAt: string;
  theme: 'pitch-black' | 'charcoal-stealth' | 'cyber-carbon';
  waterIntervalMinutes: number;
  dailyWaterGoalMl: number;
  lastWaterReminderTime?: string;
  notificationsEnabled: boolean;
  weekStartsOn: 'mon' | 'sun';
}

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  taskStreak: number;
  fitnessStreak: number;
  skillStreak: number;
}

export interface DailyScoreBreakdown {
  date: string;
  totalScore: number;
  tasksScore: number;
  tasksMax: number;
  fitnessScore: number;
  fitnessMax: number;
  skillsScore: number;
  skillsMax: number;
  habitsScore: number;
  habitsMax: number;
}

export interface GlobalSearchResult {
  id: string;
  type: 'task' | 'workout_plan' | 'workout_session' | 'skill' | 'learning_entry' | 'note';
  title: string;
  subtitle: string;
  date?: string;
  linkTab: string;
  item: any;
}
