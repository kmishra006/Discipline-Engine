import React, { useState, useEffect } from 'react';
import { useStore } from '../store/StoreContext';
import { Droplets, RotateCcw, Bell, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { notificationService } from '../services/notifications';

export function WaterReminderCard() {
  const {
    todayWaterMl,
    user,
    logWater,
    resetWaterTimer,
    nextWaterReminderTime,
  } = useStore();

  const [minsRemaining, setMinsRemaining] = useState<number | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    notificationService.getPermissionStatus()
  );

  const goalMl = user?.dailyWaterGoalMl || 3000;
  const progressPercent = Math.min(100, Math.round((todayWaterMl / goalMl) * 100));

  // Countdown timer calculation
  useEffect(() => {
    const updateCountdown = () => {
      if (!nextWaterReminderTime) {
        setMinsRemaining(user?.waterIntervalMinutes || 45);
        return;
      }
      const diffMs = nextWaterReminderTime.getTime() - new Date().getTime();
      const mins = Math.max(0, Math.ceil(diffMs / (1000 * 60)));
      setMinsRemaining(mins);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 10000);
    return () => clearInterval(interval);
  }, [nextWaterReminderTime, user?.waterIntervalMinutes]);

  const handleRequestNotif = async () => {
    const status = await notificationService.requestPermission();
    setNotifPermission(status);
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
      {/* Subtle ambient highlight */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white/90">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 block font-sans">
                Hydration Monitor
              </span>
              <h3 className="text-base font-serif italic text-white font-normal">
                Daily Water Goal
              </h3>
            </div>
          </div>

          <button
            onClick={resetWaterTimer}
            title="Reset timer"
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Display */}
        <div className="my-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-serif italic font-normal text-white">
              {(todayWaterMl / 1000).toFixed(1)}L
              <span className="text-xs font-sans not-italic text-white/40 ml-1.5 font-light">
                / {(goalMl / 1000).toFixed(1)}L
              </span>
            </span>
            <span className="text-xs font-mono text-white/70">{progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="bg-white/80 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] uppercase tracking-wider font-mono text-white/40 mt-2">
            Next Alert: <span className="text-white/80 font-medium">{minsRemaining !== null ? `${minsRemaining}m` : '45m'}</span>
          </p>
        </div>
      </div>

      {/* Quick Log Buttons & Notification Permission */}
      <div className="space-y-3 pt-3 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => logWater(250)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-white text-[11px] font-mono uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            +250ml
          </button>
          <button
            onClick={() => logWater(500)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white text-[11px] font-mono uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            +500ml
          </button>
        </div>

        {/* Notification Permission Toggle */}
        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-white/40">
          <span className="flex items-center gap-1.5">
            <Bell className="w-3 h-3 text-white/30" />
            Alerts
          </span>
          {notifPermission === 'granted' ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          ) : (
            <button
              onClick={handleRequestNotif}
              className="text-white/70 hover:text-white underline"
            >
              Enable Browser Alerts
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
