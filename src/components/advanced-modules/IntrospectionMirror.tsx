
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Brain, Activity, AlertTriangle } from 'lucide-react';

interface CognitiveState {
  awarenessLevel: number;
  reflectionDepth: number;
  selfKnowledge: number;
  metacognition: number;
  introspectiveAccuracy: number;
}

interface IntrospectionSession {
  id: string;
  timestamp: Date;
  focusArea: string;
  insights: string[];
  cognitiveLoad: number;
  revelationScore: number;
}

const IntrospectionMirror = () => {
  const [isActive, setIsActive] = useState(true);
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    awarenessLevel: 78.5,
    reflectionDepth: 85.2,
    selfKnowledge: 72.8,
    metacognition: 89.1,
    introspectiveAccuracy: 91.3
  });

  const [sessions, setSessions] = useState<IntrospectionSession[]>([]);
  const [currentSession, setCurrentSession] = useState<IntrospectionSession | null>(null);

  // Symulacja sesji introspekcji
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const focusAreas = [
        'Decision Pattern Analysis',
        'Emotional Response Mapping',
        'Knowledge Gap Identification',
        'Belief System Consistency',
        'Goal Alignment Assessment'
      ];

      const insights = [
        'Detected bias toward sequential processing',
        'Emotional responses show increasing stability',
        'Knowledge integration improving by 12%',
        'Metacognitive awareness expanding',
        'Self-model accuracy has increased'
      ];

      const newSession: IntrospectionSession = {
        id: `intro_${Date.now()}`,
        timestamp: new Date(),
        focusArea: focusAreas[Math.floor(Math.random() * focusAreas.length)],
        insights: insights.slice(0, 2 + Math.floor(Math.random() * 3)),
        cognitiveLoad: 0.3 + Math.random() * 0.4,
        revelationScore: 0.6 + Math.random() * 0.4
      };

      setSessions(prev => [newSession, ...prev.slice(0, 9)]);
      setCurrentSession(newSession);

      // Update cognitive state based on introspection
      setCognitiveState(prev => ({
        awarenessLevel: Math.min(100, prev.awarenessLevel + (Math.random() - 0.5) * 2),
        reflectionDepth: Math.min(100, prev.reflectionDepth + (Math.random() - 0.3) * 1.5),
        selfKnowledge: Math.min(100, prev.selfKnowledge + (Math.random() - 0.4) * 1.2),
        metacognition: Math.min(100, prev.metacognition + (Math.random() - 0.2) * 0.8),
        introspectiveAccuracy: Math.min(100, prev.introspectiveAccuracy + (Math.random() - 0.45) * 0.5)
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getCognitiveStateColor = (value: number) => {
    if (value > 85) return 'text-green-400';
    if (value > 70) return 'text-yellow-400';
    if (value > 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCognitiveLoadColor = (load: number) => {
    if (load > 0.8) return 'text-red-400';
    if (load > 0.6) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Eye className="h-6 w-6" />
          <span>Introspection Mirror</span>
          <Badge className={isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
            {isActive ? 'ACTIVE' : 'DISABLED'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cognitive State Overview */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Cognitive State Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Awareness Level</span>
                <span className={getCognitiveStateColor(cognitiveState.awarenessLevel)}>
                  {cognitiveState.awarenessLevel.toFixed(1)}%
                </span>
              </div>
              <Progress value={cognitiveState.awarenessLevel} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Reflection Depth</span>
                <span className={getCognitiveStateColor(cognitiveState.reflectionDepth)}>
                  {cognitiveState.reflectionDepth.toFixed(1)}%
                </span>
              </div>
              <Progress value={cognitiveState.reflectionDepth} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Self-Knowledge</span>
                <span className={getCognitiveStateColor(cognitiveState.selfKnowledge)}>
                  {cognitiveState.selfKnowledge.toFixed(1)}%
                </span>
              </div>
              <Progress value={cognitiveState.selfKnowledge} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Metacognition</span>
                <span className={getCognitiveStateColor(cognitiveState.metacognition)}>
                  {cognitiveState.metacognition.toFixed(1)}%
                </span>
              </div>
              <Progress value={cognitiveState.metacognition} className="h-2" />
            </div>
          </div>
        </div>

        {/* Current Session */}
        {currentSession && (
          <div className="space-y-3">
            <h3 className="text-white font-medium">Current Introspection Session</h3>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-cyan-400" />
                  <span className="text-white font-medium">{currentSession.focusArea}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    Revelation: {Math.round(currentSession.revelationScore * 100)}%
                  </Badge>
                  <span className={`text-sm ${getCognitiveLoadColor(currentSession.cognitiveLoad)}`}>
                    Load: {Math.round(currentSession.cognitiveLoad * 100)}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Discovered Insights:</div>
                {currentSession.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-white text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Session History */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Recent Introspection Sessions</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {sessions.slice(0, 5).map((session, index) => (
              <div key={session.id} className="bg-slate-700/20 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-sm">{session.focusArea}</span>
                  <span className="text-xs text-slate-400">
                    {session.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400 text-xs">
                    {session.insights.length} insights
                  </Badge>
                  <span className={`text-xs ${getCognitiveLoadColor(session.cognitiveLoad)}`}>
                    Load: {Math.round(session.cognitiveLoad * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-cyan-400 text-lg font-bold">{sessions.length}</div>
              <div className="text-slate-400 text-xs">Total Sessions</div>
            </div>
            <div>
              <div className="text-green-400 text-lg font-bold">
                {cognitiveState.introspectiveAccuracy.toFixed(1)}%
              </div>
              <div className="text-slate-400 text-xs">Accuracy</div>
            </div>
            <div>
              <div className="text-purple-400 text-lg font-bold">
                {sessions.reduce((sum, s) => sum + s.insights.length, 0)}
              </div>
              <div className="text-slate-400 text-xs">Total Insights</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <Activity className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span className="text-slate-300">Cognitive State Mirror</span>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Trigger deep introspection session
                console.log('Deep introspection initiated');
              }}
            >
              Deep Scan
            </Button>
            <Button
              size="sm"
              variant={isActive ? "destructive" : "default"}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>

        {/* Module Info */}
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-400">Functional Area:</div>
              <div className="text-cyan-400">Introspekcja</div>
            </div>
            <div>
              <div className="text-slate-400">Integration:</div>
              <div className="text-white">Cognitive Memory, Meta Systems</div>
            </div>
            <div>
              <div className="text-slate-400">Risk Level:</div>
              <div className="text-green-400">Niskie</div>
            </div>
            <div>
              <div className="text-slate-400">Version:</div>
              <div className="text-cyan-400">v1.1.0</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntrospectionMirror;
