import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  FileText 
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionUrl?: string;
  read: boolean;
}

const SmartNotifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [autoCollapseTimer, setAutoCollapseTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing persistent notifications per user request
    localStorage.removeItem('lush-notifications');
    setNotifications([]);
    setUnreadCount(0);

    console.log('[SmartNotifications] All notifications cleared per user request');
  }, []);

  const getCurrentUserRole = () => {
    try {
      const user = localStorage.getItem('lush_user');
      return user ? JSON.parse(user).role : 'client';
    } catch {
      return 'client';
    }
  };

  const generateRoleBasedNotifications = (role: string): Notification[] => {
    const baseId = Date.now();
    
    const notifications: Notification[] = [];

    if (role === 'admin') {
      notifications.push(
        {
          id: `${baseId}-1`,
          type: 'warning',
          title: 'Pending Claims Review',
          message: '3 progress claims awaiting approval from builders',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          priority: 'high',
          category: 'Claims',
          actionUrl: '/claims',
          read: false
        },
        {
          id: `${baseId}-2`,
          type: 'info',
          title: 'New Project Added',
          message: 'Project "Luxury Villa - Toorak" has been created',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          priority: 'medium',
          category: 'Projects',
          actionUrl: '/projects',
          read: false
        }
      );
    }

    // Notifications removed per user request - no persistent milestone or missing receipt alerts

    return notifications;
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('lush-notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem('lush-notifications', JSON.stringify(updated));
  };

  const handleVisibilityChange = (visible: boolean) => {
    setIsVisible(visible);
    
    if (visible) {
      // Auto-collapse after 5 seconds
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
      }
      const timer = setTimeout(() => {
        setIsVisible(false);
        console.log('[SmartNotifications] Auto-collapsed after 5 seconds');
      }, 5000);
      setAutoCollapseTimer(timer);
      console.log('[SmartNotifications] Auto-collapse timer started (5 seconds)');
    } else {
      // Clear timer if manually closed
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
        setAutoCollapseTimer(null);
      }
      console.log('[SmartNotifications] Panel closed');
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
      }
    };
  }, [autoCollapseTimer]);

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('lush-notifications', JSON.stringify(updated));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (!isVisible) {
    return (
      <div className="floating-button-base floating-button-5 hidden lg:block" style={{ zIndex: 30 }}>
        <div className="relative">
          <Button
            onClick={() => handleVisibilityChange(true)}
            className="floating-btn bg-orange-600 hover:bg-orange-700 text-white"
            aria-label={`Notifications (${unreadCount} unread)`}
            title={`Notifications (${unreadCount} unread)`}
          >
            <Bell />
          </Button>
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold lg:w-7 lg:h-7">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="floating-button-base floating-button-5 hidden lg:block" style={{ zIndex: 30 }}>
      <Card className="w-80 shadow-xl border-2 bg-white max-h-96">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-600" />
              Notifications ({unreadCount} new)
            </CardTitle>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-1 h-auto"
                >
                  Mark all read
                </Button>
              )}
              <Button
                onClick={() => handleVisibilityChange(false)}
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {notification.title}
                        </h4>
                        <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="text-xs px-2 py-0 h-auto text-blue-600"
                            >
                              Mark read
                            </Button>
                          )}
                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-xs px-2 py-0 h-auto text-red-600"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartNotifications;