
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const CreatorTab = () => {
  return (
    <Card className="bg-orange-500/20 border-orange-500/50">
      <CardHeader>
        <CardTitle className="text-orange-400">🚧 Kreator Mini AI</CardTitle>
        <CardDescription className="text-orange-300">
          Panel tworzenia nowych Mini AI - w trakcie implementacji
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-orange-300 py-8">
          <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Interfejs kreatora będzie tutaj...</p>
          <p className="text-sm mt-2">Funkcja w fazie rozwoju</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorTab;
