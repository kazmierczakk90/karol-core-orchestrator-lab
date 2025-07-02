
import { Button } from '@/components/ui/button';
import { Crown, Brain, Zap, Shield, Settings } from 'lucide-react';

interface ActionButtonsProps {
  onAdvancedPlatform: () => void;
  onControlPanel: () => void;
}

const ActionButtons = ({ onAdvancedPlatform, onControlPanel }: ActionButtonsProps) => {
  const primaryButtons = [
    {
      onClick: onAdvancedPlatform,
      gradient: "from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600",
      icon: Crown,
      text: "Enter Advanced Platform"
    },
    {
      onClick: () => window.location.href = '/extended-agi-panel',
      gradient: "from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600", 
      icon: Brain,
      text: "Extended AGI Panel"
    }
  ];

  const secondaryButtons = [
    {
      onClick: () => window.location.href = '/karol-extensions',
      gradient: "from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600",
      icon: Zap,
      text: "Extensions Panel"
    },
    {
      onClick: () => window.location.href = '/advanced-modules',
      gradient: "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600",
      icon: Shield,
      text: "Advanced Modules"
    },
    {
      onClick: onControlPanel,
      gradient: "from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700",
      icon: Shield,
      text: "Control Panel"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {primaryButtons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <Button
              key={index}
              onClick={button.onClick}
              className={`bg-gradient-to-r ${button.gradient} text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              {button.text}
            </Button>
          );
        })}
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        {secondaryButtons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <Button
              key={index}
              onClick={button.onClick}
              className={`bg-gradient-to-r ${button.gradient} text-white px-6 py-3 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {button.text}
            </Button>
          );
        })}
      </div>

      {/* Settings Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 px-8 py-3 text-lg transition-all duration-300"
        >
          <Settings className="h-5 w-5 mr-2" />
          Platform Settings
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
