
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Globe, 
  List, 
  Play, 
  Pause, 
  Settings, 
  Trash2,
  Plus,
  Download,
  Eye,
  RotateCcw
} from 'lucide-react';
import { ScraperSchedule, OutputFormat } from '@/types/smartExtractor';

const BulkScheduler = () => {
  const [schedules, setSchedules] = useState<ScraperSchedule[]>([
    {
      id: 'schedule_1',
      name: 'Daily E-commerce Monitor',
      description: 'Monitor product prices across major platforms',
      urls: ['https://amazon.com/category/electronics', 'https://ebay.com/electronics'],
      templateId: 'template_1',
      schedule: {
        type: 'daily',
        interval: 1,
        timezone: 'UTC'
      },
      settings: {
        parallel: true,
        maxConcurrent: 3,
        retryOnError: true,
        maxRetries: 2,
        exportFormat: 'json',
        notificationEmail: 'admin@example.com'
      },
      isActive: true,
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000),
      results: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'schedule_2',
      name: 'Weekly News Analysis',
      description: 'Analyze news articles for trends and sentiment',
      urls: ['https://news.example.com/tech', 'https://techcrunch.com'],
      templateId: 'template_2',
      schedule: {
        type: 'weekly',
        interval: 1,
        timezone: 'UTC'
      },
      settings: {
        parallel: false,
        maxConcurrent: 1,
        retryOnError: true,
        maxRetries: 3,
        exportFormat: 'csv',
        notificationEmail: 'reports@example.com'
      },
      isActive: true,
      lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      results: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [newSchedule, setNewSchedule] = useState<Partial<ScraperSchedule>>({
    name: '',
    description: '',
    urls: [],
    schedule: {
      type: 'daily',
      interval: 1,
      timezone: 'UTC'
    },
    settings: {
      parallel: true,
      maxConcurrent: 3,
      retryOnError: true,
      maxRetries: 2,
      exportFormat: 'json'
    },
    isActive: true
  });

  const [newUrl, setNewUrl] = useState('');

  const scheduleTypes = [
    { value: 'once', label: 'Run Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom (Cron)' }
  ];

  const outputFormats: OutputFormat[] = ['json', 'csv', 'excel', 'xml'];

  const addUrl = () => {
    if (newUrl && !newSchedule.urls?.includes(newUrl)) {
      setNewSchedule(prev => ({
        ...prev,
        urls: [...(prev.urls || []), newUrl]
      }));
      setNewUrl('');
    }
  };

  const removeUrl = (url: string) => {
    setNewSchedule(prev => ({
      ...prev,
      urls: prev.urls?.filter(u => u !== url) || []
    }));
  };

  const createSchedule = () => {
    const schedule: ScraperSchedule = {
      id: `schedule_${Date.now()}`,
      name: newSchedule.name || 'Unnamed Schedule',
      description: newSchedule.description || '',
      urls: newSchedule.urls || [],
      templateId: newSchedule.templateId,
      schedule: newSchedule.schedule!,
      settings: newSchedule.settings!,
      isActive: newSchedule.isActive ?? true,
      results: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSchedules(prev => [...prev, schedule]);
    
    // Reset form
    setNewSchedule({
      name: '',
      description: '',
      urls: [],
      schedule: {
        type: 'daily',
        interval: 1,
        timezone: 'UTC'
      },
      settings: {
        parallel: true,
        maxConcurrent: 3,
        retryOnError: true,
        maxRetries: 2,
        exportFormat: 'json'
      },
      isActive: true
    });
  };

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, isActive: !schedule.isActive }
        : schedule
    ));
  };

  const deleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
  };

  const getStatusColor = (schedule: ScraperSchedule) => {
    if (!schedule.isActive) return 'bg-gray-500/20 text-gray-400';
    const timeSinceLastRun = schedule.lastRun ? Date.now() - schedule.lastRun.getTime() : Infinity;
    const timeUntilNext = schedule.nextRun ? schedule.nextRun.getTime() - Date.now() : Infinity;
    
    if (timeUntilNext < 60 * 60 * 1000) return 'bg-yellow-500/20 text-yellow-400'; // Next run in 1h
    return 'bg-green-500/20 text-green-400';
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <span>Bulk Scheduler</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="schedules" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedules">Active Schedules</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="schedules" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400">
                  {schedules.filter(s => s.isActive).length} Active
                </Badge>
                <Badge className="bg-gray-500/20 text-gray-400">
                  {schedules.filter(s => !s.isActive).length} Paused
                </Badge>
              </div>
              
              <Button variant="outline" size="sm" className="border-slate-600">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>

            <div className="space-y-3">
              {schedules.map((schedule) => (
                <Card key={schedule.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold">{schedule.name}</h3>
                          <Badge className={getStatusColor(schedule)}>
                            {schedule.isActive ? 'Active' : 'Paused'}
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {schedule.schedule.type}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-400 text-sm mb-3">{schedule.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">URLs:</span>
                            <span className="text-white ml-2">{schedule.urls.length}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Last Run:</span>
                            <span className="text-white ml-2">
                              {schedule.lastRun ? schedule.lastRun.toLocaleString() : 'Never'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Next Run:</span>
                            <span className="text-white ml-2">
                              {schedule.nextRun ? schedule.nextRun.toLocaleString() : 'Not scheduled'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600"
                          onClick={() => toggleSchedule(schedule.id)}
                        >
                          {schedule.isActive ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-red-400 hover:border-red-400"
                          onClick={() => deleteSchedule(schedule.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-name">Schedule Name</Label>
                <Input
                  id="schedule-name"
                  value={newSchedule.name || ''}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter schedule name"
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
              
              <div>
                <Label htmlFor="schedule-type">Schedule Type</Label>
                <Select 
                  value={newSchedule.schedule?.type} 
                  onValueChange={(value) => setNewSchedule(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule!, type: value as any }
                  }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {scheduleTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSchedule.description || ''}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this schedule does"
                className="bg-slate-700/50 border-slate-600"
              />
            </div>

            <div>
              <Label>Target URLs</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Enter URL to scrape"
                  className="bg-slate-700/50 border-slate-600"
                />
                <Button onClick={addUrl} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {newSchedule.urls?.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-white text-sm">{url}</span>
                    <button onClick={() => removeUrl(url)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="output-format">Output Format</Label>
                <Select 
                  value={newSchedule.settings?.exportFormat} 
                  onValueChange={(value) => setNewSchedule(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, exportFormat: value as OutputFormat }
                  }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {outputFormats.map(format => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="max-concurrent">Max Concurrent</Label>
                <Input
                  id="max-concurrent"
                  type="number"
                  value={newSchedule.settings?.maxConcurrent || 3}
                  onChange={(e) => setNewSchedule(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, maxConcurrent: parseInt(e.target.value) }
                  }))}
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
              
              <div>
                <Label htmlFor="max-retries">Max Retries</Label>
                <Input
                  id="max-retries"
                  type="number"
                  value={newSchedule.settings?.maxRetries || 2}
                  onChange={(e) => setNewSchedule(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, maxRetries: parseInt(e.target.value) }
                  }))}
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newSchedule.settings?.parallel}
                  onCheckedChange={(checked) => setNewSchedule(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, parallel: checked }
                  }))}
                />
                <Label>Parallel Processing</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newSchedule.settings?.retryOnError}
                  onCheckedChange={(checked) => setNewSchedule(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, retryOnError: checked }
                  }))}
                />
                <Label>Retry on Error</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={createSchedule}
                disabled={!newSchedule.name || !newSchedule.urls?.length}
                className="bg-gradient-primary"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
              
              <Button variant="outline" className="border-slate-600">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BulkScheduler;
