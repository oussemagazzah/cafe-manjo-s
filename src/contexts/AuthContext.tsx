import React, { createContext, useContext } from 'react';
import { useSupabaseAuth, UserProfile, AppRole } from '@/hooks/useSupabaseAuth';
import { useDemoAuth } from '@/hooks/useDemoAuth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we're in demo mode (Supabase not configured)
const isDemoMode = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return !supabaseUrl || 
         !supabaseKey || 
         supabaseUrl === 'https://placeholder.supabase.co' || 
         supabaseKey === 'placeholder-key';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const demoMode = isDemoMode();
  const supabaseAuth = useSupabaseAuth();
  const demoAuth = useDemoAuth();

  // Use demo auth if Supabase is not configured
  const auth = demoMode ? demoAuth : supabaseAuth;

  const login = async (email: string, password: string) => {
    if (demoMode) {
      const result = await demoAuth.signIn(email, password);
      return { error: result.error };
    } else {
      const result = await supabaseAuth.signIn(email, password);
      return { error: result.error };
    }
  };

  const handleSignUp = async (email: string, password: string, username: string) => {
    if (demoMode) {
      const result = await demoAuth.signUp(email, password, username);
      return { error: result.error };
    } else {
      const result = await supabaseAuth.signUp(email, password, username);
      return { error: result.error };
    }
  };

  const logout = async () => {
    if (demoMode) {
      await demoAuth.signOut();
    } else {
      await supabaseAuth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user: auth.profile, 
      isAuthenticated: auth.isAuthenticated, 
      loading: auth.loading,
      login, 
      signUp: handleSignUp,
      logout,
      isDemoMode: demoMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export demo credentials for use in LoginPage
export { DEMO_CREDENTIALS } from '@/hooks/useDemoAuth';
