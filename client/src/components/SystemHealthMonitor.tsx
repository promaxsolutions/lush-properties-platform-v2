import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/useToast';
import { 
  Activity, 
  Wifi, 
  Database, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Server,
  Zap
} from 'lucide-react';

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  memoryUsage: number;
  activeUsers: number;
  errorRate: number;
  lastUpdate: Date;
}

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: Date;
  message?: string;
}

const SystemHealthMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 99.9,
    responseTime: 120,
    memoryUsage: 45,
    activeUsers: 23,
    errorRate: 0.1,
    lastUpdate: new Date()
  });

  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    {
      service: 'API Server',
      status: 'healthy',
      responseTime: 85,
      lastCheck: new Date(),
      message: 'All endpoints responding normally'
    },
    {
      service: 'Database',
      status: 'healthy',
      responseTime: 45,
      lastCheck: new Date(),
      message: 'Connection pool stable'
    },
    {
      service: 'File Storage',
      status: 'healthy',
      responseTime: 125,
      lastCheck: new Date(),
      message: 'Upload/download functioning'
    },
    {
      service: 'Authentication',
      status: 'healthy',
      responseTime: 65,
      lastCheck: new Date(),
      message: 'OAuth services operational'
    },
    {
      service: 'Email Service',
      status: 'degraded',
      responseTime: 2500,
      lastCheck: new Date(),
      message: 'Experiencing delays, investigating'
    }
  ]);

  const { warning, success } = useToast();

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 100) + 80,
        memoryUsage: Math.floor(Math.random() * 20) + 40,
        activeUsers: Math.floor(Math.random() * 10) + 20,
        errorRate: Math.random() * 0.5,
        lastUpdate: new Date()
      }));

      // Occasionally update health checks
      if (Math.random() < 0.3) {
        setHealthChecks(prev => prev.map(check => ({
          ...check,
          responseTime: Math.floor(Math.random() * 200) + 50,
          lastCheck: new Date(),
          status: Math.random() < 0.9 ? 'healthy' : 'degraded'
        })));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Monitor for system issues
    const criticalIssues = healthChecks.filter(check => check.status === 'down');
    const degradedServices = healthChecks.filter(check => check.status === 'degraded');

    if (criticalIssues.length > 0) {
      warning(`${criticalIssues.length} critical system issues detected`, 'System Alert');
    } else if (degradedServices.length > 0 && Math.random() < 0.1) {
      warning(`${degradedServices.length} services experiencing issues`, 'Performance Alert');
    }
  }, [healthChecks, warning]);

  const getStatusColor = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'down':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const overallHealth = healthChecks.every(check => check.status === 'healthy') ? 'healthy' :
                       healthChecks.some(check => check.status === 'down') ? 'critical' : 'degraded';

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 left-4 z-40 p-3 rounded-full shadow-lg ${
          overallHealth === 'healthy' ? 'bg-green-600 hover:bg-green-700' :
          overallHealth === 'degraded' ? 'bg-yellow-600 hover:bg-yellow-700' :
          'bg-red-600 hover:bg-red-700'
        } text-white`}
        aria-label="System health monitor"
      >
        <Activity className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 z-40 w-96 max-h-[80vh] shadow-xl border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-lush-primary" />
            System Health
            <Badge className={getStatusColor(overallHealth === 'healthy' ? 'healthy' : 'degraded')}>
              {overallHealth}
            </Badge>
          </CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
          >
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Uptime</span>
            </div>
            <p className="text-xl font-bold text-green-600">{metrics.uptime}%</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Response</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{metrics.responseTime}ms</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Memory</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{metrics.memoryUsage}%</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Users</span>
            </div>
            <p className="text-xl font-bold text-orange-600">{metrics.activeUsers}</p>
          </div>
        </div>

        {/* Service Health Checks */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Service Health
          </h4>
          
          <div className="space-y-2">
            {healthChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  <span className="text-sm font-medium">{check.service}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{check.responseTime}ms</span>
                  <Badge className={`text-xs ${getStatusColor(check.status)}`}>
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        {overallHealth !== 'healthy' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              System performance is {overallHealth}. Some features may be affected.
              <Button variant="link" className="p-0 h-auto ml-2">
                View Details
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Last Update */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Last updated: {metrics.lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthMonitor;