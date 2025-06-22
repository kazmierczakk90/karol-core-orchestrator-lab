
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Clock, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TemporalEvent {
  id: string;
  timestamp: Date;
  event: string;
  probability: number;
  impact: number;
  causalChain: string[];
}

interface TimeHorizon {
  short: TemporalEvent[];
  medium: TemporalEvent[];
  long: TemporalEvent[];
}

const TemporalAwareness = () => {
  const [timeHorizons, setTimeHorizons] = useState<TimeHorizon>({
    short: [],
    medium: [],
    long: []
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [settings, setSettings] = useState({
    shortTermDays: 7,
    mediumTermWeeks: 12,
    longTermMonths: 24,
    probabilityThreshold: 0.3,
    causalDepth: 3,
    enablePrediction: true,
    updateInterval: 5000
  });

  useEffect(() => {
    if (settings.enablePrediction) {
      const interval = setInterval(() => {
        generateTemporalProjections();
      }, settings.updateInterval);
      return () => clearInterval(interval);
    }
  }, [settings]);

  const generateTemporalProjections = async () => {
    setIsAnalyzing(true);

    const events = [
      "System performance optimization",
      "Agent capability evolution",
      "Decision complexity increase",
      "Resource demand spike",
      "Network latency improvement",
      "Data processing enhancement"
    ];

    const generateEvents = (timeframe: 'short' | 'medium' | 'long', count: number) => {
      const newEvents: TemporalEvent[] = [];
      const baseDate = new Date();
      
      for (let i = 0; i < count; i++) {
        let futureDate = new Date(baseDate);
        
        switch (timeframe) {
          case 'short':
            futureDate.setDate(baseDate.getDate() + Math.floor(Math.random() * settings.shortTermDays));
            break;
          case 'medium':
            futureDate.setDate(baseDate.getDate() + Math.floor(Math.random() * settings.mediumTermWeeks * 7));
            break;
          case 'long':
            futureDate.setMonth(baseDate.getMonth() + Math.floor(Math.random() * settings.longTermMonths));
            break;
        }

        const causalChain = [];
        for (let j = 0; j < settings.causalDepth; j++) {
          causalChain.push(`Cause-${j + 1}: ${events[Math.floor(Math.random() * events.length)]}`);
        }

        newEvents.push({
          id: `event_${timeframe}_${Date.now()}_${i}`,
          timestamp: futureDate,
          event: events[Math.floor(Math.random() * events.length)],
          probability: Math.max(settings.probabilityThreshold, Math.random()),
          impact: Math.random(),
          causalChain
        });
      }
      
      return newEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    };

    setTimeHorizons({
      short: generateEvents('short', 3),
      medium: generateEvents('medium', 4),
      long: generateEvents('long', 5)
    });

    setIsAnalyzing(false);
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'short': return 'text-green-400 border-green-500/50';
      case 'medium': return 'text-yellow-400 border-yellow-500/50';
      case 'long': return 'text-red-400 border-red-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

  const SettingsDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-blue-400">Temporal Awareness Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium">Short Term (days): {settings.shortTermDays}</label>
            <Slider
              value={[settings.shortTermDays]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, shortTermDays: value }))}
              min={1}
              max={30}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <label className="text-white text-sm font-medium">Medium Term (weeks): {settings.mediumTermWeeks}</label>
            <Slider
              value={[settings.mediumTermWeeks]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, mediumTermWeeks: value }))}
              min={4}
              max={52}
              step={2}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Long Term (months): {settings.longTermMonths}</label>
            <Slider
              value={[settings.longTermMonths]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, longTermMonths: value }))}
              min={6}
              max={60}
              step={3}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Probability Threshold: {settings.probabilityThreshold}</label>
            <Slider
              value={[settings.probabilityThreshold]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, probabilityThreshold: value }))}
              min={0.1}
              max={0.9}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Causal Depth: {settings.causalDepth}</label>
            <Slider
              value={[settings.causalDepth]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, causalDepth: value }))}
              min={1}
              max={10}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Auto Prediction</span>
            <Switch
              checked={settings.enablePrediction}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enablePrediction: checked }))}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderTimeframe = (title: string, events: TemporalEvent[], timeframe: string) => (
    <Card className="bg-slate-700/50 border-slate-600/50">
      <CardHeader>
        <CardTitle className={`flex items-center space-x-2 ${getTimeframeColor(timeframe)}`}>
          <Clock className="h-5 w-5" />
          <span>{title}</span>
          <Badge variant="outline" className={getTimeframeColor(timeframe)}>
            {events.length} events
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="p-3 bg-slate-600/30 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium text-sm">{event.event}</h4>
                  <p className="text-slate-400 text-xs">
                    {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="outline" className="text-xs">
                    P: {Math.round(event.probability * 100)}%
                  </Badge>
                  <br />
                  <Badge variant="outline" className="text-xs">
                    Impact: {Math.round(event.impact * 100)}%
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1">
                <Progress value={event.probability * 100} className="h-1" />
                <Progress value={event.impact * 100} className="h-1" />
              </div>
              
              <details className="mt-2">
                <summary className="text-cyan-400 text-xs cursor-pointer hover:text-cyan-300">
                  Causal Chain ({event.causalChain.length} steps)
                </summary>
                <div className="mt-2 space-y-1">
                  {event.causalChain.map((cause, index) => (
                    <div key={index} className="flex items-center text-xs text-slate-400">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {cause}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-400 flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Temporal Awareness Engine - Level 16</span>
            {isAnalyzing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            )}
          </CardTitle>
          <SettingsDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={generateTemporalProjections}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Generate Temporal Analysis
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              Short: {timeHorizons.short.length}
            </Badge>
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
              Medium: {timeHorizons.medium.length}
            </Badge>
            <Badge variant="outline" className="border-red-500/50 text-red-400">
              Long: {timeHorizons.long.length}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {renderTimeframe("Short Term Horizon", timeHorizons.short, "short")}
          {renderTimeframe("Medium Term Horizon", timeHorizons.medium, "medium")}
          {renderTimeframe("Long Term Horizon", timeHorizons.long, "long")}
        </div>

        {Object.values(timeHorizons).every(horizon => horizon.length === 0) && (
          <div className="text-center py-12 text-slate-400">
            <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No temporal projections available</p>
            <p className="text-sm">Generate analysis to see future predictions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemporalAwareness;
