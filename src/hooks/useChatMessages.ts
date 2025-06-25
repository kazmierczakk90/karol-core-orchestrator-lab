
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import type { CreateChatMessageRequest } from '@/types/chat';

export const useChatMessages = (sessionId: string | null) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['chat-messages', sessionId],
    queryFn: () => sessionId ? chatService.getMessages(sessionId) : Promise.resolve([]),
    enabled: !!sessionId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!sessionId) throw new Error('No session selected');
      return chatService.sendMessageToAI(sessionId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', sessionId] });
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: (data: CreateChatMessageRequest) => chatService.createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', sessionId] });
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessageMutation.mutate,
    createMessage: createMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    isCreatingMessage: createMessageMutation.isPending,
  };
};
