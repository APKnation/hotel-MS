'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '../lib/context/NotificationContext';
import { useAuth } from '../lib/context/AuthContext';
import { NOTIFICATION_TYPE } from '../lib/models/Notification';

export default function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead, getUnreadCount, getUserNotifications } = useNotifications();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userNotifications, setUserNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      setUserNotifications(getUserNotifications(user.id));
    }
  }, [notifications, user, getUserNotifications]);

  const unreadCount = user ? getUnreadCount(user.id) : 0;

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPE.BOOKING_CONFIRMED: return '✅';
      case NOTIFICATION_TYPE.BOOKING_CANCELLED: return '❌';
      case NOTIFICATION_TYPE.CHECK_IN: return '🔑';
      case NOTIFICATION_TYPE.CHECK_OUT: return '🚪';
      case NOTIFICATION_TYPE.PAYMENT_RECEIVED: return '💰';
      case NOTIFICATION_TYPE.ROOM_READY: return '🧹';
      case NOTIFICATION_TYPE.CLEANING_ASSIGNED: return '🧼';
      default: return '📢';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPE.BOOKING_CONFIRMED: return 'bg-green-50 border-green-200';
      case NOTIFICATION_TYPE.BOOKING_CANCELLED: return 'bg-red-50 border-red-200';
      case NOTIFICATION_TYPE.CHECK_IN: return 'bg-blue-50 border-blue-200';
      case NOTIFICATION_TYPE.CHECK_OUT: return 'bg-purple-50 border-purple-200';
      case NOTIFICATION_TYPE.PAYMENT_RECEIVED: return 'bg-green-50 border-green-200';
      case NOTIFICATION_TYPE.ROOM_READY: return 'bg-yellow-50 border-yellow-200';
      case NOTIFICATION_TYPE.CLEANING_ASSIGNED: return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {userNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              userNotifications.slice().reverse().map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''} ${getTypeColor(notification.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
