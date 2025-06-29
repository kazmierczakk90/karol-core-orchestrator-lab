
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Activity, Heart } from 'lucide-react';

const AutoPulse = () => {
  const [isActive, setIsActive] = useState(true);
  const [pulseFrequency, setPulseFrequency] = useState([30]);
  const [lastPulse, setLastPulse] = useState(new Date());

  return (
    <Card className="bg-slate-800/50 border-pink-800/30">
      <CardHeader>
        <CardTitle className="text-pink-400 flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <span>AutoPulse</span>
          <Badge variant="outline" className="text-pink-400">@persistence-core</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">System Heartbeat</div>
              <div className="text-slate-400 text-sm">Maintains system activity during idle periods</div>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Pulse Frequency</span>
              <span className="text-pink-400 text-sm">{pulseFrequency[0]}s</span>
            </div>
            <Slider
              value={pulseFrequency}
              onValueChange={setPulseFrequency}
              min={10}
              max={300}
              step={10}
              className="w-full"
            />
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white text-sm font-medium">System Status</div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-pink-400 animate-pulse" />
                <Badge className="bg-pink-500/20 text-pink-400">
                  {isActive ? 'Active' : 'Paused'}
                </Badge>
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-400">
              <div>Last pulse: {lastPulse.toLocaleTimeString()}</div>
              <div>Uptime: 47h 23m</div>
              <div>Total pulses: 5,847</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoPulse;
