import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Note } from '../types';
import {
  FileText,
  Plus,
  Trash2,
  Pin,
  Search,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';

export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useStore();

  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Active note content
  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const handleCreateNewNote = () => {
    const newNoteData = {
      title: 'Untitled Scratchpad Note',
      content: '',
      category: 'General',
      pinned: false,
    };
    addNote(newNoteData);
  };

  const handleContentChange = (newContent: string) => {
    if (!activeNoteId) return;
    updateNote(activeNoteId, { content: newContent });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1500);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!activeNoteId) return;
    updateNote(activeNoteId, { title: newTitle });
  };

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const note = notes.find((n) => n.id === id);
    if (note) {
      updateNote(id, { pinned: !note.pinned });
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.category && n.category.toLowerCase().includes(q))
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif italic text-white font-normal">
            Rough Notes Scratchpad
          </h1>
          <p className="text-[11px] text-white/50 font-mono uppercase tracking-[0.25em] mt-1">
            Instant digital scratchpad for ideas • Raw thoughts • Quick reference
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full shadow-2xl transition cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ NEW NOTE</span>
        </button>
      </div>

      {/* Editor Main Container */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl flex-1 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
        {/* LEFT LIST PANEL (4 cols) */}
        <div className="md:col-span-4 border-r border-white/10 flex flex-col bg-[#0a0a0a]/60 min-h-0">
          {/* Search Bar */}
          <div className="p-3 border-b border-white/10 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scratchpad..."
                className="w-full bg-[#121212] border border-white/10 text-xs text-white font-mono rounded-full pl-9 pr-4 py-2.5 focus:outline-none focus:border-white/30 placeholder-white/30"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {sortedNotes.length === 0 ? (
              <div className="p-8 text-center text-[10px] font-mono text-white/40 uppercase tracking-widest">
                No notes found. Click + New Note to create one.
              </div>
            ) : (
              sortedNotes.map((note) => {
                const isSelected = note.id === activeNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer group flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/20 shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs font-serif italic truncate ${
                          isSelected ? 'text-white' : 'text-white/80'
                        }`}
                      >
                        {note.title || 'Untitled Note'}
                      </h4>
                      <button
                        onClick={(e) => togglePin(note.id, e)}
                        className={`p-1 rounded transition ${
                          note.pinned
                            ? 'text-emerald-400 fill-emerald-400'
                            : 'text-white/30 hover:text-white'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed font-mono">
                      {note.content || 'Empty note...'}
                    </p>

                    <span className="text-[9px] font-mono text-white/30 tracking-wider self-end">
                      {note.updatedAt}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT EDITOR PANEL (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-[#121212] min-h-0">
          {!activeNote ? (
            <div className="m-auto text-center space-y-2 p-8">
              <FileText className="w-10 h-10 text-white/20 mx-auto" />
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Select a note or create a new one to start writing.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Note Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-[#0a0a0a]/40">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Note Title..."
                  className="bg-transparent text-lg font-serif italic text-white focus:outline-none w-full"
                />

                <div className="flex items-center gap-3 shrink-0 font-mono text-xs text-white/50">
                  {saveToast && (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] tracking-wider uppercase">
                      <Check className="w-3 h-3" /> Auto-saved
                    </span>
                  )}
                  <button
                    onClick={() => {
                      deleteNote(activeNote.id);
                      setActiveNoteId(notes.find((n) => n.id !== activeNote.id)?.id || null);
                    }}
                    className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Textarea Scratchpad */}
              <div className="flex-1 p-5 min-h-0">
                <textarea
                  value={activeNote.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Type anything here... project ideas, study formulas, professor questions, daily thoughts..."
                  className="w-full h-full bg-transparent text-xs text-white/90 placeholder-white/20 focus:outline-none resize-none font-mono leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
