import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { identifyUser, resetUser } from '../lib/posthog';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  provider?: 'supabase' | 'demo';
  avatarUrl?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null; confirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
  signInWithDemo: (role?: 'developer' | 'student' | 'merchant') => void;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS = {
  developer: {
    id: 'demo-dev-01',
    email: 'aman.developer@commercepilot.ai',
    fullName: 'Aman Sharma',
    role: 'AI & Data Science Engineer',
    provider: 'demo' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-15'
  },
  student: {
    id: 'demo-stud-02',
    email: 'priya.student@college.edu',
    fullName: 'Priya Nair',
    role: 'Computer Science Student',
    provider: 'demo' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-02-10'
  },
  merchant: {
    id: 'demo-merch-03',
    email: 'growth.lead@electronicsmart.in',
    fullName: 'Vikram Mehta',
    role: 'Electronics Merchant Growth Lead',
    provider: 'demo' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01'
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const session = await authService.getSession();
        if (session?.user && isMounted) {
          const profile = await userService.getUserProfile();
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatarUrl: profile?.avatar_url,
            role: 'Customer',
            provider: 'supabase',
            createdAt: session.user.created_at
          });
        }
      } catch (err) {
        console.warn('Auth initialization note:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    // Listen for auth state changes
    const subscription = authService.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await userService.getUserProfile();
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatarUrl: profile?.avatar_url,
          role: 'Customer',
          provider: 'supabase',
          createdAt: session.user.created_at
        });
      } else {
        // Clear state on logout
        setUser(null);
        localStorage.removeItem('cp_auth_user');
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Synchronize authenticated user identity with PostHog
  useEffect(() => {
    if (user) {
      identifyUser(user.id, {
        email: user.email,
        name: user.fullName,
        role: user.role,
        provider: user.provider
      });
    } else {
      resetUser();
    }
  }, [user]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true);
    const res = await authService.signIn(email, password);
    setLoading(false);

    if (res.error) {
      return { error: res.error };
    }

    if (res.user) {
      const profile = await userService.getUserProfile();
      setUser({
        id: res.user.id,
        email: res.user.email || email,
        fullName: profile?.full_name || res.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: profile?.avatar_url,
        role: 'Customer',
        provider: 'supabase',
        createdAt: res.user.created_at
      });
    }

    return { error: null };
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName?: string
  ): Promise<{ error: string | null; confirmationRequired?: boolean }> => {
    setLoading(true);
    const res = await authService.signUp(email, password, fullName);
    setLoading(false);

    if (res.error) {
      return { error: res.error };
    }

    if (res.session && res.user) {
      setUser({
        id: res.user.id,
        email: res.user.email || email,
        fullName: fullName || email.split('@')[0],
        role: 'Customer',
        provider: 'supabase',
        createdAt: res.user.created_at
      });
      return { error: null, confirmationRequired: false };
    }

    return { error: null, confirmationRequired: res.confirmationRequired ?? true };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    localStorage.removeItem('cp_auth_user');
  };

  const signInWithDemo = (role: 'developer' | 'student' | 'merchant' = 'developer') => {
    const demo = DEMO_ACCOUNTS[role];
    setUser(demo);
    localStorage.setItem('cp_auth_user', JSON.stringify(demo));
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    return authService.resetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: true,
        signIn,
        signUp,
        signOut,
        signInWithDemo,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
