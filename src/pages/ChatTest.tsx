
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Activity, FileText, Settings, Zap } from 'lucide-react';
import OptimizedLiveChatInterface from '@/components/chat/OptimizedLiveChatInterface';
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
                  <span>Karol-Core Chat System v2.0</span>
                </CardTitle>
                <p className="text-slate-400 mt-1">
                  Zoptymalizowany system czatu z 47 agentami AI
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400">
                  <Zap className="h-3 w-3 mr-1" />
                  Optymalizowany
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400">
                  47 Agentów
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
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
                  Live Chat
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
                <OptimizedLiveChatInterface />
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
                <CardTitle className="text-cyan-400">Ustawienia Systemu Czatu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-300">
                  <h3 className="text-lg font-semibold mb-2">Konfiguracja v2.0</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• ✅ OpenAI API: Skonfigurowany (Chat Completions)</li>
                    <li>• ✅ Supabase: Połączony i zoptymalizowany</li>
                    <li>• ✅ 47 Agentów Karol-Core: Aktywnych</li>
                    <li>• ✅ System wyboru agentów: Włączony</li>
                    <li>• ✅ Demo sesje: Włączone z optymalizacją</li>
                    <li>• ✅ Refetch interval: 2 minuty (zoptymalizowane)</li>
                  </ul>
                </div>
                
                <div className="text-slate-300">
                  <h3 className="text-lg font-semibold mb-2">Zaimplementowane funkcje</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 🤖 47 specjalistycznych agentów AI</li>
                    <li>• 👑 Wybór agenta przed konwersacją</li>
                    <li>• 💬 Optymalizowane API calls</li>
                    <li>• 🔍 Wyszukiwanie i filtrowanie agentów</li>
                    <li>• 📊 Monitoring połączenia i statusu</li>
                    <li>• ⚡ Ulepszona wydajność</li>
                    <li>• 💾 Persistent storage sesji</li>
                    <li>• 🎯 Command system (&commands)</li>
                  </ul>
                </div>

                <div className="text-slate-300">
                  <h3 className="text-lg font-semibold mb-2">Dostępne kategorie agentów</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• 👑 Zarządzanie</div>
                    <div>• 🔮 Rdzeń Systemu</div>
                    <div>• 📊 Analityka</div>
                    <div>• 🎤 Komunikacja</div>
                    <div>• 🔀 Routing</div>
                    <div>• 🛡️ Bezpieczeństwo</div>
                    <div>• ☁️ Chmura</div>
                    <div>• 📱 Rozwój</div>
                    <div>• 🎉 Rozrywka</div>
                    <div>• 🗄️ Dane</div>
                    <div>• 🌐 Integracje</div>
                  </div>
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
