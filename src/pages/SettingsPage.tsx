import React, { useState, useRef } from 'react';
import { useStore } from '../store/StoreContext';
import { notificationService } from '../services/notifications';
import {
  Settings,
  User,
  Droplets,
  Bell,
  Download,
  Upload,
  Database,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Shield,
} from 'lucide-react';

export function SettingsPage() {
  const {
    user,
    updateUserProfile,
    loadDemoData,
    clearAllData,
    exportData,
    importData,
  } = useStore();

  const [name, setName] = useState(user?.name || '');
  const [waterInterval, setWaterInterval] = useState(user?.waterIntervalMinutes || 45);
  const [waterGoal, setWaterGoal] = useState(user?.dailyWaterGoalMl || 3000);
  const [weekStart, setWeekStart] = useState<'mon' | 'sun'>(user?.weekStartsOn || 'mon');

  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notifStatus, setNotifStatus] = useState<NotificationPermission>(
    notificationService.getPermissionStatus()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateUserProfile({
      name: name.trim(),
      waterIntervalMinutes: Number(waterInterval),
      dailyWaterGoalMl: Number(waterGoal),
      weekStartsOn: weekStart,
    });
    alert('Settings updated successfully!');
  };

  const handleRequestNotif = async () => {
    const status = await notificationService.requestPermission();
    setNotifStatus(status);
    if (status === 'granted') {
      updateUserProfile({ notificationsEnabled: true });
    }
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discipline-engine-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          setImportMessage('Data imported successfully!');
          setTimeout(() => setImportMessage(null), 3000);
        } else {
          setImportMessage('Error importing data. Invalid JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-serif italic text-white font-normal">
          System Settings & Data
        </h1>
        <p className="text-[11px] text-white/50 font-mono uppercase tracking-[0.25em] mt-1">
          Profile preferences • Hydration intervals • Local backups
        </p>
      </div>

      {/* Profile & Hydration Settings */}
      <form onSubmit={handleSaveProfile} className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white">
            <User className="w-4 h-4 text-white/70" />
          </div>
          <h3 className="text-lg font-serif italic text-white font-normal">
            Profile & Preferences
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
              User Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 text-xs text-white font-mono rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
              Week Starts On
            </label>
            <select
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value as 'mon' | 'sun')}
              className="w-full bg-[#0a0a0a] border border-white/10 text-xs text-white font-mono rounded-xl px-4 py-3 focus:outline-none"
            >
              <option value="mon">Monday</option>
              <option value="sun">Sunday</option>
            </select>
          </div>
        </div>

        {/* Water Hydration Config */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400/80" />
            <h4 className="text-xs font-mono font-bold text-white/70 uppercase tracking-widest">
              Water Hydration Reminder Config
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                Reminder Interval
              </label>
              <select
                value={waterInterval}
                onChange={(e) => setWaterInterval(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] border border-white/10 text-xs text-white font-mono rounded-xl px-4 py-3 focus:outline-none"
              >
                <option value={30}>Every 30 Minutes</option>
                <option value={45}>Every 45 Minutes (Default)</option>
                <option value={60}>Every 60 Minutes</option>
                <option value={90}>Every 90 Minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono mb-1.5">
                Daily Goal (Milliliters)
              </label>
              <select
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] border border-white/10 text-xs text-white font-mono rounded-xl px-4 py-3 focus:outline-none"
              >
                <option value={2000}>2,000 ml (2.0L)</option>
                <option value={2500}>2,500 ml (2.5L)</option>
                <option value={3000}>3,000 ml (3.0L Default)</option>
                <option value={4000}>4,000 ml (4.0L)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Permission */}
        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-white/40" />
            <div>
              <p className="text-xs font-serif italic text-white">Browser Notifications</p>
              <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                Status: {notifStatus.toUpperCase()}
              </p>
            </div>
          </div>

          {notifStatus === 'granted' ? (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Enabled
            </span>
          ) : (
            <button
              type="button"
              onClick={handleRequestNotif}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-full transition"
            >
              Grant Permission
            </button>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full transition cursor-pointer active:scale-95 shadow-xl"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white">
            <Database className="w-4 h-4 text-white/70" />
          </div>
          <h3 className="text-lg font-serif italic text-white font-normal">
            Local Data Portability & Backup
          </h3>
        </div>

        {importMessage && (
          <div className="p-3 bg-white/5 border border-white/20 text-white text-xs font-mono rounded-xl">
            {importMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-2xl text-left transition cursor-pointer space-y-2 group"
          >
            <Download className="w-5 h-5 text-white/60 group-hover:text-white group-hover:scale-110 transition" />
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Export My Data (JSON)</h4>
              <p className="text-[11px] text-white/40 mt-1 font-sans">
                Download a complete offline JSON backup of all tasks, workouts, skills, notes, and streak history.
              </p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-2xl text-left transition cursor-pointer space-y-2 group"
          >
            <Upload className="w-5 h-5 text-white/60 group-hover:text-white group-hover:scale-110 transition" />
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Import Data (JSON)</h4>
              <p className="text-[11px] text-white/40 mt-1 font-sans">
                Restore data from a previously exported JSON backup file.
              </p>
            </div>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Demo Data & Hard Reset */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={loadDemoData}
            className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-mono font-bold uppercase tracking-wider rounded-full transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-white/40" />
            <span>Load Seed Demo Data</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to permanently clear all local data?')) {
                clearAllData();
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-mono font-bold uppercase tracking-wider rounded-full transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Application Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
