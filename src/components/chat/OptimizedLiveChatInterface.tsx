
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Bot, 
  User,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  Clock,
  Zap,
  Wifi,
  WifiOff,
  Brain,
  Crown,
  Users,
  Settings
} from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import AgentSelector from './AgentSelector';
import { AgentService, Agent } from '@/services/agentService';
import type { ChatSession } from '@/types/chat';
import { toast } from 'sonner';

const OptimizedLiveChatInterface = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
    createSession,
    deleteSession,
    isCreating,
    isDeleting
  } = useChatSessions();

  const {
    messages,
    isLoading: isLoadingMessages,
    sendMessage,
    isSending
  } = useChatMessages(selectedSession);

  // Inicjalizacja domyślnego agenta
  useEffect(() => {
    if (!selectedAgent) {
      const defaultAgent = AgentService.getAgentById('@ceo');
      if (defaultAgent) {
        setSelectedAgent(defaultAgent);
      }
    }
  }, [selectedAgent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-select first session if none selected
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0].id);
    }
  }, [sessions, selectedSession]);

  // Monitor connection status
  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus(navigator.onLine ? 'connected' : 'disconnected');
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  const handleCreateSession = async () => {
    if (!selectedAgent) {
      toast.error('Wybierz agenta przed utworzeniem sesji');
      return;
    }

    console.log('🎯 Creating session with agent:', selectedAgent.name);
    setConnectionStatus('connecting');
    
    try {
      await createSession({
        agent_id: selectedAgent.id,
        title: `Rozmowa z ${selectedAgent.name} - ${new Date().toLocaleString('pl-PL')}`,
        metadata: {
          assistant_id: selectedAgent.assistant_id,
          agent_name: selectedAgent.name,
          agent_category: selectedAgent.category,
          agent_capabilities: selectedAgent.capabilities,
          vector_store_id: 'vs_karol_core_main',
          created_by: 'user',
          platform: 'karol-core-v2',
          session_version: '2.0',
          optimized: true,
          features: [
            'agent_selection',
            'conversation_memory',
            'command_system',
            'vector_search',
            'advanced_ai'
          ]
        }
      });
      setConnectionStatus('connected');
      toast.success(`Sesja z ${selectedAgent.name} została utworzona!`);
    } catch (error) {
      console.error('💥 Failed to create session:', error);
      setConnectionStatus('disconnected');
      toast.error(`Nie udało się utworzyć sesji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedSession || isSending) return;
    
    console.log('📤 Sending message to agent:', selectedAgent?.name);
    setConnectionStatus('connecting');
    
    try {
      await sendMessage(newMessage);
      setNewMessage('');
      setConnectionStatus('connected');
      toast.success('Wiadomość wysłana do agenta!');
    } catch (error) {
      console.error('💥 Failed to send message:', error);
      setConnectionStatus('disconnected');
      toast.error(`Błąd wysyłania: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-400" />;
      case 'connecting': return <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'disconnected': return <WifiOff className="h-4 w-4 text-red-400" />;
    }
  };

  const activeSession = sessions.find(s => s.id === selectedSession);

  return (
    <div className="flex h-full max-h-[800px] bg-slate-900 rounded-lg overflow-hidden">
      {/* Sidebar z sesjami */}
      <div className="w-80 border-r border-slate-700 bg-slate-800/50">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Brain className="h-5 w-5 mr-2 text-cyan-400" />
              Karol-Core Chat
            </h2>
            <div className="flex items-center space-x-2">
              {getConnectionIcon()}
              <Button
                onClick={() => setShowAgentSelector(true)}
                variant="outline"
                size="sm"
                className="border-purple-600/50 text-purple-400 hover:bg-purple-600/20"
                title="Wybierz agenta"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleCreateSession}
                disabled={isCreating || !selectedAgent}
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
                title="Utwórz nową sesję"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Selected Agent Display */}
          {selectedAgent && (
            <Card className="bg-slate-900/50 border-cyan-600/30 mb-4">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{selectedAgent.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-medium truncate">
                      {selectedAgent.name}
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      {selectedAgent.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                    <Crown className="h-2 w-2 mr-1" />
                    Aktywny
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="space-y-2">
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <div className="flex items-center space-x-1">
                  {getConnectionIcon()}
                  <span className="capitalize">{connectionStatus}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Sesje:</span>
                <Badge variant="outline" className="text-xs">{sessions.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Agent:</span>
                <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                  {selectedAgent?.id || 'Brak'}
                </Badge>
              </div>
            </div>
            
            {sessionsError && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400 text-xs">
                  Błąd ładowania sesji
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {isLoadingSessions ? (
              <div className="text-center text-slate-400 py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">Ładowanie sesji...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Brak sesji czatu</p>
                <p className="text-xs mt-1">Utwórz pierwszą sesję z agentem</p>
                {!selectedAgent && (
                  <Button
                    onClick={() => setShowAgentSelector(true)}
                    variant="outline"
                    size="sm"
                    className="mt-2 border-purple-600/50 text-purple-400"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Wybierz agenta
                  </Button>
                )}
              </div>
            ) : (
              sessions.map((session) => (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedSession === session.id
                      ? 'bg-cyan-600/20 border-cyan-600/50 shadow-lg'
                      : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${getStatusBadgeColor(session.status)} border text-xs`}>
                        {session.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Usunąć sesję "${session.title}"?`)) {
                            deleteSession(session.id);
                          }
                        }}
                        disabled={isDeleting}
                        className="h-6 w-6 p-0 hover:bg-red-600/20"
                        title="Usuń sesję"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3 w-3 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="h-3 w-3 text-red-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {session.title || 'Bez tytułu'}
                    </p>
                    <div className="text-slate-400 text-xs mt-1 space-y-1">
                      {session.metadata?.agent_name && (
                        <div className="flex items-center space-x-1">
                          <Bot className="h-3 w-3" />
                          <span className="truncate">{session.metadata.agent_name}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(session.created_at).toLocaleString('pl-PL')}</span>
                      </div>
                      {session.last_message_at && (
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>Ostatnia: {new Date(session.last_message_at).toLocaleString('pl-PL')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Główny obszar czatu */}
      <div className="flex-1 flex flex-col">
        {selectedSession && activeSession ? (
          <>
            {/* Nagłówek czatu */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-cyan-400" />
                    {activeSession.title || 'Sesja z Karol-Core AI'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    🤖 {activeSession.metadata?.agent_name || 'Karol-Core AI'} • 
                    Status: {activeSession.status} • 
                    {activeSession.metadata?.optimized && ' ⚡ Zoptymalizowane'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="bg-slate-900/50 border-slate-600"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Odśwież
                  </Button>
                </div>
              </div>
            </div>

            {/* Obszar wiadomości */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {isLoadingMessages ? (
                  <div className="text-center text-slate-400 py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p>Ładowanie wiadomości...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium">Rozpocznij konwersację</p>
                    <p className="text-sm mt-1">
                      Rozmawiaj z {selectedAgent?.name || 'Karol-Core AI'}
                    </p>
                    <div className="text-xs mt-2 opacity-75 space-y-1">
                      <p>Dostępne komendy systemowe:</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">&dash</Badge>
                        <Badge variant="outline" className="text-xs">&agents</Badge>
                        <Badge variant="outline" className="text-xs">&memory</Badge>
                        <Badge variant="outline" className="text-xs">&analytics</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Brain className="h-4 w-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.role === 'user' ? 'Ty' : (selectedAgent?.name || 'AI')}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs opacity-50 mt-1 flex items-center justify-between">
                          <span>{new Date(message.created_at).toLocaleTimeString('pl-PL')}</span>
                          <div className="flex items-center space-x-2">
                            {message.metadata?.tokens_used && (
                              <span>🪙 {message.metadata.tokens_used}</span>
                            )}
                            {message.metadata?.processing_time && (
                              <span>⏱️ {message.metadata.processing_time}ms</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-white rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span className="text-xs opacity-75">
                          {selectedAgent?.name || 'Karol-Core AI'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Przetwarzam zapytanie...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Pole input */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/30">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Napisz do ${selectedAgent?.name || 'agenta'}... (Enter = wyślij)`}
                  disabled={isSending || connectionStatus === 'disconnected'}
                  className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending || connectionStatus === 'disconnected'}
                  className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {connectionStatus === 'disconnected' && (
                <Alert className="mt-2 bg-red-500/10 border-red-500/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400 text-xs">
                    Brak połączenia. Sprawdź internet i spróbuj ponownie.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Karol-Core Live Chat</h3>
              {!selectedAgent ? (
                <div>
                  <p className="mb-4">Wybierz agenta aby rozpocząć</p>
                  <Button
                    onClick={() => setShowAgentSelector(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Wybierz agenta
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="mb-4">Utwórz sesję z {selectedAgent.name}</p>
                  <Button
                    onClick={handleCreateSession}
                    disabled={isCreating || connectionStatus === 'disconnected'}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isCreating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Utwórz nową sesję
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Agent Selector Modal */}
      <AgentSelector
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        isOpen={showAgentSelector}
        onClose={() => setShowAgentSelector(false)}
      />
    </div>
  );
};

export default OptimizedLiveChatInterface;
