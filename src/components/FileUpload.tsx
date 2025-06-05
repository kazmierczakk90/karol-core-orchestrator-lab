
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
import { ProjectFile } from '@/types/openai';

const FileUpload = () => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        return await openaiService.uploadFile(file);
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>File Upload & Vector Store</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Upload files to OpenAI Vector Store for agent access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-300 mb-2">
            Przeciągnij pliki tutaj lub kliknij aby wybrać
          </p>
          <Button 
            onClick={triggerFileSelect}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {uploading ? 'Uploading...' : 'Select Files'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.json,.csv,.md"
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Uploaded Files:</h4>
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{file.name}</p>
                    <p className="text-slate-400 text-xs">
                      {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Vector Store
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-slate-400">
          <p>Supported formats: TXT, PDF, DOC, DOCX, JSON, CSV, MD</p>
          <p>Files are automatically added to Vector Store: vs_67e03445b63c819183a0c37c390f5904</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
