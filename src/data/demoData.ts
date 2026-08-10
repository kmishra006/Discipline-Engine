import { Task, WorkoutPlan, WorkoutSession, Skill, Note, WaterLog, UserProfile, StreakInfo } from '../types';
import { format, subDays } from 'date-fns';

const todayStr = format(new Date(), 'yyyy-MM-dd');
const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const day2Str = format(subDays(new Date(), 2), 'yyyy-MM-dd');
const day3Str = format(subDays(new Date(), 3), 'yyyy-MM-dd');

export const DEMO_USER: UserProfile = {
  name: 'Krishna',
  createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
  theme: 'pitch-black',
  waterIntervalMinutes: 45,
  dailyWaterGoalMl: 3000,
  notificationsEnabled: true,
  weekStartsOn: 'mon',
};

export const DEMO_STREAK: StreakInfo = {
  currentStreak: 12,
  bestStreak: 23,
  lastActiveDate: todayStr,
  taskStreak: 12,
  fitnessStreak: 8,
  skillStreak: 14,
};

export const DEMO_TASKS: Task[] = [
  {
    id: 'demo-t1',
    title: 'Finish DBMS Assignment - B-Trees & Indexing',
    description: 'Implement B+ Tree node splitting and range queries in Java.',
    date: todayStr,
    time: '14:00',
    priority: 'Critical',
    category: 'College',
    completed: false,
    createdAt: subDays(new Date(), 1).toISOString(),
    subtasks: [
      { id: 'st1', title: 'Read Chapter 12 of Database System Concepts', completed: true },
      { id: 'st2', title: 'Write node insertion algorithm', completed: false },
      { id: 'st3', title: 'Test with sample datasets', completed: false }
    ]
  },
  {
    id: 'demo-t2',
    title: 'Gym Session - Push Day (Chest & Triceps)',
    description: 'Focus on progressive overload for Bench Press.',
    date: todayStr,
    time: '17:30',
    priority: 'High',
    category: 'Fitness',
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: 'demo-t3',
    title: 'Study Data Structures & Algorithms - Graph Algorithms',
    description: 'Solve 3 LeetCode problems on Dijkstra and BFS/DFS traversal.',
    date: todayStr,
    time: '19:30',
    priority: 'High',
    category: 'Study',
    completed: false,
    createdAt: todayStr,
    subtasks: [
      { id: 'st4', title: 'Dijkstra shortest path implementation', completed: true },
      { id: 'st5', title: 'Detect cycle in directed graph', completed: false }
    ]
  },
  {
    id: 'demo-t4',
    title: 'Read 20 pages of Atomic Habits',
    description: 'Chapter on identity-based habits.',
    date: todayStr,
    time: '21:30',
    priority: 'Medium',
    category: 'Personal',
    completed: false,
    createdAt: todayStr,
  },
  {
    id: 'demo-t5',
    title: 'Submit OS Lab Report #4',
    description: 'Process Synchronization and Semaphore solutions.',
    date: yesterdayStr,
    time: '16:00',
    priority: 'Critical',
    category: 'College',
    completed: true,
    completedAt: yesterdayStr,
    createdAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: 'demo-t6',
    title: 'Review System Design - Scalability Patterns',
    description: 'Load balancers, CDN caching, database sharding.',
    date: day2Str,
    time: '11:00',
    priority: 'Medium',
    category: 'Study',
    completed: true,
    completedAt: day2Str,
    createdAt: subDays(new Date(), 4).toISOString(),
  }
];

