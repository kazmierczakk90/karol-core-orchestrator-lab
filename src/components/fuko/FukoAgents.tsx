
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFuko } from '@/hooks/useFuko';

const FukoAgents = () => {
  const { agents, isLoadingAgents } = useFuko();

  return (
    <>
      {isLoadingAgents && <p className="text-slate-300">Loading agents...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents?.map((agent) => (
          <Card key={agent.id} className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-sm">{agent.name}</CardTitle>
                <Badge className={agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-400">Mode:</span>
                  <span className="text-cyan-400 ml-2">{agent.mode}</span>
                </div>
                <div>
                  <span className="text-slate-400">Performance:</span>
                  <span className="text-white ml-2">{agent.performance.toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-slate-400">Capabilities:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map(cap => (
                      <Badge key={cap} variant="outline" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default FukoAgents;
