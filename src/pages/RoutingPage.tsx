import { useState } from 'react';
import RoutingManager from '@/components/routing/RoutingManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, GitBranch, Workflow } from 'lucide-react';

const RoutingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Intelligent Routing System
            </h1>
            <p className="text-slate-400">
              System inteligentnego routingu KAROL-Core AGI - przypisywanie agentów na podstawie kontekstu
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                <CardTitle className="text-white text-lg">Routing Engine</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Inteligentne przypisywanie agentów na podstawie ~1890 kombinacji kategorii i segmentów użytkowników
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white text-lg">27 Kategorii</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Od prowadzenia klubu DJ, przez marketing, po compliance i AI automation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-green-400" />
                <CardTitle className="text-white text-lg">7 Segmentów</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Segmentacja od nowych użytkowników po VIP i specjalistycznych twórców
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="routing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="routing">Routing Manager</TabsTrigger>
            <TabsTrigger value="info">Informacje o systemie</TabsTrigger>
          </TabsList>

          <TabsContent value="routing">
            <RoutingManager />
          </TabsContent>

          <TabsContent value="info">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">O systemie routingu</CardTitle>
                <CardDescription>
                  System bazuje na pliku full_combinations_generator_1.py
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Kategorie (27)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-400">
                    <div>• Prowadzenie klubu DJ</div>
                    <div>• Promocja wydarzenia</div>
                    <div>• Analiza klienta</div>
                    <div>• Onboarding nowy user</div>
                    <div>• Upselling subskrypcja</div>
                    <div>• Wsparcie techniczne</div>
                    <div>• Rozwój kariery DJ</div>
                    <div>• Networking community</div>
                    <div>• Organizacja eventu</div>
                    <div>• Sprzedaż biletów</div>
                    <div>• Feedback po evencie</div>
                    <div>• Strategia marketingowa</div>
                    <div>• Content creator</div>
                    <div>• Partnership/sponsoring</div>
                    <div>• Szkolenia/warsztaty</div>
                    <div>• Moderacja platformy</div>
                    <div>• Analityka biznesowa</div>
                    <div>• Crisis management</div>
                    <div>• Legal compliance</div>
                    <div>• Finance/rozliczenia</div>
                    <div>• Innowacje produktowe</div>
                    <div>• Customer success</div>
                    <div>• User research</div>
                    <div>• Security/bezpieczeństwo</div>
                    <div>• Scalability/infra</div>
                    <div>• AI automation</div>
                    <div>• Ecosystem integration</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Segmenty użytkowników (7)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
                    <div>• Nowy (0-7 dni)</div>
                    <div>• Eksplorujący (7-30 dni)</div>
                    <div>• Aktywny (30-90 dni)</div>
                    <div>• VIP (90+ high activity)</div>
                    <div>• Churn Risk (brak aktywności)</div>
                    <div>• DJ/Artysta/Twórca</div>
                    <div>• Promotor/Event Manager</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pool agentów</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-400">
                    <div>• AGENT_FUKO</div>
                    <div>• AGENT_0</div>
                    <div>• AGENT_CEO</div>
                    <div>• AGENT_FORGE</div>
                    <div>• MINI_AI_Coach</div>
                    <div>• MINI_AI_Analyzer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RoutingPage;
