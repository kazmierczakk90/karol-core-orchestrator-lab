
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import type { ChatSession, CreateChatSessionRequest } from '@/types/chat';
import { toast } from 'sonner';

export const useChatSessions = () => {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => chatService.getSessions(),
    refetchInterval: 120000, // Zmniejszono z 30s na 2 minuty
    retry: 2,
    retryDelay: 2000,
    staleTime: 60000, // Dodano stale time
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: CreateChatSessionRequest) => {
      console.log('🎯 Creating session with data:', data);
      const result = await chatService.createSession({
        ...data,
        metadata: {
          ...data.metadata,
          demo_mode: true,
          created_at: new Date().toISOString(),
          karol_core_version: '2.0',
          session_type: 'live_chat',
          features_enabled: [
            'agent_selection',
            'command_system',
            'vector_search',
            'conversation_memory',
            'advanced_routing'
          ]
        }
      });
      if (!result) {
        throw new Error('Nie udało się utworzyć sesji');
      }
      return result;
    },
    onSuccess: (newSession) => {
      console.log('✅ Session created successfully:', newSession);
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast.success('Nowa sesja została utworzona pomyślnie');
    },
    onError: (error) => {
      console.error('💥 Error creating session:', error);
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

  return {
    sessions,
    isLoading,
    error,
    createSession: createSessionMutation.mutate,
    updateSession: updateSessionMutation.mutate,
    deleteSession: deleteSessionMutation.mutate,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
  };
};
