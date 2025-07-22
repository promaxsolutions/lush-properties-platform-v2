import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/useToast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  MapPin,
  User
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'milestone' | 'financial' | 'document' | 'meeting';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  projectId?: string;
  userId?: string;
}

interface SmartNotificationsProps {
  userRole: string;
  userId: string;
}

const SmartNotifications: React.FC<SmartNotificationsProps> = ({ userRole, userId }) => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('unread');
  const { success } = useToast();

  // Generate smart notifications based on user role and activities
  useEffect(() => {
    const generateSmartNotifications = () => {
      const now = new Date();
      const smartNotifications: Notification[] = [];

      // Admin notifications
      if (userRole === 'admin') {
        smartNotifications.push({
          id: `admin-${Date.now()}-1`,
          type: 'warning',
          title: 'Pending Approvals',
          message: '3 progress claims awaiting your approval',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          actionUrl: '/claims',
          priority: 'high',
          category: 'Workflow'
        });
      }

      // Builder notifications
      if (userRole === 'builder') {
        smartNotifications.push({
          id: `builder-${Date.now()}-1`,
          type: 'milestone',
          title: 'Milestone Due Tomorrow',
          message: 'Foundation inspection scheduled for Riverway Project',
          timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
          read: false,
          actionUrl: '/builder',
          priority: 'urgent',
          category: 'Construction',
          projectId: 'proj-001'
        });
      }

      // Client notifications
      if (userRole === 'client') {
        smartNotifications.push({
          id: `client-${Date.now()}-1`,
          type: 'info',
          title: 'Progress Update Available',
          message: 'New photos uploaded for your Lakeside Villa project',
          timestamp: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
          read: false,
          actionUrl: '/client',
          priority: 'medium',
          category: 'Updates',
          projectId: 'proj-002'
        });
      }

      // Accountant notifications
      if (userRole === 'accountant') {
        smartNotifications.push({
          id: `accountant-${Date.now()}-1`,
          type: 'financial',
          title: 'Receipt Processing Complete',
          message: '12 receipts processed and categorized automatically',
          timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
          read: false,
          actionUrl: '/finance',
          priority: 'medium',
          category: 'Finance'
        });
      }

      // Investor notifications
      if (userRole === 'investor') {
        smartNotifications.push({
          id: `investor-${Date.now()}-1`,
          type: 'success',
          title: 'ROI Update',
          message: 'Your Westfield project achieved 18.5% return this quarter',
          timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
          read: false,
          actionUrl: '/investor',
          priority: 'medium',
          category: 'Performance'
        });
      }

      // Add universal notifications
      smartNotifications.push({
        id: `universal-${Date.now()}-1`,
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight from 11 PM - 1 AM',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: false,
        priority: 'low',
        category: 'System'
      });

      // Only add new notifications that don't already exist
      const existingIds = new Set(notifications.map(n => n.id));
      const newNotifications = smartNotifications.filter(n => !existingIds.has(n.id));
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 50)); // Keep max 50 notifications
      }
    };

    generateSmartNotifications();
  }, [userRole, notifications, setNotifications]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'milestone':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'financial':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'meeting':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-4 border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-l-gray-300 bg-gray-50';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    success('All notifications marked as read');
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'urgent':
        return notification.priority === 'urgent' || notification.priority === 'high';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-20 z-40 bg-white hover:bg-gray-50 text-gray-700 border shadow-sm p-2 rounded-full relative"
        aria-label={`Open notifications (${unreadCount} unread)`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 text-xs h-5 px-1.5 min-w-[20px] rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 z-40 w-96 max-h-[80vh] shadow-xl border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-lush-primary" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('unread')}
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            Unread ({unreadCount})
          </Button>
          <Button
            onClick={() => setFilter('urgent')}
            variant={filter === 'urgent' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            Urgent
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No notifications to show</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'font-medium' : 'opacity-75'
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {notification.title}
                      </h4>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto opacity-50 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          {notification.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {notification.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {unreadCount > 0 && (
          <div className="p-3 border-t">
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              Mark all as read
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartNotifications;