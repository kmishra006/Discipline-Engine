import React, { useState } from 'react';
import { AcademicOverview } from '../modules/academics/components/AcademicOverview';
import { TimetableBuilder } from '../modules/academics/components/TimetableBuilder';
import { AttendanceAnalytics } from '../modules/academics/components/AttendanceAnalytics';
import { SubjectsManager } from '../modules/academics/components/SubjectsManager';
import { Subject } from '../modules/academics/types';
import { GraduationCap, Calendar, BarChart3, BookOpen } from 'lucide-react';

type SubTab = 'overview' | 'timetable' | 'attendance' | 'subjects';

export function AcademicsPage() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<Subject | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* SECONDARY NAVIGATION BAR FOR ACADEMICS */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-2 shadow-xl flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 shrink-0 transition cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-white text-black font-bold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 shrink-0 transition cursor-pointer ${
            activeSubTab === 'timetable'
              ? 'bg-white text-black font-bold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Timetable</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 shrink-0 transition cursor-pointer ${
            activeSubTab === 'attendance'
              ? 'bg-white text-black font-bold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Attendance</span>
        </button>

        <button
          onClick={() => setActiveSubTab('subjects')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 shrink-0 transition cursor-pointer ${
            activeSubTab === 'subjects'
              ? 'bg-white text-black font-bold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Subjects</span>
        </button>
      </div>

      {/* SUB TAB VIEWS */}
      {activeSubTab === 'overview' && (
        <AcademicOverview
          onSelectSubject={(subject) => setSelectedSubjectModal(subject)}
          onNavigateSubTab={(tab) => setActiveSubTab(tab)}
        />
      )}

      {activeSubTab === 'timetable' && <TimetableBuilder />}

      {activeSubTab === 'attendance' && <AttendanceAnalytics />}

      {activeSubTab === 'subjects' && (
        <SubjectsManager
          selectedSubjectModal={selectedSubjectModal}
          onCloseSubjectModal={() => setSelectedSubjectModal(null)}
        />
      )}
    </div>
  );
}
