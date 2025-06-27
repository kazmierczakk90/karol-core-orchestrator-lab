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
  BarChart3,
  RefreshCw,
  Archive,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import type { ChatSession } from '@/types/chat';
import { toast } from 'sonner';

const LiveChatInterface = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [debugMode, setDebugMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
    createSession,
    deleteSession,
    updateSession,
    analyzeSession,
    archiveSession,
    isCreating,
    isDeleting,
    isAnalyzing,
    isArchiving
  } = useChatSessions();

  const {
    messages,
    isLoading: isLoadingMessages,
    sendMessage,
    isSending
  } = useChatMessages(selectedSession);

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
    console.log('🎯 User clicked create session');
    setConnectionStatus('connecting');
    
    try {
      await createSession({
        agent_id: 'karol-core-ai',
        title: `Sesja z Karol-Core AI - ${new Date().toLocaleString('pl-PL')}`,
        metadata: {
          assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
          created_by: 'user',
          platform: 'karol-core',
          version: '2.0',
          features: ['thread_continuation', 'platform_analysis', 'advanced_memory']
        }
      });
      setConnectionStatus('connected');
      toast.success('Sesja została utworzona pomyślnie!');
    } catch (error) {
      console.error('💥 Failed to create session:', error);
      setConnectionStatus('disconnected');
      toast.error(`Nie udało się utworzyć sesji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedSession || isSending) return;
    
    console.log('📤 Sending message:', newMessage);
    setConnectionStatus('connecting');
    
    try {
      await sendMessage(newMessage);
      setNewMessage('');
      setConnectionStatus('connected');
      toast.success('Wiadomość wysłana!');
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

  const handleDeleteSession = async (sessionId: string, sessionTitle: string) => {
    if (window.confirm(`Czy na pewno chcesz usunąć sesję "${sessionTitle}"? Ta akcja jest nieodwracalna.`)) {
      try {
        await deleteSession(sessionId);
        if (selectedSession === sessionId) {
          setSelectedSession(null);
        }
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const handleArchiveSession = async (sessionId: string) => {
    try {
      await archiveSession(sessionId);
    } catch (error) {
      console.error('Failed to archive session:', error);
    }
  };

  const handleAnalyzeSession = async (sessionId: string) => {
    try {
      await analyzeSession(sessionId);
    } catch (error) {
      console.error('Failed to analyze session:', error);
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
              <MessageCircle className="h-5 w-5 mr-2 text-cyan-400" />
              Live Chat
            </h2>
            <div className="flex items-center space-x-2">
              {getConnectionIcon()}
              <Button
                onClick={handleCreateSession}
                disabled={isCreating}
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-slate-400">
              <div>🤖 Asystent: Karol-Core AI</div>
              <div>🆔 ID: asst_7foGqdfqZKRBNloPEVXmlrua</div>
              <div className="flex items-center space-x-1 mt-1">
                <span>Status:</span>
                {getConnectionIcon()}
                <span className="capitalize">{connectionStatus}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <span>Sesje:</span>
                <Badge variant="outline">{sessions.length}</Badge>
              </div>
            </div>
            
            {sessionsError && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">
                  Błąd ładowania sesji. Sprawdź połączenie.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={() => setDebugMode(!debugMode)}
              variant="ghost"
              size="sm"
              className="w-full text-xs"
            >
              {debugMode ? '🔍 Ukryj Debug' : '🔍 Pokaż Debug'}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {isLoadingSessions ? (
              <div className="text-center text-slate-400 py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                Ładowanie sesji...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Brak sesji czatu</p>
                <p className="text-sm">Utwórz pierwszą sesję</p>
                <Button
                  onClick={handleCreateSession}
                  disabled={isCreating}
                  className="mt-2 bg-cyan-600 hover:bg-cyan-700"
                  size="sm"
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Utwórz sesję
                </Button>
              </div>
            ) : (
              sessions.map((session) => (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-all border ${
                    selectedSession === session.id
                      ? 'bg-cyan-600/20 border-cyan-600/50 shadow-lg'
                      : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${getStatusBadgeColor(session.status)} border`}>
                        {session.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Czy na pewno chcesz usunąć sesję "${session.title}"?`)) {
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
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {session.title || 'Bez tytułu'}
                    </p>
                    <div className="text-slate-400 text-xs mt-1 space-y-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Utworzono: {new Date(session.created_at).toLocaleString('pl-PL')}</span>
                      </div>
                      {session.last_message_at && (
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>Ostatnia: {new Date(session.last_message_at).toLocaleString('pl-PL')}</span>
                        </div>
                      )}
                      {debugMode && (
                        <div className="text-xs opacity-75">
                          <div>ID: {session.id}</div>
                          <div>Agent: {session.agent_id}</div>
                          {session.metadata?.demo_mode && <div>🎭 Demo Mode</div>}
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
                  <h3 className="text-white font-medium">
                    {activeSession.title || 'Sesja czatu'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    🤖 Agent: Karol-Core AI • Status: {activeSession.status} • Kontynuacja wątku: ✓
                    {activeSession.metadata?.demo_mode && ' • 🎭 Demo Mode'}
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
                    Ładowanie wiadomości...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Brak wiadomości</p>
                    <p className="text-sm">Rozpocznij konwersację z Karol-Core AI</p>
                    <p className="text-xs mt-2 opacity-75">Sesja będzie kontynuowana automatycznie</p>
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
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.role === 'user' ? 'Ty' : 'Karol-Core AI'}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs opacity-50 mt-1 flex items-center justify-between">
                          <span>{new Date(message.created_at).toLocaleTimeString('pl-PL')}</span>
                          {message.metadata?.tokens_used && (
                            <span>Tokeny: {message.metadata.tokens_used}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-white rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <span className="text-xs opacity-75">Karol-Core AI</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Generuję odpowiedź...</span>
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
                  placeholder="Napisz wiadomość do Karol-Core AI..."
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
                  <AlertDescription className="text-red-400">
                    Brak połączenia. Sprawdź internet i spróbuj ponownie.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Wybierz lub utwórz sesję czatu</h3>
              <p className="mb-4">Rozpocznij konwersację z Karol-Core AI</p>
              <p className="text-sm mb-4 opacity-75">
                Funkcje: Kontynuacja wątków • Analiza platform • Zaawansowana pamięć
              </p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatInterface;
