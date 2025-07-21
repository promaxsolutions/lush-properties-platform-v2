import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MobileCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
  action?: () => void;
  actionLabel?: string;
}

const MobileOptimizedCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  action, 
  actionLabel 
}: MobileCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  const textClasses = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    purple: 'text-purple-900',
    orange: 'text-orange-900',
    red: 'text-red-900'
  };

  return (
    <Card className={`${colorClasses[color]} hover:shadow-md transition-shadow`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-sm font-medium ${colorClasses[color]}`}>
              {title}
            </p>
            <p className={`text-lg sm:text-xl md:text-2xl font-bold ${textClasses[color]} truncate`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex-shrink-0 ml-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
        {action && actionLabel && (
          <Button
            onClick={action}
            size="sm"
            variant="outline"
            className="w-full mt-2 h-8 text-xs"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

interface MobileGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

const MobileOptimizedGrid = ({ children, columns = 2 }: MobileGridProps) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-3 sm:gap-4`}>
      {children}
    </div>
  );
};

const MobileScrollableTable = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto -mx-3 sm:mx-0">
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
        {children}
      </div>
    </div>
  </div>
);

const MobileActionButton = ({ 
  children, 
  onClick, 
  variant = "default",
  fullWidth = true 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "destructive";
  fullWidth?: boolean;
}) => (
  <Button
    onClick={onClick}
    variant={variant}
    className={`
      min-h-[48px] px-4 py-3 text-sm sm:text-base
      ${fullWidth ? 'w-full' : ''}
      hover:scale-[1.02] transition-transform active:scale-[0.98]
    `}
  >
    {children}
  </Button>
);

export {
  MobileOptimizedCard,
  MobileOptimizedGrid,
  MobileScrollableTable,
  MobileActionButton
};