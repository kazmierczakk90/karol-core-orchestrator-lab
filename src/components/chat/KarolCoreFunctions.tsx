
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Database, 
  FileText, 
  Users, 
  Shield, 
  Send,
  Download,
  Upload,
  List,
  Crown
} from 'lucide-react';

interface KarolCoreFunctionsProps {
  metadata?: Record<string, any>;
}

const KarolCoreFunctions: React.FC<KarolCoreFunctionsProps> = ({ metadata }) => {
  const functions = [
    {
      name: 'przekaz_dane_do_CEO',
      icon: Crown,
      description: 'Przekazywanie ważnych informacji do systemu CEO',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      name: 'przeslij_do_asystenta',
      icon: Send,
      description: 'Delegowanie zadań do innych asystentów',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      name: 'pobierz_plik_z_magazynu',
      icon: Download,
      description: 'Dostęp do plików w Vector Store',
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      name: 'zapisz_dane_do_magazynu',
      icon: Upload,
      description: 'Zapisywanie danych do Vector Store',
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    },
    {
      name: 'lista_plikow_w_magazynie',
      icon: List,
      description: 'Wyświetlanie zawartości magazynu',
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      name: 'zarzadzanie_dostepem',
      icon: Shield,
      description: 'Kontrola dostępu do zasobów',
      color: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-cyan-600/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Karol-Core AI Functions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {functions.map((fn) => {
            const IconComponent = fn.icon;
            return (
              <Badge 
                key={fn.name}
                className={`${fn.color} border flex items-center space-x-2 p-2 justify-start`}
                title={fn.description}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-xs">{fn.name}</span>
              </Badge>
            );
          })}
        </div>
        
        {metadata && (
          <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
            <div className="text-xs text-slate-400 space-y-1">
              <div>🤖 Assistant: {metadata.assistant_id}</div>
              <div>📦 Vector Store: {metadata.vector_store_id}</div>
              {metadata.thread_id && <div>🧵 Thread: {metadata.thread_id}</div>}
              {metadata.demo_mode && <div>🎭 Demo Mode: Aktywny</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KarolCoreFunctions;
