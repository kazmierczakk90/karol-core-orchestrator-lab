
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket, Target, TrendingUp, Calendar, DollarSign, Users } from 'lucide-react';

const StartupLab = () => {
  const projects = [
    {
      name: 'PartyApp',
      phase: 'MVP',
      pmf: 67,
      campaign: 'Campaign 0',
      funding: '$50K',
      team: 4,
      nextMilestone: 'Beta Launch',
      status: 'active'
    },
    {
      name: 'SeniorApp',
      phase: 'FULL',
      pmf: 89,
      campaign: 'Scale Phase',
      funding: '$200K',
      team: 8,
      nextMilestone: 'Series A Prep',
      status: 'scaling'
    },
    {
      name: 'AGI Platform',
      phase: 'CONCEPT',
      pmf: 23,
      campaign: 'Research Phase',
      funding: 'Self-funded',
      team: 2,
      nextMilestone: 'Prototype',
      status: 'research'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'scaling': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'research': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Active Projects</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Total Funding</p>
                <p className="text-2xl font-bold text-white">$250K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Team Members</p>
                <p className="text-2xl font-bold text-white">14</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Avg PMF</p>
                <p className="text-2xl font-bold text-white">59%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Dashboard */}
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Project Portfolio</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Active startup projects and their development phases
              </CardDescription>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.phase}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400">
                    {project.campaign}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Product-Market Fit</span>
                        <span className="text-white">{project.pmf}%</span>
                      </div>
                      <Progress value={project.pmf} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Funding</p>
                        <p className="text-white font-semibold">{project.funding}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Team Size</p>
                        <p className="text-white font-semibold">{project.team} members</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-slate-400 text-sm">Next Milestone</p>
                      <p className="text-cyan-400 font-semibold">{project.nextMilestone}</p>
                    </div>
                    
                    <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupLab;
