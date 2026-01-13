'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, signOut as authSignOut } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  role?: string;
}

export function useAuth(requireAuth: boolean = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn('[useAuth] Error fetching profile:', error);
        }
        
        return data?.role || 'editor';
      } catch (error) {
        console.warn('[useAuth] Profile fetch exception:', error);
        return 'editor';
      }
    };

    const initAuth = async () => {
      try {
        // Initial session check
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            const role = await fetchProfile(session.user.id);
            if (mounted) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: role,
              });
            }
          } else if (requireAuth) {
             router.push('/login');
          }
        }
      } catch (e) {
        console.error('[useAuth] Init error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Failsafe timeout to prevent infinite loading
    const timeoutTimer = setTimeout(() => {
        if (mounted) {
            console.warn('[useAuth] Auth check timed out, forcing loading to false');
            setLoading(false);
        }
    }, 3000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Auth state changed:', event);
        if (!mounted) return;
        
        if (session?.user) {
            // Only update if we don't have a user or it's a different user
            // We use a function check to avoid closure staleness issues if possible, 
            // but here we rely on the effect dep or just set it.
            // Since we can't easily access the current 'user' state inside this closure without ref,
            // we will just set it. The effect hook downstream will handle role fetching.
             setUser(current => {
                 if (current?.id === session.user.id) return current;
                 return {
                    id: session.user.id,
                    email: session.user.email || '',
                 };
             });
            setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
          
          if (requireAuth) {
            router.push('/login');
          }
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutTimer);
      subscription.unsubscribe();
    };
  }, [requireAuth, router]);

  // Use a separate effect to fetch profile when user ID changes
  // This decouples the DB call from the Auth listener to prevent blocking
  useEffect(() => {
      let mounted = true;
      if (user?.id && !user.role) {
          const fetchRole = async () => {
             try {
                const { data, error } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', user.id)
                  .single();
                  
                if (mounted && data?.role) {
                     setUser(prev => prev ? { ...prev, role: data.role } : null);
                }
             } catch (e) {
                 console.warn('[useAuth] Profile fetch error in effect:', e);
             }
          };
          fetchRole();
      }
      return () => { mounted = false; };
  }, [user?.id]);

  const signOut = async () => {
    try {
      await authSignOut();
    } catch (error) {
      console.warn('[useAuth] Sign out error:', error);
    } finally {
      // Nuking local storage to prevent ghost sessions
      if (typeof window !== 'undefined') {
          // Robust clear of all Supabase keys
          const keysToRemove: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
              const key = window.localStorage.key(i);
              if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                  keysToRemove.push(key);
              }
          }
          keysToRemove.forEach(key => window.localStorage.removeItem(key));
      }
      
      setUser(null);
      // Add action=logout to signal the login page that this was an intentional logout
      window.location.href = '/login?action=logout';
    }
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    role: user?.role,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor',
  };
}




