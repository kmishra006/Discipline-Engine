export const notificationService = {
  requestPermission: async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications.');
      return 'denied';
    }
    return await Notification.requestPermission();
  },

  getPermissionStatus: (): NotificationPermission => {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  },

  sendNotification: (title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/pwa-192.png',
          badge: '/pwa-192.png',
          ...options,
        });
      } catch (err) {
        console.error('Error triggering notification:', err);
      }
    }
  },

  notifyWaterReminder: (currentIntakeMl: number, goalMl: number) => {
    const remainingMl = Math.max(0, goalMl - currentIntakeMl);
    notificationService.sendNotification('💧 Hydration Time!', {
      body: `Time to drink water! Current intake: ${(currentIntakeMl / 1000).toFixed(1)}L / ${(goalMl / 1000).toFixed(1)}L (${(remainingMl / 1000).toFixed(1)}L remaining).`,
      tag: 'water-reminder',
    });
  }
};
