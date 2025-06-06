
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Play, Pause, Square, Mic, MicOff, Upload, Download, FileText, CheckCircle, Clock } from 'lucide-react';

interface CallInsight {
  id: string;
  type: 'action_item' | 'key_point' | 'decision' | 'follow_up';
  content: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface TrainingCall {
  id: string;
  title: string;
  date: Date;
  duration: string;
  participants: string[];
  recording_url?: string;
  transcript: string;
  insights: CallInsight[];
  status: 'recorded' | 'transcribed' | 'analyzed';
}

interface TrainingCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrainingCallModal = ({ isOpen, onClose }: TrainingCallModalProps) => {
  const [calls, setCalls] = useState<TrainingCall[]>([
    {
      id: 'call_1',
      title: 'Agent Training Session #1',
      date: new Date(),
      duration: '45:32',
      participants: ['Karol', 'Agent CEO', 'Agent Router'],
      transcript: 'W tym call\'u omawialiśmy strategię rozwoju agentów AI...\n\nKluczowe punkty:\n- Implementacja nowych workflow\'ów\n- Optymalizacja komunikacji między agentami\n- Training nowych modeli\n\nDo zrobienia:\n- Stworzyć dokumentację workflow\'ów\n- Przetestować nowe algorytmy routing\'u\n- Zaplanować kolejny training session',
      insights: [
        { id: 'insight_1', type: 'action_item', content: 'Stworzyć dokumentację workflow\'ów do końca tygodnia', timestamp: '15:30', priority: 'high' },
        { id: 'insight_2', type: 'key_point', content: 'Agenci potrzebują lepszej komunikacji między sobą', timestamp: '22:15', priority: 'medium' },
        { id: 'insight_3', type: 'decision', content: 'Użyjemy FUKO-LANG jako standardowego języka komunikacji', timestamp: '35:45', priority: 'high' },
        { id: 'insight_4', type: 'follow_up', content: 'Zaplanować kolejny training session za 2 tygodnie', timestamp: '42:10', priority: 'medium' }
      ],
      status: 'analyzed'
    }
  ]);

