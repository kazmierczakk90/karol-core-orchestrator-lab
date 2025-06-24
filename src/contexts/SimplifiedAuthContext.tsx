
import React, { createContext, useContext } from 'react';

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

interface SimplifiedAuthContextType {
  user: MockUser;
  profile: MockProfile;
  loading: boolean;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<MockProfile>) => Promise<{ error: any }>;
}

const SimplifiedAuthContext = createContext<SimplifiedAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(SimplifiedAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SimplifiedAuthProvider');
  }
  return context;
};

interface SimplifiedAuthProviderProps {
  children: React.ReactNode;
}

export const SimplifiedAuthProvider = ({ children }: SimplifiedAuthProviderProps) => {
  const user: MockUser = {
    id: 'demo-user-id',
    email: 'demo@karol-core.dev'
  };

  const profile: MockProfile = {
    id: 'demo-user-id',
    email: 'demo@karol-core.dev',
    first_name: 'Demo',
    last_name: 'User',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: null
  };

  const signOut = async () => {
    console.log('Sign out called - demo mode');
    return { error: null };
  };

  const updateProfile = async (updates: Partial<MockProfile>) => {
    console.log('Profile update called - demo mode:', updates);
    return { error: null };
  };

  const value = {
    user,
    profile,
    loading: false,
    signOut,
    updateProfile
  };

  return (
    <SimplifiedAuthContext.Provider value={value}>
      {children}
    </SimplifiedAuthContext.Provider>
  );
};
