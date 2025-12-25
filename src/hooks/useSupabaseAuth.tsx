import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'ADMIN' | 'SERVEUR';

export interface UserProfile {
  id: string;
  username: string;
  role: AppRole | null;
  createdAt: Date;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // Fetch role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile({
          id: profileData.id,
          username: profileData.username,
          role: roleData?.role as AppRole | null,
          createdAt: new Date(profileData.created_at),
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let profileFetchTimeout: NodeJS.Timeout | null = null;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // Skip TOKEN_REFRESHED events to avoid excessive profile fetches
        if (event === 'TOKEN_REFRESHED') {
          setSession(session);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        // Clear any pending profile fetch
        if (profileFetchTimeout) {
          clearTimeout(profileFetchTimeout);
        }

        // Defer profile fetch to avoid rapid calls
        if (session?.user) {
          profileFetchTimeout = setTimeout(() => {
            if (mounted) {
            fetchProfile(session.user.id);
            }
          }, 100);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session (only once on mount)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      // Handle 429 errors gracefully
      if (error && error.message?.includes('429')) {
        console.warn('Rate limit hit, retrying after delay...');
        setTimeout(() => {
          if (mounted) {
    supabase.auth.getSession().then(({ data: { session } }) => {
              if (mounted && session?.user) {
                setSession(session);
                setUser(session.user);
                fetchProfile(session.user.id);
              }
              setLoading(false);
            });
          }
        }, 2000);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      if (profileFetchTimeout) {
        clearTimeout(profileFetchTimeout);
      }
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
        // Handle rate limiting
        if (error.status === 429 || error.message?.includes('429')) {
          return { 
            error: { 
              ...error, 
              message: 'Trop de tentatives. Veuillez patienter quelques instants.' 
            } 
          };
        }
      return { error };
    }
    
    return { error: null, user: data.user };
    } catch (err: any) {
      if (err?.status === 429 || err?.message?.includes('429')) {
        return { 
          error: { 
            message: 'Trop de tentatives. Veuillez patienter quelques instants.',
            status: 429
          } 
        };
      }
      return { error: err };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username,
        },
      },
    });

    if (error) {
      return { error };
    }

    return { error: null, user: data.user };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    return { error };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
  };
}
