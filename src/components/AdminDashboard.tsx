
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/db';
import { toast } from 'sonner';
import { 
  Users, 
  Shield, 
  Database, 
  Settings,
  UserPlus,
  Key,
  Activity,
  RefreshCw
} from 'lucide-react';
import PlatformAudit from './PlatformAudit';

interface UserInfo {
  id: string;
  email: string;
  role: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
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
      console.log('Loading users...');
      
      // Bezpośrednie zapytanie SQL zamiast RPC
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        throw error;
      }

      console.log('Users loaded successfully:', profiles?.length);
      setUsers(profiles as UserInfo[] || []);
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
      console.log('Creating test accounts...');
      
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
        console.error('Admin account creation error:', adminError);
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
        console.error('Test account creation error:', testError);
        throw testError;
      }

      // Wait a bit for the accounts to be created
      setTimeout(async () => {
        // Update roles in profiles table
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('email', 'karolkazmierczak90@gmail.com');

        await supabase
          .from('profiles')
          .update({ role: 'user' })
          .eq('email', 'test@test');

        toast.success('Test accounts created successfully!');
        loadUsers();
      }, 2000);

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
      console.log('Creating new user:', newUserEmail);
      
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

      // Update role in profiles table after a delay
      setTimeout(async () => {
        await supabase
          .from('profiles')
          .update({ role: newUserRole })
          .eq('email', newUserEmail);

        toast.success('User created successfully!');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('user');
        loadUsers();
      }, 1000);

    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      console.log('Updating user role:', userId, newRole);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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

            <Button 
              onClick={() => window.open('https://supabase.com/dashboard/project/xhhgaysawtaeimxeodfd/editor', '_blank')}
              variant="outline"
              className="border-purple-500/50 text-purple-400"
            >
              <Key className="h-4 w-4 mr-2" />
              SQL Editor
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
                  {isLoading ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>System Users ({users.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-slate-400 py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  Loading users...
                </div>
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
                          {user.first_name && (
                            <span className="ml-4">
                              Name: {user.first_name} {user.last_name}
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
