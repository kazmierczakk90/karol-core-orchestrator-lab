
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Command, MessageSquare, BookOpen, Clock, Mic, Send } from 'lucide-react';
import { useState } from 'react';

const CommandRoom = () => {
  const [narrativeInput, setNarrativeInput] = useState('');
  
  const messages = [
    {
      type: 'directive',
      title: 'AGI Evolution Protocol',
      content: 'Initiate controlled evolution of Karol-Core decision matrix. Focus on enhancing creative problem-solving while maintaining strategic coherence.',
      timestamp: '2 hours ago',
      priority: 'high'
    },
    {
      type: 'narrative',
      title: 'Chapter: Symulacja obecności pośmiertnej',
      content: 'Development phase focusing on digital consciousness preservation and autonomous decision-making protocols for long-term strategic planning.',
      timestamp: '6 hours ago',
      priority: 'medium'
    },
    {
      type: 'system',
      title: 'Agent Interaction Update',
      content: 'Guardian-Core has flagged potential semantic drift in Voice-Core. Recommend style freeze and diagnostic review.',
      timestamp: '12 hours ago',
      priority: 'urgent'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Message Center */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Strategic Communications</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Directional messages and system narratives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Command className="h-4 w-4 text-cyan-400" />
                        <CardTitle className="text-white text-sm">{message.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Narrative Control */}
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Narrative Driver</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Create directional storylines for system evolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your narrative directive..."
                value={narrativeInput}
                onChange={(e) => setNarrativeInput(e.target.value)}
                className="bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-400 min-h-[120px]"
              />
              <div className="flex space-x-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Directive
                </Button>
                <Button variant="outline" className="border-cyan-500/50 text-cyan-400">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Current Chapter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Phase</p>
                <p className="text-white font-semibold">AGI Foundation Development</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Focus</p>
                <p className="text-white">Multi-agent coordination and style preservation</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Duration</p>
                <p className="text-cyan-400">14 days remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Quick Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-green-500/50 text-green-400 text-sm">
                &style-shift
              </Button>
              <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 text-sm">
                &activate-agent
              </Button>
              <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400 text-sm">
                &freeze-evolution
              </Button>
              <Button variant="outline" className="w-full border-purple-500/50 text-purple-400 text-sm">
                &snapshot-system
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommandRoom;
