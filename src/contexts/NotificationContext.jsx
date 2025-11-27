import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // Notification settings (fraud removed)
  const [settings, setSettings] = useState(() => {
    try {
      const storedSettings = localStorage.getItem('notificationSettings');
      return storedSettings
        ? JSON.parse(storedSettings)
        : {
            summary: false,
            news: true,
          };
    } catch {
      return {
        summary: false,
        news: true,
      };
    }
  });

  // 🔥 REMOVE FRAUD ALERT GENERATION COMPLETELY
  useEffect(() => {
    // Keep other notifications in the future, but no fraud alerts
    setNotifications([]);
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Keep functions
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const value = {
    notifications,
    settings,
    removeNotification,
    clearNotifications,
    updateSettings,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
