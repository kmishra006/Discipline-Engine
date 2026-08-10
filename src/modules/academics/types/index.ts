export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type AttendanceStatus = 'present' | 'absent' | 'cancelled' | 'not_recorded';

export type AttendanceRiskStatus = 'SAFE' | 'WARNING' | 'CRITICAL' | 'BELOW TARGET';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  professor?: string;
  room?: string;
  targetAttendance: number; // e.g. 75
  color?: string; // hex or Tailwind color
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  subjectId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  room?: string;
  professor?: string;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  timetableSlotId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  room?: string;
  professor?: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface SemesterConfig {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  attendanceRemindersEnabled: boolean;
}

export interface SubjectAttendanceStats {
  subject: Subject;
  attended: number;
  conducted: number;
  cancelled: number;
  totalScheduled: number;
  percentage: number;
  target: number;
  riskStatus: AttendanceRiskStatus;
  statusMessage: string;
  classesNeededToTarget: number;
  classesCanMiss: number;
}
