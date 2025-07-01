
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Users, Zap } from 'lucide-react';

interface EmotionalState {
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
  dominance: number; // 0 to 1 (submissive to dominant)
  confidence: number; // 0 to 1
}

interface BehavioralPrediction {
  agentId: string;
  predictedAction: string;
  confidence: number;
  emotionalContext: EmotionalState;
  reasoningPath: string[];
  timestamp: Date;
}

const CognitiveBehavioralPredictor = () => {
  const [isActive, setIsActive] = useState(true);
  const [predictions, setPredictions] = useState<BehavioralPrediction[]>([]);
  const [globalEmotionalState, setGlobalEmotionalState] = useState<EmotionalState>({
    valence: 0.3,
    arousal: 0.6,
    dominance: 0.7,
    confidence: 0.85
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    predictionAccuracy: 87.3,
    emotionalAlignment: 92.1,
    decisionImprovement: 34.7,
    agentSatisfaction: 89.5
  });

  // Symulacja predykcji behawioralnej
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newPrediction: BehavioralPrediction = {
        agentId: `agent_${Math.random().toString(36).substr(2, 6)}`,
        predictedAction: [
          'Analyze complex data pattern',
          'Initiate collaborative process',
          'Request additional context',
          'Optimize current workflow',
          'Seek emotional validation'
        ][Math.floor(Math.random() * 5)],
        confidence: 0.7 + Math.random() * 0.3,
        emotionalContext: {
          valence: -0.5 + Math.random(),
          arousal: Math.random(),
          dominance: Math.random(),
          confidence: 0.6 + Math.random() * 0.4
        },
        reasoningPath: [
          'Context analysis',
          'Emotional state assessment',
          'Historical pattern matching',
          'Confidence calculation'
        ],
        timestamp: new Date()
      };

      setPredictions(prev => [newPrediction, ...prev.slice(0, 9)]);

      // Update global emotional state
      setGlobalEmotionalState(prev => ({
        valence: prev.valence + (Math.random() - 0.5) * 0.1,
        arousal: prev.arousal + (Math.random() - 0.5) * 0.1,
        dominance: prev.dominance + (Math.random() - 0.5) * 0.1,
        confidence: Math.max(0.5, Math.min(1, prev.confidence + (Math.random() - 0.5) * 0.05))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getEmotionalStateColor = (value: number) => {
    if (value > 0.7) return 'text-green-400';
    if (value > 0.3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getEmotionalStateDescription = (state: EmotionalState) => {
    const valenceDesc = state.valence > 0.5 ? 'Positive' : state.valence > 0 ? 'Neutral' : 'Negative';
    const arousalDesc = state.arousal > 0.7 ? 'High Energy' : state.arousal > 0.3 ? 'Moderate' : 'Calm';
    return `${valenceDesc}, ${arousalDesc}`;
  };

  return (
    <Card className="bg-slate-800/50 border-purple-800/30">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span>Cognitive Behavioral Predictor</span>
          <Badge className={isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
            {isActive ? 'ACTIVE' : 'DISABLED'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Emotional State */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">System Emotional State</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className={`text-xl font-bold ${getEmotionalStateColor(globalEmotionalState.valence + 0.5)}`}>
                {Math.round((globalEmotionalState.valence + 1) * 50)}%
              </div>
              <div className="text-slate-400 text-sm">Valence</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className={`text-xl font-bold ${getEmotionalStateColor(globalEmotionalState.arousal)}`}>
                {Math.round(globalEmotionalState.arousal * 100)}%
              </div>
              <div className="text-slate-400 text-sm">Arousal</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className={`text-xl font-bold ${getEmotionalStateColor(globalEmotionalState.dominance)}`}>
                {Math.round(globalEmotionalState.dominance * 100)}%
              </div>
              <div className="text-slate-400 text-sm">Dominance</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className={`text-xl font-bold ${getEmotionalStateColor(globalEmotionalState.confidence)}`}>
                {Math.round(globalEmotionalState.confidence * 100)}%
              </div>
              <div className="text-slate-400 text-sm">Confidence</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Prediction Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Prediction Accuracy</span>
                <span className="text-green-400">{performanceMetrics.predictionAccuracy}%</span>
              </div>
              <Progress value={performanceMetrics.predictionAccuracy} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Emotional Alignment</span>
                <span className="text-purple-400">{performanceMetrics.emotionalAlignment}%</span>
              </div>
              <Progress value={performanceMetrics.emotionalAlignment} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Decision Improvement</span>
                <span className="text-cyan-400">{performanceMetrics.decisionImprovement}%</span>
              </div>
              <Progress value={performanceMetrics.decisionImprovement} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Agent Satisfaction</span>
                <span className="text-yellow-400">{performanceMetrics.agentSatisfaction}%</span>
              </div>
              <Progress value={performanceMetrics.agentSatisfaction} className="h-2" />
            </div>
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Recent Behavioral Predictions</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {predictions.slice(0, 5).map((prediction, index) => (
              <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-white font-medium text-sm">{prediction.agentId}</span>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      {Math.round(prediction.confidence * 100)}%
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400">
                    {prediction.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-white">{prediction.predictedAction}</div>
                  <div className="text-xs text-slate-400">
                    Emotional Context: {getEmotionalStateDescription(prediction.emotionalContext)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <TrendingUp className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
            <span className="text-slate-300">Behavioral Prediction Engine</span>
          </div>
          <div className="flex space-x-2">
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
              <div className="text-slate-400">Integration:</div>
              <div className="text-white">Agent States, Decision Engine</div>
            </div>
            <div>
              <div className="text-slate-400">Functional Area:</div>
              <div className="text-purple-400">Agent/Meta</div>
            </div>
            <div>
              <div className="text-slate-400">Risk Level:</div>
              <div className="text-yellow-400">Średnie</div>
            </div>
            <div>
              <div className="text-slate-400">Version:</div>
              <div className="text-cyan-400">v1.0.0-beta</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CognitiveBehavioralPredictor;
