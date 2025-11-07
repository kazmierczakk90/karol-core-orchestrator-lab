import { useQuantumDecision } from "@/hooks/useQuantumDecision";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, GitBranch } from "lucide-react";
import { useEffect } from "react";

export function QuantumDecisionsPanel() {
  const { recentTrees, isEvaluating, loadRecentTrees } = useQuantumDecision();

  useEffect(() => {
    loadRecentTrees(10);
  }, []);

  if (isEvaluating) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Drzewa Decyzyjne ({recentTrees.length})
        </h3>
        {recentTrees.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak aktywnych drzew decyzyjnych</p>
        ) : (
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {recentTrees.map((tree: any) => (
              <Card key={tree.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Decision Tree #{tree.id.slice(0, 8)}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {tree.explored_paths}/{tree.available_paths} paths
                        </Badge>
                        {tree.confidence_score && (
                          <Badge variant="secondary" className="text-xs">
                            {(tree.confidence_score * 100).toFixed(0)}% confidence
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant={tree.completed_at ? 'default' : 'secondary'}>
                      {tree.completed_at ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  {tree.optimal_path_id && (
                    <p className="text-xs text-muted-foreground">
                      Optimal path selected
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button onClick={() => loadRecentTrees(10)} className="w-full" variant="outline" size="sm">
        Odśwież dane
      </Button>
    </div>
  );
}
