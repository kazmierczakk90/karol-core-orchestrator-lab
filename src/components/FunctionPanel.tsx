import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronUp, Database, Star, TrendingUp, DollarSign, Users, Zap, Search, Filter } from 'lucide-react';

interface FunctionDetail {
  id: number;
  depthLevel: number;
  category: string;
  userBehaviorAnalysis: string;
  optimizationPotential: string;
  potentialExtensions: string;
  usageStatistics: string;
  relatedFunctions: string;
  processFlow: string;
  uixScore: number;
  priorityLevel: string;
  monetizationValue: number;
  associatedChart: string;
  integrationNotes: string;
  personalizationOptions: string;
}

const FUNCTIONS: FunctionDetail[] = [
  {
    id: 1,
    depthLevel: 1,
    category: 'Rejestracja i Logowanie',
    userBehaviorAnalysis: 'Użytkownik chce szybko zalogować się do aplikacji, szczególnie przy dużym obciążeniu serwerów. Intencja: uproszczenie procesu logowania. Sytuacja: użytkownik korzysta z funkcji "Zapamiętaj mnie".',
    optimizationPotential: 'Skrócenie czasu odpowiedzi serwera logowania. Dodanie opcji biometrycznego uwierzytelniania.',
    potentialExtensions: 'Integracja z systemem logowania Facebook. Rozbudowa weryfikacji dwuetapowej.',
    usageStatistics: 'Liczba logowań dziennie: 1000. Najczęściej wykorzystywana funkcja w godzinach 18:00-21:00.',
    relatedFunctions: '$1.1.2 (Rejestracja za pomocą mediów społecznościowych)',
    processFlow: 'Wprowadzenie email i hasła → Weryfikacja użytkownika → Przekierowanie na ekran główny.',
    uixScore: 9.5,
    priorityLevel: 'Wysoki priorytet (1)',
    monetizationValue: 5000,
    associatedChart: 'Wykres słupkowy: popularność funkcji w zależności od pory dnia.',
    integrationNotes: 'Aktualnie wspiera OAuth dla Google. Planowana integracja z Apple ID.',
    personalizationOptions: 'Wybór ciemnego lub jasnego motywu. Funkcja "Zapamiętaj mnie".',
  },
  {
    id: 2,
    depthLevel: 1,
    category: 'Powiadomienia',
    userBehaviorAnalysis: 'Użytkownik chce być informowany o nowych wiadomościach.',
    optimizationPotential: 'Optymalizacja mechanizmu powiadomień push.',
    potentialExtensions: 'Integracja z systemem kalendarzy.',
    usageStatistics: 'Średnio 200 powiadomień na użytkownika dziennie.',
    relatedFunctions: 'Powiązane z $1.2.1 (System wiadomości)',
    processFlow: 'Powiadomienie → Kliknięcie → Przekierowanie.',
    uixScore: 9.0,
    priorityLevel: 'Średni priorytet (2)',
    monetizationValue: 2000,
    associatedChart: 'Wykres liniowy: liczba powiadomień dziennie.',
    integrationNotes: 'Obecnie wspiera tylko Android. Planowana integracja z iOS.',
    personalizationOptions: 'Wybór dźwięku powiadomień.',
  },
  {
    id: 3,
    depthLevel: 2,
    category: 'Wyszukiwanie',
    userBehaviorAnalysis: 'Użytkownik szuka konkretnych elementów w aplikacji.',
    optimizationPotential: 'Dodanie inteligentnych sugestii wyszukiwania.',
    potentialExtensions: 'Integracja z wyszukiwarką Elasticsearch.',
    usageStatistics: '1000 wyszukiwań na godzinę.',
    relatedFunctions: 'Powiązane z $2.1.1 (Rekomendacje).',
    processFlow: 'Wpisanie frazy → Wyświetlenie wyników.',
    uixScore: 8.5,
    priorityLevel: 'Wysoki priorytet (1)',
    monetizationValue: 3500,
    associatedChart: 'Histogram: użycie funkcji w czasie.',
    integrationNotes: 'Obecnie nie wspiera wyszukiwania głosowego.',
    personalizationOptions: 'Historia wyszukiwań użytkownika.',
  },
  {
    id: 4,
    depthLevel: 1,
    category: 'Płatności',
    userBehaviorAnalysis: 'Użytkownik realizuje płatność w aplikacji.',
    optimizationPotential: 'Usprawnienie mechanizmu zwrotów.',
    potentialExtensions: 'Integracja z nowymi systemami płatności.',
    usageStatistics: '500 transakcji dziennie.',
    relatedFunctions: 'Powiązane z $3.1.2 (Subskrypcje).',
    processFlow: 'Wybór produktu → Podanie danych płatności → Finalizacja.',
    uixScore: 9.8,
    priorityLevel: 'Wysoki priorytet (1)',
    monetizationValue: 15000,
    associatedChart: 'Wykres słupkowy: transakcje w ciągu dnia.',
    integrationNotes: 'Planowane rozszerzenie na kryptowaluty.',
    personalizationOptions: 'Zapamiętanie preferowanego sposobu płatności.',
  },
  {
    id: 5,
    depthLevel: 2,
    category: 'Obsługa klienta',
    userBehaviorAnalysis: 'Użytkownik zgłasza problem z aplikacją.',
    optimizationPotential: 'Skrócenie czasu odpowiedzi supportu.',
    potentialExtensions: 'Automatyczne odpowiedzi w chatbotach.',
    usageStatistics: '50 zgłoszeń na godzinę.',
    relatedFunctions: 'Powiązane z $4.2.1 (System ticketów).',
    processFlow: 'Zgłoszenie → Weryfikacja → Odpowiedź.',
    uixScore: 8.0,
    priorityLevel: 'Średni priorytet (2)',
    monetizationValue: 500,
    associatedChart: 'Wykres kołowy: podział zgłoszeń.',
    integrationNotes: 'Obecnie brak integracji z CRM.',
    personalizationOptions: 'Możliwość dodania załączników w zgłoszeniu.',
  },
  {
    id: 6,
    depthLevel: 1,
    category: 'Profil użytkownika',
    userBehaviorAnalysis: 'Użytkownik edytuje swój profil.',
    optimizationPotential: 'Dodanie opcji zmian profilu w trybie offline.',
    potentialExtensions: 'Integracja z mediami społecznościowymi.',
    usageStatistics: '100 edycji dziennie.',
    relatedFunctions: 'Powiązane z $5.1.1 (Zdjęcia profilowe).',
    processFlow: 'Otwórz profil → Wprowadź zmiany → Zapisz.',
    uixScore: 8.9,
    priorityLevel: 'Średni priorytet (2)',
    monetizationValue: 1200,
    associatedChart: 'Wykres liniowy: zmiany profilu w czasie.',
    integrationNotes: 'Planowana integracja z Dropbox.',
    personalizationOptions: 'Motywy graficzne dla profilu.',
  },
];

