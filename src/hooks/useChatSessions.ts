
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import type { ChatSession, CreateChatSessionRequest } from '@/types/chat';
import { toast } from 'sonner';

export const useChatSessions = () => {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => chatService.getSessions(),
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: CreateChatSessionRequest) => {
      console.log('Creating session with data:', data);
      const result = await chatService.createSession(data);
      if (!result) {
        throw new Error('Nie udało się utworzyć sesji');
      }
      return result;
    },
    onSuccess: (newSession) => {
      console.log('Session created successfully:', newSession);
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast.success('Nowa sesja została utworzona pomyślnie');
    },
    onError: (error) => {
      console.error('Error creating session:', error);
      toast.error(`Błąd podczas tworzenia sesji: ${error.message}`);
    }
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: string; updates: Partial<ChatSession> }) => {
      const success = await chatService.updateSession(sessionId, updates);
      if (!success) {
        throw new Error('Nie udało się zaktualizować sesji');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast.success('Sesja została zaktualizowana');
    },
    onError: (error) => {
      console.error('Error updating session:', error);
      toast.error(`Błąd podczas aktualizacji: ${error.message}`);
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const success = await chatService.deleteSession(sessionId);
      if (!success) {
        throw new Error('Nie udało się usunąć sesji');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast.success('Sesja została usunięta');
    },
    onError: (error) => {
      console.error('Error deleting session:', error);
      toast.error(`Błąd podczas usuwania: ${error.message}`);
    }
  });

  const analyzeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const analysis = await chatService.analyzeSessionForPlatform(sessionId);
      if (!analysis) {
        throw new Error('Nie udało się przeanalizować sesji');
      }
      return analysis;
    },
    onSuccess: (analysis) => {
      console.log('Session analysis completed:', analysis);
      toast.success('Analiza sesji została zakończona');
    },
    onError: (error) => {
      console.error('Error analyzing session:', error);
      toast.error(`Błąd podczas analizy: ${error.message}`);
    }
  });

  const archiveSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const success = await chatService.updateSession(sessionId, { 
        status: 'archived',
        updated_at: new Date().toISOString()
      });
      if (!success) {
        throw new Error('Nie udało się zarchiwizować sesji');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast.success('Sesja została zarchiwizowana');
    },
    onError: (error) => {
      console.error('Error archiving session:', error);
      toast.error(`Błąd archiwizacji: ${error.message}`);
    }
  });

  return {
    sessions,
    isLoading,
    error,
    createSession: createSessionMutation.mutate,
    updateSession: updateSessionMutation.mutate,
    deleteSession: deleteSessionMutation.mutate,
    analyzeSession: analyzeSessionMutation.mutate,
    archiveSession: archiveSessionMutation.mutate,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
    isAnalyzing: analyzeSessionMutation.isPending,
    isArchiving: archiveSessionMutation.isPending,
  };
};
