'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NOTIFICATION_TYPE } from '../models/Notification';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedNotifications = localStorage.getItem('hotelNotifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications.map(n => {
        const notification = Object.assign(new Notification(), n);
        notification.createdAt = new Date(n.createdAt);
        if (n.readAt) notification.readAt = new Date(n.readAt);
        return notification;
      }));
    } else {
      setNotifications([]);
    }
  }, []);

  const saveNotifications = (newNotifications) => {
    setNotifications(newNotifications);
    localStorage.setItem('hotelNotifications', JSON.stringify(newNotifications));
  };

  const createNotification = (recipientId, type, message, relatedBookingId = null) => {
    const newNotification = new Notification(
      Date.now().toString(),
      recipientId,
      type,
      message,
      relatedBookingId
    );
    const newNotifications = [...notifications, newNotification];
    saveNotifications(newNotifications);
    return newNotification;
  };

  const markAsRead = (id) => {
    const newNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true, readAt: new Date() } : notification
    );
    saveNotifications(newNotifications);
  };

  const markAllAsRead = (recipientId) => {
    const newNotifications = notifications.map(notification => 
      notification.recipientId === recipientId ? { ...notification, isRead: true, readAt: new Date() } : notification
    );
    saveNotifications(newNotifications);
  };

  const getUnreadCount = (recipientId) => {
    return notifications.filter(n => n.recipientId === recipientId && !n.isRead).length;
  };

  const getUserNotifications = (recipientId) => {
    return notifications.filter(n => n.recipientId === recipientId);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      createNotification,
      markAsRead,
      markAllAsRead,
      getUnreadCount,
      getUserNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
