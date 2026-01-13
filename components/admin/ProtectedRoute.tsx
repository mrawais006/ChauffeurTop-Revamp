'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading: authLoading } = useAuth(true); // Require authentication
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Sync local loading with auth loading
    setShowLoading(authLoading);

    // Failsafe: Force stop loading after 5 seconds
    const timer = setTimeout(() => {
      if (authLoading) {
        console.warn('[ProtectedRoute] Loading timed out. Forcing render.');
        setShowLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [authLoading]);

  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-luxury-gold font-serif text-lg">Loading Admin Panel...</p>
          <p className="text-white/30 text-xs mt-4 animate-pulse">Please wait...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}




