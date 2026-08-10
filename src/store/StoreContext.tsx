import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, StreakInfo, Task, WorkoutPlan, WorkoutSession, Skill, LearningEntry, Note, WaterLog, DailyScoreBreakdown, GlobalSearchResult } from '../types';
import { Subject, TimetableSlot, ClassSession, SemesterConfig, AttendanceStatus } from '../modules/academics/types';
import { storage } from '../services/storage';
import { getTodayStr, calculateDailyScore, updateStreakCalculation } from '../utils/dateUtils';
import { notificationService } from '../services/notifications';
import { generateSemesterClassSessions } from '../modules/academics/services/classGenerator';

interface StoreContextType {
  user: UserProfile | null;
  streak: StreakInfo;
  tasks: Task[];
  workoutPlans: WorkoutPlan[];
  workoutSessions: WorkoutSession[];
  skills: Skill[];
  learningEntries: LearningEntry[];
  notes: Note[];
  waterLogs: WaterLog[];
  subjects: Subject[];
  timetableSlots: TimetableSlot[];
  classSessions: ClassSession[];
  semesterConfig: SemesterConfig;
  todayScore: DailyScoreBreakdown;
  todayWaterMl: number;
  nextWaterReminderTime: Date | null;
  selectedDateModal: string | null;
  globalSearchOpen: boolean;

