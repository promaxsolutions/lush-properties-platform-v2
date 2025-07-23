import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { 
  Zap, 
  Upload, 
  FileText, 
  DollarSign,
  Calendar,
  MessageCircle,
  Settings,
  Bell,
  Search,
  Plus,
  Bookmark,
  Clock
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  badge?: string;
  disabled?: boolean;
  role?: string[];
}

interface QuickActionsProps {
  userRole: string;
  onAction?: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole, onAction }) => {
  const [isVisible, setIsVisible] = useState(false); // Start closed for better UX
  const { success, info } = useToast();

  const handleAction = (actionId: string, action: () => void) => {
    action();
    onAction?.(actionId);
    success(`${actionId} action completed!`);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'upload-documents',
      label: 'Upload Files',
      icon: <Upload className="w-4 h-4" />,
      description: 'Upload project documents, photos, or receipts',
      action: () => {
        // Open file upload modal
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*,application/pdf,.doc,.docx';
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files) {
            info(`Selected ${files.length} file(s) for upload`);
          }
        };
        input.click();
      },
      role: ['admin', 'builder', 'client', 'accountant']
    },
    {
      id: 'create-claim',
      label: 'New Claim',
      icon: <FileText className="w-4 h-4" />,
      description: 'Create a new progress claim',
      action: () => {
        window.location.href = '/claims/new';
      },
      role: ['admin', 'builder', 'accountant']
    },
    {
      id: 'schedule-meeting',
      label: 'Schedule',
      icon: <Calendar className="w-4 h-4" />,
      description: 'Schedule a meeting or inspection',
      action: () => {
        window.location.href = '/calendar';
      },
      role: ['admin', 'builder', 'client']
    },
    {
      id: 'ai-assistant',
      label: 'AI Help',
      icon: <MessageCircle className="w-4 h-4" />,
      description: 'Get AI assistance with your tasks',
      action: () => {
        // Trigger AI chat widget
        const aiButton = document.querySelector('[data-ai-chat]');
        if (aiButton) {
          (aiButton as HTMLElement).click();
        }
      },
      badge: 'New',
      role: ['admin', 'builder', 'client', 'investor', 'accountant']
    },
    {
      id: 'quick-search',
      label: 'Search',
      icon: <Search className="w-4 h-4" />,
      description: 'Search projects, documents, or contacts',
      action: () => {
        // Focus search input or open search modal
        const searchInput = document.querySelector('[data-search]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      role: ['admin', 'builder', 'client', 'investor', 'accountant']
    },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: <Bell className="w-4 h-4" />,
      description: 'View recent notifications and alerts',
      action: () => {
        window.location.href = '/notifications';
      },
      badge: '3',
      role: ['admin', 'builder', 'client', 'investor', 'accountant']
    },
    {
      id: 'financial-summary',
      label: 'Finances',
      icon: <DollarSign className="w-4 h-4" />,
      description: 'View financial summary and reports',
      action: () => {
        if (userRole === 'accountant') {
          window.location.href = '/finance';
        } else if (userRole === 'investor') {
          window.location.href = '/investor';
        } else {
          window.location.href = '/profits';
        }
      },
      role: ['admin', 'builder', 'client', 'investor', 'accountant']
    },
    {
      id: 'quick-settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      description: 'Quick access to account settings',
      action: () => {
        window.location.href = '/settings';
      },
      role: ['admin', 'builder', 'client', 'investor', 'accountant']
    }
  ];

  // Filter actions based on user role
  const allowedActions = quickActions.filter(action => 
    !action.role || action.role.includes(userRole)
  );

  if (!isVisible || allowedActions.length === 0) {
    return (
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 40 }}>
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-[#007144] hover:bg-[#00a060] text-white p-3 rounded-full shadow-lg transition-all duration-200"
          aria-label="Show quick actions"
          title={`Quick Actions (${allowedActions.length} available)`}
        >
          <Zap className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: '80px', right: '24px', zIndex: 40 }}>
      <Card className="w-72 shadow-xl border-2 bg-white">
        <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#007144]" />
            Quick Actions
          </h3>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
          >
            ×
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {allowedActions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleAction(action.label, action.action)}
              variant="outline"
              size="sm"
              disabled={action.disabled}
              className="h-auto p-3 flex flex-col items-center gap-2 relative hover:bg-[#007144]/5 hover:border-[#007144]/20"
              title={action.description}
            >
              {action.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 text-xs h-4 px-1 min-w-[16px]"
                >
                  {action.badge}
                </Badge>
              )}
              
              <div className="text-[#007144]">
                {action.icon}
              </div>
              
              <span className="text-xs font-medium text-center leading-tight">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500 text-center">
            Role: {userRole} • {allowedActions.length} actions available
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default QuickActions;