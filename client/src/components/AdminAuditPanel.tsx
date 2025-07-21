import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Eye, 
  Search,
  Filter,
  Download,
  Clock,
  User,
  Monitor,
  AlertCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  impersonatedUser?: string;
  targetUser?: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sessionId?: string;
  additionalData?: any;
}

interface AuditStats {
  totalLogs: number;
  highRiskCount: number;
  impersonationCount: number;
  recentActivity: number;
}

const AdminAuditPanel = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      
      // Fetch audit logs
      const logsResponse = await fetch('/api/audit/logs?limit=50', {
        headers: {
          'x-user-role': 'admin'
        }
      });
      const logsData = await logsResponse.json();
      
      // Fetch audit stats
      const statsResponse = await fetch('/api/audit/stats', {
        headers: {
          'x-user-role': 'admin'
        }
      });
      const statsData = await statsResponse.json();
      
      if (logsData.success) {
        setAuditLogs(logsData.logs);
      }
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800',
      CRITICAL: 'bg-purple-100 text-purple-800'
    };
    return colors[riskLevel] || 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('IMPERSONATION')) return <Shield className="h-4 w-4" />;
    if (action.includes('LOGIN')) return <User className="h-4 w-4" />;
    if (action.includes('PORTAL')) return <Monitor className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.impersonatedUser && log.impersonatedUser.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesRisk = riskFilter === 'all' || log.riskLevel === riskFilter;
    
    return matchesSearch && matchesAction && matchesRisk;
  });

  const exportAuditLogs = () => {
    const csv = [
      ['Timestamp', 'Action', 'Performed By', 'Target User', 'Risk Level', 'IP Address', 'Session ID'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.action,
        log.performedBy,
        log.impersonatedUser || log.targetUser || '',
        log.riskLevel,
        log.ip,
        log.sessionId || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lush-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Audit Panel</h1>
          <p className="text-gray-600">Monitor user activities and security events</p>
        </div>
        <Button onClick={exportAuditLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalLogs}</div>
                  <div className="text-sm text-gray-600">Total Logs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.highRiskCount}</div>
                  <div className="text-sm text-gray-600">High Risk Events</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.impersonationCount}</div>
                  <div className="text-sm text-gray-600">Impersonations</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.recentActivity}</div>
                  <div className="text-sm text-gray-600">Last 24 Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by action, user, or target..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="SUPERADMIN_IMPERSONATION">Impersonation</SelectItem>
                  <SelectItem value="ADMIN_PORTAL_PREVIEW">Portal Preview</SelectItem>
                  <SelectItem value="USER_LOGIN">User Login</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Security Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit logs found</h3>
              <p className="text-gray-600">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold">{log.action.replace(/_/g, ' ')}</span>
                          <Badge className={getRiskLevelColor(log.riskLevel)}>
                            {log.riskLevel}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            <span className="font-medium">Performed by:</span> {log.performedBy}
                          </div>
                          {log.impersonatedUser && (
                            <div>
                              <span className="font-medium">Impersonated:</span> {log.impersonatedUser}
                            </div>
                          )}
                          {log.targetUser && (
                            <div>
                              <span className="font-medium">Target user:</span> {log.targetUser}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">IP:</span> {log.ip} | 
                            <span className="font-medium"> Time:</span> {new Date(log.timestamp).toLocaleString()}
                          </div>
                          {log.sessionId && (
                            <div>
                              <span className="font-medium">Session:</span> {log.sessionId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditPanel;