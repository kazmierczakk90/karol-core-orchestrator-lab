import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react';

interface LiveChatStatusProps {
  status: 'connected' | 'disconnected' | 'connecting';
  sessionsCount: number;
  demoMode?: boolean;
}

const LiveChatStatus: React.FC<LiveChatStatusProps> = ({ 
  status, 
  sessionsCount, 
  demoMode = true 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'connecting': return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'connecting': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'disconnected': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <Badge className={`${getStatusColor()} border`}>
            {status === 'connected' && 'Połączono'}
            {status === 'connecting' && 'Łączenie...'}
            {status === 'disconnected' && 'Rozłączono'}
          </Badge>
        </div>
        <Badge variant="outline" className="text-slate-400">
          {sessionsCount} sesji
        </Badge>
      </div>

      {demoMode && (
        <Alert className="bg-cyan-500/10 border-cyan-500/30">
          <Wifi className="h-4 w-4" />
          <AlertDescription className="text-cyan-400 text-xs">
            🎭 Tryb Demo • Karol-Core AI w pełnej funkcjonalności
          </AlertDescription>
        </Alert>
      )}

      {status === 'disconnected' && (
        <Alert className="bg-red-500/10 border-red-500/30">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="text-red-400 text-xs">
            Problem z połączeniem. Sprawdź internet lub spróbuj ponownie.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LiveChatStatus;