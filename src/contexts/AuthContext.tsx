import React, { createContext, useContext } from 'react';
import { useSupabaseAuth, UserProfile, AppRole } from '@/hooks/useSupabaseAuth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { profile, isAuthenticated, loading, signIn, signUp, signOut } = useSupabaseAuth();

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    return { error: result.error };
  };

  const handleSignUp = async (email: string, password: string, username: string) => {
    const result = await signUp(email, password, username);
    return { error: result.error };
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user: profile, 
      isAuthenticated, 
      loading,
      login, 
      signUp: handleSignUp,
      logout 
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
