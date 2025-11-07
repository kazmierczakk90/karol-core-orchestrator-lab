import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Brain } from "lucide-react";

export function EmotionalEnginePanel() {
  const emotionalMetrics = [
    { name: 'Confidence', value: 75, icon: Brain },
    { name: 'Creativity', value: 68, icon: Heart },
    { name: 'Focus', value: 82, icon: Brain },
    { name: 'Empathy', value: 70, icon: Heart },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Stan Emocjonalny</h3>
        {emotionalMetrics.map((metric) => (
          <div key={metric.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <metric.icon className="h-3 w-3" />
                {metric.name}
              </span>
              <span className="font-medium">{metric.value}%</span>
            </div>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Historia Emocjonalna</h3>
        <p className="text-sm text-muted-foreground">System aktywny - dane w czasie rzeczywistym</p>
      </div>
    </div>
  );
}