export const DEMO_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-push',
    name: 'Push Day - Hypertrophy & Power',
    description: 'Chest, Shoulders, and Triceps focus.',
    trainingDays: ['Mon', 'Thu'],
    createdAt: subDays(new Date(), 20).toISOString(),
    exercises: [
      { id: 'ex-1', name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 60, restSeconds: 90, notes: 'Bar speed fast, pause at bottom' },
      { id: 'ex-2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 24, restSeconds: 75, notes: 'Deep stretch at 30 deg incline' },
      { id: 'ex-3', name: 'Overhead Dumbbell Press', sets: 3, reps: 10, weight: 18, restSeconds: 60, notes: 'Strict form, no leg drive' },
      { id: 'ex-4', name: 'Cable Chest Fly', sets: 3, reps: 12, weight: 15, restSeconds: 60, notes: 'Peak contraction 1 sec hold' },
      { id: 'ex-5', name: 'Tricep Rope Pushdown', sets: 4, reps: 12, weight: 25, restSeconds: 45, notes: 'Spread ropes at bottom' }
    ]
  },
  {
    id: 'plan-pull',
    name: 'Pull Day - Back & Biceps',
    description: 'Lat width, upper back thickness, biceps.',
    trainingDays: ['Tue', 'Fri'],
    createdAt: subDays(new Date(), 20).toISOString(),
    exercises: [
      { id: 'ex-6', name: 'Lat Pulldown', sets: 4, reps: 10, weight: 55, restSeconds: 90 },
      { id: 'ex-7', name: 'Seated Cable Row', sets: 3, reps: 10, weight: 50, restSeconds: 75 },
      { id: 'ex-8', name: 'Face Pulls', sets: 3, reps: 15, weight: 20, restSeconds: 60 },
      { id: 'ex-9', name: 'Ez Bar Bicep Curl', sets: 3, reps: 10, weight: 25, restSeconds: 60 }
    ]
  },
  {
    id: 'plan-legs',
    name: 'Legs & Core',
    description: 'Quads, hamstrings, calves, abdominals.',
    trainingDays: ['Wed', 'Sat'],
    createdAt: subDays(new Date(), 20).toISOString(),
    exercises: [
      { id: 'ex-10', name: 'Barbell Back Squat', sets: 4, reps: 8, weight: 75, restSeconds: 120 },
      { id: 'ex-11', name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 65, restSeconds: 90 },
      { id: 'ex-12', name: 'Leg Extension', sets: 3, reps: 12, weight: 45, restSeconds: 60 }
    ]
  }
];

