
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Table, Image, Share2 } from 'lucide-react';

interface AdvancedExporterProps {
  data: any[];
  onExport?: (format: string, options: any) => void;
}

const AdvancedExporter = ({ data, onExport }: AdvancedExporterProps) => {
  const [format, setFormat] = useState('json');
  const [options, setOptions] = useState({
    includeMetadata: true,
    includeTimestamp: true,
    compressOutput: false,
    customHeaders: false,
    formatting: 'pretty'
  });

  const exportFormats = [
    { value: 'json', label: 'JSON', icon: FileText },
    { value: 'csv', label: 'CSV', icon: Table },
    { value: 'excel', label: 'Excel (XLSX)', icon: Table },
    { value: 'pdf', label: 'PDF Report', icon: FileText },
    { value: 'xml', label: 'XML', icon: FileText },
    { value: 'markdown', label: 'Markdown', icon: FileText }
  ];

  const handleExport = () => {
    onExport?.(format, options);
  };

  const handleShare = () => {
    // Generate shareable link
    const shareData = {
      title: 'Karol Core Export',
      text: `Data export from Karol Core - ${data.length} items`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
    }
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Advanced Export</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="format">Export Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {exportFormats.map((fmt) => {
                const Icon = fmt.icon;
                return (
                  <SelectItem key={fmt.value} value={fmt.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{fmt.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Export Options</Label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metadata"
                checked={options.includeMetadata}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeMetadata: checked as boolean }))
                }
              />
              <Label htmlFor="metadata" className="text-sm">Include metadata</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="timestamp"
                checked={options.includeTimestamp}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeTimestamp: checked as boolean }))
                }
              />
              <Label htmlFor="timestamp" className="text-sm">Include timestamps</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="compress"
                checked={options.compressOutput}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, compressOutput: checked as boolean }))
                }
              />
              <Label htmlFor="compress" className="text-sm">Compress output</Label>
            </div>

            {(format === 'csv' || format === 'excel') && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="headers"
                  checked={options.customHeaders}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, customHeaders: checked as boolean }))
                  }
                />
                <Label htmlFor="headers" className="text-sm">Custom headers</Label>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-slate-400">
          Ready to export {data.length} items in {format.toUpperCase()} format
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleExport} className="flex-1 bg-gradient-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          
          <Button onClick={handleShare} variant="outline" className="border-slate-600">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedExporter;
