import {
  calculateAttendancePercentage,
  getAttendanceRiskStatus,
  calculateClassesNeededToTarget,
  calculateClassesCanMiss,
  calculateMissNextClassEffect,
  calculateWhatIf,
  calculateOverallAttendance,
  calculateSubjectStats,
} from './attendanceEngine';
import { Subject, ClassSession } from '../types';

export function runAttendanceEngineTests() {
  const results: { name: string; passed: boolean; details?: string }[] = [];

  const assertEqual = (name: string, actual: any, expected: any) => {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    results.push({
      name,
      passed,
      details: passed ? undefined : `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    });
  };

  const assertAlmostEqual = (name: string, actual: number, expected: number, precision: number = 0.01) => {
    const passed = Math.abs(actual - expected) < precision;
    results.push({
      name,
      passed,
      details: passed ? undefined : `Expected approx ${expected}, got ${actual}`,
    });
  };

  // Test 1: 50 conducted, 40 attended = 80%
  assertAlmostEqual('50 conducted, 40 attended = 80%', calculateAttendancePercentage(40, 50), 80.0);

  // Test 2: 42 conducted, 36 attended = 85.714%
  assertAlmostEqual('42 conducted, 36 attended = 85.714%', calculateAttendancePercentage(36, 42), 85.714);

  // Test 3: 0 conducted = 100%
  assertEqual('0 conducted = 100%', calculateAttendancePercentage(0, 0), 100);

  // Test 4: 0% attendance (0/10)
  assertEqual('0/10 = 0%', calculateAttendancePercentage(0, 10), 0);

  // Test 5: 100% attendance (10/10)
  assertEqual('10/10 = 100%', calculateAttendancePercentage(10, 10), 100);

  // Test 6: Risk status thresholds
  assertEqual('82% vs 75% target = SAFE', getAttendanceRiskStatus(82, 75), 'SAFE');
  assertEqual('76% vs 75% target = WARNING', getAttendanceRiskStatus(76, 75), 'WARNING');
  assertEqual('72% vs 75% target = CRITICAL', getAttendanceRiskStatus(72, 75), 'CRITICAL');
  assertEqual('65% vs 75% target = BELOW TARGET', getAttendanceRiskStatus(65, 75), 'BELOW TARGET');

  // Test 7: Classes needed to reach target
  // Current: 35/50 = 70%, Target: 75%
  // Formula: (35 + x) / (50 + x) >= 0.75 => 35 + x >= 37.5 + 0.75x => 0.25x >= 2.5 => x >= 10
  assertEqual('Classes needed to go from 70% (35/50) to 75%', calculateClassesNeededToTarget(35, 50, 75), 10);

  // Check result after 10 classes: (35+10)/(50+10) = 45/60 = 75%
  assertAlmostEqual('Verification: 45/60 = 75%', calculateAttendancePercentage(45, 60), 75.0);

  // Test 8: Classes can miss while staying above target
  // Current: 44/50 = 88%, Target: 75%
  // Formula: 44 / (50 + x) >= 0.75 => 50 + x <= 44 / 0.75 = 58.66 => x <= 8.66 => 8 classes
  assertEqual('Classes can miss from 88% (44/50) with 75% target', calculateClassesCanMiss(44, 50, 75), 8);

  // Verification after 8 misses: 44 / (50 + 8) = 44 / 58 = 75.86% >= 75%
  assertAlmostEqual('Verification after 8 misses = 75.86%', calculateAttendancePercentage(44, 58), 75.86);

  // Test 9: What-if simulation
  const whatIf = calculateWhatIf(40, 50, 10, 8); // 40/50 current, 10 upcoming (attend 8, miss 2)
  assertAlmostEqual('What-If current = 80%', whatIf.currentPct, 80.0);
  assertAlmostEqual('What-If projected = 80%', whatIf.projectedPct, 80.0); // (40+8)/(50+10) = 48/60 = 80%

  // Test 10: Cancelled classes do not count as conducted
  const dummySubject: Subject = {
    id: 'sub1',
    name: 'DBMS',
    targetAttendance: 75,
    createdAt: new Date().toISOString(),
  };

  const sessions: ClassSession[] = [
    ...Array(40).fill(null).map((_, i) => ({
      id: `p_${i}`,
      subjectId: 'sub1',
      date: '2026-08-01',
      startTime: '09:00',
      endTime: '10:00',
      status: 'present' as const,
    })),
    ...Array(8).fill(null).map((_, i) => ({
      id: `a_${i}`,
      subjectId: 'sub1',
      date: '2026-08-02',
      startTime: '09:00',
      endTime: '10:00',
      status: 'absent' as const,
    })),
    ...Array(2).fill(null).map((_, i) => ({
      id: `c_${i}`,
      subjectId: 'sub1',
      date: '2026-08-03',
      startTime: '09:00',
      endTime: '10:00',
      status: 'cancelled' as const,
    })),
  ];

  const stats = calculateSubjectStats(dummySubject, sessions);
  assertEqual('Attended count = 40', stats.attended, 40);
  assertEqual('Conducted count = 48 (not 50)', stats.conducted, 48);
  assertEqual('Cancelled count = 2', stats.cancelled, 2);
  assertAlmostEqual('Percentage = 83.33%', stats.percentage, 83.33);

  const passedCount = results.filter((r) => r.passed).length;
  console.log(`[Attendance Engine Unit Tests] Passed ${passedCount}/${results.length}`);
  return {
    total: results.length,
    passed: passedCount,
    allPassed: passedCount === results.length,
    results,
  };
}
