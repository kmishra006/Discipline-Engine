import { UserProfile, StreakInfo, Task, WorkoutPlan, WorkoutSession, Skill, LearningEntry, Note, WaterLog } from '../types';
import { Subject, TimetableSlot, ClassSession, SemesterConfig } from '../modules/academics/types';
import {
  DEMO_USER,
  DEMO_STREAK,
  DEMO_TASKS,
  DEMO_WORKOUT_PLANS,
  DEMO_WORKOUT_SESSIONS,
  DEMO_SKILLS,
  DEMO_LEARNING_ENTRIES,
  DEMO_NOTES,
  DEMO_WATER_LOGS,
  DEMO_SUBJECTS,
  DEMO_TIMETABLE_SLOTS,
  DEMO_SEMESTER_CONFIG,
  DEMO_CLASS_SESSIONS,
} from '../data/demoData';

const KEYS = {
  USER: 'de_user_profile',
  STREAK: 'de_streak_info',
  TASKS: 'de_tasks',
  WORKOUT_PLANS: 'de_workout_plans',
  WORKOUT_SESSIONS: 'de_workout_sessions',
  SKILLS: 'de_skills',
  LEARNING_ENTRIES: 'de_learning_entries',
  NOTES: 'de_notes',
  WATER_LOGS: 'de_water_logs',
  SUBJECTS: 'de_subjects',
  TIMETABLE_SLOTS: 'de_timetable_slots',
  CLASS_SESSIONS: 'de_class_sessions',
  SEMESTER_CONFIG: 'de_semester_config',
};

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Storage error reading ${key}:`, err);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Storage error writing ${key}:`, err);
  }
}

