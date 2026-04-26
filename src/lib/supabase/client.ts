import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key";

export const isSupabaseConfigured = supabaseUrl !== "https://placeholder.supabase.co" && supabaseKey !== "placeholder_key";

if (!isSupabaseConfigured) {
  console.warn("Supabase environment variables are missing. Querying will be disabled.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'insta-bot'
  }
});
