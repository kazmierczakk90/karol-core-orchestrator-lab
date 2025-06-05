
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Terminal, Code, Database, Download, Upload, Play, Square } from 'lucide-react';
import { useState } from 'react';

const DeveloperConsole = () => {
  const [commandInput, setCommandInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const apiEndpoints = [
    { method: 'GET', endpoint: '/api/agents', description: 'List all AGI agents', status: 'active' },
    { method: 'POST', endpoint: '/api/style-shift', description: 'Modify decision style', status: 'active' },
    { method: 'GET', endpoint: '/api/system/status', description: 'System health check', status: 'active' },
    { method: 'POST', endpoint: '/api/agents/activate', description: 'Activate dormant agent', status: 'active' },
    { method: 'GET', endpoint: '/api/mutations/test', description: 'Test configuration changes', status: 'beta' },
  ];

  const systemLogs = [
    { timestamp: '14:32:15', level: 'INFO', message: 'Karol-Core decision matrix updated successfully' },
    { timestamp: '14:31:42', level: 'WARN', message: 'Voice-Core semantic drift detected: threshold 0.23' },
    { timestamp: '14:30:18', level: 'INFO', message: 'Guardian-Core audit cycle completed' },
    { timestamp: '14:29:55', level: 'DEBUG', message: 'Agent interaction map regenerated' },
    { timestamp: '14:28:33', level: 'ERROR', message: 'Snapshot creation failed: insufficient permissions' },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-400';
      case 'WARN': return 'text-yellow-400';
      case 'INFO': return 'text-green-400';
      case 'DEBUG': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'beta': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Terminal Interface */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Terminal className="h-5 w-5" />
              <span>API Console</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Direct system interface and command execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter command (e.g., GET /api/agents)"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-400 font-mono"
                />
                <Button 
                  onClick={() => setIsRunning(!isRunning)}
                  className={isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 min-h-[200px] font-mono text-sm">
                <div className="space-y-1">
                  <div className="text-green-400">karol-lab@core:~$ {commandInput || 'GET /api/system/status'}</div>
                  <div className="text-slate-300">
                    {isRunning ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                        <span>Executing...</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-cyan-400">Status: 200 OK</div>
                        <div className="text-slate-400">
                          {JSON.stringify({
                            system: "online",
                            agents: 4,
                            performance: "87%",
                            uptime: "72h 14m"
                          }, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>System Logs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
              <div className="space-y-1 font-mono text-xs">
                {systemLogs.map((log, index) => (
                  <div key={index} className="flex space-x-3">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className={`font-semibold ${getLevelColor(log.level)}`}>
                      [{log.level}]
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Reference & Tools */}
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>API Endpoints</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apiEndpoints.map((api, index) => (
                <div key={index} className="p-3 bg-slate-900/50 rounded border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
                        {api.method}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(api.status)}`}>
                        {api.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="font-mono text-sm text-white mb-1">{api.endpoint}</p>
                  <p className="text-xs text-slate-400">{api.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">System Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-blue-500/50 text-blue-400">
                <Download className="h-4 w-4 mr-2" />
                Export System State
              </Button>
              <Button variant="outline" className="w-full border-green-500/50 text-green-400">
                <Upload className="h-4 w-4 mr-2" />
                Import Configuration
              </Button>
              <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400">
                Create Snapshot
              </Button>
              <Button variant="outline" className="w-full border-purple-500/50 text-purple-400">
                Mutation Sandbox
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Version Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Current Version</p>
                <p className="text-white font-semibold">Karol-Core v1.0.3</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Last Commit</p>
                <p className="text-cyan-400 text-sm">Style matrix optimization</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Build Status</p>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  Stable
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperConsole;
