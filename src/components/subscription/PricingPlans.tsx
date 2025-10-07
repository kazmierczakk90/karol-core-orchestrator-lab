import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Sparkles, Zap, Rocket } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';

const TIER_ICONS = {
  basic: Zap,
  professional: Sparkles,
  enterprise: Crown,
  custom: Rocket,
};

const TIER_COLORS = {
  basic: 'from-blue-500 to-cyan-500',
  professional: 'from-purple-500 to-pink-500',
  enterprise: 'from-orange-500 to-red-500',
  custom: 'from-emerald-500 to-teal-500',
};

const PricingPlans = () => {
  const { tiers, createCheckout, currentTier, subscribed, loading } = useSubscription();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Wybierz Plan dla Swojej Firmy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Kompleksowe rozwiązania AI dla przedsiębiorstw - skalowalne, bezpieczne i efektywne
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {Object.entries(tiers).map(([key, tier]) => {
          const Icon = TIER_ICONS[key as keyof typeof TIER_ICONS];
          const isCurrentPlan = currentTier?.productId === tier.productId;
          
          return (
            <Card 
              key={key} 
              className={`relative overflow-hidden transition-all hover:shadow-2xl ${
                isCurrentPlan ? 'ring-2 ring-primary shadow-xl' : ''
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${TIER_COLORS[key as keyof typeof TIER_COLORS]}`} />
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-8 w-8 text-primary" />
                  {isCurrentPlan && (
                    <Badge variant="default" className="bg-primary">
                      Twój Plan
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-3xl font-bold mt-4">
                  {tier.price.toLocaleString('pl-PL')} {tier.currency}
                  <span className="text-sm font-normal text-muted-foreground">/miesiąc</span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => createCheckout(tier.priceId)}
                  disabled={loading || isCurrentPlan}
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                >
                  {loading ? 'Ładowanie...' : isCurrentPlan ? 'Aktywny Plan' : 'Wybierz Plan'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {subscribed && (
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Chcesz zarządzać swoją subskrypcją?
          </p>
          <Button variant="outline" onClick={() => {
            const { openCustomerPortal } = useSubscription();
            openCustomerPortal();
          }}>
            Otwórz Portal Klienta
          </Button>
        </div>
      )}

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Potrzebujesz indywidualnej oferty?</h3>
        <p className="text-muted-foreground mb-6">
          Skontaktuj się z nami, aby omówić dedykowane rozwiązanie dla Twojej organizacji
        </p>
        <Button size="lg" variant="outline">
          Skontaktuj się z działem sprzedaży
        </Button>
      </div>
    </div>
  );
};

export default PricingPlans;
