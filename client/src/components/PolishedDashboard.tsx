import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Users,
  Smartphone,
  RefreshCw,
  Download,
  ChevronRight,
  Calendar,
  MapPin,
  Brain,
  Shield,
  Menu,
  X
} from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Project {
  id: string;
  name: string;
  address: string;
  status: string;
  stage: string;
  amount: number;
  progress: number;
  nextMilestone: string;
  daysUntilMilestone: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface PolishedDashboardProps {
  user: User;
  projects: Project[];
}

const PolishedDashboard = ({ user, projects = [] }: PolishedDashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Check for PWA install prompt
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setShowInstallPrompt(true);
    }
  }, []);

  // Load audit logs for admin users
  useEffect(() => {
    if (selectedRole === 'admin') {
      fetchAuditLogs();
    }
  }, [selectedRole]);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/audit/logs');
      const data = await response.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleRoleSwitch = (newRole: string) => {
    setSelectedRole(newRole);
    // Trigger instant view update without reload
    window.dispatchEvent(new CustomEvent('roleChanged', { detail: newRole }));
  };

  const installPWA = () => {
    // PWA install logic would go here
    alert('Install app feature activated! Add to home screen from browser menu.');
    setShowInstallPrompt(false);
  };

  // Sample chart data
  const progressChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Project Progress',
        data: [20, 35, 50, 65, 75, 85],
        borderColor: '#007144',
        backgroundColor: 'rgba(0, 113, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const financialChartData = {
    labels: ['Completed', 'In Progress', 'Upcoming'],
    datasets: [
      {
        label: 'Project Value ($M)',
        data: [2.4, 1.8, 3.2],
        backgroundColor: ['#10B981', '#007144', '#FFD700'],
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-lg"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                👋 {getGreeting()}, {user.firstName}
              </h1>
              <p className="text-gray-600">
                {currentTime.toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <select
                value={selectedRole}
                onChange={(e) => handleRoleSwitch(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm focus:border-lush-primary focus:ring-lush-primary text-sm font-medium"
              >
                <option value="admin">Admin View</option>
                <option value="builder">Builder View</option>
                <option value="client">Client View</option>
                <option value="investor">Investor View</option>
              </select>

              {/* PWA Install Button */}
              {showInstallPrompt && (
                <Button
                  onClick={installPWA}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-2 bg-lush-primary text-white border-lush-primary hover:bg-lush-primary/90"
                >
                  <Smartphone className="h-4 w-4" />
                  Install App
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">$7.4M</p>
                  <p className="text-xs text-lush-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-lush-light rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-lush-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    3 due this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    5 online now
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-lush-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Above target
                  </p>
                </div>
                <div className="w-12 h-12 bg-lush-light rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-lush-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
            <Button variant="outline" size="sm">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-4">
            {projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-200 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">{project.name}</CardTitle>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          <a 
                            href={`https://maps.google.com/?q=${encodeURIComponent(project.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-lush-primary transition-colors"
                          >
                            {project.address}
                          </a>
                        </div>
                      </div>
                      <Badge className={
                        project.status === 'completed' ? 'bg-lush-success' :
                        project.status === 'in-progress' ? 'bg-lush-primary' :
                        'bg-gray-500'
                      }>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-lush-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-semibold">${project.amount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Next Milestone:</span>
                        <span className="font-medium text-lush-primary">{project.nextMilestone}</span>
                      </div>
                      
                      {project.daysUntilMilestone <= 7 && (
                        <Alert className="border-lush-warning bg-orange-50">
                          <Clock className="h-4 w-4" />
                          <AlertDescription className="text-orange-700">
                            {project.daysUntilMilestone} days until next milestone
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mobile PWA Install for smaller screens */}
          {showInstallPrompt && (
            <div className="sm:hidden mb-4">
              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-lush-primary to-lush-accent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-semibold">Install Lush Properties Control Center</h3>
                      <p className="text-sm opacity-90">Get the full mobile experience</p>
                    </div>
                    <Button
                      onClick={installPWA}
                      variant="outline"
                      size="sm"
                      className="bg-white text-lush-primary border-white hover:bg-gray-50"
                    >
                      <Smartphone className="h-4 w-4 mr-1" />
                      Install
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={progressChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={financialChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights and Admin Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs defaultValue="ai-insights" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3 rounded-xl bg-gray-100">
              <TabsTrigger value="ai-insights" className="rounded-lg">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </TabsTrigger>
              <TabsTrigger value="recent-activity" className="rounded-lg">
                <Clock className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              {selectedRole === 'admin' && (
                <TabsTrigger value="audit-logs" className="rounded-lg">
                  <Shield className="h-4 w-4 mr-2" />
                  Audit Logs
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="ai-insights">
              <Card className="rounded-2xl shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-lush-primary" />
                      AI Project Insights
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-lush-primary bg-lush-light">
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommendation:</strong> Project "Luxury Townhouse" is 18% ahead of schedule. 
                      Consider moving up the next milestone date to optimize cash flow.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-blue-200 bg-blue-50">
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Market Insight:</strong> Construction material costs have decreased 3% this month. 
                      Good time to lock in rates for upcoming projects.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent-activity">
              <Card className="rounded-2xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Progress claim submitted", project: "Luxury Townhouse", time: "2 hours ago", type: "claim" },
                      { action: "Receipt uploaded", project: "Modern Villa", time: "4 hours ago", type: "upload" },
                      { action: "Milestone completed", project: "Garden Apartments", time: "1 day ago", type: "milestone" },
                      { action: "New team member added", project: "Office Complex", time: "2 days ago", type: "team" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'claim' ? 'bg-lush-primary' :
                          activity.type === 'upload' ? 'bg-blue-500' :
                          activity.type === 'milestone' ? 'bg-lush-success' :
                          'bg-purple-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.project} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {selectedRole === 'admin' && (
              <TabsContent value="audit-logs">
                <Card className="rounded-2xl shadow-lg border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        Security Audit Logs
                      </CardTitle>
                      <Button onClick={fetchAuditLogs} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditLogs.slice(0, 5).map((log: any, index) => (
                        <div key={index} className="p-3 rounded-xl bg-gray-50 border-l-4 border-red-500">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{log.action}</span>
                            <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{log.email} - {log.resource}</p>
                          <p className="text-xs text-gray-500">IP: {log.ipAddress}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default PolishedDashboard;