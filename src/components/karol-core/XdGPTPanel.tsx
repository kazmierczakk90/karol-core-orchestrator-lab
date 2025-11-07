import { useState, useEffect } from "react";
import { useXdGPT } from "@/hooks/useXdGPT";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles } from "lucide-react";

export function XdGPTPanel() {
  const { models, isComparing, lastComparison, loadModels, compareModels } = useXdGPT();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    loadModels();
  }, []);

  const handleCompare = async () => {
    if (selectedModels.length < 2 || !prompt.trim()) return;
    await compareModels(selectedModels, prompt);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Wybierz Modele ({models.length})</h3>
        <div className="space-y-2 max-h-[120px] overflow-y-auto">
          {models.map((model) => (
            <div key={model.id} className="flex items-center gap-2">
              <Checkbox
                id={model.id}
                checked={selectedModels.includes(model.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedModels([...selectedModels, model.id]);
                  } else {
                    setSelectedModels(selectedModels.filter(id => id !== model.id));
                  }
                }}
              />
              <label htmlFor={model.id} className="text-sm cursor-pointer">
                {model.name} ({model.provider})
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Prompt Testowy</h3>
        <Textarea
          placeholder="Wprowadź prompt do porównania modeli..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <Button
          onClick={handleCompare}
          disabled={isComparing || selectedModels.length < 2 || !prompt.trim()}
          className="w-full"
          size="sm"
        >
          {isComparing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Porównywanie...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Porównaj Modele
            </>
          )}
        </Button>
      </div>

      {lastComparison && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Ostatnie Porównanie</h3>
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {lastComparison.results.map((result, idx) => (
              <Card key={idx} className="p-2">
                <p className="text-xs font-medium">{result.model}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {result.response || result.error}
                </p>
                {result.response_time && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.response_time}ms
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
