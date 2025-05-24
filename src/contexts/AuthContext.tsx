
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name?: string;
  username?: string;
  role?: 'usuario' | 'administrador';
  avatar_url?: string;
  bio?: string;
  location?: string;
  company?: string;
  position?: string;
  phone?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  interests?: string[];
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const generateUsernameFromEmail = (email: string): string => {
  const localPart = email.split('@')[0];
  return localPart.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const createOrUpdateProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create new profile with Google photo and generated username
        const avatarUrl = user.user_metadata?.avatar_url || null;
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null;
        const suggestedUsername = generateUsernameFromEmail(user.email || '');

        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: fullName,
            username: suggestedUsername,
            avatar_url: avatarUrl,
            role: 'usuario'
          });

        if (error) {
          console.error('Error creating profile:', error);
        } else {
          await fetchProfile(user.id);
        }
      } else if (!existingProfile.avatar_url && user.user_metadata?.avatar_url) {
        // Update existing profile with Google photo if not set
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: user.user_metadata.avatar_url })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile with avatar:', error);
        } else {
          await fetchProfile(user.id);
        }
      } else {
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error('Error creating/updating profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            createOrUpdateProfile(session.user);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await createOrUpdateProfile(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
