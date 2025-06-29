
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, User, Shield } from 'lucide-react';

const LiteViewSwitch = () => {
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [accessLevel, setAccessLevel] = useState('admin');

  return (
    <Card className="bg-slate-800/50 border-teal-800/30">
      <CardHeader>
        <CardTitle className="text-teal-400 flex items-center space-x-2">
          <Monitor className="h-5 w-5" />
          <span>LiteView Switch</span>
          <Badge variant="outline" className="text-teal-400">@ui-router</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Lite Mode</div>
              <div className="text-slate-400 text-sm">Simplified interface for other users</div>
            </div>
            <Switch
              checked={isLiteMode}
              onCheckedChange={setIsLiteMode}
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Access Level</label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-red-400" />
                    <span>Admin (Full Access)</span>
                  </div>
                </SelectItem>
                <SelectItem value="user">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <span>User (Limited)</span>
                  </div>
                </SelectItem>
                <SelectItem value="viewer">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-green-400" />
                    <span>Viewer (Read Only)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="text-white text-sm font-medium mb-2">Current View Configuration</div>
            <div className="space-y-1 text-sm text-slate-400">
              <div>Mode: {isLiteMode ? 'Lite' : 'Full'}</div>
              <div>Access: {accessLevel}</div>
              <div>Features: {isLiteMode ? 'Basic Dashboard Only' : 'All AGI Modules'}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiteViewSwitch;
