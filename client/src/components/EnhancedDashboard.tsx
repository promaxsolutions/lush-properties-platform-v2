import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from './LoadingSpinner';
import OptimizedImage from './OptimizedImage';
import { useToast } from '@/hooks/useToast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  Brain,
  Smartphone,
  RefreshCw
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  stage: string;
  amount: number;
  progress: number;
  nextMilestone: string;
  daysUntilMilestone: number;
  imageUrl?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface DashboardStats {
  totalValue: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
  upcomingMilestones: number;
  monthlyRevenue: number;
}

interface EnhancedDashboardProps {
  userRole: string;
  userName: string;
  projects?: Project[];
  stats?: DashboardStats;
  loading?: boolean;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  userRole,
  userName,
  projects = [],
  stats,
  loading = false
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useLocalStorage('dashboard-view', 'grid');
  const { success, warning } = useToast();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Compute stats from projects if not provided
  const computedStats = useMemo(() => {
    if (stats) return stats;
    
    return {
      totalValue: projects.reduce((sum, p) => sum + p.amount, 0),
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      averageProgress: projects.length > 0 
        ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length 
        : 0,
      upcomingMilestones: projects.filter(p => p.daysUntilMilestone <= 7).length,
      monthlyRevenue: 0 // Would be calculated from actual revenue data
    };
  }, [projects, stats]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      case 'builder':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      case 'accountant':
        return 'bg-yellow-100 text-yellow-800';
      case 'investor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'completed':
        return 'text-blue-600';
      case 'on-hold':
        return 'text-yellow-600';
      case 'planning':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="lg" message="Loading your dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Project Value',
      value: formatCurrency(computedStats.totalValue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Projects',
      value: computedStats.activeProjects.toString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg Progress',
      value: `${Math.round(computedStats.averageProgress)}%`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Upcoming Milestones',
      value: computedStats.upcomingMilestones.toString(),
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {userName}!
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge className={getRoleBadgeColor(userRole)}>
              {userRole.toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('en-AU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Alerts Section */}
      {computedStats.upcomingMilestones > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You have {computedStats.upcomingMilestones} project milestone
              {computedStats.upcomingMilestones !== 1 ? 's' : ''} due within 7 days.
              <Button variant="link" className="p-0 h-auto ml-2 text-orange-800">
                View Details
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Projects</CardTitle>
              <Badge variant="secondary">
                {projects.length} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No projects found</p>
                <p className="text-sm">Create your first project to get started</p>
              </div>
            ) : (
              <div className={`gap-4 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'space-y-4'
              }`}>
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-all hover:scale-[1.02]">
                      <CardContent className="p-4">
                        {project.imageUrl && (
                          <div className="mb-3">
                            <OptimizedImage
                              src={project.imageUrl}
                              alt={project.name}
                              className="w-full h-32 rounded-md"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {project.name}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(project.status)}
                            >
                              {project.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">{project.address}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900">
                              {formatCurrency(project.amount)}
                            </span>
                            <span className="text-gray-600">
                              {project.progress}% complete
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-lush-primary h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{project.stage}</span>
                            <span>{project.daysUntilMilestone} days to milestone</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedDashboard;