import { useState } from "react";
import { useEDICT } from "@/hooks/useEDICT";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";

export function EDICTPanel() {
  const { prompts, isProcessing, processPrompt } = useEDICT();
  const [inputPrompt, setInputPrompt] = useState("");

  const handleProcess = async () => {
    if (!inputPrompt.trim()) return;
    await processPrompt(inputPrompt, 'lite');
    setInputPrompt("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Wzbogacanie Promptów
        </h3>
        <Textarea
          placeholder="Wprowadź prompt do analizy i wzbogacenia..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <Button 
          onClick={handleProcess} 
          disabled={isProcessing || !inputPrompt.trim()}
          className="w-full"
          size="sm"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Przetwarzanie...
            </>
          ) : (
            'Przeanalizuj Prompt'
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Ostatnie Prompty</h3>
        {prompts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak przetworzonych promptów</p>
        ) : (
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {prompts.slice(0, 5).map((prompt) => (
              <Card key={prompt.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {prompt.original_prompt}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {prompt.orchestration_mode}
                    </Badge>
                  </div>
                  {prompt.generated_prompt && (
                    <p className="text-xs bg-muted p-2 rounded line-clamp-3">
                      {prompt.generated_prompt}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
