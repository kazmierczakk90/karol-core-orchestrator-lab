import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StyleProfile {
  agentId: string;
  characteristics: {
    tone: string;
    verbosity: number;
    complexity: number;
    emoji_usage: number;
  };
  consistency_score: number;
  last_updated: string;
}

export default function StyleConsistencyChart() {
  const [profiles, setProfiles] = useState<StyleProfile[]>([]);
  const [systemCoherence, setSystemCoherence] = useState(0);

  useEffect(() => {
    // Simulated data - replace with actual service call
    const mockProfiles: StyleProfile[] = [
      {
        agentId: '@router',
        characteristics: { tone: 'technical', verbosity: 0.6, complexity: 0.7, emoji_usage: 0.1 },
        consistency_score: 0.92,
        last_updated: new Date().toISOString()
      },
      {
        agentId: '@guardian-core',
        characteristics: { tone: 'formal', verbosity: 0.5, complexity: 0.8, emoji_usage: 0.0 },
        consistency_score: 0.95,
        last_updated: new Date().toISOString()
      },
      {
        agentId: '@voice-core',
        characteristics: { tone: 'creative', verbosity: 0.7, complexity: 0.6, emoji_usage: 0.3 },
        consistency_score: 0.88,
        last_updated: new Date().toISOString()
      },
      {
        agentId: '@meta-reflex',
        characteristics: { tone: 'technical', verbosity: 0.4, complexity: 0.9, emoji_usage: 0.0 },
        consistency_score: 0.90,
        last_updated: new Date().toISOString()
      }
    ];
    
    setProfiles(mockProfiles);
    
    const avgScore = mockProfiles.reduce((sum, p) => sum + p.consistency_score, 0) / mockProfiles.length;
    setSystemCoherence(avgScore);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.75) return 'Good';
    if (score >= 0.6) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Style Consistency</CardTitle>
        <CardDescription>
          Agent style coherence and pattern analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Overview */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">System Coherence</span>
            <Badge variant={systemCoherence >= 0.85 ? 'default' : 'secondary'}>
              {getScoreLabel(systemCoherence)}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={systemCoherence * 100} className="flex-1" />
            <span className={`text-2xl font-bold ${getScoreColor(systemCoherence)}`}>
              {(systemCoherence * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Agent Profiles */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Agent Style Profiles</h4>
          {profiles.map(profile => (
            <div key={profile.agentId} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-mono text-sm font-medium">{profile.agentId}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {profile.characteristics.tone} tone
                  </p>
                </div>
                <Badge 
                  variant="outline"
                  className={profile.consistency_score >= 0.9 ? 'border-green-500 text-green-600' : ''}
                >
                  {(profile.consistency_score * 100).toFixed(0)}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Verbosity</p>
                  <Progress value={profile.characteristics.verbosity * 100} className="h-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Complexity</p>
                  <Progress value={profile.characteristics.complexity * 100} className="h-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Emoji Usage</p>
                  <Progress value={profile.characteristics.emoji_usage * 100} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
