import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { GlobalSearchModal } from './GlobalSearchModal';
import { DateDetailModal } from './DateDetailModal';
import { WelcomePage } from '../pages/WelcomePage';
import { DashboardPage } from '../pages/DashboardPage';
import { AcademicsPage } from '../pages/AcademicsPage';
import { TodoPage } from '../pages/TodoPage';
import { FitnessPage } from '../pages/FitnessPage';
import { SkillsPage } from '../pages/SkillsPage';
import { NotesPage } from '../pages/NotesPage';
import { SettingsPage } from '../pages/SettingsPage';

export function Layout() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (!user) {
    return <WelcomePage />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigateTab={setActiveTab} />;
      case 'academics':
        return <AcademicsPage />;
      case 'todo':
        return <TodoPage />;
      case 'fitness':
        return <FitnessPage />;
      case 'skills':
        return <SkillsPage />;
      case 'notes':
        return <NotesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased selection:bg-red-500/30 selection:text-red-200">
      {/* Sidebar & Mobile Bottom Bar */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header activeTab={activeTab} />
        <main className="flex-1 animate-fade-in">{renderActivePage()}</main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal onNavigateTab={setActiveTab} />
      <DateDetailModal />
    </div>
  );
}
