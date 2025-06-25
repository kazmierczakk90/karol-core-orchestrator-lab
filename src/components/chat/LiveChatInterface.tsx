
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Bot, 
  User,
  Trash2,
  Loader2
} from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import type { ChatSession } from '@/types/chat';

const LiveChatInterface = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    isLoading: isLoadingSessions,
    createSession,
    deleteSession,
    isCreating
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

  const handleCreateSession = () => {
    createSession({
      agent_id: 'karol-core-ai',
      title: `Nowa sesja ${new Date().toLocaleString()}`,
      metadata: {}
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession || isSending) return;
    
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

  return (
    <div className="flex h-full max-h-[800px] bg-slate-900">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {session.title || 'Bez tytułu'}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {new Date(session.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Główny obszar czatu */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Nagłówek czatu */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/30">
              <h3 className="text-white font-medium">
                {sessions.find(s => s.id === selectedSession)?.title || 'Sesja czatu'}
              </h3>
              <p className="text-slate-400 text-sm">Agent: Karol-Core AI</p>
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
                    <p className="text-sm">Rozpocznij konwersację</p>
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
                        <p className="text-xs opacity-50 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
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
                        <span className="text-sm">Pisze odpowiedź...</span>
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
                  placeholder="Napisz wiadomość..."
                  disabled={isSending}
                  className="bg-slate-900/50 border-slate-700/50 text-white"
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
              <h3 className="text-lg font-medium mb-2">Wybierz sesję czatu</h3>
              <p>Wybierz istniejącą sesję lub utwórz nową, aby rozpocząć konwersację</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatInterface;
