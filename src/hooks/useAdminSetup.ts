
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminCredentials {
  email: string;
  password: string;
  role: string;
}

export const useAdminSetup = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // SECURITY: Credentials should be set via environment variables or admin interface
  // This hook is now disabled for security reasons
  const adminCredentials: AdminCredentials = {
    email: '',
    password: '',
    role: 'admin'
  };

  const testCredentials: AdminCredentials = {
    email: '',
    password: '',
    role: 'user'
  };

  const createDefaultAccounts = async () => {
    console.warn('SECURITY: Default account creation disabled - use proper admin setup process');
    toast.error('Account creation disabled for security reasons');
    setIsLoading(false);
    setIsSetupComplete(true);
  };

  const checkAccountsExist = async () => {
    // Security: Account checking disabled
    return true;
  };

  useEffect(() => {
    const setupAccounts = async () => {
      setIsLoading(true);
      
      const accountsExist = await checkAccountsExist();
      
      if (accountsExist) {
        console.log('Default accounts already exist');
        setIsSetupComplete(true);
        setIsLoading(false);
      } else {
        console.log('Creating default accounts...');
        await createDefaultAccounts();
      }
    };

    // SECURITY: Automatic setup disabled - accounts should be created through proper admin interface
    console.warn('SECURITY: Default account setup has been disabled for security reasons');
    setIsSetupComplete(true);
    setIsLoading(false);
  }, []);

  return {
    isSetupComplete,
    isLoading,
    adminCredentials,
    testCredentials,
    createDefaultAccounts: () => createDefaultAccounts()
  };
};
