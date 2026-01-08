import { createClient } from '@supabase/supabase-js';

// Use dummy values during build time if environment variables are not available
// This allows the build to succeed without actually using Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client with the values (will use placeholders during build)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Runtime validation - this will only run when the client is actually used
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
  }
}

