import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Skill, SubSkill } from '../types';
import { getTodayStr, formatDateDisplay } from '../utils/dateUtils';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  X,
  Target,
  Send,
} from 'lucide-react';

export function SkillsPage() {
  const {
    skills,
    learningEntries,
    addSkill,
    deleteSkill,
    toggleSubSkill,
    addLearningEntry,
  } = useStore();

  // New Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [subSkillsText, setSubSkillsText] = useState('');

  // Daily Learning Journal form state
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || '');
  const [journalContent, setJournalContent] = useState('');

  const todayStr = getTodayStr();

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    const parsedSubSkills: SubSkill[] = subSkillsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: line,
        completed: false,
      }));

    addSkill({
      name: skillName.trim(),
      description: skillDescription.trim() || undefined,
      targetGoal: targetGoal.trim() || undefined,
      subSkills: parsedSubSkills,
    });

    setIsSkillModalOpen(false);
    setSkillName('');
    setSkillDescription('');
    setTargetGoal('');
    setSubSkillsText('');
  };

  const handleSaveJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    const matchedSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

    addLearningEntry({
      skillId: matchedSkill ? matchedSkill.id : 'custom',
      skillName: matchedSkill ? matchedSkill.name : 'General Learning',
      date: todayStr,
      content: journalContent.trim(),
    });

    setJournalContent('');
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif italic text-white font-normal">
            Skills & Learning Journal
          </h1>
          <p className="text-[11px] text-white/50 font-mono uppercase tracking-[0.25em] mt-1">
            Track skill roadmaps • Sub-skills • Daily study logs
          </p>
        </div>

        <button
          onClick={() => setIsSkillModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full shadow-2xl transition cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ NEW SKILL</span>
        </button>
      </div>

      {/* 1. DAILY LEARNING JOURNAL WRITER CARD */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white">
              <Sparkles className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <h3 className="text-lg font-serif italic text-white font-normal">
                What did I learn today?
              </h3>
              <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest mt-0.5">
                Reinforce memory retention by documenting core insights
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-white/60 tracking-wider">{todayStr}</span>
        </div>

        <form onSubmit={handleSaveJournalEntry} className="space-y-4">
          {skills.length > 0 && (
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                Select Associated Skill
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="bg-[#0a0a0a] border border-white/10 text-xs text-white font-mono rounded-full px-4 py-2.5 focus:outline-none w-full sm:w-auto"
              >
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.progressPercent}%)
                  </option>
                ))}
              </select>
            </div>
          )}

          <textarea
            rows={3}
            required
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="Document key insights, algorithms, or concepts mastered today..."
            className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-xl p-4 focus:outline-none placeholder-white/30 leading-relaxed font-mono"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!journalContent.trim()}
              className="px-6 py-2.5 bg-white hover:bg-neutral-200 disabled:opacity-30 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-xl"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
              <span>Save Journal Entry</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. ACTIVE SKILLS ROADMAP GRID */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
          Active Skills ({skills.length})
        </h3>

        {skills.length === 0 ? (
          <div className="p-12 text-center bg-[#121212] border border-white/10 rounded-2xl space-y-3">
            <p className="text-sm font-serif italic text-white/60">No active skill roadmaps yet.</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Select a skill and start building your mastery.</p>
            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="px-6 py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-widest rounded-full transition"
            >
              + New Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-serif italic text-white">{skill.name}</h4>
                      {skill.description && (
                        <p className="text-xs text-white/60 mt-0.5 font-sans">{skill.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="text-white/40 hover:text-red-400 p-1.5 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {skill.targetGoal && (
                    <p className="text-xs font-mono text-white/70 bg-white/[0.02] p-3 rounded-xl border border-white/10 mt-3 flex items-center gap-2">
                      <Target className="w-3 h-3 text-white/50 shrink-0" />
                      Goal: {skill.targetGoal}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider">Mastery Progress</span>
                      <span className="text-white font-bold">{skill.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#0a0a0a] h-2 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-skills checklist */}
                  {skill.subSkills && skill.subSkills.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                        Sub-Skills ({skill.subSkills.filter((s) => s.completed).length}/{skill.subSkills.length})
                      </span>
                      <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                        {skill.subSkills.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubSkill(skill.id, sub.id)}
                            className="flex items-center gap-2.5 p-2.5 bg-white/[0.02] rounded-xl border border-white/10 hover:border-white/20 transition cursor-pointer text-xs"
                          >
                            {sub.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-white/30 shrink-0" />
                            )}
                            <span
                              className={sub.completed ? 'line-through text-white/40' : 'text-white/90 font-sans'}
                            >
                              {sub.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. CHRONOLOGICAL LEARNING JOURNAL HISTORY */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
          Journal Timeline ({learningEntries.length})
        </h3>

        {learningEntries.length === 0 ? (
          <div className="p-8 text-center bg-[#121212] border border-white/10 rounded-2xl text-white/40 font-mono text-xs uppercase tracking-widest">
            No learning journal entries yet.
          </div>
        ) : (
          <div className="space-y-3">
            {learningEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#121212] border border-white/10 rounded-2xl p-5 shadow-xl space-y-2 relative"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-serif italic text-white">{entry.skillName}</span>
                  <span className="text-xs font-mono text-white/40 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-white/30" />
                    {formatDateDisplay(entry.date)}
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-mono whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NEW SKILL MODAL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 bg-[#0a0a0a] border-b border-white/10">
              <h3 className="text-lg font-serif italic text-white font-normal">
                New Skill Roadmap
              </h3>
              <button
                onClick={() => setIsSkillModalOpen(false)}
                className="p-2 text-white/40 hover:text-white bg-white/5 border border-white/10 rounded-full transition duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Java & Spring Boot"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={skillDescription}
                  onChange={(e) => setSkillDescription(e.target.value)}
                  placeholder="e.g. Core Java, Multithreading, REST APIs"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Target Goal
                </label>
                <input
                  type="text"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  placeholder="e.g. Build reactive backend for project"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Sub-skills (One per line)
                </label>
                <textarea
                  rows={4}
                  value={subSkillsText}
                  onChange={(e) => setSubSkillsText(e.target.value)}
                  placeholder="Variables & Control Flow&#10;OOP Principles&#10;Collections & Generics&#10;Multithreading"
                  className="w-full bg-white/[0.03] border border-white/10 text-xs text-white rounded-xl p-4 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono uppercase tracking-wider rounded-full transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold uppercase tracking-widest rounded-full transition"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
