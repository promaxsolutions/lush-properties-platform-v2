import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X, CheckCircle, AlertTriangle, Upload, Camera } from "lucide-react";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'upload' | 'milestone';
  title: string;
  message: string;
  timestamp: Date;
  actionLabel?: string;
  actionUrl?: string;
  read?: boolean;
}

const MobileNotifications = () => {
  // Demo notifications for testing purposes
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'milestone',
      title: 'Demo: Milestone Detected',
      message: 'Foundation work milestone found in uploaded receipt',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      actionLabel: 'View Details',
      actionUrl: '/smart-upload'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Demo: Missing Receipts',
      message: 'Roofing and lockup milestone receipts still needed',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      actionLabel: 'Upload Now',
      actionUrl: '/smart-upload'
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'upload':
        return <Upload className="h-5 w-5 text-blue-600" />;
      case 'milestone':
        return <Camera className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Mobile notification system with demo data for testing
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    console.log('[MobileNotifications] Demo notifications loaded for testing');
  }, [notifications]);

  // Auto-collapse notifications after 5 seconds
  useEffect(() => {
    if (showNotifications) {
      const timer = setTimeout(() => {
        setShowNotifications(false);
        console.log('[MobileNotifications] Auto-collapsed after 5 seconds');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showNotifications]);

  return (
    <>
      {/* Mobile Notification Bell - Only on mobile */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          className="relative bg-white shadow-lg"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Notification Panel - Only on mobile */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-y-auto h-full pb-20">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id}
                      className={`${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          {getIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium truncate">
                                {notification.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dismissNotification(notification.id)}
                                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              {notification.actionLabel && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="h-auto p-0 text-xs"
                                  onClick={() => {
                                    markAsRead(notification.id);
                                    if (notification.actionUrl) {
                                      window.location.href = notification.actionUrl;
                                    }
                                  }}
                                >
                                  {notification.actionLabel}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Notification Toast (for non-mobile) */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        {notifications
          .filter(n => !n.read)
          .slice(0, 3)
          .map((notification) => (
            <Card key={notification.id} className="mb-2 w-80 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 text-xs"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
};

export default MobileNotifications;