const priorityColor = (level: string) =>
  level.startsWith('Wysoki') ? 'border-red-500/50 text-red-400' : 'border-yellow-500/50 text-yellow-400';

const uixColor = (score: number) => {
  if (score >= 9.5) return 'text-green-400';
  if (score >= 8.5) return 'text-cyan-400';
  return 'text-yellow-400';
};

const CATEGORY_ICONS: Record<string, string> = {
  'Rejestracja i Logowanie': '🔐',
  'Powiadomienia': '🔔',
  'Wyszukiwanie': '🔍',
  'Płatności': '💳',
  'Obsługa klienta': '🎧',
  'Profil użytkownika': '👤',
};

export default function FunctionPanel() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [search, setSearch] = useState('');

  const totalMonetization = FUNCTIONS.reduce((s, f) => s + f.monetizationValue, 0);
  const avgUix = (FUNCTIONS.reduce((s, f) => s + f.uixScore, 0) / FUNCTIONS.length).toFixed(1);
  const highPriority = FUNCTIONS.filter(f => f.priorityLevel.startsWith('Wysoki')).length;

  const visible = FUNCTIONS.filter(f => {
    if (filter === 'high' && !f.priorityLevel.startsWith('Wysoki')) return false;
    if (filter === 'medium' && !f.priorityLevel.startsWith('Średni')) return false;
    if (search && !f.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardContent className="pt-5">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-slate-400 text-sm">Funkcje w systemie</p>
                <p className="text-3xl font-bold text-white">{FUNCTIONS.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardContent className="pt-5">
            <div className="flex items-center space-x-3">
              <Star className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-slate-400 text-sm">Średni UIX Score</p>
                <p className="text-3xl font-bold text-white">{avgUix}
                  <span className="text-sm text-slate-400 ml-1">/10</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardContent className="pt-5">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-slate-400 text-sm">Łączna wartość monetyzacji</p>
                <p className="text-3xl font-bold text-white">
                  {totalMonetization.toLocaleString('pl-PL')}
                  <span className="text-sm text-slate-400 ml-1">PLN</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Szukaj kategorii..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800/70 border border-blue-800/30 rounded-md pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-slate-600 text-slate-300'}
          >
            Wszystkie ({FUNCTIONS.length})
          </Button>
          <Button
            size="sm"
            variant={filter === 'high' ? 'default' : 'outline'}
            onClick={() => setFilter('high')}
            className={filter === 'high' ? 'bg-red-700 hover:bg-red-800' : 'border-slate-600 text-slate-300'}
          >
            Wysoki ({highPriority})
          </Button>
          <Button
            size="sm"
            variant={filter === 'medium' ? 'default' : 'outline'}
            onClick={() => setFilter('medium')}
            className={filter === 'medium' ? 'bg-yellow-700 hover:bg-yellow-800' : 'border-slate-600 text-slate-300'}
          >
            Średni ({FUNCTIONS.length - highPriority})
          </Button>
        </div>
      </div>

      {/* Function cards */}
      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="text-slate-400 text-center py-8">Brak wyników dla podanych filtrów.</p>
        )}
        {visible.map(fn => (
          <Card key={fn.id} className="bg-slate-800/50 border-blue-800/30 hover:border-cyan-700/40 transition-colors">
            <CardHeader
              className="cursor-pointer select-none"
              onClick={() => setExpanded(expanded === fn.id ? null : fn.id)}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{CATEGORY_ICONS[fn.category] ?? '⚙️'}</span>
                  <div>
                    <CardTitle className="text-white text-base">
                      #{fn.id} — {fn.category}
                    </CardTitle>
                    <p className="text-slate-400 text-xs mt-0.5">Depth Level: {fn.depthLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className={priorityColor(fn.priorityLevel)}>
                    {fn.priorityLevel}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400" />
                    <span className={`text-sm font-bold ${uixColor(fn.uixScore)}`}>{fn.uixScore}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-sm text-green-400 font-semibold">
                      {fn.monetizationValue.toLocaleString('pl-PL')} PLN
                    </span>
                  </div>
                  {expanded === fn.id
                    ? <ChevronUp className="h-4 w-4 text-slate-400" />
                    : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
              </div>
              {/* UIX progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>UIX Score</span>
                  <span>{fn.uixScore} / 10</span>
                </div>
                <Progress value={fn.uixScore * 10} className="h-1.5 bg-slate-700" />
              </div>
            </CardHeader>

            {expanded === fn.id && (
              <CardContent className="border-t border-blue-800/20 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <DetailBlock icon="👤" label="Analiza zachowania użytkownika" value={fn.userBehaviorAnalysis} />
                  <DetailBlock icon="⚡" label="Potencjał optymalizacji" value={fn.optimizationPotential} />
                  <DetailBlock icon="🔌" label="Możliwe rozszerzenia" value={fn.potentialExtensions} />
                  <DetailBlock icon="📊" label="Statystyki użycia" value={fn.usageStatistics} />
                  <DetailBlock icon="🔗" label="Powiązane funkcje" value={fn.relatedFunctions} />
                  <DetailBlock icon="➡️" label="Przepływ procesu" value={fn.processFlow} />
                  <DetailBlock icon="🔧" label="Notatki integracyjne" value={fn.integrationNotes} />
                  <DetailBlock icon="🎨" label="Opcje personalizacji" value={fn.personalizationOptions} />
                  <div className="md:col-span-2">
                    <DetailBlock icon="📈" label="Powiązany wykres" value={fn.associatedChart} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function DetailBlock({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-slate-900/50 rounded-md p-3 space-y-1">
      <p className="text-slate-400 text-xs flex items-center gap-1">
        <span>{icon}</span>{label}
      </p>
      <p className="text-slate-200">{value}</p>
    </div>
  );
}
