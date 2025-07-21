import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Bell,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'reminder' | 'inspection' | 'deadline' | 'meeting';
  priority: 'low' | 'medium' | 'high';
  projectName?: string;
  description?: string;
}

interface AdminCalendarProps {
  events: CalendarEvent[];
  className?: string;
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ events, className = "" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-yellow-100 text-yellow-800';
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'medium': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-3 w-3 text-green-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const today = new Date();
  const calendarDays = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-10" />;
            }
            
            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = selectedDate?.toDateString() === day.toDateString();
            
            return (
              <div
                key={day.toDateString()}
                className={`h-10 border rounded cursor-pointer flex flex-col items-center justify-center text-xs relative hover:bg-gray-50 ${
                  isToday ? 'bg-lush-primary text-white' : ''
                } ${isSelected ? 'ring-2 ring-lush-primary' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <span className={`${isToday ? 'text-white' : 'text-gray-900'}`}>
                  {day.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <div className="absolute -bottom-1 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className={`w-1 h-1 rounded-full ${
                          event.priority === 'high' ? 'bg-red-500' : 
                          event.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Selected Date Events */}
        {selectedDate && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium text-sm mb-2">
              Events for {selectedDate.toLocaleDateString()}
            </h4>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {getPriorityIcon(event.priority)}
                    <div className="flex-1">
                      <div className="font-medium text-xs">{event.title}</div>
                      {event.projectName && (
                        <div className="text-xs text-gray-500">{event.projectName}</div>
                      )}
                    </div>
                    <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No events scheduled</p>
            )}
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div className="text-center">
            <div className="font-medium text-red-600">{events.filter(e => e.priority === 'high').length}</div>
            <div className="text-gray-500">High Priority</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-blue-600">{events.length}</div>
            <div className="text-gray-500">Total Events</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCalendar;