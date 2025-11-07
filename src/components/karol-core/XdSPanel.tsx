import { useState, useEffect } from "react";
import { useXdS } from "@/hooks/useXdS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search } from "lucide-react";

export function XdSPanel() {
  const { researches, isProcessing, currentPipeline, createResearch, loadResearches } = useXdS();
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadResearches();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadResearches();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadResearches]);

  const handleCreate = async () => {
    if (!query.trim()) return;
    await createResearch(query);
    setQuery("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4" />
          Nowe Badanie
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Wprowadź query badawcze..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={isProcessing || !query.trim()} size="sm">
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Start'
            )}
          </Button>
        </div>
      </div>

      {isProcessing && currentPipeline.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Pipeline Progress</h3>
          {currentPipeline.map((stage) => (
            <div key={stage.stage} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>{stage.name}</span>
                <Badge variant={stage.status === 'completed' ? 'default' : 'secondary'}>
                  {stage.status}
                </Badge>
              </div>
              <Progress 
                value={stage.status === 'completed' ? 100 : stage.status === 'processing' ? 50 : 0} 
                className="h-1" 
              />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Badania ({researches.length})</h3>
        {researches.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak badań</p>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {researches.slice(0, 5).map((research) => (
              <Card key={research.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{research.query}</p>
                    <p className="text-xs text-muted-foreground">
                      Stage {research.pipeline_stage}/5
                    </p>
                  </div>
                  <Badge variant={
                    research.status === 'completed' ? 'default' :
                    research.status === 'processing' ? 'secondary' :
                    research.status === 'failed' ? 'destructive' : 'outline'
                  }>
                    {research.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
