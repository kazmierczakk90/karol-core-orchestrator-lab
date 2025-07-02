
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, Pause, Square, RotateCcw, 
  CheckCircle, AlertCircle, Clock 
} from 'lucide-react';

const TestAgentSidebar = () => {
  const [runningTests, setRunningTests] = useState<string[]>([]);
  
  const testScenarios = [
    {
      id: 'load-test-1',
      name: 'Load Test',
      description: 'High volume request handling',
      status: 'ready',
      duration: '2m 30s'
    },
    {
      id: 'decision-test-1',
      name: 'Decision Logic Test',
      description: 'Complex decision scenarios',
      status: 'running',
      duration: '1m 15s'
    },
    {
      id: 'memory-test-1',
      name: 'Memory Stress Test',
      description: 'Memory allocation and cleanup',
      status: 'completed',
      duration: '45s'
    },
    {
      id: 'integration-test-1',
      name: 'Integration Test',
      description: 'Cross-agent communication',
      status: 'failed',
      duration: '3m 20s'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Play className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500';
    }
  };

  const handleTestAction = (testId: string, action: 'start' | 'stop' | 'restart') => {
    console.log(`${action} test: ${testId}`);
    
    if (action === 'start') {
      setRunningTests(prev => [...prev, testId]);
    } else if (action === 'stop') {
      setRunningTests(prev => prev.filter(id => id !== testId));
    }
  };

  return (
    <Card className="bg-slate-800/50 border-yellow-800/30 h-full">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center space-x-2">
          <Play className="h-5 w-5" />
          <span>Test Suite</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {testScenarios.map((test) => (
              <div key={test.id} className="bg-slate-700/30 p-3 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{test.name}</div>
                    <div className="text-slate-400 text-xs">{test.description}</div>
                  </div>
                  <Badge className={getStatusColor(test.status)} variant="outline">
                    {test.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    {getStatusIcon(test.status)}
                    <span>{test.duration}</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    {test.status === 'ready' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 border-green-600 hover:bg-green-600/20"
                        onClick={() => handleTestAction(test.id, 'start')}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {test.status === 'running' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 border-red-600 hover:bg-red-600/20"
                          onClick={() => handleTestAction(test.id, 'stop')}
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    
                    {(test.status === 'completed' || test.status === 'failed') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 border-blue-600 hover:bg-blue-600/20"
                        onClick={() => handleTestAction(test.id, 'restart')}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">
            Run All Tests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAgentSidebar;
