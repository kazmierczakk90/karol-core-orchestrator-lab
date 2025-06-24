
import { useState, useEffect } from 'react';

interface MockUser {
  id: string;
  email: string;
}

interface MockProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
}

export const useSimplifiedAuth = () => {
  const [user] = useState<MockUser>({
    id: 'demo-user-id',
    email: 'demo@karol-core.dev'
  });

  const [profile] = useState<MockProfile>({
    id: 'demo-user-id',
    email: 'demo@karol-core.dev',
    first_name: 'Demo',
    last_name: 'User',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: null
  });

  const [loading] = useState(false);

  const signOut = async () => {
    console.log('Sign out called - demo mode');
    return { error: null };
  };

  const updateProfile = async (updates: Partial<MockProfile>) => {
    console.log('Profile update called - demo mode:', updates);
    return { error: null };
  };

  return {
    user,
    profile,
    loading,
    signOut,
    updateProfile
  };
};
