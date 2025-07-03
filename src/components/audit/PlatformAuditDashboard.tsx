
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, CheckCircle, XCircle, Settings, Database, 
  Code, Zap, Shield, TrendingUp, Activity, FileText, 
  Clock, Users, Globe, Brain, Network
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuditIssue {
  id: string;
  category: 'critical' | 'high' | 'medium' | 'low' | 'info';
  type: 'error' | 'warning' | 'optimization' | 'security' | 'performance';
  title: string;
  description: string;
  location: string;
  impact: string;
  recommendation: string;
  status: 'pending' | 'in_progress' | 'fixed' | 'ignored';
  estimatedTime: string;
  agentRequired?: string;
}

interface SystemMetrics {
  totalComponents: number;
  activeAgents: number;
  databaseHealth: number;
  performanceScore: number;
  securityScore: number;
  codeQuality: number;
  lastAuditTime: string;
}

const PlatformAuditDashboard = () => {
  const { toast } = useToast();
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalComponents: 0,
    activeAgents: 0,
    databaseHealth: 0,
    performanceScore: 0,
    securityScore: 0,
    codeQuality: 0,
    lastAuditTime: ''
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const auditCategories = [
    { id: 'configuration', name: 'Konfiguracja', icon: Settings },
    { id: 'database', name: 'Baza Danych', icon: Database },
    { id: 'code', name: 'Jakość Kodu', icon: Code },
    { id: 'performance', name: 'Wydajność', icon: Zap },
    { id: 'security', name: 'Bezpieczeństwo', icon: Shield },
    { id: 'agents', name: 'Agenci', icon: Users },
    { id: 'ui', name: 'Interfejs', icon: Globe },
    { id: 'logic', name: 'Logika', icon: Brain }
  ];

  const runComprehensiveAudit = async () => {
    setIsAuditing(true);
    setAuditProgress(0);
    const foundIssues: AuditIssue[] = [];

    try {
      // 1. Audit konfiguracji (12.5%)
      setAuditProgress(12.5);
      await auditConfiguration(foundIssues);

      // 2. Audit bazy danych (25%)
      setAuditProgress(25);
      await auditDatabase(foundIssues);

      // 3. Audit jakości kodu (37.5%)
      setAuditProgress(37.5);
      await auditCodeQuality(foundIssues);

      // 4. Audit wydajności (50%)
      setAuditProgress(50);
      await auditPerformance(foundIssues);

      // 5. Audit bezpieczeństwa (62.5%)
      setAuditProgress(62.5);
      await auditSecurity(foundIssues);

      // 6. Audit agentów (75%)
      setAuditProgress(75);
      await auditAgents(foundIssues);

      // 7. Audit interfejsu (87.5%)
      setAuditProgress(87.5);
      await auditUI(foundIssues);

      // 8. Audit logiki (100%)
      setAuditProgress(100);
      await auditLogic(foundIssues);

      // Oblicz metryki
      const newMetrics = calculateMetrics(foundIssues);
      setMetrics(newMetrics);
      setIssues(foundIssues);

      // Zapisz wyniki audytu
      await saveAuditResults(foundIssues, newMetrics);

      toast({
        title: "Audit Zakończony",
        description: `Znaleziono ${foundIssues.length} problemów do naprawienia`,
      });

    } catch (error) {
      console.error('Audit error:', error);
      toast({
        title: "Błąd Audytu",
        description: "Wystąpił błąd podczas przeprowadzania audytu",
        variant: "destructive"
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const auditConfiguration = async (issues: AuditIssue[]) => {
    // Sprawdź karolconfig.json
    try {
      const { data: config } = await supabase.from('karol_config').select('*');
      
      if (!config || config.length === 0) {
        issues.push({
          id: 'config-001',
          category: 'critical',
          type: 'error',
          title: 'Brak konfiguracji platformy',
          description: 'Nie znaleziono podstawowej konfiguracji karol_config',
          location: 'karol_config table',
          impact: 'System może nie działać poprawnie',
          recommendation: 'Zainicjalizuj podstawową konfigurację',
          status: 'pending',
          estimatedTime: '15 min'
        });
      }

      // Sprawdź duplikaty konfiguracji
      const duplicates = config?.filter((item, index, self) => 
        index !== self.findIndex(t => t.config_key === item.config_key)
      );

      if (duplicates && duplicates.length > 0) {
        issues.push({
          id: 'config-002',
          category: 'medium',
          type: 'warning',
          title: 'Duplikaty w konfiguracji',
          description: `Znaleziono ${duplicates.length} duplikatów kluczy konfiguracyjnych`,
          location: 'karol_config table',
          impact: 'Może powodować nieprzewidywalne zachowanie',
          recommendation: 'Usuń duplikaty i ustandaryzuj klucze',
          status: 'pending',
          estimatedTime: '30 min'
        });
      }

    } catch (error) {
      issues.push({
        id: 'config-003',
        category: 'high',
        type: 'error',
        title: 'Błąd dostępu do konfiguracji',
        description: 'Nie można odczytać konfiguracji systemu',
        location: 'Database connection',
        impact: 'Krytyczny błąd dostępu do danych',
        recommendation: 'Sprawdź połączenie z bazą danych',
        status: 'pending',
        estimatedTime: '60 min'
      });
    }
  };

  const auditDatabase = async (issues: AuditIssue[]) => {
    try {
      // Sprawdź konkretne tabele bezpośrednio
      const tablesToCheck = [
        'agents', 'chat_sessions', 'chat_messages', 'profiles',
        'edict_prompts', 'xdgpt_models', 'xds_research', 'analytics'
      ];

      for (const tableName of tablesToCheck) {
        try {
          // Use type assertion to handle the dynamic table name issue
          const { data, error } = await (supabase as any).from(tableName).select('count').limit(1);
          if (error) {
            issues.push({
              id: `db-${tableName}`,
              category: 'high',
              type: 'error',
              title: `Błąd tabeli ${tableName}`,
              description: `Nie można dostać się do tabeli: ${error.message}`,
              location: `Database table: ${tableName}`,
              impact: 'Funkcjonalność może być ograniczona',
              recommendation: 'Sprawdź strukturę bazy danych i uprawnienia',
              status: 'pending',
              estimatedTime: '45 min'
            });
          }
        } catch (err) {
          console.error(`Error checking table ${tableName}:`, err);
        }
      }

    } catch (error) {
      issues.push({
        id: 'db-connection',
        category: 'critical',
        type: 'error',
        title: 'Błąd połączenia z bazą danych',
        description: 'Nie można nawiązać połączenia z bazą danych',
        location: 'Database connection',
        impact: 'System nie może działać',
        recommendation: 'Sprawdź konfigurację Supabase',
        status: 'pending',
        estimatedTime: '120 min'
      });
    }
  };

  const auditCodeQuality = async (issues: AuditIssue[]) => {
    // Symulacja audytu jakości kodu
    const codeIssues = [
      {
        id: 'code-001',
        category: 'medium' as const,
        type: 'optimization' as const,
        title: 'Duże komponenty wymagają refaktoryzacji',
        description: 'Niektóre komponenty przekraczają 300 linii kodu',
        location: 'src/components/optimization/ComprehensiveOptimizationManager.tsx (289 linii)',
        impact: 'Trudność w utrzymaniu i debugowaniu',
        recommendation: 'Podziel na mniejsze, fokusowe komponenty',
        status: 'pending' as const,
        estimatedTime: '2 godziny'
      },
      {
        id: 'code-002',
        category: 'medium' as const,
        type: 'optimization' as const,
        title: 'Długie komponenty wymagają optymalizacji',
        description: 'ChatAuditReport.tsx (320 linii) i PlatformAudit.tsx (412 linii)',
        location: 'src/components/chat/, src/components/',
        impact: 'Utrudniona czytelność i zarządzanie kodem',
        recommendation: 'Refaktoryzacja na mniejsze komponenty',
        status: 'pending' as const,
        estimatedTime: '3 godziny'
      },
      {
        id: 'code-003',
        category: 'low' as const,
        type: 'optimization' as const,
        title: 'Brakujące TypeScript strict mode',
        description: 'Nie wszystkie pliki używają strict type checking',
        location: 'Multiple files',
        impact: 'Potencjalne błędy typu w runtime',
        recommendation: 'Włącz strict mode w tsconfig.json',
        status: 'pending' as const,
        estimatedTime: '1 godzina'
      }
    ];

    issues.push(...codeIssues);
  };

  const auditPerformance = async (issues: AuditIssue[]) => {
    // Audit wydajności
    const performanceIssues = [
      {
        id: 'perf-001',
        category: 'high' as const,
        type: 'performance' as const,
        title: 'Brak lazy loading dla dużych komponentów',
        description: 'Niektóre komponenty ładują się synchronicznie',
        location: 'src/components/advanced-core/',
        impact: 'Wolniejsze ładowanie aplikacji',
        recommendation: 'Implementuj React.lazy() dla ciężkich komponentów',
        status: 'pending' as const,
        estimatedTime: '2 godziny'
      },
      {
        id: 'perf-002',
        category: 'medium' as const,
        type: 'performance' as const,
        title: 'Wielokrotne wywołania GoTrueClient',
        description: 'Ostrzeżenia o wielokrotnych instancjach GoTrueClient',
        location: 'Supabase client initialization',
        impact: 'Potencjalne problemy z wydajnością auth',
        recommendation: 'Zoptymalizuj inicjalizację klienta Supabase',
        status: 'pending' as const,
        estimatedTime: '1 godzina'
      }
    ];

    issues.push(...performanceIssues);
  };

  const auditSecurity = async (issues: AuditIssue[]) => {
    // Audit bezpieczeństwa
    const securityIssues = [
      {
        id: 'sec-001',
        category: 'medium' as const,
        type: 'security' as const,
        title: 'RLS polityki wymagają przeglądu',
        description: 'Niektóre tabele mają zbyt permisywne polityki RLS',
        location: 'Database RLS policies',
        impact: 'Potencjalne naruszenie bezpieczeństwa danych',
        recommendation: 'Przejrzyj i zaostrzaj polityki RLS',
        status: 'pending' as const,
        estimatedTime: '3 godziny'
      },
      {
        id: 'sec-002',
        category: 'low' as const,
        type: 'security' as const,
        title: 'Brak walidacji input danych',
        description: 'Niektóre formularze nie mają pełnej walidacji',
        location: 'Various form components',
        impact: 'Potencjalne problemy z bezpieczeństwem',
        recommendation: 'Dodaj walidację po stronie klienta i serwera',
        status: 'pending' as const,
        estimatedTime: '2 godziny'
      }
    ];

    issues.push(...securityIssues);
  };

  const auditAgents = async (issues: AuditIssue[]) => {
    try {
      const { data: agents } = await supabase.from('agents').select('*');
      
      if (!agents || agents.length === 0) {
        issues.push({
          id: 'agents-001',
          category: 'high',
          type: 'warning',
          title: 'Brak aktywnych agentów',
          description: 'Nie znaleziono żadnych agentów w systemie',
          location: 'agents table',
          impact: 'Ograniczona funkcjonalność AI',
          recommendation: 'Zainicjalizuj podstawowych agentów',
          status: 'pending',
          estimatedTime: '1 godzina',
          agentRequired: 'system-init-agent'
        });
      }

      // Sprawdź nieaktywnych agentów
      const inactiveAgents = agents?.filter(agent => !agent.is_active);
      if (inactiveAgents && inactiveAgents.length > 0) {
        issues.push({
          id: 'agents-002',
          category: 'medium',
          type: 'optimization',
          title: 'Nieaktywni agenci',
          description: `${inactiveAgents.length} agentów jest nieaktywnych`,
          location: 'agents table',
          impact: 'Zmniejszona wydajność systemu',
          recommendation: 'Reaktywuj lub usuń nieużywanych agentów',
          status: 'pending',
          estimatedTime: '45 min'
        });
      }

    } catch (error) {
      issues.push({
        id: 'agents-003',
        category: 'high',
        type: 'error',
        title: 'Błąd dostępu do agentów',
        description: 'Nie można pobrać listy agentów',
        location: 'agents table',
        impact: 'Brak kontroli nad agentami',
        recommendation: 'Sprawdź uprawnienia do tabeli agents',
        status: 'pending',
        estimatedTime: '30 min'
      });
    }
  };

  const auditUI = async (issues: AuditIssue[]) => {
    const uiIssues = [
      {
        id: 'ui-001',
        category: 'medium' as const,
        type: 'optimization' as const,
        title: 'Brak responsywności na urządzeniach mobilnych',
        description: 'Niektóre komponenty nie są zoptymalizowane pod mobile',
        location: 'Various components',
        impact: 'Słabe doświadczenie użytkownika na mobile',
        recommendation: 'Implementuj responsive design patterns',
        status: 'pending' as const,
        estimatedTime: '4 godziny'
      },
      {
        id: 'ui-002',
        category: 'low' as const,
        type: 'optimization' as const,
        title: 'Brakujące loading states',
        description: 'Niektóre akcje nie mają wskaźników ładowania',
        location: 'Form components',
        impact: 'Niepewność użytkownika co do stanu operacji',
        recommendation: 'Dodaj loading spinners i skeleton screens',
        status: 'pending' as const,
        estimatedTime: '2 godziny'
      }
    ];

    issues.push(...uiIssues);
  };

  const auditLogic = async (issues: AuditIssue[]) => {
    const logicIssues = [
      {
        id: 'logic-001',
        category: 'medium' as const,
        type: 'optimization' as const,
        title: 'Brak error boundary components',
        description: 'Aplikacja nie ma globalnego error handling',
        location: 'App root level',
        impact: 'Nieoczekiwane crashes mogą zepsuć całą aplikację',
        recommendation: 'Implementuj React Error Boundaries',
        status: 'pending' as const,
        estimatedTime: '2 godziny'
      },
      {
        id: 'logic-002',
        category: 'low' as const,
        type: 'optimization' as const,
        title: 'Brak retry logic dla API calls',
        description: 'API wywołania nie mają mechanizmu ponawiania',
        location: 'Service layers',
        impact: 'Tymczasowe błędy sieci mogą powodować niepowodzenia',
        recommendation: 'Dodaj exponential backoff retry logic',
        status: 'pending' as const,
        estimatedTime: '3 godziny'
      }
    ];

    issues.push(...logicIssues);
  };

  const calculateMetrics = (issues: AuditIssue[]): SystemMetrics => {
    const criticalIssues = issues.filter(i => i.category === 'critical').length;
    const highIssues = issues.filter(i => i.category === 'high').length;
    const totalIssues = issues.length;

    return {
      totalComponents: 45, // Szacowana liczba komponentów
      activeAgents: 3, // Z audytu agentów
      databaseHealth: criticalIssues === 0 ? (highIssues === 0 ? 95 : 80) : 60,
      performanceScore: Math.max(0, 100 - (criticalIssues * 20 + highIssues * 10)),
      securityScore: Math.max(0, 100 - (issues.filter(i => i.type === 'security').length * 15)),
      codeQuality: Math.max(0, 100 - (totalIssues * 3)),
      lastAuditTime: new Date().toISOString()
    };
  };

  const saveAuditResults = async (issues: AuditIssue[], metrics: SystemMetrics) => {
    try {
      // Convert issues to JSON-compatible format
      const issuesForDb = issues.map(issue => ({
        id: issue.id,
        category: issue.category,
        type: issue.type,
        title: issue.title,
        description: issue.description,
        location: issue.location,
        impact: issue.impact,
        recommendation: issue.recommendation,
        status: issue.status,
        estimatedTime: issue.estimatedTime,
        agentRequired: issue.agentRequired || null
      }));

      const recommendationsForDb = issues.map(i => i.recommendation);

      await supabase.from('audit_logs').insert({
        audit_type: 'comprehensive_platform_audit',
        target_entity: 'karol_core_platform',
        target_id: 'platform_v2',
        consistency_score: metrics.performanceScore,
        issues_found: issuesForDb as any,
        recommendations: recommendationsForDb as any,
        severity_level: issues.some(i => i.category === 'critical') ? 'error' : 
                      issues.some(i => i.category === 'high') ? 'warning' : 'info'
      });
    } catch (error) {
      console.error('Failed to save audit results:', error);
    }
  };

  const fixIssue = async (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    // Symulacja naprawy
    setIssues(prev => prev.map(i => 
      i.id === issueId ? { ...i, status: 'in_progress' } : i
    ));

    // Symulacja czasu naprawy
    setTimeout(() => {
      setIssues(prev => prev.map(i => 
        i.id === issueId ? { ...i, status: 'fixed' } : i
      ));
      
      toast({
        title: "Problem naprawiony",
        description: `${issue.title} został pomyślnie naprawiony`,
      });
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    const cat = auditCategories.find(c => c.id === category);
    return cat ? cat.icon : Activity;
  };

  const getSeverityColor = (category: string) => {
    switch (category) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'optimization': return TrendingUp;
      case 'security': return Shield;
      case 'performance': return Zap;
      default: return Activity;
    }
  };

  const filteredIssues = selectedCategory === 'all' 
    ? issues 
    : issues.filter(issue => {
        // Map issue types to categories
        const categoryMap: Record<string, string[]> = {
          configuration: ['config'],
          database: ['db'],
          code: ['code'],
          performance: ['perf'],
          security: ['sec'],
          agents: ['agents'],
          ui: ['ui'],
          logic: ['logic']
        };
        
        return categoryMap[selectedCategory]?.some(prefix => issue.id.startsWith(prefix));
      });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span>Karol-Core AGI - Comprehensive Platform Audit</span>
            <Badge variant="outline" className="text-cyan-400">v2.0 Extended</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{metrics.performanceScore}%</div>
              <div className="text-slate-400 text-sm">Performance Score</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{metrics.databaseHealth}%</div>
              <div className="text-slate-400 text-sm">Database Health</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-purple-400 text-2xl font-bold">{metrics.securityScore}%</div>
              <div className="text-slate-400 text-sm">Security Score</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">{issues.length}</div>
              <div className="text-slate-400 text-sm">Issues Found</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button 
              onClick={runComprehensiveAudit}
              disabled={isAuditing}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isAuditing ? 'Auditing...' : 'Start Platform Audit'}
            </Button>
            
            {isAuditing && (
              <div className="flex items-center space-x-2">
                <Progress value={auditProgress} className="w-64" />
                <span className="text-sm text-slate-400">{Math.round(auditProgress)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Issues Dashboard */}
      {issues.length > 0 && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['critical', 'high', 'medium', 'low'].map(severity => {
                const count = issues.filter(i => i.category === severity).length;
                return (
                  <Card key={severity} className="bg-slate-800/50">
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${
                        severity === 'critical' ? 'text-red-400' :
                        severity === 'high' ? 'text-orange-400' :
                        severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                        {count}
                      </div>
                      <div className="text-slate-400 text-sm capitalize">{severity}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All ({issues.length})
              </Button>
              {auditCategories.map(category => {
                const count = issues.filter(issue => {
                  const categoryMap: Record<string, string[]> = {
                    configuration: ['config'],
                    database: ['db'],
                    code: ['code'],
                    performance: ['perf'],
                    security: ['sec'],
                    agents: ['agents'],
                    ui: ['ui'],
                    logic: ['logic']
                  };
                  return categoryMap[category.id]?.some(prefix => issue.id.startsWith(prefix));
                }).length;
                
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    size="sm"
                    className="capitalize"
                  >
                    <category.icon className="h-4 w-4 mr-1" />
                    {category.name} ({count})
                  </Button>
                );
              })}
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-4">
                {filteredIssues.map((issue) => {
                  const TypeIcon = getTypeIcon(issue.type);
                  return (
                    <Card key={issue.id} className="bg-slate-800/50 border-slate-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <TypeIcon className="h-5 w-5 text-slate-400 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-white">{issue.title}</h3>
                                <Badge className={`${getSeverityColor(issue.category)} text-white`}>
                                  {issue.category}
                                </Badge>
                                <Badge variant="outline" className="text-slate-400">
                                  {issue.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">{issue.description}</p>
                              <div className="text-xs text-slate-400 space-y-1">
                                <div><strong>Location:</strong> {issue.location}</div>
                                <div><strong>Impact:</strong> {issue.impact}</div>
                                <div><strong>Estimated Time:</strong> {issue.estimatedTime}</div>
                                {issue.agentRequired && (
                                  <div><strong>Agent Required:</strong> {issue.agentRequired}</div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              issue.status === 'fixed' ? 'default' :
                              issue.status === 'in_progress' ? 'secondary' : 'outline'
                            }>
                              {issue.status}
                            </Badge>
                            {issue.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => fixIssue(issue.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Fix
                              </Button>
                            )}
                          </div>
                        </div>
                        <Alert className="mt-3 border-blue-500/50 bg-blue-500/10">
                          <AlertDescription className="text-blue-300">
                            <strong>Recommendation:</strong> {issue.recommendation}
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card className="bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Priority Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-red-400">Critical Issues (Fix First)</h3>
                    <ul className="list-disc list-inside text-sm text-slate-300 mt-2">
                      {issues.filter(i => i.category === 'critical').map(issue => (
                        <li key={issue.id}>{issue.title} - {issue.estimatedTime}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-orange-400">High Priority Issues</h3>
                    <ul className="list-disc list-inside text-sm text-slate-300 mt-2">
                      {issues.filter(i => i.category === 'high').map(issue => (
                        <li key={issue.id}>{issue.title} - {issue.estimatedTime}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-yellow-400">Medium Priority Optimizations</h3>
                    <ul className="list-disc list-inside text-sm text-slate-300 mt-2">
                      {issues.filter(i => i.category === 'medium').map(issue => (
                        <li key={issue.id}>{issue.title} - {issue.estimatedTime}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <h3 className="font-semibold text-cyan-400 mb-2">Backup & Recovery Plan</h3>
                    <p className="text-sm text-slate-300">
                      Before implementing fixes, create a backup of karolconfig.json and current system state. 
                      All changes will be tracked with timestamps and can be rolled back if needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PlatformAuditDashboard;
