import { useState, useEffect, useCallback } from 'react';
import { UserProfile, AppRole } from './useSupabaseAuth';

// Demo users for testing without Supabase
const DEMO_USERS = {
  admin: {
    id: 'demo-admin-1',
    email: 'admin@demo.com',
    password: 'admin123',
    username: 'Admin Demo',
    role: 'ADMIN' as AppRole,
  },
  serveur: {
    id: 'demo-serveur-1',
    email: 'serveur@demo.com',
    password: 'serveur123',
    username: 'Serveur Demo',
    role: 'SERVEUR' as AppRole,
  },
};

const STORAGE_KEY = 'demo_auth_session';

export function useDemoAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        setProfile(session.profile);
      }
    } catch (error) {
      console.error('Error loading demo session:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Check demo credentials
    const user = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return { error: { message: 'Identifiants incorrects' } };
    }

    const userProfile: UserProfile = {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: new Date(),
    };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: userProfile }));

    setProfile(userProfile);
    return { error: null, user: userProfile };
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    // In demo mode, we don't allow signup - only use demo accounts
    return { error: { message: 'Inscription désactivée en mode démo. Utilisez les comptes de démonstration.' } };
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    return { error: null };
  }, []);

  return {
    profile,
    loading,
    isAuthenticated: !!profile,
    signIn,
    signUp,
    signOut,
  };
}

// Export demo credentials for display
export const DEMO_CREDENTIALS = {
  admin: {
    email: DEMO_USERS.admin.email,
    password: DEMO_USERS.admin.password,
    role: 'ADMIN' as AppRole,
  },
  serveur: {
    email: DEMO_USERS.serveur.email,
    password: DEMO_USERS.serveur.password,
    role: 'SERVEUR' as AppRole,
  },
};

