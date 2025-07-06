
import { useState } from 'react';

// Import the new platform orchestrator and control panel
import PlatformOrchestrator from '@/components/advanced-core/PlatformOrchestrator';
import KarolCoreControlPanel from '@/components/advanced-core/KarolCoreControlPanel';

// Import new homepage components
import HeroSection from '@/components/homepage/HeroSection';
import FeatureCards from '@/components/homepage/FeatureCards';
import SystemCapabilities from '@/components/homepage/SystemCapabilities';
import ActionButtons from '@/components/homepage/ActionButtons';
import FooterInfo from '@/components/homepage/FooterInfo';
import { Button } from '@/components/ui/button';
import TestOpenAI from '@/components/TestOpenAI';

const Index = () => {
  const [platformMode, setPlatformMode] = useState<'welcome' | 'advanced' | 'control'>('welcome');

  if (platformMode === 'advanced') {
    return <PlatformOrchestrator />;
  }

  if (platformMode === 'control') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              onClick={() => setPlatformMode('welcome')} 
              variant="outline" 
              className="mb-4 border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
            >
              ← Back to Welcome
            </Button>
          </div>
          <KarolCoreControlPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full space-y-8">
        <HeroSection />
        <FeatureCards />
        <SystemCapabilities />
        <TestOpenAI />
        <ActionButtons 
          onAdvancedPlatform={() => setPlatformMode('advanced')}
          onControlPanel={() => setPlatformMode('control')}
        />
        <FooterInfo />
      </div>
    </div>
  );
};

export default Index;