export const DEMO_WORKOUT_SESSIONS: WorkoutSession[] = [
  {
    id: 'session-today',
    planId: 'plan-push',
    planName: 'Push Day - Hypertrophy & Power',
    date: todayStr,
    completed: true,
    durationMinutes: 55,
    notes: 'Hit a new PR on Bench Press 60kg for 8 clean reps!',
    exercises: [
      { id: 's1-e1', name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 60, completed: true },
      { id: 's1-e2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 24, completed: true },
      { id: 's1-e3', name: 'Cable Chest Fly', sets: 3, reps: 12, weight: 15, completed: true },
      { id: 's1-e4', name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 25, completed: true }
    ]
  },
  {
    id: 'session-prev-1',
    planId: 'plan-push',
    planName: 'Push Day',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    completed: true,
    durationMinutes: 52,
    exercises: [
      { id: 's2-e1', name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 57.5, completed: true },
      { id: 's2-e2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 22, completed: true }
    ]
  },
  {
    id: 'session-prev-2',
    planId: 'plan-push',
    planName: 'Push Day',
    date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
    completed: true,
    durationMinutes: 50,
    exercises: [
      { id: 's3-e1', name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 55, completed: true },
      { id: 's3-e2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 22, completed: true }
    ]
  }
];

export const DEMO_SKILLS: Skill[] = [
  {
    id: 'skill-java',
    name: 'Java & Spring Boot',
    description: 'Master core Java, concurrency, collection frameworks, and Spring microservices.',
    targetGoal: 'Build full-stack reactive microservice backend for student project.',
    progressPercent: 80,
    createdAt: subDays(new Date(), 40).toISOString(),
    subSkills: [
      { id: 'sub-j1', title: 'Variables & Datatypes', completed: true },
      { id: 'sub-j2', title: 'Control Flow & Loops', completed: true },
      { id: 'sub-j3', title: 'Object-Oriented Programming (OOP)', completed: true },
      { id: 'sub-j4', title: 'Collections Framework (ArrayList, HashMap, HashSet)', completed: true },
      { id: 'sub-j5', title: 'Multithreading & ExecutorService', completed: false },
      { id: 'sub-j6', title: 'Spring Boot REST Controllers & JPA Repository', completed: false }
    ]
  },
  {
    id: 'skill-dsa',
    name: 'Data Structures & Algorithms',
    description: 'Problem-solving proficiency for technical interviews and competitive coding.',
    targetGoal: 'Solve 200 medium/hard problems on LeetCode.',
    progressPercent: 50,
    createdAt: subDays(new Date(), 35).toISOString(),
    subSkills: [
      { id: 'sub-d1', title: 'Arrays & Two Pointers', completed: true },
      { id: 'sub-d2', title: 'Sliding Window Technique', completed: true },
      { id: 'sub-d3', title: 'Binary Search & Monotonic Stack', completed: true },
      { id: 'sub-d4', title: 'Trees & Binary Search Trees', completed: false },
      { id: 'sub-d5', title: 'Graphs (BFS/DFS/Dijkstra)', completed: false },
      { id: 'sub-d6', title: 'Dynamic Programming (1D & 2D)', completed: false }
    ]
  },
  {
    id: 'skill-video',
    name: 'Video Editing & Content Design',
    description: 'DaVinci Resolve color grading and motion graphics.',
    targetGoal: 'Edit 5 technical tutorials for YouTube channel.',
    progressPercent: 30,
    createdAt: subDays(new Date(), 25).toISOString(),
    subSkills: [
      { id: 'sub-v1', title: 'Timeline Editing & Cut Page', completed: true },
      { id: 'sub-v2', title: 'Audio Noise Reduction & Equalization', completed: true },
      { id: 'sub-v3', title: 'Color Wheels & Node Grading', completed: false },
      { id: 'sub-v4', title: 'Fusion Keyframing & Motion Titles', completed: false }
    ]
  }
];

export const DEMO_LEARNING_ENTRIES = [
  {
    id: 'le-1',
    skillId: 'skill-java',
    skillName: 'Java & Spring Boot',
    date: todayStr,
    content: 'Studied HashMap internals in Java 8+. Learned how bucket chaining switches from LinkedList to Red-Black Tree when chain length exceeds TREEIFY_THRESHOLD (8). Also reviewed hashCode equality contract.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'le-2',
    skillId: 'skill-dsa',
    skillName: 'Data Structures & Algorithms',
    date: yesterdayStr,
    content: 'Mastered Dijkstra algorithm using PriorityQueue. Understood distance relaxation rule and time complexity O((V + E) log V).',
    createdAt: subDays(new Date(), 1).toISOString()
  },
  {
    id: 'le-3',
    skillId: 'skill-java',
    skillName: 'Java & Spring Boot',
    date: day2Str,
    content: 'Learned Java Optional pattern to eliminate NullPointerExceptions cleanly with map, flatMap, and orElseGet.',
    createdAt: subDays(new Date(), 2).toISOString()
  }
];

export const DEMO_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Discipline Engine - Project Architecture Idea',
    content: `Key ideas for personal tracker app:
1. Centralized local-first data store for ultra-fast response.
2. Interconnected modules: Task completion updates daily score and streak automatically.
3. Dark, serious, high-contrast UI so opening it feels like stepping into a command bridge.
4. Export JSON feature to ensure zero data lock-in.`,
    category: 'Projects',
    pinned: true,
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: todayStr
  },
  {
    id: 'note-2',
    title: 'Things to ask DBMS Professor tomorrow',
    content: `- Clarification on B+ Tree node redistribution vs merging during deletion.
- Will indexed sequential access method (ISAM) be included in the mid-term exam?
- Submission deadline extension for Lab #5.`,
    category: 'College',
    pinned: false,
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: yesterdayStr
  },
  {
    id: 'note-3',
    title: 'Tomorrow Plan & Priority Checklist',
    content: `1. Morning 6:00 AM - Hydration + 30 mins workout review.
2. Complete DBMS B-Tree assignment before 2:00 PM.
3. Solve 2 Graph DP problems.
4. Review Spring Boot JPA annotations (Entity, Table, Id, ManyToOne).`,
    category: 'Daily',
    pinned: true,
    createdAt: yesterdayStr,
    updatedAt: todayStr
  }
];

export const DEMO_WATER_LOGS: WaterLog[] = [
  { id: 'w1', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), date: todayStr, amountMl: 500 },
  { id: 'w2', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), date: todayStr, amountMl: 500 },
  { id: 'w3', timestamp: new Date(Date.now() - 1800000).toISOString(), date: todayStr, amountMl: 500 },
];

