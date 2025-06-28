
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Command } from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useCommands } from '@/hooks/useCommands';
import CommandDropdown from './CommandDropdown';
import { toast } from 'sonner';

const EnhancedChatInterface = () => {
  const [input, setInput] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { sessions, createSession, isCreating } = useChatSessions();
  const { messages, sendMessage, isSending } = useChatMessages(currentSessionId);
  const { executeCommand, getCommandSuggestions, validateCommand } = useCommands();

  // Auto-scroll do końca wiadomości
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Utwórz początkową sesję
  useEffect(() => {
    if (!currentSessionId && sessions.length === 0 && !isCreating) {
      createSession({
        agent_id: 'karol-core-ai',
        title: 'Chat z Karol-Core CEO AI',
        metadata: {
          agent_type: 'ceo',
          enhanced_interface: true,
          commands_enabled: true
        }
      });
    }
  }, [sessions, currentSessionId, isCreating, createSession]);

  // Ustaw aktualną sesję
  useEffect(() => {
    if (sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId]);

  const handleSendMessage = async () => {
    if (!input.trim() || !currentSessionId) return;

    const messageText = input.trim();
    setInput('');

    // Sprawdź czy to komenda
    if (messageText.startsWith('&')) {
      const validation = validateCommand(messageText);
      if (validation.isValid) {
        executeCommand(messageText, { sessionId: currentSessionId });
        return;
      } else {
        toast.error(`Nieprawidłowa komenda: ${validation.errors.join(', ')}`);
        return;
      }
    }

    // Wyślij jako zwykłą wiadomość
    sendMessage(messageText);
  };

  const handleCommandSelect = (commandText: string) => {
    setInput(commandText);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Podpowiedzi komend podczas pisania
  const getCommandSuggestionsForInput = () => {
    if (input.startsWith('&') && input.length > 1) {
      return getCommandSuggestions(input).slice(0, 5);
    }
    return [];
  };

  const suggestions = getCommandSuggestionsForInput();

  return (
    <Card className="bg-slate-800/50 border-blue-800/30 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-cyan-400 flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <span>Karol-Core CEO AI</span>
            </h2>
            <p className="text-sm text-slate-400">
              Zaawansowany asystent AGI z systemem komend
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/20 text-green-400">
              Online
            </Badge>
            <CommandDropdown onCommandSelect={handleCommandSelect} />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Witaj w Karol-Core AI!</h3>
              <p className="mb-4">Jestem Twoim asystentem CEO. W czym mogę Ci pomóc?</p>
              <div className="text-sm space-y-1">
                <p>💡 Możesz użyć komend systemowych zaczynając od &</p>
                <p>⌨️ Naciśnij ⌘+K aby otworzyć paletę komend</p>
                <p>🔍 Kliknij przycisk "Komendy" aby przeglądać dostępne opcje</p>
              </div>
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
                    <Bot className="h-8 w-8 text-cyan-400 bg-slate-700/50 rounded-full p-1" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-100'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                  
                  <div className="text-xs opacity-70 mt-2 flex items-center space-x-2">
                    <span>{new Date(message.created_at).toLocaleTimeString('pl-PL')}</span>
                    {message.tokens_used && (
                      <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                        {message.tokens_used} tokens
                      </Badge>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-blue-400 bg-slate-700/50 rounded-full p-1" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isSending && (
            <div className="flex items-start space-x-3">
              <Bot className="h-8 w-8 text-cyan-400 bg-slate-700/50 rounded-full p-1" />
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-slate-300">Przetwarzam Twoją wiadomość...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Command Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-700/30 bg-slate-900/30">
          <div className="text-xs text-slate-400 mb-2">Podpowiedzi komend:</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((command) => (
              <button
                key={command.id}
                onClick={() => handleCommandSelect(command.name)}
                className="text-xs bg-slate-700/50 hover:bg-slate-600/50 text-cyan-400 px-2 py-1 rounded transition-colors"
              >
                {command.name} - {command.description}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700/30">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napisz wiadomość lub użyj komendy (&help aby zobaczyć dostępne komendy)..."
              className="bg-slate-900/50 border-slate-700/50 text-white pr-12"
              disabled={isSending || !currentSessionId}
            />
            {input.startsWith('&') && (
              <Command className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
            )}
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isSending || !currentSessionId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedChatInterface;
