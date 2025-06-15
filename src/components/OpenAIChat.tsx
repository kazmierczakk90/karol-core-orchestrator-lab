import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Search, Paperclip, File as FileIcon, X, Loader2, Mic } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
import { ChatMessage, Agent, ProjectFile } from '@/types/openai';

const OpenAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('@ceo');
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pełna lista 47 agentów
  const allAgents: Agent[] = [
    { id: '@ceo', name: 'CEO Agent', description: 'Strategic decision making and high-level planning', assistantId: 'asst_7foGqdfqZKRBNloPEVXmlrua', instructions: 'CEO-level strategic assistant', isActive: true },
    { id: '@logger', name: 'Logger Agent', description: 'System logging and monitoring', assistantId: 'asst_default', instructions: 'System logging specialist', isActive: true },
    { id: '@voice-core', name: 'Voice Core', description: 'Voice processing and communication', assistantId: 'asst_default', instructions: 'Voice interactions specialist', isActive: true },
    { id: '@analiza', name: 'Analiza Agent', description: 'Data analysis and insights', assistantId: 'asst_default', instructions: 'Data analysis specialist', isActive: true },
    { id: '@router', name: 'Router Agent', description: 'Task routing and distribution', assistantId: 'asst_default', instructions: 'Task routing specialist', isActive: true },
    { id: '@kontroling', name: 'Kontroling Agent', description: 'Quality control and oversight', assistantId: 'asst_default', instructions: 'Quality control specialist', isActive: true },
    { id: '@agent0', name: 'Agent Zero', description: 'Base agent functionality', assistantId: 'asst_default', instructions: 'Base agent operations', isActive: true },
    { id: '@system-admin', name: 'System Admin', description: 'System administration', assistantId: 'asst_default', instructions: 'System administration specialist', isActive: true },
    { id: '@optymalizator', name: 'Optymalizator', description: 'Performance optimization', assistantId: 'asst_default', instructions: 'Performance optimization specialist', isActive: true },
    { id: '@strategic-driver', name: 'Strategic Driver', description: 'Strategic planning and execution', assistantId: 'asst_default', instructions: 'Strategic planning specialist', isActive: true },
    { id: '@timing-core', name: 'Timing Core', description: 'Timing and scheduling', assistantId: 'asst_default', instructions: 'Timing coordination specialist', isActive: true },
    { id: '@guardian-core', name: 'Guardian Core', description: 'Security and protection', assistantId: 'asst_default', instructions: 'Security specialist', isActive: true },
    { id: '@agent-router-core', name: 'Agent Router Core', description: 'Advanced agent routing', assistantId: 'asst_default', instructions: 'Advanced routing specialist', isActive: true },
    { id: '@sky-solution', name: 'Sky Solution', description: 'Cloud solutions and automation', assistantId: 'asst_default', instructions: 'Cloud automation specialist', isActive: true },
    { id: '@party-app', name: 'Party App', description: 'Event and party management', assistantId: 'asst_default', instructions: 'Event management specialist', isActive: true },
    { id: '@home-project', name: 'Home Project', description: 'Home automation and management', assistantId: 'asst_default', instructions: 'Home automation specialist', isActive: true },
    { id: '@app-project', name: 'App Project', description: 'Application development', assistantId: 'asst_default', instructions: 'Application development specialist', isActive: true },
    { id: '@crm', name: 'CRM Agent', description: 'Customer relationship management', assistantId: 'asst_default', instructions: 'CRM specialist', isActive: true },
    { id: '@vector-store', name: 'Vector Store', description: 'Vector database management', assistantId: 'asst_default', instructions: 'Vector database specialist', isActive: true },
    { id: '@google-places', name: 'Google Places', description: 'Google Places API integration', assistantId: 'asst_default', instructions: 'Google Places specialist', isActive: true },
    { id: '@google-maps', name: 'Google Maps', description: 'Google Maps integration', assistantId: 'asst_default', instructions: 'Google Maps specialist', isActive: true },
    { id: '@google-search', name: 'Google Search', description: 'Google Search integration', assistantId: 'asst_default', instructions: 'Google Search specialist', isActive: true },
    { id: '@partyapp.club', name: 'PartyApp Club', description: 'Club and venue management', assistantId: 'asst_default', instructions: 'Club management specialist', isActive: true },
    { id: '@karol-core', name: 'Karol Core', description: 'Core Karol system functionality', assistantId: 'asst_default', instructions: 'Core system specialist', isActive: true },
    { id: '@fuko-lang', name: 'FUKO Lang', description: 'FUKO language processing', assistantId: 'asst_default', instructions: 'FUKO language specialist', isActive: true },
    { id: '@fuko-flow', name: 'FUKO Flow', description: 'FUKO workflow management', assistantId: 'asst_default', instructions: 'FUKO workflow specialist', isActive: true },
    { id: '@fuko-phi', name: 'FUKO Phi', description: 'FUKO philosophy and reasoning', assistantId: 'asst_default', instructions: 'FUKO reasoning specialist', isActive: true },
    { id: '@partyapp.ai', name: 'PartyApp AI', description: 'AI-powered party solutions', assistantId: 'asst_default', instructions: 'Party AI specialist', isActive: true },
    { id: '@skyai.ai', name: 'SkyAI', description: 'Advanced AI solutions', assistantId: 'asst_default', instructions: 'Advanced AI specialist', isActive: true },
    { id: '@karol-voice', name: 'Karol Voice', description: 'Karol voice processing', assistantId: 'asst_default', instructions: 'Voice processing specialist', isActive: true },
    { id: '@karol-logger', name: 'Karol Logger', description: 'Karol system logging', assistantId: 'asst_default', instructions: 'System logging specialist', isActive: true },
    { id: '@karol-router', name: 'Karol Router', description: 'Karol task routing', assistantId: 'asst_default', instructions: 'Task routing specialist', isActive: true },
    { id: '@karol-control', name: 'Karol Control', description: 'Karol system control', assistantId: 'asst_default', instructions: 'System control specialist', isActive: true },
    { id: '@karol-agent', name: 'Karol Agent', description: 'Karol agent management', assistantId: 'asst_default', instructions: 'Agent management specialist', isActive: true },
    { id: '@karol-admin', name: 'Karol Admin', description: 'Karol administration', assistantId: 'asst_default', instructions: 'Administration specialist', isActive: true },
    { id: '@karol-optimizer', name: 'Karol Optimizer', description: 'Karol system optimization', assistantId: 'asst_default', instructions: 'System optimization specialist', isActive: true },
    { id: '@karol-driver', name: 'Karol Driver', description: 'Karol system driver', assistantId: 'asst_default', instructions: 'System driver specialist', isActive: true },
    { id: '@karol-timer', name: 'Karol Timer', description: 'Karol timing systems', assistantId: 'asst_default', instructions: 'Timing systems specialist', isActive: true },
    { id: '@karol-guard', name: 'Karol Guard', description: 'Karol security systems', assistantId: 'asst_default', instructions: 'Security systems specialist', isActive: true },
    { id: '@karol-router-agent', name: 'Karol Router Agent', description: 'Advanced Karol routing', assistantId: 'asst_default', instructions: 'Advanced routing specialist', isActive: true },
    { id: '@karol-sky', name: 'Karol Sky', description: 'Karol cloud solutions', assistantId: 'asst_default', instructions: 'Cloud solutions specialist', isActive: true },
    { id: '@karol-party', name: 'Karol Party', description: 'Karol party management', assistantId: 'asst_default', instructions: 'Party management specialist', isActive: true },
    { id: '@karol-home', name: 'Karol Home', description: 'Karol home automation', assistantId: 'asst_default', instructions: 'Home automation specialist', isActive: true },
    { id: '@karol-app', name: 'Karol App', description: 'Karol application systems', assistantId: 'asst_default', instructions: 'Application systems specialist', isActive: true },
    { id: '@karol-crm', name: 'Karol CRM', description: 'Karol CRM systems', assistantId: 'asst_default', instructions: 'CRM systems specialist', isActive: true },
    { id: '@karol-vector', name: 'Karol Vector', description: 'Karol vector processing', assistantId: 'asst_default', instructions: 'Vector processing specialist', isActive: true },
    { id: '@karol-google', name: 'Karol Google', description: 'Karol Google integrations', assistantId: 'asst_default', instructions: 'Google integrations specialist', isActive: true },
  ];

  const filteredAgents = allAgents.filter(agent => 
    agent.name.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
    agent.id.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(agentSearchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

    setIsLoading(true);
    let uploadedFiles: ProjectFile[] = [];

    if (selectedFiles.length > 0) {
      setIsUploadingFiles(true);
      try {
        const uploadPromises = selectedFiles.map(file => openaiService.uploadFile(file));
        uploadedFiles = await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Error uploading files:', error);
        const errorMessage: ChatMessage = {
          id: `msg_${Date.now()}_upload_error`,
          role: 'assistant',
          content: 'I had trouble uploading your files. Please try again.',
          timestamp: new Date(),
          agentId: selectedAgent,
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        setIsUploadingFiles(false);
        return;
      } finally {
        setIsUploadingFiles(false);
      }
    }
    
    let messageContent = input;
    if (uploadedFiles.length > 0) {
      const fileNames = uploadedFiles.map(f => f.name).join(', ');
      messageContent += `\n\n(Udostępniono pliki: ${fileNames})`;
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: input,
      files: uploadedFiles,
      timestamp: new Date(),
      agentId: selectedAgent
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedFiles([]);

    try {
      const response = await openaiService.sendMessage(messageContent, selectedAgent);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'Przepraszam, wystąpił błąd podczas komunikacji z agentem.',
        timestamp: new Date(),
        agentId: selectedAgent
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(event.target.files!)]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedAgentInfo = allAgents.find(a => a.id === selectedAgent);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-slate-800/50 border-blue-800/30 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>OpenAI Assistant Chat</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Komunikacja z agentami przez OpenAI API (47 dostępnych agentów)
            </CardDescription>
          </div>
          <Badge className="bg-green-500/20 text-green-400">
            {allAgents.length} agentów
          </Badge>
        </div>
        
        {/* Agent Selector z wyszukiwaniem */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Wyszukaj agenta..."
              value={agentSearchQuery}
              onChange={(e) => setAgentSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-700/50 text-white pl-10"
            />
          </div>
          
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
              {filteredAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-cyan-400">{agent.id}</span>
                    <div>
                      <div className="font-semibold">{agent.name}</div>
                      <div className="text-xs text-slate-400">{agent.description}</div>
                    </div>
                    {agent.isActive && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedAgentInfo && (
          <div className="text-sm text-slate-400 p-2 bg-slate-900/30 rounded">
            <div><strong>Agent:</strong> {selectedAgentInfo.name}</div>
            <div><strong>Opis:</strong> {selectedAgentInfo.description}</div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Rozpocznij rozmowę z wybranym agentem</p>
              <p className="text-sm">Dostępnych: {allAgents.length} agentów</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <Bot className="h-6 w-6 text-cyan-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-100'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-2 border-t border-white/20 pt-2">
                      {message.files.map(file => (
                        <div key={file.id} className="flex items-center gap-2 bg-blue-700/50 p-2 rounded-md">
                          <FileIcon className="h-5 w-5 flex-shrink-0" />
                          <div className="text-xs">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="opacity-80">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {message.agentId} • {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && !isUploadingFiles && (
            <div className="flex items-start space-x-3">
              <Bot className="h-6 w-6 text-cyan-400" />
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          {isUploadingFiles && (
            <div className="flex items-start space-x-3">
              <Bot className="h-6 w-6 text-cyan-400" />
              <div className="bg-slate-700/50 rounded-lg p-3 text-sm text-slate-200 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading files...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mb-2 p-2 bg-slate-900/50 rounded-lg space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between text-sm text-white bg-slate-700/50 p-2 rounded">
                <div className="flex items-center space-x-2 truncate">
                  <FileIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-slate-400 text-xs">({formatFileSize(file.size)})</span>
                </div>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:bg-red-500/20" onClick={() => removeSelectedFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={triggerFileSelect}
            disabled={isLoading}
            className="bg-slate-900/50 border-slate-700/50 text-white hover:bg-slate-700"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.json,.csv,.md,image/*"
          />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napisz wiadomość lub załącz plik..."
            className="bg-slate-900/50 border-slate-700/50 text-white"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            disabled
            title="Voice input (coming soon)"
            className="bg-slate-900/50 border-slate-700/50 text-white cursor-not-allowed"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenAIChat;
