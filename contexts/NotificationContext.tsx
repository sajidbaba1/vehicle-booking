import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification, ToastMessage } from '../types';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;
  sendEmail: (to: string, subject: string, template: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Derived state
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (data: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info', title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, title }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Simulate SMTP Email Sending
  const sendEmail = async (to: string, subject: string, template: string) => {
    console.log(`[SMTP MOCK] Sending email to ${to}`);
    console.log(`[SMTP MOCK] Subject: ${subject}`);
    console.log(`[SMTP MOCK] Template: ${template}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast(`Email sent to ${to}`, 'info', 'Check your inbox');
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      toasts,
      showToast,
      removeToast,
      sendEmail
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};