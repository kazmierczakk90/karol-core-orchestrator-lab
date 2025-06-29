
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { BookOpen, Download, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NarrativeBuilderModule = () => {
  const { toast } = useToast();
  const [narrative, setNarrative] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSnapshot, setLastSnapshot] = useState('10:45:32');

  const generateNarrative = () => {
    setIsGenerating(true);
    
    // Simulate narrative generation
    setTimeout(() => {
      const sampleNarrative = `## System Narrative - ${new Date().toLocaleTimeString()}

**Cognitive State**: Elevated processing detected across memory cores
**Agent Activity**: @voice-core engaged in style synthesis, @evolution-tracker monitoring adaptation patterns
**Decision Flow**: 3 major decisions processed, 2 optimization cycles completed
**Memory Integration**: Semantic compression active, episodic memory consolidated

**Key Insights**: 
- Enhanced pattern recognition emerging in decision pathways
- Cross-agent communication efficiency improved by 15%
- Memory utilization optimized through recursive analysis

**Narrative Summary**: The system demonstrates increased cognitive coherence with adaptive learning patterns stabilizing across multiple agent interactions.`;

      setNarrative(sampleNarrative);
      setIsGenerating(false);
      setLastSnapshot(new Date().toLocaleTimeString());
      
      toast({
        title: "Narracja wygenerowana",
        description: "@voice-core zakończył analizę snapshotów",
      });
    }, 2000);
  };

  const exportNarrative = () => {
    const data = {
      timestamp: new Date().toISOString(),
      agent: '@voice-core',
      narrative_text: narrative,
      format: 'markdown',
      snapshot_source: lastSnapshot
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `narrative_${Date.now()}.json`;
    link.click();

    toast({
      title: "Narracja wyeksportowana",
      description: "Plik JSON został pobrany",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>Narrative Builder</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-cyan-400">@voice-core</Badge>
          <Badge variant="secondary" className="text-xs">
            Last: {lastSnapshot}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300">System Narrative</Label>
          <div className="flex space-x-2">
            <Button 
              onClick={generateNarrative} 
              disabled={isGenerating}
              size="sm" 
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Generate
            </Button>
            <Button 
              onClick={exportNarrative} 
              disabled={!narrative}
              size="sm" 
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <Textarea
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          className="bg-slate-900/50 border-slate-600 text-white font-mono min-h-48"
          placeholder="Narracja zostanie wygenerowana na podstawie analizy snapshotów..."
        />

        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">
            <div>Trigger: snapshot analysis</div>
            <div>Format: JSON + Markdown</div>
            <div>Agent: @voice-core active</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NarrativeBuilderModule;
