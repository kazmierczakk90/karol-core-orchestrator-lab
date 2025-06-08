
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useProcessStore } from '@/stores/processStore';
import { toast } from '@/components/ui/sonner';
import { 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  AlertTriangle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { ProcessEntry } from '@/types/common';

const ProcessJournal = () => {
  const [filter, setFilter] = useState<'all' | 'running' | 'completed' | 'failed'>('all');
  const { 
    processes, 
    activeProcesses, 
    errors,
    exportProcesses, 
    exportErrors,
    getProcessStats,
    getErrorStats 
  } = useProcessStore();

  const processStats = getProcessStats();
  const errorStats = getErrorStats();

  const filteredProcesses = processes.filter(process => {
    if (filter === 'all') return true;
    return process.status === filter;
  });

  const getStatusIcon = (status: ProcessEntry['status']) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: ProcessEntry['status']) => {
    switch (status) {
      case 'running': return 'border-blue-500/50 text-blue-400';
      case 'completed': return 'border-green-500/50 text-green-400';
      case 'failed': return 'border-red-500/50 text-red-400';
      default: return 'border-slate-500/50 text-slate-400';
    }
  };

  const handleExportProcesses = () => {
    const csvContent = exportProcesses();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karol_core_processes_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Procesy wyeksportowane do CSV');
  };

  const handleExportErrors = () => {
    const csvContent = exportErrors();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karol_core_errors_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Błędy wyeksportowane do CSV');
  };

  const formatDuration = (process: ProcessEntry) => {
    if (!process.endTime) return 'Trwa...';
    const duration = process.endTime.getTime() - process.startTime.getTime();
    return `${(duration / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-dark border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Wszystkie procesy</p>
                <p className="text-2xl font-bold text-white">{processStats.total}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-dark border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Aktywne</p>
                <p className="text-2xl font-bold text-blue-400">{processStats.running}</p>
              </div>
              <Play className="h-8 w-8 text-blue-400 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-dark border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Ukończone</p>
                <p className="text-2xl font-bold text-green-400">{processStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-dark border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Błędy</p>
                <p className="text-2xl font-bold text-red-400">{errorStats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Journal */}
      <Card className="bg-gradient-dark border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient-primary">Dziennik Procesów</CardTitle>
              <CardDescription>
                Historia wszystkich operacji wykonanych w systemie
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {/* Filter Buttons */}
              <div className="flex space-x-1">
                {(['all', 'running', 'completed', 'failed'] as const).map((filterType) => (
                  <Button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    variant={filter === filterType ? "default" : "outline"}
                    size="sm"
                    className={filter === filterType ? 'bg-cyan-500' : 'border-slate-600'}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {filterType === 'all' ? 'Wszystkie' : 
                     filterType === 'running' ? 'Aktywne' :
                     filterType === 'completed' ? 'Ukończone' : 'Błędne'}
                  </Button>
                ))}
              </div>
              <Button onClick={handleExportProcesses} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Eksportuj procesy
              </Button>
              <Button onClick={handleExportErrors} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Eksportuj błędy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredProcesses.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Brak procesów do wyświetlenia</p>
                </div>
              ) : (
                filteredProcesses.map((process) => (
                  <div
                    key={process.id}
                    className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(process.status)}
                        <div>
                          <h4 className="font-medium text-white">{process.title}</h4>
                          <p className="text-sm text-slate-400">{process.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusColor(process.status)}>
                          {process.status === 'running' ? 'Trwa' :
                           process.status === 'completed' ? 'Ukończony' :
                           process.status === 'failed' ? 'Błąd' : 'Oczekuje'}
                        </Badge>
                        <Badge variant="outline" className="border-slate-500/50 text-slate-400">
                          {process.type}
                        </Badge>
                      </div>
                    </div>

                    {process.status === 'running' && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Postęp</span>
                          <span>{process.progress}%</span>
                        </div>
                        <Progress value={process.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Rozpoczęty: {process.startTime.toLocaleString('pl')}</span>
                      <span>Czas trwania: {formatDuration(process)}</span>
                    </div>

                    {process.error && (
                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                        <strong>Błąd:</strong> {process.error}
                      </div>
                    )}

                    {process.metadata && Object.keys(process.metadata).length > 0 && (
                      <div className="mt-2 text-xs text-slate-400">
                        <strong>Metadata:</strong> {JSON.stringify(process.metadata)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Error Summary */}
      {errors.length > 0 && (
        <Card className="bg-gradient-dark border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Ostatnie błędy systemu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {errors.slice(0, 5).map((error) => (
                  <div key={error.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400">{error.message}</span>
                      <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">
                        {error.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500">
                      {error.timestamp.toLocaleString('pl')} • {error.type}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcessJournal;
