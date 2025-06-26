
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import type { ChatSession, CreateChatSessionRequest } from '@/types/chat';
import { toast } from 'sonner';

export const useChatSessions = () => {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => chatService.getSessions(),
    refetchInterval: 30000, // Odświeżaj co 30 sekund
  });

  const createSessionMutation = useMutation({
    mutationFn: (data: CreateChatSessionRequest) => {
      console.log('Creating session with data:', data);
      return chatService.createSession(data);
    },
    onSuccess: (newSession) => {
      if (newSession) {
        queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
        toast.success('Nowa sesja czatu została utworzona');
        console.log('Session created successfully:', newSession);
      } else {
        toast.error('Nie udało się utworzyć nowej sesji');
      }
    },
    onError: (error) => {
      console.error('Error creating session:', error);
      toast.error('Błąd podczas tworzenia sesji czatu');
    }
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ sessionId, updates }: { sessionId: string; updates: Partial<ChatSession> }) =>
      chatService.updateSession(sessionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast.success('Sesja została zaktualizowana');
    },
    onError: () => {
      toast.error('Błąd podczas aktualizacji sesji');
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => chatService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast.success('Sesja została usunięta');
    },
    onError: () => {
      toast.error('Błąd podczas usuwania sesji');
    }
  });

  const analyzeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => chatService.analyzeSessionForPlatform(sessionId),
    onSuccess: (analysis) => {
      if (analysis) {
        toast.success('Analiza sesji została przeprowadzona');
        console.log('Session analysis:', analysis);
      }
    },
    onError: () => {
      toast.error('Błąd podczas analizy sesji');
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
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
    isAnalyzing: analyzeSessionMutation.isPending,
  };
};
