
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Zap, Settings, Copy, Download } from 'lucide-react';
import { useEDICT } from '@/hooks/useEDICT';
import type { EDICTPrompt } from '@/types/edict';

const PromptOrchestrator = () => {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<'lite' | 'advanced'>('lite');
  const { prompts, isProcessing, currentAnalysis, processPrompt, analyzeIntention, loadPrompts } = useEDICT();

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleProcess = async () => {
    if (!originalPrompt.trim()) return;
    
    await processPrompt(originalPrompt, selectedMode);
    setOriginalPrompt('');
  };

  const handleAnalyze = async () => {
    if (!originalPrompt.trim()) return;
    await analyzeIntention(originalPrompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>EDICT Logic - Meta-Engine Prompt Orchestrator</span>
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Dwuetapowy proces generowania promptów z analizą intencji i wzbogaceniem o reguły systemowe
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Original Prompt</label>
            <Textarea
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              placeholder="Wprowadź swój oryginalny prompt do przetworzenia przez EDICT Logic..."
              className="bg-slate-900/50 border-slate-700/50 text-white min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Orchestration Mode</label>
              <div className="flex space-x-2">
                <Button
                  variant={selectedMode === 'lite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMode('lite')}
                  className={selectedMode === 'lite' ? 'bg-cyan-600' : 'border-slate-600 text-slate-300'}
                >
                  Lite Mode
                </Button>
                <Button
                  variant={selectedMode === 'advanced' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMode('advanced')}
                  className={selectedMode === 'advanced' ? 'bg-purple-600' : 'border-slate-600 text-slate-300'}
                >
                  Advanced Mode
                </Button>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleAnalyze}
              variant="outline"
              disabled={!originalPrompt.trim()}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Settings className="h-4 w-4 mr-2" />
              Analyze Intention
            </Button>
            <Button
              onClick={handleProcess}
              disabled={!originalPrompt.trim() || isProcessing}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Process with EDICT'}
            </Button>
          </div>

          {currentAnalysis && (
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-blue-400 text-lg">Intention Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-sm">User Goal:</span>
                    <p className="text-white text-sm">{currentAnalysis.user_goal}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Complexity:</span>
                    <Badge className={`ml-2 ${
                      currentAnalysis.complexity_level === 'complex' ? 'bg-red-500/20 text-red-400' :
                      currentAnalysis.complexity_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {currentAnalysis.complexity_level}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Context Required:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentAnalysis.context_required.map((context, index) => (
                      <Badge key={index} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                        {context}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
          <TabsTrigger value="recent" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Recent Prompts
          </TabsTrigger>
          <TabsTrigger value="library" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Prompt Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {prompts.map((prompt: EDICTPrompt) => (
                <Card key={prompt.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={`${
                        prompt.orchestration_mode === 'advanced' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {prompt.orchestration_mode} mode
                      </Badge>
                      <span className="text-slate-400 text-xs">
                        {new Date(prompt.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-400 text-sm">Original:</span>
                        <p className="text-white text-sm bg-slate-900/50 p-2 rounded border-l-2 border-blue-500/50">
                          {prompt.original_prompt}
                        </p>
                      </div>
                      
                      {prompt.generated_prompt && (
                        <div>
                          <span className="text-slate-400 text-sm">Generated:</span>
                          <div className="relative">
                            <pre className="text-white text-sm bg-slate-900/50 p-3 rounded border-l-2 border-cyan-500/50 overflow-x-auto whitespace-pre-wrap">
                              {prompt.generated_prompt}
                            </pre>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(prompt.generated_prompt!)}
                              className="absolute top-2 right-2 text-slate-400 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {prompts.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No processed prompts yet</p>
                  <p className="text-sm">Create your first EDICT processed prompt above</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-white text-lg font-medium mb-2">Prompt Library</h3>
              <p className="text-slate-400 text-sm mb-4">
                Save and organize your best EDICT processed prompts for future use
              </p>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptOrchestrator;
