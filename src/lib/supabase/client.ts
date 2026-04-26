import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'insta-bot' // ⚠️ ADICIONE ESTA LINHA!
  }
});