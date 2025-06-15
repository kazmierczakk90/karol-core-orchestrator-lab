
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { voiceService } from '@/services/voiceService';
import { keyboardService } from '@/services/keyboardService';

const MicrophoneControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      // A quick check without prompting the user
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(d => d.kind === 'audioinput');
      if (hasMic) {
         // Check for permission status without triggering a prompt
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'granted') {
             setHasPermission(true);
        }
      }
    } catch (error) {
      setHasPermission(false);
    }
  };

  const requestMicrophoneAccess = async () => {
    const granted = await voiceService.requestMicrophoneAccess();
    setHasPermission(granted);
    if (!granted) {
      alert('Dostęp do mikrofonu jest wymagany dla funkcji głosowych. Sprawdź ustawienia przeglądarki.');
    }
    return granted;
  };

  const startListening = async () => {
    let permissionGranted = hasPermission;
    if (!permissionGranted) {
      permissionGranted = await requestMicrophoneAccess();
    }

    if (!permissionGranted) return;

    const success = voiceService.startListening(
      (text, isFinal) => {
        if (isFinal && text.trim()) {
          setLastCommand(text);
          setIsProcessing(true);
          keyboardService.processVoiceCommand(text);
          setTimeout(() => setIsProcessing(false), 2000);
        }
      },
      (error) => {
        console.error('Voice error:', error);
        setIsListening(false);
        setIsProcessing(false);
      }
    );

    if (success) {
      setIsListening(true);
      voiceService.speak('Słucham poleceń');
    }
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
    setIsProcessing(false);
    voiceService.speak('Tryb głosowy wyłączony');
  };

  const testSpeech = () => {
    voiceService.speak('System Karol Core jest gotowy do pracy. Wszystkie agenty są aktywne.');
  };

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Mic className="h-5 w-5" />
          <span>Voice Control</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Microphone and speech recognition controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Microphone Access:</span>
          <Badge className={hasPermission ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
            {hasPermission ? 'Granted' : 'Denied'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300">Voice Recognition:</span>
          <Badge className={isListening ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}>
            {isListening ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {isProcessing && (
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Processing:</span>
            <Badge className="bg-yellow-500/20 text-yellow-400 animate-pulse">
              Processing Command...
            </Badge>
          </div>
        )}

        {lastCommand && (
          <div className="p-2 bg-slate-900/50 rounded border border-slate-700/50">
            <p className="text-xs text-slate-400">Last Command:</p>
            <p className="text-white text-sm">{lastCommand}</p>
          </div>
        )}

        <div className="flex space-x-2">
          {!hasPermission ? (
            <Button 
              onClick={requestMicrophoneAccess}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Mic className="h-4 w-4 mr-2" />
              Grant Access
            </Button>
          ) : (
            <>
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`flex-1 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isListening ? 'Stop' : 'Listen'}
              </Button>
              <Button
                onClick={testSpeech}
                variant="outline"
                className="border-cyan-500/50 text-cyan-400"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Test
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <p>• Say "aktywuj agenta" to activate an agent</p>
          <p>• Say "zmień styl" to modify decision style</p>
          <p>• Say "status systemu" for system status</p>
          <p>• Say "stop awaryjny" for emergency shutdown</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrophoneControl;