  const [selectedCall, setSelectedCall] = useState<TrainingCall | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [newCallTitle, setNewCallTitle] = useState('');
  const [newCallNotes, setNewCallNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'calls' | 'new_call' | 'insights'>('calls');

  const insightTypeColors = {
    action_item: 'bg-red-500/20 text-red-400 border-red-500/30',
    key_point: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    decision: 'bg-green-500/20 text-green-400 border-green-500/30',
    follow_up: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-gray-500/20 text-gray-400'
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement actual recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Create new call from recording
    const newCall: TrainingCall = {
      id: `call_${Date.now()}`,
      title: newCallTitle || `Training Call ${calls.length + 1}`,
      date: new Date(),
      duration: '00:00',
      participants: ['Karol'],
      transcript: newCallNotes,
      insights: [],
      status: 'recorded'
    };
    setCalls(prev => [newCall, ...prev]);
    setNewCallTitle('');
    setNewCallNotes('');
    setActiveTab('calls');
  };

  const extractInsights = async (call: TrainingCall) => {
    // Simulate AI-powered insight extraction
    const mockInsights: CallInsight[] = [
      { id: `insight_${Date.now()}_1`, type: 'action_item', content: 'Follow up on discussed action items', timestamp: '10:00', priority: 'high' },
      { id: `insight_${Date.now()}_2`, type: 'key_point', content: 'Important decision was made regarding workflow', timestamp: '15:30', priority: 'medium' }
    ];

    const updatedCall = {
      ...call,
      insights: [...call.insights, ...mockInsights],
      status: 'analyzed' as const
    };

    setCalls(prev => prev.map(c => c.id === call.id ? updatedCall : c));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] bg-gradient-dark border-cyan-800/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center space-x-2">
            <Phone className="h-6 w-6" />
            <span>Training Call Manager</span>
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Zarządzanie call'ami treningowymi, transkrypcjami i insights
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full space-x-4">
          {/* Left Panel - Call List & Controls */}
          <div className="w-1/3 space-y-4">
            {/* Tab Buttons */}
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className={activeTab === 'calls' ? 'bg-gradient-primary' : 'bg-slate-700'}
                onClick={() => setActiveTab('calls')}
              >
                <FileText className="h-4 w-4 mr-1" />
                Calls
              </Button>
              <Button 
                size="sm" 
                className={activeTab === 'new_call' ? 'bg-gradient-primary' : 'bg-slate-700'}
                onClick={() => setActiveTab('new_call')}
              >
                <Mic className="h-4 w-4 mr-1" />
                New Call
              </Button>
            </div>

            {/* Calls List */}
            {activeTab === 'calls' && (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {calls.map((call) => (
                  <Card 
                    key={call.id}
                    className={`bg-slate-700/50 border-slate-600/50 cursor-pointer hover:border-cyan-400/50 transition-colors ${
                      selectedCall?.id === call.id ? 'border-cyan-400 bg-cyan-400/10' : ''
                    }`}
                    onClick={() => setSelectedCall(call)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">{call.title}</h3>
                        <Badge className={`text-xs ${call.status === 'analyzed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {call.status}
                        </Badge>
                      </div>
                      <div className="text-slate-400 text-sm space-y-1">
                        <div>📅 {call.date.toLocaleDateString()}</div>
                        <div>⏱️ {call.duration}</div>
                        <div>👥 {call.participants.join(', ')}</div>
                        <div>💡 {call.insights.length} insights</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* New Call Recording */}
            {activeTab === 'new_call' && (
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm font-semibold">Call Title</label>
                  <Input 
                    placeholder="Enter call title..."
                    value={newCallTitle}
                    onChange={(e) => setNewCallTitle(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-semibold">Notes/Transcript</label>
                  <Textarea 
                    placeholder="Add your notes or paste transcript..."
                    value={newCallNotes}
                    onChange={(e) => setNewCallNotes(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                    rows={8}
                  />
                </div>

                <div className="flex space-x-2">
                  {!isRecording ? (
                    <Button 
                      className="bg-red-500 hover:bg-red-600"
                      onClick={startRecording}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gray-500 hover:bg-gray-600"
                      onClick={stopRecording}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop & Save
                    </Button>
                  )}
                  
                  <Button variant="outline" className="border-slate-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Audio
                  </Button>
                </div>

                {isRecording && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-red-400">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span>Recording in progress...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Call Details */}
          <div className="flex-1">
            {selectedCall ? (
              <div className="space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedCall.title}</h2>
                    <p className="text-slate-400">
                      {selectedCall.date.toLocaleDateString()} • {selectedCall.duration} • {selectedCall.participants.join(', ')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {selectedCall.status !== 'analyzed' && (
                      <Button 
                        size="sm" 
                        className="bg-gradient-secondary"
                        onClick={() => extractInsights(selectedCall)}
                      >
                        🧠 Extract Insights
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 h-[calc(100%-80px)]">
                  {/* Transcript */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4 h-full">
                      <h3 className="text-white font-semibold mb-3">Transcript</h3>
                      <div className="h-[calc(100%-40px)] overflow-y-auto">
                        <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                          {selectedCall.transcript}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Insights */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4 h-full">
                      <h3 className="text-white font-semibold mb-3">AI Insights</h3>
                      <div className="space-y-3 h-[calc(100%-40px)] overflow-y-auto">
                        {selectedCall.insights.map((insight) => (
                          <Card key={insight.id} className={`border ${insightTypeColors[insight.type]}`}>
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <Badge className={`text-xs ${insightTypeColors[insight.type]}`}>
                                  {insight.type.replace('_', ' ')}
                                </Badge>
                                <div className="flex space-x-2">
                                  <Badge className={`text-xs ${priorityColors[insight.priority]}`}>
                                    {insight.priority}
                                  </Badge>
                                  <span className="text-xs text-slate-500">{insight.timestamp}</span>
                                </div>
                              </div>
                              <p className="text-slate-300 text-sm">{insight.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {selectedCall.insights.length === 0 && (
                          <div className="text-center py-8 text-slate-400">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No insights extracted yet</p>
                            <p className="text-sm">Click "Extract Insights" to analyze this call</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Phone className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a call to view details</p>
                  <p>Or create a new training call recording</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingCallModal;
