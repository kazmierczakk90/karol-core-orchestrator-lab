
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Settings, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOption {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

const PDFExporterModule = () => {
  const { toast } = useToast();
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    { id: 'timeline', label: 'Timeline Events', description: 'All system events and decisions', checked: true },
    { id: 'agents', label: 'Agent Activities', description: 'Individual agent performance data', checked: true },
    { id: 'insights', label: 'Dynamic Insights', description: 'Generated analysis and trends', checked: false },
    { id: 'emotions', label: 'Emotional States', description: 'Emotional memory and patterns', checked: false },
    { id: 'scenarios', label: 'Scenario Maps', description: 'Decision trees and flow diagrams', checked: true },
    { id: 'config', label: 'Configuration', description: 'System settings and parameters', checked: false }
  ]);

  const [reportSettings, setReportSettings] = useState({
    title: 'Karol-Core AGI Report',
    dateRange: '24h',
    template: 'comprehensive',
    includeGraphs: true,
    includeRawData: false
  });

  const [customFilters, setCustomFilters] = useState({
    agentFilter: 'all',
    severityLevel: 'all',
    customQuery: ''
  });

  const toggleOption = (id: string) => {
    setExportOptions(prev => 
      prev.map(option => 
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  };

  const generateReport = () => {
    const selectedOptions = exportOptions.filter(opt => opt.checked);
    
    if (selectedOptions.length === 0) {
      toast({
        title: "No Data Selected",
        description: "Please select at least one data source",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report Generation Started",
      description: `@guardian-core processing ${selectedOptions.length} data sources`,
    });
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "PDF report has been generated successfully",
      });
    }, 3000);
  };

  const previewReport = () => {
    toast({
      title: "Preview Loading",
      description: "@guardian-core preparing report preview",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-indigo-400 flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>PDF Exporter / Reporter</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Report Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Report Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Report Title</Label>
                <Input
                  value={reportSettings.title}
                  onChange={(e) => setReportSettings(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Date Range</Label>
                <Select 
                  value={reportSettings.dateRange} 
                  onValueChange={(value) => setReportSettings(prev => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Template</Label>
                <Select 
                  value={reportSettings.template} 
                  onValueChange={(value) => setReportSettings(prev => ({ ...prev, template: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Executive Summary</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="technical">Technical Details</SelectItem>
                    <SelectItem value="narrative">Narrative Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">Data Sources</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportOptions.map(option => (
                <div key={option.id} className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg">
                  <Checkbox
                    id={option.id}
                    checked={option.checked}
                    onCheckedChange={() => toggleOption(option.id)}
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={option.id} 
                      className="text-white font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-slate-400 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Filters */}
          <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Custom Filters</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Agent Filter</Label>
                <Select 
                  value={customFilters.agentFilter} 
                  onValueChange={(value) => setCustomFilters(prev => ({ ...prev, agentFilter: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="@guardian-core">@guardian-core</SelectItem>
                    <SelectItem value="@memory-core">@memory-core</SelectItem>
                    <SelectItem value="@voice-core">@voice-core</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Severity Level</Label>
                <Select 
                  value={customFilters.severityLevel} 
                  onValueChange={(value) => setCustomFilters(prev => ({ ...prev, severityLevel: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Custom Query</Label>
              <Textarea
                placeholder="Enter custom filter query..."
                value={customFilters.customQuery}
                onChange={(e) => setCustomFilters(prev => ({ ...prev, customQuery: e.target.value }))}
                className="bg-slate-900/50 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-700 pt-4 flex flex-wrap gap-3">
            <Button onClick={generateReport} className="bg-indigo-600 hover:bg-indigo-700">
              <Download className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
            
            <Button onClick={previewReport} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Template Editor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFExporterModule;
