
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { smartExtractorService, SmartExtractionResult } from '@/services/smartExtractorService';
import { toast } from '@/components/ui/sonner';
import { 
  Upload, Play, Download, Pause, RotateCcw, Filter, 
  TrendingUp, BarChart3, FileSpreadsheet, Database,
  Zap, Clock, CheckCircle, AlertTriangle, FileText
} from 'lucide-react';

interface ProcessingJob {
  id: string;
  type: 'bulk_extraction' | 'data_enrichment' | 'validation' | 'export';
  status: 'pending' | 'running' | 'completed' | 'error' | 'paused';
  progress: number;
  urls?: string[];
  results?: SmartExtractionResult[];
  startedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  settings: {
    parallel: boolean;
    maxConcurrent: number;
    template?: string;
    exportFormat?: string;
  };
}

const DataProcessor = () => {
  const [urlInput, setUrlInput] = useState('');
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [currentResults, setCurrentResults] = useState<SmartExtractionResult[]>([]);
  const [bulkSettings, setBulkSettings] = useState({
    parallel: true,
    maxConcurrent: 3,
    template: 'auto',
    exportFormat: 'json'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseUrlsFromInput = (input: string): string[] => {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        try {
          new URL(line);
          return true;
        } catch {
          return false;
        }
      });
  };

  const startBulkProcessing = async () => {
    const urls = parseUrlsFromInput(urlInput);
    
    if (urls.length === 0) {
      toast.error('Podaj prawidłowe URLs (jeden na linię)');
      return;
    }

    const job: ProcessingJob = {
      id: `job_${Date.now()}`,
      type: 'bulk_extraction',
      status: 'running',
      progress: 0,
      urls,
      startedAt: new Date(),
      settings: bulkSettings
    };

    setProcessingJobs(prev => [job, ...prev]);
    
    try {
      // Simulate progress updates
      const updateProgress = (progress: number) => {
        setProcessingJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, progress } : j
        ));
      };

      // Simulate processing with progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        updateProgress(i);
      }

      const results = await smartExtractorService.processBulkUrls(urls, {
        parallel: bulkSettings.parallel,
        maxConcurrent: bulkSettings.maxConcurrent
      });

      setProcessingJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { 
              ...j, 
              status: 'completed', 
              progress: 100, 
              results,
              completedAt: new Date()
            } 
          : j
      ));

      setCurrentResults(results);
      
      toast.success(`Bulk processing completed!`, {
        description: `Processed ${urls.length} URLs, extracted ${results.reduce((sum, r) => sum + r.metadata.itemCount, 0)} total items`
      });

    } catch (error) {
      setProcessingJobs(prev => prev.map(j => 
        j.id === job.id 
          ? { 
              ...j, 
              status: 'error', 
              errorMessage: 'Processing failed'
            } 
          : j
      ));
      toast.error('Bulk processing failed');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setUrlInput(text);
    
    const urls = parseUrlsFromInput(text);
    toast.success(`Loaded ${urls.length} URLs from file`);
  };

  const pauseJob = (jobId: string) => {
    setProcessingJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, status: 'paused' as const } : j
    ));
    toast.info('Job paused');
  };

  const resumeJob = (jobId: string) => {
    setProcessingJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, status: 'running' as const } : j
    ));
    toast.info('Job resumed');
  };

  const cancelJob = (jobId: string) => {
    setProcessingJobs(prev => prev.filter(j => j.id !== jobId));
    toast.info('Job cancelled');
  };

  const exportResults = async (results: SmartExtractionResult[], format: string) => {
    const blob = await smartExtractorService.exportData(results, format as any);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_extraction_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Results exported to ${format.toUpperCase()}`);
  };

  const getJobStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'running': return <Zap className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'paused': return <Pause className="h-4 w-4 text-orange-400" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getJobStatusColor = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'running': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'paused': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const totalExtractedItems = currentResults.reduce((sum, r) => sum + r.metadata.itemCount, 0);
  const avgProcessingTime = currentResults.length > 0 
    ? currentResults.reduce((sum, r) => sum + r.metadata.processingTime, 0) / currentResults.length 
    : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dark border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-gradient-primary flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span>Data Processor</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Bulk processing and advanced data extraction capabilities
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="bulk" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="bulk">Bulk Processing</TabsTrigger>
              <TabsTrigger value="enrichment">Data Enrichment</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="bulk" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <Label className="text-slate-300">URLs to Process (one per line)</Label>
                    <div className="flex space-x-2 mt-2">
                      <textarea
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://github.com/trending&#10;https://linkedin.com/search/results/people&#10;https://news.ycombinator.com"
                        className="flex-1 min-h-[120px] bg-slate-900/50 border border-slate-700/50 text-white p-3 rounded-md resize-none"
                        rows={6}
                      />
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-slate-600 text-slate-300"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {parseUrlsFromInput(urlInput).length} valid URLs
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={startBulkProcessing}
                    disabled={parseUrlsFromInput(urlInput).length === 0}
                    className="bg-gradient-primary hover:bg-gradient-secondary w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Bulk Processing
                  </Button>
                </div>

                <div className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Processing Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Parallel Processing</Label>
                        <Switch
                          checked={bulkSettings.parallel}
                          onCheckedChange={(checked) => setBulkSettings(prev => ({ ...prev, parallel: checked }))}
                        />
                      </div>

                      <div>
                        <Label className="text-slate-300">Max Concurrent</Label>
                        <Select 
                          value={bulkSettings.maxConcurrent.toString()} 
                          onValueChange={(value) => setBulkSettings(prev => ({ ...prev, maxConcurrent: parseInt(value) }))}
                        >
                          <SelectTrigger className="mt-1 bg-slate-900/50 border-slate-700/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-slate-300">Template</Label>
                        <Select 
                          value={bulkSettings.template} 
                          onValueChange={(value) => setBulkSettings(prev => ({ ...prev, template: value }))}
                        >
                          <SelectTrigger className="mt-1 bg-slate-900/50 border-slate-700/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto-detect</SelectItem>
                            <SelectItem value="github_repos">GitHub Repos</SelectItem>
                            <SelectItem value="linkedin_profiles">LinkedIn Profiles</SelectItem>
                            <SelectItem value="amazon_products">Amazon Products</SelectItem>
                            <SelectItem value="generic_list">Generic List</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-slate-300">Export Format</Label>
                        <Select 
                          value={bulkSettings.exportFormat} 
                          onValueChange={(value) => setBulkSettings(prev => ({ ...prev, exportFormat: value }))}
                        >
                          <SelectTrigger className="mt-1 bg-slate-900/50 border-slate-700/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="enrichment" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Data Enrichment</CardTitle>
                  <CardDescription className="text-slate-400">
                    Enhance extracted data with additional information and validation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                    <p className="text-slate-400">Data enrichment features coming soon</p>
                    <p className="text-slate-500 text-sm mt-2">
                      Auto-categorization, data validation, duplicate detection, and more
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {currentResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-2xl font-bold text-white">{totalExtractedItems}</div>
                          <div className="text-slate-400 text-sm">Total Items</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-green-400" />
                        <div>
                          <div className="text-2xl font-bold text-white">{Math.round(avgProcessingTime)}ms</div>
                          <div className="text-slate-400 text-sm">Avg Processing</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-purple-400" />
                        <div>
                          <div className="text-2xl font-bold text-white">{currentResults.length}</div>
                          <div className="text-slate-400 text-sm">URLs Processed</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                    <p className="text-slate-400">No data to analyze yet</p>
                    <p className="text-slate-500 text-sm mt-2">Run some bulk processing jobs to see analytics</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Processing Jobs */}
      {processingJobs.length > 0 && (
        <Card className="bg-gradient-dark border-cyan-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Processing Jobs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processingJobs.map((job) => (
                <Card key={job.id} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getJobStatusIcon(job.status)}
                          <div>
                            <div className="font-semibold text-white">
                              {job.type.replace('_', ' ').toUpperCase()}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {job.urls?.length} URLs • Started {job.startedAt.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getJobStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          
                          {job.status === 'running' && (
                            <Button size="sm" variant="outline" onClick={() => pauseJob(job.id)}>
                              <Pause className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {job.status === 'paused' && (
                            <Button size="sm" variant="outline" onClick={() => resumeJob(job.id)}>
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {job.status === 'completed' && job.results && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => exportResults(job.results!, job.settings.exportFormat || 'json')}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => cancelJob(job.id)}
                            className="border-red-600 text-red-400"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <Progress value={job.progress} className="h-2" />
                      
                      {job.status === 'completed' && job.results && (
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>✅ {job.results.length} URLs processed</span>
                          <span>📊 {job.results.reduce((sum, r) => sum + r.metadata.itemCount, 0)} items extracted</span>
                          <span>⏱️ {job.completedAt ? Math.round((job.completedAt.getTime() - job.startedAt.getTime()) / 1000) : 0}s total</span>
                        </div>
                      )}
                      
                      {job.status === 'error' && job.errorMessage && (
                        <div className="text-red-400 text-sm">
                          ❌ {job.errorMessage}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataProcessor;
