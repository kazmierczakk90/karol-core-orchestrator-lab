
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/db';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Bezpośrednie zapytanie SQL zamiast wywołania RPC
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking auth flow
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 100);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Existing session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
      } else {
        console.log('Sign in successful');
        toast.success('Successfully signed in!');
      }

      return { error };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('Attempting sign up for:', email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
      } else {
        console.log('Sign up successful');
        toast.success('Check your email for verification link!');
      }

      return { error };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error(error.message);
      } else {
        console.log('Sign out successful');
        toast.success('Successfully signed out!');
        setProfile(null);
      }

      return { error };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      console.log('Updating profile:', updates);
      
      // Bezpośrednie zapytanie SQL zamiast RPC
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        toast.error(error.message);
      } else {
        console.log('Profile updated successfully');
        toast.success('Profile updated successfully!');
        // Refresh profile data
        fetchProfile(user.id);
      }

      return { error };
    } catch (error) {
      console.error('Unexpected profile update error:', error);
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
