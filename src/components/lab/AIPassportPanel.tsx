import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { passportService, AgentPassport } from '@/services/passportService';
import { identityVerificationService, VerificationResult } from '@/services/identityVerificationService';
import { agentRegisterService, AgentOwner, AgentVersion } from '@/services/agentRegisterService';
import { Shield, Fingerprint, CheckCircle, XCircle, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AIPassportPanel() {
  const { toast } = useToast();
  const [passports, setPassports] = useState<AgentPassport[]>([]);
  const [owners, setOwners] = useState<AgentOwner[]>([]);
  const [versions, setVersions] = useState<AgentVersion[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, revoked: 0, avgTrustScore: 0 });
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newAgent, setNewAgent] = useState({ agent_id: '', display_name: '', capabilities: '' });

  const loadData = async () => {
    setLoading(true);
    const [p, s, o, v] = await Promise.all([
      passportService.getAllPassports(),
      passportService.getStats(),
      agentRegisterService.getAllOwners(),
      agentRegisterService.getAllVersions(),
    ]);
    setPassports(p);
    setStats(s);
    setOwners(o);
    setVersions(v);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleIssue = async () => {
    if (!newAgent.agent_id || !newAgent.display_name) return;
    const passport = await passportService.issuePassport({
      agent_id: newAgent.agent_id,
      display_name: newAgent.display_name,
      capabilities: newAgent.capabilities.split(',').map(c => c.trim()).filter(Boolean),
    });
    if (passport) {
      toast({ title: 'Passport Issued', description: `${passport.passport_number} for ${passport.display_name}` });
      setNewAgent({ agent_id: '', display_name: '', capabilities: '' });
      setShowCreate(false);
      loadData();
    }
  };

  const handleVerify = async (id: string) => {
    setVerifying(id);
    const result = await identityVerificationService.verifyIdentity(id);
    toast({
      title: result.passed ? 'Verification Passed' : 'Verification Failed',
      description: `Score: ${result.score.toFixed(1)}% — ${result.checks.filter(c => c.passed).length}/${result.checks.length} checks`,
    });
    setVerifying(null);
    loadData();
  };

  const handleRevoke = async (id: string) => {
    await passportService.revokePassport(id);
    toast({ title: 'Passport Revoked' });
    loadData();
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'suspended': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'revoked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <div className="text-lab-muted text-sm tracking-widest animate-pulse">LOADING PASSPORT REGISTRY...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'TOTAL', value: stats.total, icon: Fingerprint },
          { label: 'ACTIVE', value: stats.active, icon: CheckCircle },
          { label: 'SUSPENDED', value: stats.suspended, icon: AlertTriangle },
          { label: 'REVOKED', value: stats.revoked, icon: XCircle },
          { label: 'AVG TRUST', value: `${stats.avgTrustScore.toFixed(1)}%`, icon: Shield },
        ].map(s => (
          <Card key={s.label} className="bg-lab-surface border-lab-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="w-4 h-4 text-lab-accent" />
                <span className="text-[10px] tracking-widest text-lab-muted">{s.label}</span>
              </div>
              <div className="text-2xl font-light text-lab-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="passports" className="space-y-4">
        <TabsList className="bg-lab-surface border border-lab-border">
          <TabsTrigger value="passports" className="data-[state=active]:bg-lab-accent/20 data-[state=active]:text-lab-accent">
            Passports
          </TabsTrigger>
          <TabsTrigger value="owners" className="data-[state=active]:bg-lab-accent/20 data-[state=active]:text-lab-accent">
            Owners
          </TabsTrigger>
          <TabsTrigger value="versions" className="data-[state=active]:bg-lab-accent/20 data-[state=active]:text-lab-accent">
            Versions
          </TabsTrigger>
        </TabsList>

        {/* Passports Tab */}
        <TabsContent value="passports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm tracking-widest text-lab-muted uppercase">Agent Passports</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={loadData} className="border-lab-border text-lab-muted hover:text-lab-foreground">
                <RefreshCw className="w-3 h-3 mr-1" /> Refresh
              </Button>
              <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="bg-lab-accent/20 text-lab-accent hover:bg-lab-accent/30 border border-lab-accent/30">
                <Plus className="w-3 h-3 mr-1" /> Issue Passport
              </Button>
            </div>
          </div>

          {showCreate && (
            <Card className="bg-lab-surface border-lab-accent/30">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Agent ID (e.g. agent-ceo)" value={newAgent.agent_id}
                    onChange={e => setNewAgent(p => ({ ...p, agent_id: e.target.value }))}
                    className="bg-lab-background border-lab-border text-lab-foreground" />
                  <Input placeholder="Display Name" value={newAgent.display_name}
                    onChange={e => setNewAgent(p => ({ ...p, display_name: e.target.value }))}
                    className="bg-lab-background border-lab-border text-lab-foreground" />
                  <Input placeholder="Capabilities (comma-separated)" value={newAgent.capabilities}
                    onChange={e => setNewAgent(p => ({ ...p, capabilities: e.target.value }))}
                    className="bg-lab-background border-lab-border text-lab-foreground" />
                </div>
                <Button size="sm" onClick={handleIssue} className="bg-lab-accent text-lab-background hover:bg-lab-accent/80">
                  Issue Passport
                </Button>
              </CardContent>
            </Card>
          )}

          {passports.length === 0 ? (
            <Card className="bg-lab-surface border-lab-border">
              <CardContent className="p-8 text-center text-lab-muted text-sm">
                No passports issued yet. Click "Issue Passport" to create the first agent identity.
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-lab-surface border-lab-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-lab-border hover:bg-transparent">
                    <TableHead className="text-lab-muted text-[10px] tracking-widest">PASSPORT #</TableHead>
                    <TableHead className="text-lab-muted text-[10px] tracking-widest">AGENT</TableHead>
                    <TableHead className="text-lab-muted text-[10px] tracking-widest">STATUS</TableHead>
                    <TableHead className="text-lab-muted text-[10px] tracking-widest">TRUST</TableHead>
                    <TableHead className="text-lab-muted text-[10px] tracking-widest">CAPABILITIES</TableHead>
                    <TableHead className="text-lab-muted text-[10px] tracking-widest">VERIFIED</TableHead>
                    <TableHead className="text-lab-muted text-[10px] tracking-widest">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passports.map(p => (
                    <TableRow key={p.id} className="border-lab-border hover:bg-lab-accent/5">
                      <TableCell className="font-mono text-xs text-lab-accent">{p.passport_number}</TableCell>
                      <TableCell>
                        <div className="text-sm text-lab-foreground">{p.display_name}</div>
                        <div className="text-[10px] text-lab-muted">{p.agent_id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor(p.status)}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-lab-border rounded-full overflow-hidden">
                            <div className="h-full bg-lab-accent rounded-full" style={{ width: `${p.trust_score}%` }} />
                          </div>
                          <span className="text-xs text-lab-muted">{Number(p.trust_score).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(p.capabilities as string[]).slice(0, 3).map((c, i) => (
                            <Badge key={i} variant="outline" className="text-[9px] border-lab-border text-lab-muted">{c}</Badge>
                          ))}
                          {(p.capabilities as string[]).length > 3 && (
                            <Badge variant="outline" className="text-[9px] border-lab-border text-lab-muted">+{(p.capabilities as string[]).length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-[10px] text-lab-muted">
                        {p.last_verified_at ? new Date(p.last_verified_at).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleVerify(p.id)}
                            disabled={verifying === p.id}
                            className="h-7 text-xs text-lab-accent hover:bg-lab-accent/10">
                            {verifying === p.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Verify'}
                          </Button>
                          {p.status === 'active' && (
                            <Button size="sm" variant="ghost" onClick={() => handleRevoke(p.id)}
                              className="h-7 text-xs text-red-400 hover:bg-red-500/10">
                              Revoke
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* Owners Tab */}
        <TabsContent value="owners">
          <Card className="bg-lab-surface border-lab-border">
            <CardHeader>
              <CardTitle className="text-sm tracking-widest text-lab-muted uppercase">Owner Registry</CardTitle>
            </CardHeader>
            <CardContent>
              {owners.length === 0 ? (
                <p className="text-lab-muted text-sm">No owners registered.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-lab-border">
                      <TableHead className="text-lab-muted text-[10px] tracking-widest">NAME</TableHead>
                      <TableHead className="text-lab-muted text-[10px] tracking-widest">ORG</TableHead>
                      <TableHead className="text-lab-muted text-[10px] tracking-widest">TIER</TableHead>
                      <TableHead className="text-lab-muted text-[10px] tracking-widest">MAX AGENTS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {owners.map(o => (
                      <TableRow key={o.id} className="border-lab-border">
                        <TableCell className="text-lab-foreground">{o.name}</TableCell>
                        <TableCell className="text-lab-muted">{o.organization || '—'}</TableCell>
                        <TableCell><Badge variant="outline" className="border-lab-border text-lab-accent">{o.tier}</Badge></TableCell>
                        <TableCell className="text-lab-muted">{o.max_agents}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Versions Tab */}
        <TabsContent value="versions">
          <Card className="bg-lab-surface border-lab-border">
            <CardHeader>
              <CardTitle className="text-sm tracking-widest text-lab-muted uppercase">Version Registry</CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <p className="text-lab-muted text-sm">No versions registered.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-lab-border">
                      <TableHead className="text-lab-muted text-[10px] tracking-widest">AGENT</TableHead>
                      <TableHead className="text-lab-muted text-[10px] tracking-widest">VERSION</TableHead>
                      <TableHead className="text-lab-muted text-[10px] tracking-widest">STATUS</TableHead>
                      <TableHead className="text-lab-muted text-[10px] tracking-widest">RELEASED</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {versions.map(v => (
                      <TableRow key={v.id} className="border-lab-border">
                        <TableCell className="text-lab-foreground font-mono text-xs">{v.agent_id}</TableCell>
                        <TableCell className="text-lab-accent">{v.version}</TableCell>
                        <TableCell><Badge variant="outline" className="border-lab-border text-lab-muted">{v.status}</Badge></TableCell>
                        <TableCell className="text-lab-muted text-xs">{new Date(v.released_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
