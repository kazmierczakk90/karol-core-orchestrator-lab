import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserPlus, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/db';
import { toast } from 'sonner';

const SecureAdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateInput = (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Email and password are required');
      return false;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    
    return true;
  };

  const createAdminAccount = async () => {
    if (!validateInput(email, password)) return;
    
    setIsLoading(true);
    
    try {
      console.log('Creating admin account securely...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'admin'
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Account already exists');
        } else {
          toast.error(`Account creation failed: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email,
            role: 'admin',
            first_name: firstName,
            last_name: lastName
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('Account created but profile setup failed');
        } else {
          toast.success('Admin account created successfully! Please check your email for verification.');
          // Clear form
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-red-800/30 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Secure Admin Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-yellow-500/10 border-yellow-500/30">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-400 text-sm">
            <strong>Security Notice:</strong> This panel creates administrator accounts with full system access. Use only for authorized personnel.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Email Address *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="bg-slate-900 border-slate-600"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-2 block">Password *</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="bg-slate-900 border-slate-600 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">First Name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="bg-slate-900 border-slate-600"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Last Name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="bg-slate-900 border-slate-600"
              />
            </div>
          </div>

          <Button
            onClick={createAdminAccount}
            disabled={isLoading || !email || !password}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isLoading ? 'Creating...' : 'Create Admin Account'}
          </Button>
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <p>• Password must be at least 8 characters</p>
          <p>• Admin accounts have full system access</p>
          <p>• Email verification required</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureAdminPanel;