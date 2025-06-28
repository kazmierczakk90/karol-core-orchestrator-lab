
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Activity, FileText, Settings } from 'lucide-react';
import EnhancedChatInterface from '@/components/chat/EnhancedChatInterface';
import ChatSimulator from '@/components/chat/ChatSimulator';
import ChatAuditReport from '@/components/chat/ChatAuditReport';
import { CommandPalette } from '@/components/commands/CommandPalette';

const ChatTest = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-cyan-400 flex items-center space-x-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>Karol-Core Chat System</span>
                </CardTitle>
                <p className="text-slate-400 mt-1">
                  Zaawansowany system czatu z integracją komend i agentem CEO
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400">
                  System Ready
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400">
                  v2.0
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                <TabsTrigger 
                  value="chat" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Interface
                </TabsTrigger>
                <TabsTrigger 
                  value="simulator"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Symulator
                </TabsTrigger>
                <TabsTrigger 
                  value="audit"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Audyt
                </TabsTrigger>
                <TabsTrigger 
                  value="settings"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Ustawienia
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="min-h-[600px]">
                <EnhancedChatInterface />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <ChatSimulator />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <ChatAuditReport />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-cyan-400">Ustawienia Systemu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-300">
                  <h3 className="text-lg font-semibold mb-2">Konfiguracja</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• OpenAI API: Skonfigurowany</li>
                    <li>• Supabase: Połączony</li>
                    <li>• System komend: Aktywny</li>
                    <li>• Demo sesje: Włączone</li>
                  </ul>
                </div>
                
                <div className="text-slate-300">
                  <h3 className="text-lg font-semibold mb-2">Dostępne funkcje</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 💬 Chat z agentem CEO</li>
                    <li>• ⌨️ System komend (&pomoc)</li>
                    <li>• 🔍 Wyszukiwanie komend</li>
                    <li>• 🎯 Command Palette (⌘+K)</li>
                    <li>• 📊 Symulacja i audyt</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Command Palette - dostępna globalnie */}
        <CommandPalette />
      </div>
    </div>
  );
};

export default ChatTest;
