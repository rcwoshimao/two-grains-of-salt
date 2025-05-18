import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('Environment variables loaded:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl?.substring(0, 20) + '...',  // Only show start of URL for security
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing Supabase credentials:
    URL: ${supabaseUrl ? 'Present' : 'Missing'}
    Key: ${supabaseAnonKey ? 'Present' : 'Missing'}
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 