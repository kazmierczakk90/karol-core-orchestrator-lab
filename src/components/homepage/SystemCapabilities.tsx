
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const SystemCapabilities = () => {
  const capabilities = [
    { symbol: "∞", label: "Recursive Logic", color: "text-cyan-400" },
    { symbol: "◊", label: "Quantum States", color: "text-purple-400" },
    { symbol: "⧬", label: "Meta-Evolution", color: "text-green-400" },
    { symbol: "⟐", label: "Transcendence", color: "text-yellow-400" }
  ];

  return (
    <Card className="bg-slate-800/60 backdrop-blur-sm border-yellow-800/40 mb-12 hover:border-yellow-600/60 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-slate-100 text-xl">
          <TrendingUp className="h-6 w-6 text-yellow-400" />
          <span>Advanced System Capabilities</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {capabilities.map((capability, index) => (
            <div key={index} className="text-center group">
              <div className={`text-4xl font-bold ${capability.color} mb-3 group-hover:scale-110 transition-transform duration-200`}>
                {capability.symbol}
              </div>
              <div className="text-slate-300 text-base font-medium">
                {capability.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemCapabilities;
