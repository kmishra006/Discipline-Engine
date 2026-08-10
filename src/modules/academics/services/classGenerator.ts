import { ClassSession, SemesterConfig, TimetableSlot, DayOfWeek } from '../types';
import { format, parseISO, addDays, isBefore, isAfter, isSameDay } from 'date-fns';

const DAY_MAP: Record<number, DayOfWeek> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

/**
 * Generates or syncs ClassSessions for a semester date range based on weekly TimetableSlots.
 * Preserves historical/already recorded class sessions!
 */
export function generateSemesterClassSessions(
  timetableSlots: TimetableSlot[],
  semesterConfig: SemesterConfig,
  existingSessions: ClassSession[] = []
): ClassSession[] {
  if (!semesterConfig.startDate || !semesterConfig.endDate) {
    return existingSessions;
  }

  const start = parseISO(semesterConfig.startDate);
  const end = parseISO(semesterConfig.endDate);

  if (isAfter(start, end)) return existingSessions;

  // Map existing sessions by unique key: `${subjectId}_${date}_${startTime}`
  const existingMap = new Map<string, ClassSession>();
  for (const s of existingSessions) {
    existingMap.set(`${s.subjectId}_${s.date}_${s.startTime}`, s);
  }

  const generatedSessions: ClassSession[] = [];
  let curr = start;

  while (isBefore(curr, end) || isSameDay(curr, end)) {
    const dayIndex = curr.getDay(); // 0 = Sun, 1 = Mon ...
    const dayName = DAY_MAP[dayIndex];
    const dateStr = format(curr, 'yyyy-MM-dd');

    // Find slots matching this day
    const matchingSlots = timetableSlots.filter((slot) => slot.dayOfWeek === dayName);

    for (const slot of matchingSlots) {
      const key = `${slot.subjectId}_${dateStr}_${slot.startTime}`;
      const existing = existingMap.get(key);

      if (existing) {
        // Keep existing session with its recorded status and notes
        generatedSessions.push({
          ...existing,
          endTime: slot.endTime, // Keep end time synced
          room: slot.room || existing.room,
          professor: slot.professor || existing.professor,
          timetableSlotId: slot.id,
        });
      } else {
        // Create new session
        generatedSessions.push({
          id: `sess_${slot.subjectId}_${dateStr}_${slot.startTime.replace(':', '')}`,
          subjectId: slot.subjectId,
          timetableSlotId: slot.id,
          date: dateStr,
          startTime: slot.startTime,
          endTime: slot.endTime,
          room: slot.room,
          professor: slot.professor,
          status: 'not_recorded',
        });
      }
    }

    curr = addDays(curr, 1);
  }

  // Preserve any historical sessions that were already recorded outside the current range or for removed slots
  const newlyGeneratedKeys = new Set(
    generatedSessions.map((s) => `${s.subjectId}_${s.date}_${s.startTime}`)
  );

  for (const prev of existingSessions) {
    const key = `${prev.subjectId}_${prev.date}_${prev.startTime}`;
    if (!newlyGeneratedKeys.has(key)) {
      // If it was already recorded (present, absent, cancelled), PRESERVE IT!
      if (prev.status !== 'not_recorded') {
        generatedSessions.push(prev);
      }
    }
  }

  // Sort sessions chronologically by date and start time
  return generatedSessions.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}
