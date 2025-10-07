import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Calendar, CreditCard, Settings, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const SubscriptionStatus = () => {
  const { subscribed, currentTier, subscriptionEnd, loading, checkSubscription, openCustomerPortal } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Sprawdzam status subskrypcji...</p>
        </CardContent>
      </Card>
    );
  }

  if (!subscribed || !currentTier) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Brak Aktywnej Subskrypcji</CardTitle>
          <CardDescription>
            Wybierz plan, aby rozpocząć korzystanie z pełnych możliwości platformy KAROL AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => window.location.href = '/pricing'}>
            Przeglądaj Plany Cenowe
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Status Subskrypcji
              <Badge variant="default" className="bg-green-500">Aktywna</Badge>
            </CardTitle>
            <CardDescription>
              Zarządzaj swoim planem i płatnościami
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={checkSubscription}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <CreditCard className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="font-semibold text-lg">{currentTier.name}</p>
            <p className="text-sm text-muted-foreground">
              {currentTier.price.toLocaleString('pl-PL')} {currentTier.currency}/miesiąc
            </p>
          </div>
        </div>

        {subscriptionEnd && (
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Odnawia się</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(subscriptionEnd), 'dd MMMM yyyy', { locale: pl })}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Funkcje Planu:</h4>
          <ul className="space-y-1">
            {currentTier.features.map((feature, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 space-y-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={openCustomerPortal}
          >
            <Settings className="mr-2 h-4 w-4" />
            Zarządzaj Subskrypcją
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => window.location.href = '/pricing'}
          >
            Zmień Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
