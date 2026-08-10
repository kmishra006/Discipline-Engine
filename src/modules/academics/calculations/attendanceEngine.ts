import { AttendanceRiskStatus, AttendanceStatus, ClassSession, Subject, SubjectAttendanceStats } from '../types';

/**
 * Calculates raw attendance percentage from attended and conducted counts.
 * Cancelled classes are NOT conducted classes.
 */
export function calculateAttendancePercentage(attended: number, conducted: number): number {
  if (conducted <= 0) return 100;
  const pct = (attended / conducted) * 100;
  return Math.min(100, Math.max(0, pct));
}

/**
 * Returns formatted percentage with 1 decimal place (e.g. 84.0%)
 */
export function formatAttendancePercentage(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

/**
 * Determines attendance risk status based on percentage and target percentage.
 */
export function getAttendanceRiskStatus(percentage: number, target: number = 75): AttendanceRiskStatus {
  if (percentage >= target + 5) {
    return 'SAFE';
  } else if (percentage >= target) {
    return 'WARNING';
  } else if (percentage >= target - 5) {
    return 'CRITICAL';
  } else {
    return 'BELOW TARGET';
  }
}

/**
 * Solves for the minimum number of consecutive classes a student must attend
 * to reach or exceed their target attendance percentage.
 * Formula: (attended + x) / (conducted + x) >= target / 100
 */
export function calculateClassesNeededToTarget(
  attended: number,
  conducted: number,
  target: number = 75
): number {
  if (conducted === 0) return 0;
  const currentPct = (attended / conducted) * 100;
  if (currentPct >= target) return 0;

  if (target >= 100) {
    if (attended < conducted) return Infinity; // Impossible
    return 0;
  }

  const numerator = target * conducted - 100 * attended;
  const denominator = 100 - target;
  if (denominator <= 0) return Infinity;

  const required = Math.ceil(numerator / denominator);
  return Math.max(0, required);
}

/**
 * Solves for the maximum number of consecutive classes a student can miss
 * while remaining at or above their target attendance percentage.
 * Formula: attended / (conducted + x) >= target / 100
 */
export function calculateClassesCanMiss(
  attended: number,
  conducted: number,
  target: number = 75
): number {
  if (conducted === 0) return 0;
  const currentPct = (attended / conducted) * 100;
  if (currentPct < target) return 0;

  if (target <= 0) return Infinity;

  const maxConducted = (attended * 100) / target;
  const allowedMisses = Math.floor(maxConducted - conducted);
  return Math.max(0, allowedMisses);
}

/**
 * Calculates the exact mathematical outcome of attending vs missing the next class.
 * Uses neutral language without encouraging absenteeism.
 */
export function calculateMissNextClassEffect(
  attended: number,
  conducted: number,
  target: number = 75
) {
  const currentPct = calculateAttendancePercentage(attended, conducted);
  const attendNextPct = calculateAttendancePercentage(attended + 1, conducted + 1);
  const missNextPct = calculateAttendancePercentage(attended, conducted + 1);

  let status: 'safe' | 'warning' | 'critical';
  let statement: string;

  if (missNextPct >= target) {
    status = 'safe';
    statement = `If you are absent for the next class, your projected attendance will be ${missNextPct.toFixed(
      1
    )}%, which remains at or above your required target of ${target}%.`;
  } else if (missNextPct >= target - 3) {
    status = 'warning';
    statement = `If you are absent for the next class, your projected attendance will drop to ${missNextPct.toFixed(
      1
    )}%, bringing you near your ${target}% target threshold.`;
  } else {
    status = 'critical';
    statement = `If you are absent for the next class, your projected attendance will drop to ${missNextPct.toFixed(
      1
    )}%, placing you below your required target of ${target}%.`;
  }

  return {
    currentPct,
    attendNextPct,
    missNextPct,
    target,
    canAbsenceMaintainTarget: missNextPct >= target,
    status,
    statement,
  };
}

/**
 * Interactive What-If Simulator calculation.
 */
export function calculateWhatIf(
  currentAttended: number,
  currentConducted: number,
  upcomingCount: number,
  attendUpcomingCount: number
) {
  const missCount = Math.max(0, upcomingCount - attendUpcomingCount);
  const projectedAttended = currentAttended + attendUpcomingCount;
  const projectedConducted = currentConducted + upcomingCount;
  const currentPct = calculateAttendancePercentage(currentAttended, currentConducted);
  const projectedPct = calculateAttendancePercentage(projectedAttended, projectedConducted);

  return {
    currentPct,
    projectedPct,
    projectedAttended,
    projectedConducted,
    missCount,
  };
}

/**
 * Calculates stats for a single subject based on all its sessions.
 */
export function calculateSubjectStats(
  subject: Subject,
  sessions: ClassSession[]
): SubjectAttendanceStats {
  const subjectSessions = sessions.filter((s) => s.subjectId === subject.id);

  let attended = 0;
  let conducted = 0;
  let cancelled = 0;
  let totalScheduled = subjectSessions.length;

  for (const session of subjectSessions) {
    if (session.status === 'present') {
      attended++;
      conducted++;
    } else if (session.status === 'absent') {
      conducted++;
    } else if (session.status === 'cancelled') {
      cancelled++;
    }
  }

  const percentage = calculateAttendancePercentage(attended, conducted);
  const target = subject.targetAttendance || 75;
  const riskStatus = getAttendanceRiskStatus(percentage, target);

  let statusMessage = '';
  if (riskStatus === 'SAFE') {
    const canMiss = calculateClassesCanMiss(attended, conducted, target);
    statusMessage = `Safe margin (${canMiss} buffer classes)`;
  } else if (riskStatus === 'WARNING') {
    statusMessage = 'Near target threshold';
  } else if (riskStatus === 'CRITICAL') {
    const needed = calculateClassesNeededToTarget(attended, conducted, target);
    statusMessage = `Critical: Need ${needed} consecutive classes`;
  } else {
    const needed = calculateClassesNeededToTarget(attended, conducted, target);
    statusMessage = `Below target: Need ${needed} consecutive classes`;
  }

  const classesNeededToTarget = calculateClassesNeededToTarget(attended, conducted, target);
  const classesCanMiss = calculateClassesCanMiss(attended, conducted, target);

  return {
    subject,
    attended,
    conducted,
    cancelled,
    totalScheduled,
    percentage,
    target,
    riskStatus,
    statusMessage,
    classesNeededToTarget,
    classesCanMiss,
  };
}

/**
 * Calculates overall attendance across all subjects and sessions.
 */
export function calculateOverallAttendance(sessions: ClassSession[]) {
  let totalAttended = 0;
  let totalConducted = 0;
  let totalCancelled = 0;
  let totalScheduled = sessions.length;

  for (const session of sessions) {
    if (session.status === 'present') {
      totalAttended++;
      totalConducted++;
    } else if (session.status === 'absent') {
      totalConducted++;
    } else if (session.status === 'cancelled') {
      totalCancelled++;
    }
  }

  const overallPercentage = calculateAttendancePercentage(totalAttended, totalConducted);

  return {
    totalAttended,
    totalConducted,
    totalCancelled,
    totalScheduled,
    overallPercentage,
  };
}
