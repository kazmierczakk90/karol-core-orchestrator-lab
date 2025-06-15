
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, Pause, Settings, Trash2 } from 'lucide-react';
import { SystemConnection } from '@/types/system';
import { typeColors, statusColors, getResponseTimeColor, getUptimeColor } from './utils';

interface ConnectionTableRowProps {
  connection: SystemConnection;
  onTest: (id: string) => void;
  onToggle: (connection: SystemConnection) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  deletingId?: string;
}

export const ConnectionTableRow = ({
  connection,
  onTest,
  onToggle,
  onDelete,
  isUpdating,
  isDeleting,
  deletingId,
}: ConnectionTableRowProps) => {
  return (
    <TableRow key={connection.id} className="border-slate-700/50 hover:bg-slate-700/30">
        <TableCell>
            <div>
            <div className="font-semibold text-white">{connection.name}</div>
            <div className="text-slate-400 text-sm">{connection.description ?? ''}</div>
            </div>
        </TableCell>
        
        <TableCell>
            <Badge className={typeColors[connection.type]}>
            {connection.type}
            </Badge>
        </TableCell>
        
        <TableCell>
            <Badge className={statusColors[connection.status]}>
            {connection.status}
            </Badge>
        </TableCell>
        
        <TableCell>
            <span className="text-slate-300 text-sm font-mono truncate max-w-xs block" title={connection.endpoint}>
            {connection.endpoint}
            </span>
        </TableCell>
        
        <TableCell>
            <span className={`font-semibold ${getResponseTimeColor(connection.response_time)}`}>
            {connection.response_time === 0 ? '-' : `${connection.response_time}ms`}
            </span>
        </TableCell>
        
        <TableCell>
            <span className={`font-semibold ${getUptimeColor(connection.uptime)}`}>
            {connection.uptime === 0 ? '-' : `${connection.uptime}%`}
            </span>
        </TableCell>
        
        <TableCell>
            <span className="text-slate-300 font-semibold">{connection.requests.toLocaleString()}</span>
        </TableCell>
        
        <TableCell>
            <span className={`font-semibold ${connection.errors > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {connection.errors}
            </span>
        </TableCell>
        
        <TableCell>
            <span className="text-slate-400 text-sm">
            {new Date(connection.last_ping).toLocaleTimeString()}
            </span>
        </TableCell>
        
        <TableCell>
            <div className="flex space-x-2">
            <Button
                size="sm"
                variant="outline"
                className="border-slate-600 hover:border-green-400"
                onClick={() => onTest(connection.id)}
                disabled={connection.status === 'testing' || isUpdating}
            >
                <RefreshCw className={`h-3 w-3 ${connection.status === 'testing' ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
                size="sm"
                variant="outline"
                className="border-slate-600 hover:border-cyan-400"
                onClick={() => onToggle(connection)}
                disabled={isUpdating}
            >
                {connection.status === 'connected' ? (
                <Pause className="h-3 w-3" />
                ) : (
                <Play className="h-3 w-3" />
                )}
            </Button>
            
            <Button
                size="sm"
                variant="outline"
                className="border-slate-600 hover:border-blue-400"
            >
                <Settings className="h-3 w-3" />
            </Button>
            
            <Button
                size="sm"
                variant="outline"
                className="border-slate-600 hover:border-red-400 text-red-400"
                onClick={() => onDelete(connection.id)}
                disabled={isDeleting && deletingId === connection.id}
            >
                <Trash2 className="h-3 w-3" />
            </Button>
            </div>
        </TableCell>
    </TableRow>
  );
};
