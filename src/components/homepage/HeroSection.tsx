
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="flex items-center justify-center space-x-4 mb-8">
        <img 
          src="/lovable-uploads/e937e8a7-7b24-4ba0-b98b-aade23ac4f11.png" 
          alt="Karol Core Logo" 
          className="h-20 w-20 animate-pulse rounded-lg shadow-lg"
        />
        <div className="text-left">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Karol-Core AGI Platform
          </h1>
          <p className="text-slate-200 text-xl mt-2 font-medium">
            Ultra-Advanced Artificial General Intelligence System
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        <Badge className="bg-green-500/20 text-green-300 border-green-500/50 px-6 py-3 text-sm font-medium">
          ✨ Version 2.0 Active
        </Badge>
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 px-6 py-3 text-sm font-medium">
          🧠 100-Level Evolution System
        </Badge>
        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 px-6 py-3 text-sm font-medium">
          ⚡ Quantum Decision Engine
        </Badge>
      </div>
    </div>
  );
};

export default HeroSection;
