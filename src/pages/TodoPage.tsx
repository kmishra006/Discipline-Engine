import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { TaskCategory, TaskPriority, Task } from '../types';
import { getTodayStr } from '../utils/dateUtils';
import {
  Plus,
  Search,
  CheckSquare,
  Trash2,
  Calendar,
  Clock,
  X,
  Edit2,
  CheckCircle2,
  Circle,
} from 'lucide-react';

const CATEGORIES: TaskCategory[] = ['Study', 'College', 'Work', 'Fitness', 'Personal', 'Other'];
const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export function TodoPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, toggleTaskSubtask } = useStore();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Study');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [subtasksText, setSubtasksText] = useState('');

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDate(getTodayStr());
    setTime('');
    setCategory('Study');
    setPriority('Medium');
    setSubtasksText('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setDate(task.date || getTodayStr());
    setTime(task.time || '');
    setCategory(task.category);
    setPriority(task.priority);
    setSubtasksText(task.subtasks ? task.subtasks.map((s) => s.title).join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedSubtasks = subtasksText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        title: line,
        completed: false,
      }));

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        time: time || undefined,
        category,
        priority,
        subtasks: parsedSubtasks.length > 0 ? parsedSubtasks : editingTask.subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        time: time || undefined,
        category,
        priority,
        completed: false,
        subtasks: parsedSubtasks,
      });
    }

    setIsModalOpen(false);
  };

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    if (filterStatus === 'active' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif italic text-white font-normal">
            To-Do Management
          </h1>
          <p className="text-[11px] text-white/50 font-mono uppercase tracking-[0.25em] mt-1">
            Organize priorities • Auto-synchronized to calendar
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full shadow-2xl transition cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ ADD TASK</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search task entries..."
              className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-full pl-11 pr-4 py-3 focus:outline-none placeholder-white/30"
            />
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-full w-full md:w-auto shrink-0">
            {(['all', 'active', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`flex-1 md:flex-none px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-full transition ${
                  filterStatus === st
                    ? 'bg-white text-black font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterCategory('All')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest shrink-0 transition ${
              filterCategory === 'All'
                ? 'bg-white text-black font-bold'
                : 'bg-white/[0.03] text-white/60 border border-white/10 hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = tasks.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest shrink-0 transition ${
                  filterCategory === cat
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/[0.03] text-white/60 border border-white/10 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#121212] border border-white/10 rounded-2xl space-y-2">
            <p className="text-sm font-serif italic text-white/60">No task records found.</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Click + ADD TASK above to create your targets.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 bg-[#121212] border rounded-2xl transition-all shadow-xl ${
                task.completed ? 'border-white/5 opacity-50' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 text-white/40 hover:text-white transition cursor-pointer shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/30" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-1.5">
                    <h3
                      className={`text-base font-serif italic ${
                        task.completed ? 'line-through text-white/40' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-white/60 leading-relaxed font-sans">{task.description}</p>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        <Calendar className="w-3 h-3 text-white/40" />
                        {task.date}
                      </span>

                      {task.time && (
                        <span className="flex items-center gap-1.5 text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                          <Clock className="w-3 h-3 text-white/40" />
                          {task.time}
                        </span>
                      )}

                      <span className="bg-white/10 text-white/70 px-3 py-1 rounded-full border border-white/10">
                        {task.category}
                      </span>

                      <span className="font-bold px-3 py-1 rounded-full bg-white/15 text-white border border-white/10">
                        {task.priority}
                      </span>
                    </div>

                    {/* Subtasks checklist */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                          Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                        </span>
                        <div className="space-y-1.5 pl-1">
                          {task.subtasks.map((st) => (
                            <label
                              key={st.id}
                              className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={st.completed}
                                onChange={() => toggleTaskSubtask(task.id, st.id)}
                                className="w-3.5 h-3.5 accent-white rounded"
                              />
                              <span className={st.completed ? 'line-through text-white/40' : ''}>
                                {st.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition duration-300"
                    title="Edit task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-full transition duration-300"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 bg-[#0a0a0a] border-b border-white/10">
              <h3 className="text-lg font-serif italic text-white font-normal">
                {editingTask ? 'Edit Task' : 'Create Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-white/40 hover:text-white bg-white/5 border border-white/10 rounded-full transition duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete DBMS Assignment"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details or references..."
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 text-xs text-white rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-xs text-white rounded-xl px-3 py-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-xs text-white rounded-xl px-3 py-3 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full bg-[#121212] border border-white/10 text-xs text-white rounded-xl px-3 py-3 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-[#121212] border border-white/10 text-xs text-white rounded-xl px-3 py-3 focus:outline-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                  Subtasks (One per line)
                </label>
                <textarea
                  rows={3}
                  value={subtasksText}
                  onChange={(e) => setSubtasksText(e.target.value)}
                  placeholder="Read Chapter 12&#10;Write insertion logic&#10;Test edge cases"
                  className="w-full bg-white/[0.03] border border-white/10 text-xs text-white rounded-xl px-4 py-3 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono uppercase tracking-wider rounded-full transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold uppercase tracking-widest rounded-full transition"
                >
                  {editingTask ? 'Update Task' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
