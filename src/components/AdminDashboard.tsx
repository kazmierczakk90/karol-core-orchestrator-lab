
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  Shield, 
  Database, 
  Settings,
  UserPlus,
  Key,
  Activity
} from 'lucide-react';
import PlatformAudit from './PlatformAudit';

interface UserInfo {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
}

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadUsers();
    }
  }, [profile]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Get user profiles from our profiles table
      const { data: profiles, error } = await supabase
        .rpc('get_all_user_profiles');

      if (error) throw error;

      setUsers(profiles || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const createTestAccounts = async () => {
    setIsLoading(true);
    try {
      // Create admin account
      const { error: adminError } = await supabase.auth.signUp({
        email: 'karolkazmierczak90@gmail.com',
        password: 'Terefere123#',
        options: {
          data: {
            first_name: 'Karol',
            last_name: 'Kazmierczak',
            role: 'admin'
          }
        }
      });

      if (adminError && !adminError.message.includes('already registered')) {
        throw adminError;
      }

      // Create test user account
      const { error: testError } = await supabase.auth.signUp({
        email: 'test@test',
        password: '12345678',
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User',
            role: 'user'
          }
        }
      });

      if (testError && !testError.message.includes('already registered')) {
        throw testError;
      }

      // Update roles in profiles table
      await supabase.rpc('update_user_role', {
        user_email: 'karolkazmierczak90@gmail.com',
        new_role: 'admin'
      });

      await supabase.rpc('update_user_role', {
        user_email: 'test@test',
        new_role: 'user'
      });

      toast.success('Test accounts created successfully!');
      loadUsers();

    } catch (error) {
      console.error('Error creating test accounts:', error);
      toast.error('Failed to create test accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            role: newUserRole
          }
        }
      });

      if (error) throw error;

      // Update role in profiles table
      await supabase.rpc('update_user_role', {
        user_email: newUserEmail,
        new_role: newUserRole
      });

      toast.success('User created successfully!');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('user');
      loadUsers();

    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.rpc('update_user_role_by_id', {
        user_id: userId,
        new_role: newRole
      });

      if (error) throw error;

      toast.success('User role updated successfully!');
      loadUsers();

    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <Card className="bg-slate-800/50 border-red-800/30">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-400">
            <Shield className="h-5 w-5" />
            <span>Access Denied - Admin privileges required</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Admin Dashboard</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Platform administration and user management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={createTestAccounts}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Test Accounts
            </Button>
            
            <Button 
              onClick={loadUsers}
              disabled={isLoading}
              variant="outline"
              className="border-cyan-500/50 text-cyan-400"
            >
              <Users className="h-4 w-4 mr-2" />
              Refresh Users
            </Button>
            
            <Button 
              onClick={() => window.open('https://supabase.com/dashboard/project/xhhgaysawtaeimxeodfd/auth/users', '_blank')}
              variant="outline"
              className="border-blue-500/50 text-blue-400"
            >
              <Database className="h-4 w-4 mr-2" />
              Supabase Auth
            </Button>
          </div>

          {/* Create New User */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white text-lg">Create New User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="bg-slate-800/50 border border-slate-700/50 text-white rounded px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
                <Button 
                  onClick={createUser}
                  disabled={isLoading}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Create User
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>System Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-slate-400">Loading users...</div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{user.email}</span>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400">
                          Created: {new Date(user.created_at).toLocaleDateString()}
                          {user.last_sign_in_at && (
                            <span className="ml-4">
                              Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                          className="border-yellow-500/50 text-yellow-400"
                        >
                          {user.role === 'admin' ? 'Demote' : 'Promote'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {users.length === 0 && (
                    <div className="text-center text-slate-400 py-8">
                      No users found. Create test accounts to get started.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Platform Audit Section */}
      <PlatformAudit />
    </div>
  );
};

export default AdminDashboard;
