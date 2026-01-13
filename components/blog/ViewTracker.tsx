'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function ViewTracker({ blogId }: { blogId: string }) {
  useEffect(() => {
    const increment = async () => {
        // Prevent duplicate counts in dev mode or frequent reloads? 
        // Simple implementation for now.
        const viewedKey = `viewed_${blogId}`;
        if (sessionStorage.getItem(viewedKey)) return;

        await supabase.rpc('increment_blog_view', { blog_id: blogId });
        sessionStorage.setItem(viewedKey, 'true');
    };
    increment();
  }, [blogId]);

  return null;
}
