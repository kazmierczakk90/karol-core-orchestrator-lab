import { MessageSquare } from "lucide-react";
import OptimizedLiveChatInterface from "@/components/chat/OptimizedLiveChatInterface";

export default function LiveChatPage() {
  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-emerald-400" />
          Live Chat
        </h1>
        <p className="text-muted-foreground mt-1">
          Chat with AI agents in real-time
        </p>
      </div>

      <div className="h-[calc(100%-5rem)]">
        <OptimizedLiveChatInterface />
      </div>
    </div>
  );
}
