
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Fingerprint, Activity, Shield, User, Sparkles, RefreshCw } from 'lucide-react';
import { useMetaDecision } from '@/hooks/useMetaDecision';

const FukoIDManager = () => {
  const { 
    fukoIdentities, 
    isLoading, 
    updateFukoIdentity 
  } = useMetaDecision();

  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyIdentity = async (agentId: string) => {
    setIsVerifying(true);
    try {
      await updateFukoIdentity(agentId, {
        last_verification: new Date().toISOString(),
        consistency_metrics: {
          style_consistency: Math.random() * 100,
          behavioral_stability: Math.random() * 100,
          identity_coherence: Math.random() * 100,
          verification_timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to verify identity:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateIdentity = async () => {
    setIsVerifying(true);
    try {
      const newAgentId = `@agent-${Date.now()}`;
      await updateFukoIdentity(newAgentId, {
        core_identity: {
          name: `Agent ${Date.now()}`,
          role: 'meta-processor',
          traits: ['analytical', 'precise', 'adaptive'],
          core_values: ['efficiency', 'consistency', 'growth'],
          created_at: new Date().toISOString()
        },
        style_signature: `style_${Math.random().toString(36).substr(2, 9)}`,
        behavioral_patterns: {
          decision_style: 'methodical',
          communication_pattern: 'formal',
          problem_solving: 'systematic',
          risk_tolerance: 'moderate'
        },
        identity_evolution: [],
        consistency_metrics: {
          style_consistency: 85 + Math.random() * 15,
          behavioral_stability: 80 + Math.random() * 20,
          identity_coherence: 90 + Math.random() * 10
        }
      });
    } catch (error) {
      console.error('Failed to create identity:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const getConsistencyColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getIdentityStrength = (identity: any) => {
    if (!identity.consistency_metrics) return { score: 0, level: 'Unknown' };
    
    const avg = (
      (identity.consistency_metrics.style_consistency || 0) +
      (identity.consistency_metrics.behavioral_stability || 0) +
      (identity.consistency_metrics.identity_coherence || 0)
    ) / 3;

    if (avg >= 90) return { score: avg, level: 'Excellent' };
    if (avg >= 75) return { score: avg, level: 'Good' };
    if (avg >= 60) return { score: avg, level: 'Fair' };
    return { score: avg, level: 'Needs Work' };
  };

  const stats = {
    totalIdentities: fukoIdentities.length,
    verifiedIdentities: fukoIdentities.filter(id => id.last_verification).length,
    avgConsistency: fukoIdentities.length > 0 
      ? Math.round(fukoIdentities.reduce((acc, id) => {
          const strength = getIdentityStrength(id);
          return acc + strength.score;
        }, 0) / fukoIdentities.length)
      : 0,
    recentlyUpdated: fukoIdentities.filter(id => {
      const lastUpdate = new Date(id.last_verification || id.created_at);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastUpdate > dayAgo;
    }).length
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-indigo-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Activity className="h-8 w-8 text-indigo-400 animate-spin" />
              <span className="ml-3 text-slate-300">Loading FUKO-ID Manager...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-indigo-800/30">
        <CardHeader>
          <CardTitle className="text-indigo-400 flex items-center space-x-2">
            <Fingerprint className="h-6 w-6" />
            <span>FUKO-ID Manager</span>
            <Badge className="bg-indigo-500/20 text-indigo-400 ml-2">Level 7 - Active</Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Zarządzanie tożsamością agentów i weryfikacja spójności stylu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-indigo-400 text-2xl font-bold">{stats.totalIdentities}</div>
              <div className="text-slate-400 text-sm">Total Identities</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{stats.verifiedIdentities}</div>
              <div className="text-slate-400 text-sm">Verified</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">{stats.avgConsistency}%</div>
              <div className="text-slate-400 text-sm">Avg Consistency</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{stats.recentlyUpdated}</div>
              <div className="text-slate-400 text-sm">Recent Updates</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">Agent Identities</h3>
            <Button 
              onClick={handleCreateIdentity}
              disabled={isVerifying}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isVerifying ? <Activity className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span className="ml-2">Create Identity</span>
            </Button>
          </div>

          <div className="rounded-lg border border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-300">Agent</TableHead>
                  <TableHead className="text-slate-300">Style Signature</TableHead>
                  <TableHead className="text-slate-300">Identity Strength</TableHead>
                  <TableHead className="text-slate-300">Core Traits</TableHead>
                  <TableHead className="text-slate-300">Last Verification</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fukoIdentities.map((identity) => {
                  const strengthInfo = getIdentityStrength(identity);
                  const traits = identity.core_identity?.traits || [];
                  
                  return (
                    <TableRow key={identity.id} className="border-slate-700/50 hover:bg-slate-700/30">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-indigo-400" />
                          <div>
                            <div className="font-mono text-white">{identity.agent_id}</div>
                            <div className="text-slate-400 text-sm">
                              {identity.core_identity?.name || 'Unnamed Agent'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Fingerprint className="h-4 w-4 text-purple-400" />
                          <span className="font-mono text-purple-400 text-sm">
                            {identity.style_signature}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-cyan-400" />
                          <div>
                            <span className={`font-bold ${getConsistencyColor(strengthInfo.score)}`}>
                              {strengthInfo.score.toFixed(1)}%
                            </span>
                            <div className="text-slate-400 text-xs">
                              {strengthInfo.level}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {traits.slice(0, 3).map((trait: string, index: number) => (
                            <Badge key={index} className="bg-blue-500/20 text-blue-400 text-xs">
                              {trait}
                            </Badge>
                          ))}
                          {traits.length > 3 && (
                            <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                              +{traits.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-400 text-sm">
                          {identity.last_verification 
                            ? new Date(identity.last_verification).toLocaleString()
                            : 'Never'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyIdentity(identity.agent_id)}
                          disabled={isVerifying}
                          className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {fukoIdentities.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Fingerprint className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No agent identities found</p>
              <p>Create an identity to start tracking agent style consistency.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FukoIDManager;
