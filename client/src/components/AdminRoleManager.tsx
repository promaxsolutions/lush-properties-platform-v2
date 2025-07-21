import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Edit3, 
  Trash2, 
  Mail, 
  Crown,
  Hammer,
  Home,
  Briefcase,
  Calculator,
  Building,
  Search,
  Filter,
  MoreVertical,
  Check,
  X
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  lastActive: Date;
  projects: number;
  joinDate: Date;
}

const mockUsers: User[] = [
  { 
    id: 1, 
    name: "David Chen", 
    email: "david@lushproperties.com", 
    role: "broker", 
    status: "active",
    lastActive: new Date("2024-07-19T16:30:00"),
    projects: 8,
    joinDate: new Date("2024-01-15")
  },
  { 
    id: 2, 
    name: "Amaka Okafor", 
    email: "amaka@lushproperties.com", 
    role: "builder", 
    status: "active",
    lastActive: new Date("2024-07-19T15:45:00"),
    projects: 3,
    joinDate: new Date("2024-03-20")
  },
  { 
    id: 3, 
    name: "Tunde Williams", 
    email: "tunde@client.email.com", 
    role: "client", 
    status: "active",
    lastActive: new Date("2024-07-19T14:20:00"),
    projects: 1,
    joinDate: new Date("2024-06-10")
  },
  { 
    id: 4, 
    name: "Zainab Al-Rashid", 
    email: "zainab@lushproperties.com", 
    role: "admin", 
    status: "active",
    lastActive: new Date("2024-07-19T17:00:00"),
    projects: 12,
    joinDate: new Date("2023-11-01")
  },
  { 
    id: 5, 
    name: "Marcus Thompson", 
    email: "marcus@investor.com", 
    role: "investor", 
    status: "active",
    lastActive: new Date("2024-07-18T10:30:00"),
    projects: 5,
    joinDate: new Date("2024-02-28")
  },
  { 
    id: 6, 
    name: "Sarah Mitchell", 
    email: "sarah@accounting.com", 
    role: "accountant", 
    status: "pending",
    lastActive: new Date("2024-07-15T09:00:00"),
    projects: 0,
    joinDate: new Date("2024-07-15")
  }
];

const AdminRoleManager = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "client"
  });
  const [showNewUserForm, setShowNewUserForm] = useState(false);

  const roleIcons: Record<string, React.ReactNode> = {
    admin: <Crown className="h-4 w-4" />,
    broker: <Building className="h-4 w-4" />,
    builder: <Hammer className="h-4 w-4" />,
    client: <Home className="h-4 w-4" />,
    investor: <Briefcase className="h-4 w-4" />,
    accountant: <Calculator className="h-4 w-4" />
  };

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    broker: "bg-blue-100 text-blue-800",
    builder: "bg-orange-100 text-orange-800",
    client: "bg-green-100 text-green-800",
    investor: "bg-purple-100 text-purple-800",
    accountant: "bg-yellow-100 text-yellow-800"
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800"
  };

  // Admin editing roles and logging
  const handleRoleUpdate = (userId: number, newRole: string) => {
    const user = users.find(u => u.id === userId);
    const currentUser = { email: 'admin@lush.com' }; // Mock current user
    
    if (user) {
      // Update user role
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, role: newRole }
          : u
      ));
      setEditingUserId(null);
      
      // Log activity with comprehensive audit trail
      logActivity({ 
        action: 'Role Change', 
        by: currentUser.email, 
        target: userId, 
        role: newRole,
        previousRole: user.role,
        userName: user.name,
        timestamp: new Date().toISOString(),
        severity: 'HIGH'
      });
      
      // Success notification
      window.dispatchEvent(new CustomEvent('uploadComplete', {
        detail: { 
          message: `✅ Role updated: ${user.name} changed from ${user.role} to ${newRole}` 
        }
      }));
    }
  };

  const logActivity = (activityData: any) => {
    console.log('[ADMIN-AUDIT] Role change logged:', activityData);
    
    // Send to backend audit system
    fetch('/api/audit-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...activityData,
        ip: '192.168.1.100', // Mock IP
        userAgent: navigator.userAgent
      })
    }).catch(err => console.error('Failed to log activity:', err));
  };

  const updateUserStatus = (userId: number, newStatus: 'active' | 'pending' | 'suspended') => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      alert(`✅ Status updated for ${user.name} to ${newStatus}`);
    }
  };

  const deleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert(`✅ User ${user.name} has been removed`);
    }
  };

  const addNewUser = async () => {
    if (newUserForm.name && newUserForm.email) {
      try {
        const response = await fetch('/api/team/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newUserForm.name,
            email: newUserForm.email,
            role: newUserForm.role,
            createdBy: 1 // Mock admin user ID - in real app, get from auth
          })
        });

        const result = await response.json();
        
        if (result.success) {
          // Add to local state with pending status
          const newUser: User = {
            id: Date.now(), // Temporary ID for frontend
            name: newUserForm.name,
            email: newUserForm.email,
            role: newUserForm.role,
            status: 'pending',
            lastActive: new Date(),
            projects: 0,
            joinDate: new Date()
          };
          
          setUsers(prev => [...prev, newUser]);
          setNewUserForm({ name: "", email: "", role: "client" });
          setShowNewUserForm(false);
          alert(`✅ Invitation sent to ${newUser.name} at ${newUser.email}`);
        } else {
          alert(`❌ Failed to send invitation: ${result.message}`);
        }
      } catch (error) {
        console.error('Invitation error:', error);
        alert('❌ Failed to send invitation. Please check your connection.');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = users.reduce((acc, user) => {
    acc[user.status] = (acc[user.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👥 User Role Manager</h1>
          <p className="text-gray-600 mt-1">Manage team access and permissions</p>
        </div>
        <Button 
          onClick={() => setShowNewUserForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.active || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</p>
              </div>
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-red-600">{roleCounts.admin || 0}</p>
              </div>
              <Crown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="broker">Broker</option>
              <option value="builder">Builder</option>
              <option value="client">Client</option>
              <option value="investor">Investor</option>
              <option value="accountant">Accountant</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* New User Form */}
      {showNewUserForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add New User</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNewUserForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Full Name"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Email Address"
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
              />
              <select
                value={newUserForm.role}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              >
                <option value="client">Client</option>
                <option value="builder">Builder</option>
                <option value="broker">Broker</option>
                <option value="investor">Investor</option>
                <option value="accountant">Accountant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addNewUser} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <Button variant="outline" onClick={() => setShowNewUserForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Projects</th>
                  <th className="text-left py-3 px-4">Last Active</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {editingUserId === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                          autoFocus
                        >
                          <option value="admin">Admin</option>
                          <option value="broker">Broker</option>
                          <option value="builder">Builder</option>
                          <option value="client">Client</option>
                          <option value="investor">Investor</option>
                          <option value="accountant">Accountant</option>
                        </select>
                      ) : (
                        <Badge className={`${roleColors[user.role]} flex items-center gap-1 w-fit`}>
                          {roleIcons[user.role]}
                          {user.role}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[user.status]}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.projects}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {user.lastActive.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingUserId(editingUserId === user.id ? null : user.id)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        
                        <select
                          value={user.status}
                          onChange={(e) => updateUserStatus(user.id, e.target.value as any)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-4 border-t">
        <p className="text-xs text-gray-400">
          Lush OS Secure Panel — Manage all roles and team access
        </p>
      </div>
    </div>
  );
};

export default AdminRoleManager;