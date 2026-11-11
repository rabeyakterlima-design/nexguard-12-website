// Supabase Client for Vite / React SPA
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mwbyboraywlegsvlmlfa.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
