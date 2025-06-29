import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Crown, MessageSquare, Shield, Database, 
  Network, Zap, Activity, Settings, Users, 
  BarChart3, Code2, Webhook, Eye
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Karol-Core Orchestrator Lab
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AGI Platform for Intelligent Systems Management
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/chat-test')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat System
              </CardTitle>
              <CardDescription>
                Test the advanced chat interface with AGI capabilities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/agi-panel')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                AGI Control Panel
              </CardTitle>
              <CardDescription>
                Complete system configuration and management interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>
                Monitor platform health and performance metrics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Feature Sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cognitive Core</CardTitle>
                <CardDescription>Advanced memory and belief processing</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Manages system memory, beliefs, and narratives.</p>
                <Badge className="mt-2">Active</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decision Engine</CardTitle>
                <CardDescription>Strategic decision-making and planning</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analyzes data and makes optimal decisions.</p>
                <Badge className="mt-2">Active</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Advanced Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Orchestration Engine</CardTitle>
                <CardDescription>Manages agents and system resources</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Optimizes performance and resource allocation.</p>
                <Badge className="mt-2">Active</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Core</CardTitle>
                <CardDescription>Protects the system from threats</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Real-time threat detection and mitigation.</p>
                <Badge className="mt-2">Active</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* System Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
                <CardDescription>Real-time performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">CPU Usage</p>
                    <p className="text-lg">75%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Memory Usage</p>
                    <p className="text-lg">60%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Status</CardTitle>
                <CardDescription>Active agents and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Active Agents</p>
                    <p className="text-lg">8</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Inactive Agents</p>
                    <p className="text-lg">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
