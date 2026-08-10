import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { WorkoutPlan, Exercise, WorkoutSession } from '../types';
import { getTodayStr, formatDateDisplay } from '../utils/dateUtils';
import {
  Dumbbell,
  Plus,
  Trash2,
  Play,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  TrendingUp,
  History,
  X,
  Sparkles,
} from 'lucide-react';

export function FitnessPage() {
  const {
    workoutPlans,
    workoutSessions,
    addWorkoutPlan,
    deleteWorkoutPlan,
    logWorkoutSession,
    toggleSessionExercise,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'today' | 'plans' | 'history' | 'progression'>('today');

  // Plan Modal state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [exercises, setExercises] = useState<
    { name: string; sets: number; reps: number; weight: number; restSeconds: number; notes: string }[]
  >([
    { name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 60, restSeconds: 90, notes: '' },
  ]);

  // Selected exercise for progression view
  const [selectedProgressionExercise, setSelectedProgressionExercise] = useState<string>('Barbell Bench Press');

  const todayStr = getTodayStr();

  // Find today's session if already started/completed
  const todaySession = workoutSessions.find((s) => s.date === todayStr);

  const handleAddExerciseInput = () => {
    setExercises((prev) => [
      ...prev,
      { name: '', sets: 3, reps: 10, weight: 20, restSeconds: 60, notes: '' },
    ]);
  };

  const handleRemoveExerciseInput = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim()) return;

    const formattedExercises: Exercise[] = exercises
      .filter((ex) => ex.name.trim().length > 0)
      .map((ex, idx) => ({
        id: `ex-${Date.now()}-${idx}`,
        name: ex.name.trim(),
        sets: Number(ex.sets) || 3,
        reps: Number(ex.reps) || 10,
        weight: Number(ex.weight) || 0,
        restSeconds: Number(ex.restSeconds) || 60,
        notes: ex.notes || undefined,
        completed: false,
      }));

    addWorkoutPlan({
      name: planName.trim(),
      description: planDescription.trim() || undefined,
      trainingDays: selectedDays,
      exercises: formattedExercises,
    });

    setIsPlanModalOpen(false);
    setPlanName('');
    setPlanDescription('');
    setSelectedDays([]);
    setExercises([{ name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 60, restSeconds: 90, notes: '' }]);
  };

  const handleStartWorkoutFromPlan = (plan: WorkoutPlan) => {
    const sessionExercises: Exercise[] = plan.exercises.map((e) => ({
      ...e,
      completed: false,
    }));

    logWorkoutSession({
      planId: plan.id,
      planName: plan.name,
      date: todayStr,
      exercises: sessionExercises,
      completed: false,
    });

    setActiveTab('today');
  };

  // Collect distinct exercise names across plans and history
  const allExerciseNames = Array.from(
    new Set(
      workoutSessions
        .flatMap((s) => s.exercises.map((e) => e.name))
        .concat(workoutPlans.flatMap((p) => p.exercises.map((e) => e.name)))
    )
  );

  // Progression history for selected exercise
  const progressionRecords = workoutSessions
    .flatMap((s) =>
      s.exercises
        .filter((e) => e.name.toLowerCase() === selectedProgressionExercise.toLowerCase())
        .map((e) => ({
          date: s.date,
          weight: e.weight,
          reps: e.reps,
          sets: e.sets,
        }))
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif italic text-white font-normal">
            Fitness Command
          </h1>
          <p className="text-[11px] text-white/50 font-mono uppercase tracking-[0.25em] mt-1">
            Workout logs • Progressive overload • Training execution
          </p>
        </div>

        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full shadow-2xl transition cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ CREATE PLAN</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'today'
              ? 'bg-white text-black font-bold'
              : 'text-white/50 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          Today&apos;s Session
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'plans'
              ? 'bg-white text-black font-bold'
              : 'text-white/50 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Plans ({workoutPlans.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white text-black font-bold'
              : 'text-white/50 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <History className="w-4 h-4" />
          History ({workoutSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('progression')}
          className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'progression'
              ? 'bg-white text-black font-bold'
              : 'text-white/50 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Progression
        </button>
      </div>

      {/* TAB 1: TODAY'S WORKOUT */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          {!todaySession ? (
            <div className="p-12 text-center bg-[#121212] border border-white/10 rounded-2xl space-y-4">
              <Dumbbell className="w-10 h-10 text-white/30 mx-auto" />
              <div>
                <h3 className="text-lg font-serif italic text-white font-normal">
                  No workout logged today
                </h3>
                <p className="text-[11px] font-mono uppercase tracking-widest text-white/40 mt-1 max-w-md mx-auto">
                  Select a workout plan or create a new one to begin your session.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('plans')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider rounded-full transition"
                >
                  Choose From Workout Plans
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Active Session • {todaySession.date}
                  </span>
                  <h2 className="text-2xl font-serif italic text-white font-normal mt-1">
                    {todaySession.planName}
                  </h2>
                </div>

                <span
                  className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-full border ${
                    todaySession.completed
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  {todaySession.completed ? '✓ Completed' : 'In Progress'}
                </span>
              </div>

              {/* Exercise Checklist */}
              <div className="space-y-3">
                {todaySession.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`p-4 bg-white/[0.02] border rounded-xl flex items-center justify-between gap-4 transition ${
                      exercise.completed ? 'border-white/5 opacity-50' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <button
                        onClick={() => toggleSessionExercise(todaySession.id, exercise.id)}
                        className="text-white/40 hover:text-white transition cursor-pointer shrink-0"
                      >
                        {exercise.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-white/30" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <h4
                          className={`text-sm font-serif italic ${
                            exercise.completed ? 'line-through text-white/40' : 'text-white'
                          }`}
                        >
                          {exercise.name}
                        </h4>
                        <p className="text-[11px] text-white/50 font-mono mt-0.5 uppercase tracking-wider">
                          {exercise.sets} Sets × {exercise.reps} Reps @{' '}
                          <span className="text-white font-bold">{exercise.weight}kg</span>
                          {exercise.restSeconds ? ` • ${exercise.restSeconds}s rest` : ''}
                        </p>
                        {exercise.notes && (
                          <p className="text-xs text-white/40 italic mt-1 font-sans">{exercise.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WORKOUT PLANS */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workoutPlans.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#121212] border border-white/10 rounded-2xl space-y-3">
              <p className="text-sm font-serif italic text-white/60">No workout plans available.</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Build your first plan to start tracking.</p>
              <button
                onClick={() => setIsPlanModalOpen(true)}
                className="px-6 py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-widest rounded-full transition"
              >
                + Create Plan
              </button>
            </div>
          ) : (
            workoutPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-serif italic text-white">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-xs text-white/60 mt-1 font-sans">{plan.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteWorkoutPlan(plan.id)}
                      className="text-white/40 hover:text-red-400 p-1.5 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {plan.trainingDays && plan.trainingDays.length > 0 && (
                    <div className="flex gap-1.5 mt-3">
                      {plan.trainingDays.map((d) => (
                        <span
                          key={d}
                          className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 bg-white/5 text-white/70 border border-white/10 rounded-full"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Exercises list */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                      Exercises ({plan.exercises.length})
                    </span>
                    {plan.exercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex justify-between items-center text-xs bg-white/[0.02] p-2.5 rounded-xl border border-white/10"
                      >
                        <span className="font-sans text-white/90">{ex.name}</span>
                        <span className="font-mono text-[10px] uppercase text-white/50">
                          {ex.sets} × {ex.reps} @ <strong className="text-white">{ex.weight}kg</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleStartWorkoutFromPlan(plan)}
                  className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Start Session Today</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: WORKOUT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {workoutSessions.length === 0 ? (
            <div className="p-12 text-center bg-[#121212] border border-white/10 rounded-2xl text-white/40 font-mono text-xs uppercase tracking-widest">
              No completed workout sessions logged yet.
            </div>
          ) : (
            workoutSessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-base font-serif italic text-white">
                      {session.planName}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-white/50 uppercase tracking-wider">{formatDateDisplay(session.date)}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {session.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between text-xs"
                    >
                      <span className="text-white/90 font-sans">{ex.name}</span>
                      <span className="font-mono text-[10px] uppercase text-white/50">
                        {ex.weight}kg × {ex.reps} ({ex.sets} sets)
                      </span>
                    </div>
                  ))}
                </div>

                {session.notes && (
                  <p className="text-xs text-white/50 italic bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    &quot;{session.notes}&quot;
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: STRENGTH PROGRESSION */}
      {activeTab === 'progression' && (
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-serif italic text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-white/60" />
                Exercise Progression Records
              </h3>
              <p className="text-[11px] text-white/40 font-mono uppercase tracking-widest mt-0.5">
                Track strength velocity across workouts.
              </p>
            </div>

            {/* Exercise Selector */}
            {allExerciseNames.length > 0 && (
              <select
                value={selectedProgressionExercise}
                onChange={(e) => setSelectedProgressionExercise(e.target.value)}
                className="bg-[#0a0a0a] border border-white/10 text-xs font-mono text-white rounded-full px-4 py-2.5 focus:outline-none"
              >
                {allExerciseNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {progressionRecords.length === 0 ? (
            <p className="text-xs text-white/40 font-mono uppercase tracking-widest text-center p-8">
              No completed workout records for &quot;{selectedProgressionExercise}&quot;.
            </p>
          ) : (
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Logged History ({selectedProgressionExercise})
              </h4>
              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl bg-[#0a0a0a] overflow-hidden">
                {progressionRecords.map((rec, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/50 text-[11px]">{formatDateDisplay(rec.date)}</span>
                    <span className="font-mono text-white text-sm">
                      {rec.weight}kg × {rec.reps} reps
                      <span className="text-xs text-white/40 font-normal ml-2">({rec.sets} sets)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE WORKOUT PLAN MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 bg-[#0a0a0a] border-b border-white/10">
              <h3 className="text-lg font-serif italic text-white font-normal">
                Create Workout Plan
              </h3>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-2 text-white/40 hover:text-white bg-white/5 border border-white/10 rounded-full transition duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g. Push Day - Hypertrophy"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="e.g. Chest, shoulders, triceps focus"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              {/* Dynamic Exercise Inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono">
                    Exercises ({exercises.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExerciseInput}
                    className="text-xs font-mono text-white/70 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Exercise
                  </button>
                </div>

                {exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#0a0a0a] border border-white/10 rounded-xl space-y-3 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Exercise Name (e.g. Bench Press)"
                        value={ex.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExercises((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                          );
                        }}
                        className="flex-1 bg-white/[0.03] border border-white/10 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                      />
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseInput(idx)}
                          className="text-white/40 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-white/40">Sets</span>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setExercises((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, sets: val } : item))
                            );
                          }}
                          className="w-full bg-white/[0.03] border border-white/10 text-xs text-white rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-white/40">Reps</span>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setExercises((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, reps: val } : item))
                            );
                          }}
                          className="w-full bg-white/[0.03] border border-white/10 text-xs text-white rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-white/40">Weight (kg)</span>
                        <input
                          type="number"
                          value={ex.weight}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setExercises((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, weight: val } : item))
                            );
                          }}
                          className="w-full bg-white/[0.03] border border-white/10 text-xs text-white rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-white/40">Rest (sec)</span>
                        <input
                          type="number"
                          value={ex.restSeconds}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setExercises((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, restSeconds: val } : item))
                            );
                          }}
                          className="w-full bg-white/[0.03] border border-white/10 text-xs text-white rounded-lg p-2 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono uppercase tracking-wider rounded-full transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold uppercase tracking-widest rounded-full transition"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