  loginUser: (name: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleTaskSubtask: (taskId: string, subtaskId: string) => void;

  addWorkoutPlan: (plan: Omit<WorkoutPlan, 'id' | 'createdAt'>) => void;
  updateWorkoutPlan: (id: string, updates: Partial<WorkoutPlan>) => void;
  deleteWorkoutPlan: (id: string) => void;
  logWorkoutSession: (session: Omit<WorkoutSession, 'id'>) => void;
  toggleSessionExercise: (sessionId: string, exerciseId: string) => void;

  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'progressPercent'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  toggleSubSkill: (skillId: string, subSkillId: string) => void;
  addLearningEntry: (entry: Omit<LearningEntry, 'id' | 'createdAt'>) => void;

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  logWater: (amountMl: number) => void;
  resetWaterTimer: () => void;

  // Academic Actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  updateTimetableSlot: (id: string, updates: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;
  duplicateTimetableSlot: (id: string) => void;

  updateSemesterConfig: (updates: Partial<SemesterConfig>) => void;
  recordAttendance: (sessionId: string, status: AttendanceStatus, notes?: string) => void;
  generateClassesForSemester: () => void;

  setSelectedDateModal: (date: string | null) => void;
  setGlobalSearchOpen: (open: boolean) => void;

  loadDemoData: () => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;

  searchGlobal: (query: string) => GlobalSearchResult[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => storage.getUserProfile());
  const [streak, setStreak] = useState<StreakInfo>(() => storage.getStreakInfo());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => storage.getWorkoutPlans());
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>(() => storage.getWorkoutSessions());
  const [skills, setSkills] = useState<Skill[]>(() => storage.getSkills());
  const [learningEntries, setLearningEntries] = useState<LearningEntry[]>(() => storage.getLearningEntries());
  const [notes, setNotes] = useState<Note[]>(() => storage.getNotes());
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => storage.getWaterLogs());
  const [subjects, setSubjects] = useState<Subject[]>(() => storage.getSubjects());
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => storage.getTimetableSlots());
  const [classSessions, setClassSessions] = useState<ClassSession[]>(() => storage.getClassSessions());
  const [semesterConfig, setSemesterConfig] = useState<SemesterConfig>(() => storage.getSemesterConfig());

  const [selectedDateModal, setSelectedDateModal] = useState<string | null>(null);
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  const [lastWaterLoggedAt, setLastWaterLoggedAt] = useState<Date | null>(null);

  const todayStr = getTodayStr();

  // Save changes to storage
  useEffect(() => {
    if (user) storage.setUserProfile(user);
  }, [user]);

  useEffect(() => {
    storage.setTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.setWorkoutPlans(workoutPlans);
  }, [workoutPlans]);

  useEffect(() => {
    storage.setWorkoutSessions(workoutSessions);
  }, [workoutSessions]);

  useEffect(() => {
    storage.setSkills(skills);
  }, [skills]);

  useEffect(() => {
    storage.setLearningEntries(learningEntries);
  }, [learningEntries]);

  useEffect(() => {
    storage.setNotes(notes);
  }, [notes]);

  useEffect(() => {
    storage.setWaterLogs(waterLogs);
  }, [waterLogs]);

  useEffect(() => {
    storage.setSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    storage.setTimetableSlots(timetableSlots);
  }, [timetableSlots]);

  useEffect(() => {
    storage.setClassSessions(classSessions);
  }, [classSessions]);

  useEffect(() => {
    storage.setSemesterConfig(semesterConfig);
  }, [semesterConfig]);

  // Recalculate streak whenever tasks, sessions or entries change
  useEffect(() => {
    const updatedStreak = updateStreakCalculation(streak, tasks, workoutSessions, learningEntries);
    if (
      updatedStreak.currentStreak !== streak.currentStreak ||
      updatedStreak.bestStreak !== streak.bestStreak
    ) {
      setStreak(updatedStreak);
      storage.setStreakInfo(updatedStreak);
    }
  }, [tasks, workoutSessions, learningEntries]);

  // Today's total water intake
  const todayWaterMl = waterLogs
    .filter((w) => w.date === todayStr)
    .reduce((acc, curr) => acc + curr.amountMl, 0);

  // Next water reminder time
  const waterIntervalMinutes = user?.waterIntervalMinutes || 45;
  const nextWaterReminderTime = lastWaterLoggedAt
    ? new Date(lastWaterLoggedAt.getTime() + waterIntervalMinutes * 60 * 1000)
    : null;

  // Water timer interval check
  useEffect(() => {
    if (!user || !user.notificationsEnabled) return;
    const interval = setInterval(() => {
      if (nextWaterReminderTime && new Date() >= nextWaterReminderTime) {
        notificationService.notifyWaterReminder(todayWaterMl, user.dailyWaterGoalMl);
        setLastWaterLoggedAt(new Date()); // bump next reminder
      }
    }, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [nextWaterReminderTime, todayWaterMl, user]);

  // Today's score
  const todayScore = calculateDailyScore(
    todayStr,
    tasks,
    workoutSessions,
    learningEntries,
    waterLogs,
    user?.dailyWaterGoalMl || 3000
  );

  // Handlers
  const loginUser = (name: string) => {
    const newUser: UserProfile = {
      name: name.trim() || 'Champion',
      createdAt: todayStr,
      theme: 'pitch-black',
      waterIntervalMinutes: 45,
      dailyWaterGoalMl: 3000,
      notificationsEnabled: true,
      weekStartsOn: 'mon',
    };
    setUser(newUser);
    storage.setUserProfile(newUser);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      storage.setUserProfile(updated);
      return updated;
    });
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const completed = !t.completed;
          return {
            ...t,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const toggleTaskSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  // Fitness Actions
  const addWorkoutPlan = (planData: Omit<WorkoutPlan, 'id' | 'createdAt'>) => {
    const newPlan: WorkoutPlan = {
      ...planData,
      id: 'plan-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setWorkoutPlans((prev) => [newPlan, ...prev]);
  };

  const updateWorkoutPlan = (id: string, updates: Partial<WorkoutPlan>) => {
    setWorkoutPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const logWorkoutSession = (sessionData: Omit<WorkoutSession, 'id'>) => {
    const newSession: WorkoutSession = {
      ...sessionData,
      id: 'session-' + Date.now(),
    };
    setWorkoutSessions((prev) => [newSession, ...prev]);
  };

  const toggleSessionExercise = (sessionId: string, exerciseId: string) => {
    setWorkoutSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const updatedExercises = s.exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
          );
          const allCompleted = updatedExercises.length > 0 && updatedExercises.every((e) => e.completed);
          return { ...s, exercises: updatedExercises, completed: allCompleted };
        }
        return s;
      })
    );
  };

  // Skill Actions
  const calculateSkillPercent = (subSkills: { completed: boolean }[]): number => {
    if (subSkills.length === 0) return 0;
    const completed = subSkills.filter((s) => s.completed).length;
    return Math.round((completed / subSkills.length) * 100);
  };

  const addSkill = (skillData: Omit<Skill, 'id' | 'createdAt' | 'progressPercent'>) => {
    const percent = calculateSkillPercent(skillData.subSkills || []);
    const newSkill: Skill = {
      ...skillData,
      id: 'skill-' + Date.now(),
      progressPercent: percent,
      createdAt: new Date().toISOString(),
    };
    setSkills((prev) => [newSkill, ...prev]);
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const subSkills = updates.subSkills || s.subSkills;
          const progressPercent = calculateSkillPercent(subSkills);
          return { ...s, ...updates, progressPercent };
        }
        return s;
      })
    );
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSubSkill = (skillId: string, subSkillId: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          const updatedSubSkills = s.subSkills.map((sub) =>
            sub.id === subSkillId ? { ...sub, completed: !sub.completed } : sub
          );
          const progressPercent = calculateSkillPercent(updatedSubSkills);
          return { ...s, subSkills: updatedSubSkills, progressPercent };
        }
        return s;
      })
    );
  };

  const addLearningEntry = (entryData: Omit<LearningEntry, 'id' | 'createdAt'>) => {
    const newEntry: LearningEntry = {
      ...entryData,
      id: 'entry-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setLearningEntries((prev) => [newEntry, ...prev]);
  };

  // Note Actions
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: 'note-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: todayStr,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: todayStr } : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Water Actions
  const logWater = (amountMl: number) => {
    const newLog: WaterLog = {
      id: 'water-' + Date.now(),
      timestamp: new Date().toISOString(),
      date: todayStr,
      amountMl,
    };
    setWaterLogs((prev) => [newLog, ...prev]);
    setLastWaterLoggedAt(new Date());
  };

  const resetWaterTimer = () => {
    setLastWaterLoggedAt(new Date());
  };

  // Seed / Reset / Export / Import
  const loadDemoData = () => {
    storage.loadDemoData();
    setUser(storage.getUserProfile());
    setStreak(storage.getStreakInfo());
    setTasks(storage.getTasks());
    setWorkoutPlans(storage.getWorkoutPlans());
    setWorkoutSessions(storage.getWorkoutSessions());
    setSkills(storage.getSkills());
    setLearningEntries(storage.getLearningEntries());
    setNotes(storage.getNotes());
    setWaterLogs(storage.getWaterLogs());
  };

  const clearAllData = () => {
    storage.clearAll();
    setUser(null);
    setTasks([]);
    setWorkoutPlans([]);
    setWorkoutSessions([]);
    setSkills([]);
    setLearningEntries([]);
    setNotes([]);
    setWaterLogs([]);
    setStreak({
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: '',
      taskStreak: 0,
      fitnessStreak: 0,
      skillStreak: 0,
    });
  };

  const exportData = () => {
    return storage.exportAllData();
  };

  const importData = (jsonStr: string) => {
    const success = storage.importAllData(jsonStr);
    if (success) {
      setUser(storage.getUserProfile());
      setStreak(storage.getStreakInfo());
      setTasks(storage.getTasks());
      setWorkoutPlans(storage.getWorkoutPlans());
      setWorkoutSessions(storage.getWorkoutSessions());
      setSkills(storage.getSkills());
      setLearningEntries(storage.getLearningEntries());
      setNotes(storage.getNotes());
      setWaterLogs(storage.getWaterLogs());
    }
    return success;
  };

  // ACADEMIC SYSTEM HANDLERS
  const addSubject = (subjectData: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setTimetableSlots((prev) => prev.filter((slot) => slot.subjectId !== id));
    setClassSessions((prev) => prev.filter((sess) => sess.subjectId !== id));
  };

  const generateClassesForSemester = useCallback(() => {
    setClassSessions((prevSessions) => {
      const generated = generateSemesterClassSessions(timetableSlots, semesterConfig, prevSessions);
      return generated;
    });
  }, [timetableSlots, semesterConfig]);

  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `ts_${Date.now()}`,
    };
    const nextSlots = [...timetableSlots, newSlot];
    setTimetableSlots(nextSlots);
    setClassSessions((prev) => generateSemesterClassSessions(nextSlots, semesterConfig, prev));
  };

  const updateTimetableSlot = (id: string, updates: Partial<TimetableSlot>) => {
    const nextSlots = timetableSlots.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setTimetableSlots(nextSlots);
    setClassSessions((prev) => generateSemesterClassSessions(nextSlots, semesterConfig, prev));
  };

  const deleteTimetableSlot = (id: string) => {
    const nextSlots = timetableSlots.filter((s) => s.id !== id);
    setTimetableSlots(nextSlots);
    setClassSessions((prev) => generateSemesterClassSessions(nextSlots, semesterConfig, prev));
  };

  const duplicateTimetableSlot = (id: string) => {
    const existing = timetableSlots.find((s) => s.id === id);
    if (!existing) return;
    const duplicated: TimetableSlot = {
      ...existing,
      id: `ts_${Date.now()}`,
    };
    const nextSlots = [...timetableSlots, duplicated];
    setTimetableSlots(nextSlots);
    setClassSessions((prev) => generateSemesterClassSessions(nextSlots, semesterConfig, prev));
  };

  const updateSemesterConfig = (updates: Partial<SemesterConfig>) => {
    const nextConfig = { ...semesterConfig, ...updates };
    setSemesterConfig(nextConfig);
    setClassSessions((prev) => generateSemesterClassSessions(timetableSlots, nextConfig, prev));
  };

  const recordAttendance = (sessionId: string, status: AttendanceStatus, notes?: string) => {
    setClassSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status, notes: notes !== undefined ? notes : s.notes } : s))
    );
  };

  // Global Search Engine
  const searchGlobal = useCallback((query: string): GlobalSearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: GlobalSearchResult[] = [];

    // Search subjects
    subjects.forEach((sub) => {
      if (sub.name.toLowerCase().includes(q) || (sub.code && sub.code.toLowerCase().includes(q)) || (sub.professor && sub.professor.toLowerCase().includes(q))) {
        results.push({
          id: sub.id,
          type: 'subject' as any,
          title: sub.name,
          subtitle: `Subject (${sub.code || 'No Code'}) • Prof: ${sub.professor || 'N/A'}`,
          linkTab: 'academics',
          item: sub,
        });
      }
    });

    // Search tasks
    tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)) || t.category.toLowerCase().includes(q)) {
        results.push({
          id: t.id,
          type: 'task',
          title: t.title,
          subtitle: `Task (${t.category}) • Priority: ${t.priority}`,
          date: t.date,
          linkTab: 'todo',
          item: t,
        });
      }
    });

    // Search workout plans
    workoutPlans.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)) || p.exercises.some(e => e.name.toLowerCase().includes(q))) {
        results.push({
          id: p.id,
          type: 'workout_plan',
          title: p.name,
          subtitle: `Workout Plan (${p.exercises.length} exercises)`,
          linkTab: 'fitness',
          item: p,
        });
      }
    });

    // Search workout sessions
    workoutSessions.forEach((s) => {
      if (s.planName.toLowerCase().includes(q) || s.exercises.some((e) => e.name.toLowerCase().includes(q))) {
        results.push({
          id: s.id,
          type: 'workout_session',
          title: s.planName,
          subtitle: `Workout Log (${s.exercises.length} exercises)`,
          date: s.date,
          linkTab: 'fitness',
          item: s,
        });
      }
    });

    // Search skills
    skills.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))) {
        results.push({
          id: s.id,
          type: 'skill',
          title: s.name,
          subtitle: `Skill (${s.progressPercent}% complete)`,
          linkTab: 'skills',
          item: s,
        });
      }
    });

    // Search learning entries
    learningEntries.forEach((e) => {
      if (e.content.toLowerCase().includes(q) || e.skillName.toLowerCase().includes(q)) {
        results.push({
          id: e.id,
          type: 'learning_entry',
          title: `${e.skillName} Journal Entry`,
          subtitle: e.content.substring(0, 70) + '...',
          date: e.date,
          linkTab: 'skills',
          item: e,
        });
      }
    });

    // Search notes
    notes.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || (n.category && n.category.toLowerCase().includes(q))) {
        results.push({
          id: n.id,
          type: 'note',
          title: n.title || 'Untitled Note',
          subtitle: n.content.substring(0, 70) + '...',
          linkTab: 'notes',
          item: n,
        });
      }
    });

    return results;
  }, [subjects, tasks, workoutPlans, workoutSessions, skills, learningEntries, notes]);

  return (
    <StoreContext.Provider
      value={{
        user,
        streak,
        tasks,
        workoutPlans,
        workoutSessions,
        skills,
        learningEntries,
        notes,
        waterLogs,
        subjects,
        timetableSlots,
        classSessions,
        semesterConfig,
        todayScore,
        todayWaterMl,
        nextWaterReminderTime,
        selectedDateModal,
        globalSearchOpen,
        loginUser,
        updateUserProfile,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        toggleTaskSubtask,
        addWorkoutPlan,
        updateWorkoutPlan,
        deleteWorkoutPlan,
        logWorkoutSession,
        toggleSessionExercise,
        addSkill,
        updateSkill,
        deleteSkill,
        toggleSubSkill,
        addLearningEntry,
        addNote,
        updateNote,
        deleteNote,
        logWater,
        resetWaterTimer,
        addSubject,
        updateSubject,
        deleteSubject,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        duplicateTimetableSlot,
        updateSemesterConfig,
        recordAttendance,
        generateClassesForSemester,
        setSelectedDateModal,
        setGlobalSearchOpen,
        loadDemoData,
        clearAllData,
        exportData,
        importData,
        searchGlobal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
