import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionTier {
  name: string;
  priceId: string;
  productId: string;
  price: number;
  currency: string;
  features: string[];
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  basic: {
    name: 'KAROL Basic',
    priceId: 'price_1SFgzwGPEb5cgjF3YllufV69',
    productId: 'prod_TC5AAmeAQ6NhVn',
    price: 299,
    currency: 'PLN',
    features: [
      'Do 5 agentów AI',
      '10,000 wiadomości/mies',
      'Podstawowy chat AI',
      'Email support',
    ],
  },
  professional: {
    name: 'KAROL Professional',
    priceId: 'price_1SFh4LGPEb5cgjF33BYyzEJA',
    productId: 'prod_TC5EBShTbMSj44',
    price: 999,
    currency: 'PLN',
    features: [
      'Do 15 agentów AI',
      '50,000 wiadomości/mies',
      'Zaawansowane analytics',
      'Priorytetowy support',
      'Integracje API',
    ],
  },
  enterprise: {
    name: 'KAROL Enterprise',
    priceId: 'price_1SFh63GPEb5cgjF3ayELOdPY',
    productId: 'prod_TC5G8EaL8WnKtE',
    price: 2999,
    currency: 'PLN',
    features: [
      'Nieograniczona liczba agentów',
      '200,000 wiadomości/mies',
      'Dedykowany account manager',
      'SLA 99.9%',
      'Custom integracje',
      'On-premise deployment opcja',
    ],
  },
  custom: {
    name: 'KAROL Custom',
    priceId: 'price_1SFh6xGPEb5cgjF3iPyU6rDc',
    productId: 'prod_TC5Hi62gpVo1ZH',
    price: 9999,
    currency: 'PLN',
    features: [
      'Pełna personalizacja',
      'White-label solution',
      'Dedykowany zespół R&D',
      'On-premise deployment',
      'Nieograniczone wszystko',
      '24/7 Premium support',
    ],
  },
};

export interface SubscriptionStatus {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  currentTier: SubscriptionTier | null;
}

export const useSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
    loading: true,
    currentTier: null,
  });
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setStatus({
          subscribed: false,
          productId: null,
          subscriptionEnd: null,
          loading: false,
          currentTier: null,
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const currentTier = data.product_id 
        ? Object.values(SUBSCRIPTION_TIERS).find(tier => tier.productId === data.product_id) || null
        : null;

      setStatus({
        subscribed: data.subscribed || false,
        productId: data.product_id || null,
        subscriptionEnd: data.subscription_end || null,
        loading: false,
        currentTier,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus({
        subscribed: false,
        productId: null,
        subscriptionEnd: null,
        loading: false,
        currentTier: null,
      });
    }
  };

  const createCheckout = async (priceId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Wymagane logowanie',
          description: 'Musisz być zalogowany, aby wykupić subskrypcję',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się utworzyć sesji checkout',
        variant: 'destructive',
      });
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Wymagane logowanie',
          description: 'Musisz być zalogowany',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się otworzyć portalu klienta',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    checkSubscription();

    // Auto-refresh subscription status
    const interval = setInterval(checkSubscription, 60000); // Co minutę

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  return {
    ...status,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    tiers: SUBSCRIPTION_TIERS,
  };
};
