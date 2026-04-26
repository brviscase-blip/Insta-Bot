import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase connection
// Note: In Vite, env variables on the client must start with VITE_
// but AI Studio allows custom replacements. We will use import.meta.env
// The brief mentioned NEXT_PUBLIC_SUPABASE_URL, so we support that or VITE fallback.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder_key");
