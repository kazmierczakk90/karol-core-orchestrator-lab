
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, Smartphone, Tablet, Eye, Palette, 
  Volume2, MousePointer, Keyboard, Brain, Settings
} from 'lucide-react';

interface UserPreferences {
  fontSize: number;
  contrast: number;
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  motionReduced: boolean;
  soundEnabled: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  device: 'desktop' | 'tablet' | 'mobile';
  theme: 'dark' | 'light' | 'auto' | 'high_contrast';
}

interface BehaviorPattern {
  clickFrequency: number;
  scrollSpeed: number;
  timeSpent: Record<string, number>;
  errorRate: number;
  helpUsage: number;
  preferredActions: string[];
}

const AdaptiveInterface = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 16,
    contrast: 100,
    colorBlindness: 'none',
    motionReduced: false,
    soundEnabled: true,
    keyboardNavigation: false,
    voiceControl: false,
    device: 'desktop',
    theme: 'dark'
  });

  const [behaviorPattern, setBehaviorPattern] = useState<BehaviorPattern>({
    clickFrequency: 45,
    scrollSpeed: 300,
    timeSpent: { dashboard: 120, agents: 85, decisions: 67 },
    errorRate: 2.3,
    helpUsage: 12,
    preferredActions: ['quick_access', 'keyboard_shortcuts', 'voice_commands']
  });

  const [adaptations, setAdaptations] = useState<string[]>([]);
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    // Simulate behavior learning
    const learningInterval = setInterval(() => {
      if (isLearning) {
        setBehaviorPattern(prev => ({
          ...prev,
          clickFrequency: prev.clickFrequency + (Math.random() - 0.5) * 5,
          scrollSpeed: Math.max(100, prev.scrollSpeed + (Math.random() - 0.5) * 50),
          errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.5)
        }));
      }
    }, 3000);

    return () => clearInterval(learningInterval);
  }, [isLearning]);

  useEffect(() => {
    // Auto-adaptations based on behavior
    const newAdaptations: string[] = [];

    if (behaviorPattern.errorRate > 5) {
      newAdaptations.push('increased_button_size');
      newAdaptations.push('confirmation_dialogs');
    }

    if (behaviorPattern.clickFrequency < 20) {
      newAdaptations.push('gesture_controls');
      newAdaptations.push('voice_activation');
    }

    if (behaviorPattern.helpUsage > 20) {
      newAdaptations.push('contextual_hints');
      newAdaptations.push('guided_tutorials');
    }

    if (preferences.device === 'mobile') {
      newAdaptations.push('touch_optimized');
      newAdaptations.push('swipe_gestures');
    }

    setAdaptations(newAdaptations);
  }, [behaviorPattern, preferences]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const startLearning = () => {
    setIsLearning(true);
    setTimeout(() => setIsLearning(false), 15000); // Learn for 15 seconds
  };

  const getAdaptationDescription = (adaptation: string): string => {
    const descriptions: Record<string, string> = {
      'increased_button_size': 'Larger buttons for easier clicking',
      'confirmation_dialogs': 'Confirmation prompts for important actions',
      'gesture_controls': 'Gesture-based navigation',
      'voice_activation': 'Voice command integration',
      'contextual_hints': 'Smart help tooltips',
      'guided_tutorials': 'Interactive learning guides',
      'touch_optimized': 'Mobile touch interface',
      'swipe_gestures': 'Swipe navigation controls'
    };
    return descriptions[adaptation] || adaptation;
  };

  const applyColorBlindnessFilter = () => {
    const filters: Record<string, string> = {
      'none': 'none',
      'protanopia': 'url(#protanopia)',
      'deuteranopia': 'url(#deuteranopia)',
      'tritanopia': 'url(#tritanopia)'
    };
    return filters[preferences.colorBlindness];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center space-x-2">
            <Monitor className="h-6 w-6" />
            <span>Adaptive Interface System - Level 4</span>
            {isLearning && (
              <Badge className="bg-green-500/20 text-green-400 animate-pulse">
                Learning...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Behavior Tracking */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-cyan-400 text-lg flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Behavior Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Click Frequency</span>
                    <span className="text-cyan-400">{Math.round(behaviorPattern.clickFrequency)}/min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Scroll Speed</span>
                    <span className="text-cyan-400">{Math.round(behaviorPattern.scrollSpeed)}px/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Error Rate</span>
                    <span className="text-cyan-400">{behaviorPattern.errorRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Help Usage</span>
                    <span className="text-cyan-400">{behaviorPattern.helpUsage}%</span>
                  </div>
                </div>

                <Button
                  onClick={startLearning}
                  disabled={isLearning}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {isLearning ? (
                    <>
                      <Brain className="h-4 w-4 animate-pulse mr-2" />
                      Learning Behavior...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Start Learning Session
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-green-400 text-lg flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Active Adaptations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adaptations.length === 0 ? (
                    <div className="text-slate-400 text-center py-4">
                      No adaptations currently active
                    </div>
                  ) : (
                    adaptations.map((adaptation) => (
                      <div key={adaptation} className="p-3 bg-slate-600/30 rounded-lg">
                        <div className="text-white font-medium capitalize">
                          {adaptation.replace(/_/g, ' ')}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {getAdaptationDescription(adaptation)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accessibility Preferences */}
          <Card className="bg-slate-700/50 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-purple-400 text-lg flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Accessibility Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Font Size: {preferences.fontSize}px
                  </label>
                  <Slider
                    value={[preferences.fontSize]}
                    onValueChange={([value]) => updatePreference('fontSize', value)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Contrast: {preferences.contrast}%
                  </label>
                  <Slider
                    value={[preferences.contrast]}
                    onValueChange={([value]) => updatePreference('contrast', value)}
                    min={50}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Color Blindness Support
                  </label>
                  <select
                    value={preferences.colorBlindness}
                    onChange={(e) => updatePreference('colorBlindness', e.target.value as any)}
                    className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                  >
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia</option>
                    <option value="deuteranopia">Deuteranopia</option>
                    <option value="tritanopia">Tritanopia</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Reduced Motion</span>
                  <Switch
                    checked={preferences.motionReduced}
                    onCheckedChange={(checked) => updatePreference('motionReduced', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Sound Effects</span>
                  <Switch
                    checked={preferences.soundEnabled}
                    onCheckedChange={(checked) => updatePreference('soundEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Keyboard Navigation</span>
                  <Switch
                    checked={preferences.keyboardNavigation}
                    onCheckedChange={(checked) => updatePreference('keyboardNavigation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Voice Control</span>
                  <Switch
                    checked={preferences.voiceControl}
                    onCheckedChange={(checked) => updatePreference('voiceControl', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Optimization */}
          <Card className="bg-slate-700/50 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-orange-400 text-lg flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Device Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'desktop', icon: Monitor, label: 'Desktop' },
                  { key: 'tablet', icon: Tablet, label: 'Tablet' },
                  { key: 'mobile', icon: Smartphone, label: 'Mobile' }
                ].map(({ key, icon: Icon, label }) => (
                  <Button
                    key={key}
                    variant={preferences.device === key ? 'default' : 'outline'}
                    onClick={() => updatePreference('device', key as any)}
                    className="flex flex-col items-center space-y-2 h-20"
                  >
                    <Icon className="h-6 w-6" />
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Theme Preferences */}
          <Card className="bg-slate-700/50 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-pink-400 text-lg flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Theme Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { key: 'dark', label: 'Dark', color: 'bg-slate-800' },
                  { key: 'light', label: 'Light', color: 'bg-white border border-gray-300' },
                  { key: 'auto', label: 'Auto', color: 'bg-gradient-to-r from-slate-800 to-white' },
                  { key: 'high_contrast', label: 'High Contrast', color: 'bg-black border-2 border-white' }
                ].map(({ key, label, color }) => (
                  <Button
                    key={key}
                    variant={preferences.theme === key ? 'default' : 'outline'}
                    onClick={() => updatePreference('theme', key as any)}
                    className="flex flex-col items-center space-y-2 h-20"
                  >
                    <div className={`w-8 h-8 rounded ${color}`} />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Color Blindness Filters (SVG) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix values="0.567, 0.433, 0,     0, 0
                                   0.558, 0.442, 0,     0, 0
                                   0,     0.242, 0.758, 0, 0
                                   0,     0,     0,     1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix values="0.625, 0.375, 0,   0, 0
                                   0.7,   0.3,   0,   0, 0
                                   0,     0.3,   0.7, 0, 0
                                   0,     0,     0,   1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix values="0.95, 0.05,  0,     0, 0
                                   0,    0.433, 0.567, 0, 0
                                   0,    0.475, 0.525, 0, 0
                                   0,    0,     0,     1, 0" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default AdaptiveInterface;
