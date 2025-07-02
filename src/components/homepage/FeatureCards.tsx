
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Crown, Zap, Activity } from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      icon: Brain,
      title: "Cognitive Research Hub",
      description: "Advanced cognitive analysis, memory management, and belief processing with recursive logic engines.",
      badges: ["Memory", "Beliefs", "Analysis"],
      borderColor: "border-cyan-800/40",
      hoverColor: "hover:border-cyan-600/60",
      iconColor: "text-cyan-400"
    },
    {
      icon: Crown,
      title: "Meta-Evolution Engine", 
      description: "100-step evolution system for continuous platform advancement and transcendence protocols.",
      badges: ["Evolution", "Transcendence", "Meta-Level"],
      borderColor: "border-purple-800/40",
      hoverColor: "hover:border-purple-600/60", 
      iconColor: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Quantum Decision System",
      description: "Superposition-based decision making with quantum probability analysis and multi-dimensional reasoning.",
      badges: ["Quantum", "Superposition", "Multi-D"],
      borderColor: "border-pink-800/40",
      hoverColor: "hover:border-pink-600/60",
      iconColor: "text-pink-400"
    },
    {
      icon: Activity,
      title: "Platform Orchestration",
      description: "Real-time system monitoring, agent coordination, and intelligent resource management.",
      badges: ["Monitoring", "Agents", "Orchestration"],
      borderColor: "border-green-800/40", 
      hoverColor: "hover:border-green-600/60",
      iconColor: "text-green-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <Card 
            key={index}
            className={`bg-slate-800/60 backdrop-blur-sm ${feature.borderColor} ${feature.hoverColor} transition-all duration-300 group hover:shadow-xl hover:shadow-black/20`}
          >
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center space-x-3 text-slate-100 group-hover:${feature.iconColor} transition-colors text-xl`}>
                <IconComponent className="h-7 w-7" />
                <span>{feature.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6 leading-relaxed text-base">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.badges.map((badge, badgeIndex) => (
                  <Badge 
                    key={badgeIndex}
                    variant="outline" 
                    className="text-slate-300 border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FeatureCards;
