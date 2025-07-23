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
  const [countdown, setCountdown] = useState(5);

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

  // Auto-collapse notifications after 5 seconds with countdown
  useEffect(() => {
    if (showNotifications) {
      setCountdown(5);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowNotifications(false);
            console.log('[MobileNotifications] Auto-collapsed after countdown');
            return 5;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [showNotifications]);

  return (
    <>
      {/* White Notification Bell - All devices */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="relative bg-white shadow-lg border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4 text-gray-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-[#007144] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* White Notification Panel - Card Format */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-40">
          <div className="w-80 max-w-[90vw] bg-white shadow-2xl rounded-lg border border-gray-200">
            {/* Card Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#007144] to-[#00a060] rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-white" />
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Auto-collapse timer indicator */}
            <div className="bg-[#007144] h-1 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-white/60 to-white/80 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        !notification.read 
                          ? 'border-l-4 border-l-[#007144] bg-green-50/50 border-green-200' 
                          : 'bg-gray-50/50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium truncate text-gray-900">
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
                                className="h-auto p-0 text-xs text-[#007144] hover:text-[#00a060]"
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
                    </div>
                  ))}
                </div>
              )}
              
              {/* Card Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                        setUnreadCount(0);
                      }}
                      className="text-xs text-gray-600 hover:text-gray-900"
                    >
                      Mark all read
                    </Button>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#007144] animate-pulse"></div>
                      Auto-closes in {countdown}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNotifications;