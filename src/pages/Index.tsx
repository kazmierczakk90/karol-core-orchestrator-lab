
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AGIDashboard from "@/components/AGIDashboard";
import SystemOverview from "@/components/SystemOverview";
import AgentCommander from "@/components/AgentCommander";
import MiniAIDashboard from "@/components/MiniAIDashboard";
import OpenAIChat from "@/components/OpenAIChat";
import AdminDashboard from "@/components/AdminDashboard";
import PlatformAudit from "@/components/PlatformAudit";
import ComprehensivePlatformAudit from "@/components/ComprehensivePlatformAudit";
import OptimizationManager from "@/components/OptimizationManager";
import ErrorLogger from "@/components/ErrorLogger";
import ErrorReportGenerator from "@/components/ErrorReportGenerator";
import UserProfile from "@/components/UserProfile";
import { Activity, Brain, Users, Settings, Shield, TrendingUp, Bug, FileText } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Karol-Core AGI Platform
              </h1>
              <p className="text-slate-300 mt-2">
                Advanced Artificial General Intelligence Orchestration System
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                System Active
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Demo Mode
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-800/50">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="mini-ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Mini-AI</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Audit</span>
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Optimize</span>
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span className="hidden sm:inline">Errors</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6">
              <AGIDashboard />
              <SystemOverview />
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <AgentCommander />
          </TabsContent>

          <TabsContent value="mini-ai" className="space-y-6">
            <MiniAIDashboard />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <OpenAIChat />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <div className="grid gap-6">
              <AdminDashboard />
              <UserProfile />
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <div className="grid gap-6">
              <ComprehensivePlatformAudit />
              <PlatformAudit />
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <OptimizationManager />
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            <div className="grid gap-6">
              <ErrorLogger />
              <ErrorReportGenerator />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Karol-Core AGI Platform v2.0.0 | Advanced AI Orchestration System
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Powered by React, Supabase, and OpenAI | Built for scalable AI operations
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
