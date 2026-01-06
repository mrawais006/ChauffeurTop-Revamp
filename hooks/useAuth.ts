'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, signOut as authSignOut } from '@/lib/auth';

interface User {
  id: string;
  email: string;
}

export function useAuth(requireAuth: boolean = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Auth state changed:', event);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
        } else {
          setUser(null);
          
          // Redirect to login if auth is required
          if (requireAuth) {
            router.push('/login');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [requireAuth, router]);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        
        // Redirect to login if auth is required
        if (requireAuth) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('[useAuth] Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authSignOut();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('[useAuth] Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}


