
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import AGIDashboard from '@/components/AGIDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RealTimeMonitor from '@/components/RealTimeMonitor';
import { 
  Brain, 
  Settings, 
  Activity, 
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

const Index = () => {
  const { user, profile } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'admin'>('dashboard');

  const handleLogoClick = () => {
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header onLogoClick={handleLogoClick} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to Karol Core AGI Platform
              </h1>
              <p className="text-slate-300">
                Advanced Artificial General Intelligence Platform
                {profile && (
                  <span className="ml-2">
                    - Logged in as{' '}
                    <span className="text-cyan-400 font-medium">
                      {profile.first_name || user?.email?.split('@')[0]}
                    </span>
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {profile?.role === 'admin' && (
                <Button
                  onClick={() => setActiveView(activeView === 'admin' ? 'dashboard' : 'admin')}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {activeView === 'admin' ? 'Dashboard' : 'Admin Panel'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center space-x-4 mt-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="h-3 w-3 mr-1" />
              System Online
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Brain className="h-3 w-3 mr-1" />
              AI Ready
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Zap className="h-3 w-3 mr-1" />
              Real-time Active
            </Badge>
            {profile?.role === 'admin' && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {activeView === 'dashboard' ? (
              <AGIDashboard />
            ) : (
              <AdminDashboard />
            )}
          </div>
          
          <div className="space-y-6">
            <RealTimeMonitor />
            
            {/* Quick Stats */}
            <div className="bg-slate-800/50 border border-cyan-800/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Platform Status</span>
                  <span className="text-green-400 font-medium">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">AI Integration</span>
                  <span className="text-green-400 font-medium">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">User Role</span>
                  <span className="text-cyan-400 font-medium capitalize">
                    {profile?.role || 'User'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Session</span>
                  <span className="text-blue-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
