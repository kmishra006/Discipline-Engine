import React, { useState } from 'react';
import { useStore } from '../../../store/StoreContext';
import { Subject } from '../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  User,
  MapPin,
  Target,
  X,
  History,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { calculateSubjectStats } from '../calculations/attendanceEngine';

interface Props {
  selectedSubjectModal: Subject | null;
  onCloseSubjectModal: () => void;
}

export function SubjectsManager({ selectedSubjectModal, onCloseSubjectModal }: Props) {
  const { subjects, classSessions, addSubject, updateSubject, deleteSubject } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [room, setRoom] = useState('');
  const [targetAttendance, setTargetAttendance] = useState(75);
  const [color, setColor] = useState('#F59E0B');

  const handleOpenAddModal = () => {
    setEditingSubject(null);
    setCode('');
    setName('');
    setProfessor('');
    setRoom('');
    setTargetAttendance(75);
    setColor('#F59E0B');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setCode(sub.code || '');
    setName(sub.name);
    setProfessor(sub.professor || '');
    setRoom(sub.room || '');
    setTargetAttendance(sub.targetAttendance);
    setColor(sub.color || '#F59E0B');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        code,
        name,
        professor,
        room,
        targetAttendance,
        color,
      });
    } else {
      addSubject({
        code,
        name,
        professor,
        room,
        targetAttendance,
        color,
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-1">
            <BookOpen className="w-4 h-4 text-amber-300" />
            SUBJECT MANAGEMENT • COURSE CATALOG
          </div>
          <h2 className="text-2xl font-serif italic text-white font-normal">
            Academic Subjects
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Configure courses, professors, rooms, and custom attendance targets.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-mono uppercase tracking-wider font-medium flex items-center gap-2 shadow-lg transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* SUBJECTS CARDS GRID */}
      {subjects.length === 0 ? (
        <div className="p-12 bg-[#121212] border border-white/10 rounded-2xl text-center space-y-3">
          <BookOpen className="w-8 h-8 text-white/20 mx-auto" />
          <p className="text-sm font-serif italic text-white/50">
            No subjects added yet. Add subjects to manage your timetable and attendance targets!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const stats = calculateSubjectStats(subject, classSessions);
            return (
              <div
                key={subject.id}
                className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      {subject.code || 'COURSE'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(subject)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition"
                        title="Edit Subject"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-300 transition"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif italic text-white">{subject.name}</h3>

                  <div className="space-y-1 text-xs text-white/50 pt-1">
                    {subject.professor && (
                      <p className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-white/30" />
                        <span>Prof: {subject.professor}</span>
                      </p>
                    )}
                    {subject.room && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-white/30" />
                        <span>Room: {subject.room}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-white/30" />
                      <span>Target: {subject.targetAttendance}% Attendance</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 block">CURRENT</span>
                    <span className="text-2xl font-serif italic text-white">
                      {stats.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      stats.riskStatus === 'SAFE'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}
                  >
                    {stats.riskStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT SUBJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif italic text-white font-normal">
                {editingSubject ? 'Edit Subject' : 'Add Subject'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CS101"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                    Target % (e.g. 75, 80)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={targetAttendance}
                    onChange={(e) => setTargetAttendance(parseInt(e.target.value) || 75)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                    Professor Name
                  </label>
                  <input
                    type="text"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    placeholder="e.g. Dr. A. Sharma"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Lab 3 / Room 204"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-mono font-medium uppercase tracking-wider"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED SUBJECT MODAL */}
      {selectedSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block">
                  {selectedSubjectModal.code || 'SUBJECT DETAILS'}
                </span>
                <h3 className="text-2xl font-serif italic text-white font-normal">
                  {selectedSubjectModal.name}
                </h3>
              </div>
              <button onClick={onCloseSubjectModal} className="p-1 text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subject Stats */}
            {(() => {
              const stats = calculateSubjectStats(selectedSubjectModal, classSessions);
              const subjectSessions = classSessions.filter(
                (s) => s.subjectId === selectedSubjectModal.id
              );
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                      <span className="text-[9px] font-mono text-white/40 block mb-1">
                        ATTENDANCE
                      </span>
                      <span className="text-2xl font-serif italic text-white">
                        {stats.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                      <span className="text-[9px] font-mono text-white/40 block mb-1">
                        ATTENDED / CONDUCTED
                      </span>
                      <span className="text-xl font-serif italic text-white">
                        {stats.attended} / {stats.conducted}
                      </span>
                    </div>

                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                      <span className="text-[9px] font-mono text-white/40 block mb-1">TARGET</span>
                      <span className="text-2xl font-serif italic text-amber-200">
                        {stats.target}%
                      </span>
                    </div>
                  </div>

                  {/* Class History for this subject */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white/60">
                      CLASS SESSION LOGS ({subjectSessions.length})
                    </h4>
                    <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
                      {subjectSessions.map((sess) => (
                        <div
                          key={sess.id}
                          className="py-2.5 px-2 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono text-white/80">{sess.date}</span>
                            <span className="text-white/40 text-[10px] ml-2">
                              {sess.startTime} - {sess.endTime}
                            </span>
                          </div>
                          <span
                            className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                              sess.status === 'present'
                                ? 'text-emerald-300'
                                : sess.status === 'absent'
                                ? 'text-rose-300'
                                : 'text-amber-300'
                            }`}
                          >
                            {sess.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
