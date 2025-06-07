
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, RefreshCw, Calendar } from 'lucide-react';

interface AnalyticsHeaderProps {
  totalMetrics: number;
  activeAgents: number;
  onRefresh: () => void;
  onExport: () => void;
  lastUpdate: Date;
}

const AnalyticsHeader = ({ 
  totalMetrics, 
  activeAgents, 
  onRefresh, 
  onExport, 
  lastUpdate 
}: AnalyticsHeaderProps) => {
  return (
    <Card className="bg-gradient-dark border-cyan-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gradient-primary flex items-center space-x-2">
              <BarChart3 className="h-6 w-6" />
              <span>Analytics Dashboard</span>
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className="bg-cyan-500/20 text-cyan-400">
                {totalMetrics} Total Metrics
              </Badge>
              <Badge className="bg-green-500/20 text-green-400">
                {activeAgents} Active Agents
              </Badge>
              <div className="flex items-center space-x-1 text-slate-400 text-sm">
                <Calendar className="h-3 w-3" />
                <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={onRefresh}
              className="bg-gradient-secondary hover:bg-gradient-primary"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={onExport}
              variant="outline"
              className="border-slate-600"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default AnalyticsHeader;
