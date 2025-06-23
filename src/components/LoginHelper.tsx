
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, User, Key, Info } from 'lucide-react';
import { useAdminSetup } from '@/hooks/useAdminSetup';

const LoginHelper = () => {
  const { adminCredentials, testCredentials, isSetupComplete, isLoading } = useAdminSetup();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-cyan-800/30 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-300">Setting up default accounts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30 mb-6">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Default Login Credentials</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Use these credentials to access the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Admin Account */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-red-400" />
              <span className="text-white font-semibold">Administrator Account</span>
            </div>
            <Badge className="bg-red-500/20 text-red-400">Admin</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-slate-800 px-2 py-1 rounded text-white text-sm">
                  {adminCredentials.email}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(adminCredentials.email)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  📋
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Password:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-slate-800 px-2 py-1 rounded text-white text-sm">
                  {adminCredentials.password}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(adminCredentials.password)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  📋
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-red-500/10 rounded border border-red-500/20">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">
                Full admin access to all platform features, user management, and system settings.
              </p>
            </div>
          </div>
        </div>

        {/* Test Account */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-white font-semibold">Test User Account</span>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400">User</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-slate-800 px-2 py-1 rounded text-white text-sm">
                  {testCredentials.email}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(testCredentials.email)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  📋
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Password:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-slate-800 px-2 py-1 rounded text-white text-sm">
                  {testCredentials.password}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(testCredentials.password)}
                  className="h-6 w-6 p-0 text-Slate-400 hover:text-white"
                >
                  📋
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-500/20">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-blue-300 text-sm">
                Standard user access for testing regular user functionality.
              </p>
            </div>
          </div>
        </div>

        {isSetupComplete && (
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Default accounts are ready for use</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginHelper;