export const storage = {
  getUserProfile: (): UserProfile | null => getItem<UserProfile | null>(KEYS.USER, null),
  setUserProfile: (user: UserProfile) => setItem(KEYS.USER, user),

  getStreakInfo: (): StreakInfo => getItem<StreakInfo>(KEYS.STREAK, {
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: '',
    taskStreak: 0,
    fitnessStreak: 0,
    skillStreak: 0,
  }),
  setStreakInfo: (streak: StreakInfo) => setItem(KEYS.STREAK, streak),

  getTasks: (): Task[] => getItem<Task[]>(KEYS.TASKS, []),
  setTasks: (tasks: Task[]) => setItem(KEYS.TASKS, tasks),

  getWorkoutPlans: (): WorkoutPlan[] => getItem<WorkoutPlan[]>(KEYS.WORKOUT_PLANS, []),
  setWorkoutPlans: (plans: WorkoutPlan[]) => setItem(KEYS.WORKOUT_PLANS, plans),

  getWorkoutSessions: (): WorkoutSession[] => getItem<WorkoutSession[]>(KEYS.WORKOUT_SESSIONS, []),
  setWorkoutSessions: (sessions: WorkoutSession[]) => setItem(KEYS.WORKOUT_SESSIONS, sessions),

  getSkills: (): Skill[] => getItem<Skill[]>(KEYS.SKILLS, []),
  setSkills: (skills: Skill[]) => setItem(KEYS.SKILLS, skills),

  getLearningEntries: (): LearningEntry[] => getItem<LearningEntry[]>(KEYS.LEARNING_ENTRIES, []),
  setLearningEntries: (entries: LearningEntry[]) => setItem(KEYS.LEARNING_ENTRIES, entries),

  getNotes: (): Note[] => getItem<Note[]>(KEYS.NOTES, []),
  setNotes: (notes: Note[]) => setItem(KEYS.NOTES, notes),

  getWaterLogs: (): WaterLog[] => getItem<WaterLog[]>(KEYS.WATER_LOGS, []),
  setWaterLogs: (logs: WaterLog[]) => setItem(KEYS.WATER_LOGS, logs),

  getSubjects: (): Subject[] => getItem<Subject[]>(KEYS.SUBJECTS, []),
  setSubjects: (subjects: Subject[]) => setItem(KEYS.SUBJECTS, subjects),

  getTimetableSlots: (): TimetableSlot[] => getItem<TimetableSlot[]>(KEYS.TIMETABLE_SLOTS, []),
  setTimetableSlots: (slots: TimetableSlot[]) => setItem(KEYS.TIMETABLE_SLOTS, slots),

  getClassSessions: (): ClassSession[] => getItem<ClassSession[]>(KEYS.CLASS_SESSIONS, []),
  setClassSessions: (sessions: ClassSession[]) => setItem(KEYS.CLASS_SESSIONS, sessions),

  getSemesterConfig: (): SemesterConfig => getItem<SemesterConfig>(KEYS.SEMESTER_CONFIG, DEMO_SEMESTER_CONFIG),
  setSemesterConfig: (config: SemesterConfig) => setItem(KEYS.SEMESTER_CONFIG, config),

  // Load Seed Demo Data
  loadDemoData: () => {
    storage.setUserProfile(DEMO_USER);
    storage.setStreakInfo(DEMO_STREAK);
    storage.setTasks(DEMO_TASKS);
    storage.setWorkoutPlans(DEMO_WORKOUT_PLANS);
    storage.setWorkoutSessions(DEMO_WORKOUT_SESSIONS);
    storage.setSkills(DEMO_SKILLS);
    storage.setLearningEntries(DEMO_LEARNING_ENTRIES);
    storage.setNotes(DEMO_NOTES);
    storage.setWaterLogs(DEMO_WATER_LOGS);
    storage.setSubjects(DEMO_SUBJECTS);
    storage.setTimetableSlots(DEMO_TIMETABLE_SLOTS);
    storage.setClassSessions(DEMO_CLASS_SESSIONS);
    storage.setSemesterConfig(DEMO_SEMESTER_CONFIG);
  },

  // Clear All Data
  clearAll: () => {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  },

  // Full Export
  exportAllData: () => {
    return JSON.stringify({
      version: '1.1',
      exportedAt: new Date().toISOString(),
      user: storage.getUserProfile(),
      streak: storage.getStreakInfo(),
      tasks: storage.getTasks(),
      workoutPlans: storage.getWorkoutPlans(),
      workoutSessions: storage.getWorkoutSessions(),
      skills: storage.getSkills(),
      learningEntries: storage.getLearningEntries(),
      notes: storage.getNotes(),
      waterLogs: storage.getWaterLogs(),
      subjects: storage.getSubjects(),
      timetableSlots: storage.getTimetableSlots(),
      classSessions: storage.getClassSessions(),
      semesterConfig: storage.getSemesterConfig(),
    }, null, 2);
  },

  // Full Import
  importAllData: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.user) storage.setUserProfile(parsed.user);
      if (parsed.streak) storage.setStreakInfo(parsed.streak);
      if (Array.isArray(parsed.tasks)) storage.setTasks(parsed.tasks);
      if (Array.isArray(parsed.workoutPlans)) storage.setWorkoutPlans(parsed.workoutPlans);
      if (Array.isArray(parsed.workoutSessions)) storage.setWorkoutSessions(parsed.workoutSessions);
      if (Array.isArray(parsed.skills)) storage.setSkills(parsed.skills);
      if (Array.isArray(parsed.learningEntries)) storage.setLearningEntries(parsed.learningEntries);
      if (Array.isArray(parsed.notes)) storage.setNotes(parsed.notes);
      if (Array.isArray(parsed.waterLogs)) storage.setWaterLogs(parsed.waterLogs);
      if (Array.isArray(parsed.subjects)) storage.setSubjects(parsed.subjects);
      if (Array.isArray(parsed.timetableSlots)) storage.setTimetableSlots(parsed.timetableSlots);
      if (Array.isArray(parsed.classSessions)) storage.setClassSessions(parsed.classSessions);
      if (parsed.semesterConfig) storage.setSemesterConfig(parsed.semesterConfig);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }
};
