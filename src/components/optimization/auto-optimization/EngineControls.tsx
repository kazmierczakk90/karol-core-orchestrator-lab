
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface EngineControlsProps {
  isEngineActive: boolean;
  setIsEngineActive: (active: boolean) => void;
  aggressiveness: number[];
  setAggressiveness: (value: number[]) => void;
  activeOptimizations: number;
  completedToday: number;
}

const EngineControls = ({
  isEngineActive,
  setIsEngineActive,
  aggressiveness,
  setAggressiveness,
  activeOptimizations,
  completedToday
}: EngineControlsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Engine Status</div>
              <div className="text-sm text-slate-400">Auto-optimization engine</div>
            </div>
            <Switch 
              checked={isEngineActive} 
              onCheckedChange={setIsEngineActive}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <div className="text-white font-medium mb-2">Aggressiveness Level</div>
          <Slider
            value={aggressiveness}
            onValueChange={setAggressiveness}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="text-sm text-slate-400 mt-1">
            Level {aggressiveness[0]}/10 - {aggressiveness[0] > 7 ? 'Aggressive' : aggressiveness[0] > 4 ? 'Balanced' : 'Conservative'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Active</span>
              <span className="text-cyan-400 font-bold">{activeOptimizations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Today</span>
              <span className="text-green-400 font-bold">{completedToday}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineControls;
