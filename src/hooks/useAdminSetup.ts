
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

  const adminCredentials: AdminCredentials = {
    email: 'karolkazmierczak90@gmail.com',
    password: 'Terefere123#',
    role: 'admin'
  };

  const testCredentials: AdminCredentials = {
    email: 'test@test',
    password: '12345678',
    role: 'user'
  };

  const createDefaultAccounts = async () => {
    try {
      console.log('Setting up default accounts...');

      // Create admin account
      const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: adminCredentials.email,
        password: adminCredentials.password,
        options: {
          data: {
            first_name: 'Karol',
            last_name: 'Kazmierczak',
            role: 'admin'
          }
        }
      });

      if (adminError && !adminError.message.includes('already registered')) {
        console.error('Admin account creation error:', adminError);
      } else {
        console.log('Admin account ready');
      }

      // Create test account
      const { data: testData, error: testError } = await supabase.auth.signUp({
        email: testCredentials.email,
        password: testCredentials.password,
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User',
            role: 'user'
          }
        }
      });

      if (testError && !testError.message.includes('already registered')) {
        console.error('Test account creation error:', testError);
      } else {
        console.log('Test account ready');
      }

      // Update roles in profiles table after a delay - fixed the type issue
      setTimeout(async () => {
        try {
          // Get user IDs first
          const { data: adminUser } = await supabase.auth.signInWithPassword({
            email: adminCredentials.email,
            password: adminCredentials.password
          });

          if (adminUser.user) {
            await supabase
              .from('profiles')
              .upsert({
                id: adminUser.user.id,
                email: adminCredentials.email,
                role: 'admin',
                first_name: 'Karol',
                last_name: 'Kazmierczak'
              }, { onConflict: 'id' });
          }

          const { data: testUser } = await supabase.auth.signInWithPassword({
            email: testCredentials.email,
            password: testCredentials.password
          });

          if (testUser.user) {
            await supabase
              .from('profiles')
              .upsert({
                id: testUser.user.id,
                email: testCredentials.email,
                role: 'user',
                first_name: 'Test',
                last_name: 'User'
              }, { onConflict: 'id' });
          }

          console.log('Default accounts setup completed');
          setIsSetupComplete(true);
        } catch (error) {
          console.error('Error updating profiles:', error);
        }
      }, 2000);

    } catch (error) {
      console.error('Error setting up default accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAccountsExist = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('email, role')
        .in('email', [adminCredentials.email, testCredentials.email]);

      if (error) {
        console.error('Error checking accounts:', error);
        return false;
      }

      const adminExists = profiles?.some(p => p.email === adminCredentials.email && p.role === 'admin');
      const testExists = profiles?.some(p => p.email === testCredentials.email);

      return adminExists && testExists;
    } catch (error) {
      console.error('Error checking accounts:', error);
      return false;
    }
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

    // Disable automatic setup for now since we're removing auth
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