export const DEMO_SEMESTER_CONFIG = {
  startDate: '2026-08-01',
  endDate: '2026-11-30',
  attendanceRemindersEnabled: true,
};

export const DEMO_SUBJECTS = [
  {
    id: 'sub-dbms',
    name: 'DBMS',
    code: 'CS301',
    professor: 'Dr. Sharma',
    room: 'A204',
    targetAttendance: 75,
    color: '#3b82f6',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: 'CS302',
    professor: 'Prof. Verma',
    room: 'B102',
    targetAttendance: 75,
    color: '#10b981',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'sub-cloud',
    name: 'Cloud Computing',
    code: 'CS303',
    professor: 'Dr. Gupta',
    room: 'C301',
    targetAttendance: 75,
    color: '#f59e0b',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'sub-ai',
    name: 'Artificial Intelligence',
    code: 'CS304',
    professor: 'Dr. Mehta',
    room: 'A204',
    targetAttendance: 80,
    color: '#8b5cf6',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
];

export const DEMO_TIMETABLE_SLOTS = [
  { id: 'ts-1', subjectId: 'sub-dbms', dayOfWeek: 'Monday' as const, startTime: '09:00', endTime: '10:00', room: 'A204', professor: 'Dr. Sharma' },
  { id: 'ts-2', subjectId: 'sub-cn', dayOfWeek: 'Monday' as const, startTime: '10:00', endTime: '11:00', room: 'B102', professor: 'Prof. Verma' },
  { id: 'ts-3', subjectId: 'sub-ai', dayOfWeek: 'Monday' as const, startTime: '11:00', endTime: '12:00', room: 'A204', professor: 'Dr. Mehta' },

  { id: 'ts-4', subjectId: 'sub-cloud', dayOfWeek: 'Tuesday' as const, startTime: '09:00', endTime: '10:00', room: 'C301', professor: 'Dr. Gupta' },
  { id: 'ts-5', subjectId: 'sub-dbms', dayOfWeek: 'Tuesday' as const, startTime: '10:00', endTime: '11:00', room: 'A204', professor: 'Dr. Sharma' },
  { id: 'ts-6', subjectId: 'sub-cn', dayOfWeek: 'Tuesday' as const, startTime: '11:00', endTime: '12:00', room: 'B102', professor: 'Prof. Verma' },

  { id: 'ts-7', subjectId: 'sub-dbms', dayOfWeek: 'Wednesday' as const, startTime: '09:00', endTime: '10:00', room: 'A204', professor: 'Dr. Sharma' },
  { id: 'ts-8', subjectId: 'sub-cloud', dayOfWeek: 'Wednesday' as const, startTime: '10:00', endTime: '11:00', room: 'C301', professor: 'Dr. Gupta' },
  { id: 'ts-9', subjectId: 'sub-ai', dayOfWeek: 'Wednesday' as const, startTime: '11:00', endTime: '12:00', room: 'A204', professor: 'Dr. Mehta' },

  { id: 'ts-10', subjectId: 'sub-cn', dayOfWeek: 'Thursday' as const, startTime: '09:00', endTime: '10:00', room: 'B102', professor: 'Prof. Verma' },
  { id: 'ts-11', subjectId: 'sub-dbms', dayOfWeek: 'Thursday' as const, startTime: '10:00', endTime: '11:00', room: 'A204', professor: 'Dr. Sharma' },
  { id: 'ts-12', subjectId: 'sub-cloud', dayOfWeek: 'Thursday' as const, startTime: '11:00', endTime: '12:00', room: 'C301', professor: 'Dr. Gupta' },

  { id: 'ts-13', subjectId: 'sub-ai', dayOfWeek: 'Friday' as const, startTime: '09:00', endTime: '10:00', room: 'A204', professor: 'Dr. Mehta' },
  { id: 'ts-14', subjectId: 'sub-cn', dayOfWeek: 'Friday' as const, startTime: '10:00', endTime: '11:00', room: 'B102', professor: 'Prof. Verma' },
  { id: 'ts-15', subjectId: 'sub-dbms', dayOfWeek: 'Friday' as const, startTime: '11:00', endTime: '12:00', room: 'A204', professor: 'Dr. Sharma' },
];

export const DEMO_CLASS_SESSIONS = [
  // DBMS: 42 attended out of 50 conducted (84.0%)
  ...Array(42).fill(null).map((_, i) => ({
    id: `sess-dbms-p-${i}`,
    subjectId: 'sub-dbms',
    date: format(subDays(new Date(), (i % 25) + 1), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    room: 'A204',
    professor: 'Dr. Sharma',
    status: 'present' as const,
  })),
  ...Array(8).fill(null).map((_, i) => ({
    id: `sess-dbms-a-${i}`,
    subjectId: 'sub-dbms',
    date: format(subDays(new Date(), (i % 20) + 2), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '11:00',
    room: 'A204',
    professor: 'Dr. Sharma',
    status: 'absent' as const,
  })),

  // Computer Networks: 38 attended out of 50 conducted (76.0%)
  ...Array(38).fill(null).map((_, i) => ({
    id: `sess-cn-p-${i}`,
    subjectId: 'sub-cn',
    date: format(subDays(new Date(), (i % 25) + 1), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '11:00',
    room: 'B102',
    professor: 'Prof. Verma',
    status: 'present' as const,
  })),
  ...Array(12).fill(null).map((_, i) => ({
    id: `sess-cn-a-${i}`,
    subjectId: 'sub-cn',
    date: format(subDays(new Date(), (i % 20) + 2), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '11:00',
    room: 'B102',
    professor: 'Prof. Verma',
    status: 'absent' as const,
  })),

  // Cloud Computing: 32 attended out of 45 conducted (71.1%)
  ...Array(32).fill(null).map((_, i) => ({
    id: `sess-cloud-p-${i}`,
    subjectId: 'sub-cloud',
    date: format(subDays(new Date(), (i % 25) + 1), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    room: 'C301',
    professor: 'Dr. Gupta',
    status: 'present' as const,
  })),
  ...Array(13).fill(null).map((_, i) => ({
    id: `sess-cloud-a-${i}`,
    subjectId: 'sub-cloud',
    date: format(subDays(new Date(), (i % 20) + 2), 'yyyy-MM-dd'),
    startTime: '11:00',
    endTime: '12:00',
    room: 'C301',
    professor: 'Dr. Gupta',
    status: 'absent' as const,
  })),

  // Artificial Intelligence: 41 attended out of 45 conducted (91.1%)
  ...Array(41).fill(null).map((_, i) => ({
    id: `sess-ai-p-${i}`,
    subjectId: 'sub-ai',
    date: format(subDays(new Date(), (i % 25) + 1), 'yyyy-MM-dd'),
    startTime: '11:00',
    endTime: '12:00',
    room: 'A204',
    professor: 'Dr. Mehta',
    status: 'present' as const,
  })),
  ...Array(4).fill(null).map((_, i) => ({
    id: `sess-ai-a-${i}`,
    subjectId: 'sub-ai',
    date: format(subDays(new Date(), (i % 20) + 2), 'yyyy-MM-dd'),
    startTime: '11:00',
    endTime: '12:00',
    room: 'A204',
    professor: 'Dr. Mehta',
    status: 'absent' as const,
  })),

  // Today's classes (mix of unrecorded and recorded)
  {
    id: 'today-sess-1',
    subjectId: 'sub-dbms',
    date: todayStr,
    startTime: '09:00',
    endTime: '10:00',
    room: 'A204',
    professor: 'Dr. Sharma',
    status: 'present' as const,
  },
  {
    id: 'today-sess-2',
    subjectId: 'sub-cn',
    date: todayStr,
    startTime: '10:00',
    endTime: '11:00',
    room: 'B102',
    professor: 'Prof. Verma',
    status: 'not_recorded' as const,
  },
  {
    id: 'today-sess-3',
    subjectId: 'sub-ai',
    date: todayStr,
    startTime: '11:00',
    endTime: '12:00',
    room: 'A204',
    professor: 'Dr. Mehta',
    status: 'not_recorded' as const,
  },
];

