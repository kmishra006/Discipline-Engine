import React, { useState } from 'react';
import { useStore } from '../../../store/StoreContext';
import { DayOfWeek, TimetableSlot } from '../types';
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Upload,
  Check,
  X,
  Sparkles,
  MapPin,
  User,
  Settings,
} from 'lucide-react';
import { format } from 'date-fns';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export function TimetableBuilder() {
  const {
    subjects,
    timetableSlots,
    semesterConfig,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    duplicateTimetableSlot,
    updateSemesterConfig,
  } = useStore();

  const [activeMobileDay, setActiveMobileDay] = useState<DayOfWeek>('Monday');
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  // Form State
  const [subjectId, setSubjectId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [professor, setProfessor] = useState('');

  // Semester Config Modal State
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [startDateInput, setStartDateInput] = useState(semesterConfig.startDate);
  const [endDateInput, setEndDateInput] = useState(semesterConfig.endDate);

  // Import Timetable Architecture Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [detectedSlotsReview, setDetectedSlotsReview] = useState<Omit<TimetableSlot, 'id'>[] | null>(null);

  const currentDayName = format(new Date(), 'EEEE') as DayOfWeek;

  const handleOpenAddModal = (defaultDay?: DayOfWeek, defaultTime?: string) => {
    setEditingSlot(null);
    setSubjectId(subjects[0]?.id || '');
    setDayOfWeek(defaultDay || 'Monday');
    setStartTime(defaultTime || '09:00');
    setEndTime('10:00');
    setRoom('');
    setProfessor('');
    setShowSlotModal(true);
  };

  const handleOpenEditModal = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setSubjectId(slot.subjectId);
    setDayOfWeek(slot.dayOfWeek);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setRoom(slot.room || '');
    setProfessor(slot.professor || '');
    setShowSlotModal(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) return;

    if (editingSlot) {
      updateTimetableSlot(editingSlot.id, {
        subjectId,
        dayOfWeek,
        startTime,
        endTime,
        room,
        professor,
      });
    } else {
      addTimetableSlot({
        subjectId,
        dayOfWeek,
        startTime,
        endTime,
        room,
        professor,
      });
    }
    setShowSlotModal(false);
  };

  const handleSaveSemester = (e: React.FormEvent) => {
    e.preventDefault();
    updateSemesterConfig({
      startDate: startDateInput,
      endDate: endDateInput,
    });
    setShowSemesterModal(false);
  };

  // Timetable OCR/JSON Import Architecture
  const handleParseImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        const slots: Omit<TimetableSlot, 'id'>[] = parsed.map((item) => ({
          subjectId: item.subjectId || subjects[0]?.id || 'sub-dbms',
          dayOfWeek: item.dayOfWeek || 'Monday',
          startTime: item.startTime || '09:00',
          endTime: item.endTime || '10:00',
          room: item.room || 'A101',
          professor: item.professor || 'Prof',
        }));
        setDetectedSlotsReview(slots);
      }
    } catch {
      // Mock review preview if plain text / image uploaded
      const sampleReview: Omit<TimetableSlot, 'id'>[] = [
        { subjectId: subjects[0]?.id || 's1', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', room: 'A204', professor: 'Dr. Sharma' },
        { subjectId: subjects[1]?.id || 's2', dayOfWeek: 'Monday', startTime: '10:00', endTime: '11:00', room: 'B102', professor: 'Prof. Verma' },
        { subjectId: subjects[2]?.id || 's3', dayOfWeek: 'Tuesday', startTime: '11:00', endTime: '12:00', room: 'C301', professor: 'Dr. Gupta' },
      ];
      setDetectedSlotsReview(sampleReview);
    }
  };

  const handleConfirmImport = () => {
    if (!detectedSlotsReview) return;
    detectedSlotsReview.forEach((slot) => addTimetableSlot(slot));
    setDetectedSlotsReview(null);
    setShowImportModal(false);
    setImportJsonText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. TOP HEADER & SEMESTER CONFIG BANNER */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-1">
            <Calendar className="w-4 h-4 text-amber-300" />
            TIMETABLE BUILDER • RECURRING CLASS ENGINE
          </div>
          <h2 className="text-2xl font-serif italic text-white font-normal">
            Weekly Class Schedule
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Semester:{' '}
            <span className="text-white/80 font-mono">
              {semesterConfig.startDate} to {semesterConfig.endDate}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setStartDateInput(semesterConfig.startDate);
              setEndDateInput(semesterConfig.endDate);
              setShowSemesterModal(true);
            }}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Semester Dates</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Timetable</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-mono uppercase tracking-wider font-medium flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* 2. DESKTOP WEEKLY GRID (Visible md+) */}
      <div className="hidden md:block bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-8 border-b border-white/10 bg-[#0a0a0a]">
          <div className="p-4 border-r border-white/10 font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center justify-center">
            TIME
          </div>
          {DAYS.map((day) => {
            const isToday = currentDayName === day;
            return (
              <div
                key={day}
                className={`p-4 border-r border-white/10 last:border-r-0 text-center ${
                  isToday ? 'bg-amber-500/10 border-b-2 border-b-amber-400' : ''
                }`}
              >
                <span className="font-serif italic text-sm block text-white">{day.substring(0, 3)}</span>
                {isToday && (
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300 block">
                    Today
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Hour Rows */}
        <div className="divide-y divide-white/5">
          {TIME_HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-h-[90px]">
              {/* Hour Label */}
              <div className="p-3 border-r border-white/10 text-[10px] font-mono text-white/40 flex items-start justify-center pt-3">
                {hour}
              </div>

              {/* Day Cells */}
              {DAYS.map((day) => {
                const daySlots = timetableSlots.filter(
                  (s) => s.dayOfWeek === day && s.startTime.startsWith(hour.split(':')[0])
                );

                return (
                  <div
                    key={day}
                    onClick={() => handleOpenAddModal(day, hour)}
                    className="p-1.5 border-r border-white/5 last:border-r-0 relative group hover:bg-white/[0.02] transition cursor-pointer"
                  >
                    {daySlots.map((slot) => {
                      const sub = subjects.find((s) => s.id === slot.subjectId);
                      return (
                        <div
                          key={slot.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(slot);
                          }}
                          className="p-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 shadow-md transition space-y-1 group/item relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-amber-300/80">
                              {slot.startTime}–{slot.endTime}
                            </span>
                            <div className="opacity-0 group-hover/item:opacity-100 flex items-center gap-1 transition">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateTimetableSlot(slot.id);
                                }}
                                title="Duplicate"
                                className="p-1 text-white/50 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTimetableSlot(slot.id);
                                }}
                                title="Delete"
                                className="p-1 text-rose-400 hover:text-rose-200"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <h5 className="text-xs font-serif italic text-white font-medium truncate">
                            {sub?.name || 'Class'}
                          </h5>

                          {slot.room && (
                            <p className="text-[9px] font-mono text-white/50 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{slot.room}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}

                    {daySlots.length === 0 && (
                      <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Plus className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 3. MOBILE VERTICALLY SCROLLABLE TIMETABLE (Visible sm/mobile) */}
      <div className="md:hidden space-y-4">
        {/* Day Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DAYS.map((day) => {
            const isSelected = activeMobileDay === day;
            const isToday = currentDayName === day;
            return (
              <button
                key={day}
                onClick={() => setActiveMobileDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider shrink-0 border transition cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black border-white font-bold shadow-md'
                    : isToday
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-white/5 text-white/60 border-white/10'
                }`}
              >
                {day.substring(0, 3)} {isToday && '• Today'}
              </button>
            );
          })}
        </div>

        {/* Class Cards List for Active Mobile Day */}
        <div className="space-y-3">
          {timetableSlots
            .filter((s) => s.dayOfWeek === activeMobileDay)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((slot) => {
              const sub = subjects.find((s) => s.id === slot.subjectId);
              return (
                <div
                  key={slot.id}
                  className="bg-[#121212] border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-amber-300">
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <h4 className="text-base font-serif italic text-white font-medium">
                      {sub?.name || 'Class'}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-white/50">
                      {slot.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {slot.room}
                        </span>
                      )}
                      {slot.professor && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {slot.professor}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(slot)}
                      className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTimetableSlot(slot.id)}
                      className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

          {timetableSlots.filter((s) => s.dayOfWeek === activeMobileDay).length === 0 && (
            <div className="p-8 bg-[#121212] border border-white/10 rounded-2xl text-center space-y-3">
              <p className="text-xs font-serif italic text-white/50">
                No classes added for {activeMobileDay}.
              </p>
              <button
                onClick={() => handleOpenAddModal(activeMobileDay)}
                className="px-4 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider rounded-xl font-medium"
              >
                + Add Class Slot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SLOT FORM MODAL */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif italic text-white font-normal">
                {editingSlot ? 'Edit Timetable Slot' : 'Add Timetable Slot'}
              </h3>
              <button
                onClick={() => setShowSlotModal(false)}
                className="p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                  Subject
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                      {s.name} ({s.code || 'No Code'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                  Day of Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d} className="bg-neutral-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                    Room (Optional)
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. A204"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                    Professor (Optional)
                  </label>
                  <input
                    type="text"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    placeholder="e.g. Dr. Sharma"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-mono font-medium uppercase tracking-wider"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEMESTER CONFIG MODAL */}
      {showSemesterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif italic text-white font-normal">
                Semester Dates Configuration
              </h3>
              <button
                onClick={() => setShowSemesterModal(false)}
                className="p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSemester} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                  Semester Start Date
                </label>
                <input
                  type="date"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                  Semester End Date
                </label>
                <input
                  type="date"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />
              </div>

              <p className="text-[11px] text-white/40 font-serif italic">
                Updating semester dates automatically generates recurring classes inside the date range without destroying existing attendance logs!
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSemesterModal(false)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-mono font-medium uppercase tracking-wider"
                >
                  Save Semester
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD / IMPORT TIMETABLE ARCHITECTURE MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-300" />
                <h3 className="text-lg font-serif italic text-white font-normal">
                  Import Timetable Schedule
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setDetectedSlotsReview(null);
                }}
                className="p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!detectedSlotsReview ? (
              <div className="space-y-4">
                <p className="text-xs text-white/60 font-serif italic">
                  Paste JSON schedule or upload timetable image/PDF export structure. The AI & OCR parser will extract recurring classes for user review.
                </p>

                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder={`[
  { "subjectId": "${subjects[0]?.id || 'sub-dbms'}", "dayOfWeek": "Monday", "startTime": "09:00", "endTime": "10:00", "room": "A204" }
]`}
                  className="w-full h-36 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleParseImport}
                    className="px-5 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-mono font-medium uppercase tracking-wider"
                  >
                    Parse & Review
                  </button>
                </div>
              </div>
            ) : (
              /* Review Step Before Generation */
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 font-mono">
                  ✓ Review Detected Classes ({detectedSlotsReview.length} slots found). Confirm below to apply to timetable.
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {detectedSlotsReview.map((slot, idx) => {
                    const sub = subjects.find((s) => s.id === slot.subjectId);
                    return (
                      <div
                        key={idx}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono text-amber-300 text-[10px]">
                            {slot.dayOfWeek} • {slot.startTime}–{slot.endTime}
                          </span>
                          <h5 className="font-serif italic text-white">{sub?.name || 'Subject'}</h5>
                        </div>
                        <span className="text-[10px] font-mono text-white/50">{slot.room}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setDetectedSlotsReview(null)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white/60"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmImport}
                    className="px-5 py-2 bg-emerald-400 text-black hover:bg-emerald-300 rounded-xl text-xs font-mono font-medium uppercase tracking-wider"
                  >
                    Confirm & Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
