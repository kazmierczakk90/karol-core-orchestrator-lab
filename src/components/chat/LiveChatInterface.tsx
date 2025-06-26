
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  Archive
} from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import type { ChatSession } from '@/types/chat';
import { toast } from 'sonner';

const LiveChatInterface = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    isLoading: isLoadingSessions,
    createSession,
    deleteSession,
    updateSession,
    analyzeSession,
    isCreating,
    isDeleting,
    isAnalyzing
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

  // Automatycznie wybierz pierwszą sesję jeśli żadna nie jest wybrana
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0].id);
    }
  }, [sessions, selectedSession]);

  const handleCreateSession = () => {
    console.log('Creating new session...');
    createSession({
      agent_id: 'karol-core-ai',
      title: `Sesja z Karol-Core AI - ${new Date().toLocaleString('pl-PL')}`,
      metadata: {
        assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
        created_by: 'user',
        platform: 'karol-core'
      }
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession || isSending) return;
    
    console.log('Sending message:', newMessage);
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteSession = (sessionId: string, sessionTitle: string) => {
    if (window.confirm(`Czy na pewno chcesz usunąć sesję "${sessionTitle}"?`)) {
      deleteSession(sessionId);
      if (selectedSession === sessionId) {
        setSelectedSession(null);
      }
    }
  };

  const handleArchiveSession = (sessionId: string) => {
    updateSession({
      sessionId,
      updates: { status: 'archived' }
    });
    toast.success('Sesja została zarchiwizowana');
  };

  const handleAnalyzeSession = (sessionId: string) => {
    analyzeSession(sessionId);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
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
            <Button
              onClick={handleCreateSession}
              disabled={isCreating}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-slate-400">
            Asystent: Karol-Core AI (asst_7foGqdfqZKRBNloPEVXmlrua)
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
              </div>
            ) : (
              sessions.map((session) => (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-all ${
                    selectedSession === session.id
                      ? 'bg-cyan-600/20 border-cyan-600/50'
                      : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusBadgeColor(session.status)}>
                        {session.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnalyzeSession(session.id);
                          }}
                          disabled={isAnalyzing}
                          className="h-6 w-6 p-0 hover:bg-blue-600/20"
                          title="Analizuj sesję"
                        >
                          <BarChart3 className="h-3 w-3 text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveSession(session.id);
                          }}
                          className="h-6 w-6 p-0 hover:bg-yellow-600/20"
                          title="Archiwizuj sesję"
                        >
                          <Archive className="h-3 w-3 text-yellow-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id, session.title || 'Bez tytułu');
                          }}
                          disabled={isDeleting}
                          className="h-6 w-6 p-0 hover:bg-red-600/20"
                          title="Usuń sesję"
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {session.title || 'Bez tytułu'}
                    </p>
                    <div className="text-slate-400 text-xs mt-1">
                      <p>Utworzono: {new Date(session.created_at).toLocaleString('pl-PL')}</p>
                      {session.last_message_at && (
                        <p>Ostatnia wiadomość: {new Date(session.last_message_at).toLocaleString('pl-PL')}</p>
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
                    Agent: Karol-Core AI • Status: {activeSession.status}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSession(selectedSession)}
                  disabled={isAnalyzing}
                  className="bg-slate-900/50 border-slate-600"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <BarChart3 className="h-4 w-4 mr-2" />
                  )}
                  Analizuj
                </Button>
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
                  disabled={isSending}
                  className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Wybierz lub utwórz sesję czatu</h3>
              <p className="mb-4">Rozpocznij konwersację z Karol-Core AI</p>
              <Button
                onClick={handleCreateSession}
                disabled={isCreating}
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
