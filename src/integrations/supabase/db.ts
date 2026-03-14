// Untyped Supabase client wrapper for tables not yet in the schema.
// Once tables are created via migrations and types.ts regenerates,
// switch imports back to '@/integrations/supabase/client'.
import { supabase as typedSupabase } from './client';

export const supabase = typedSupabase as any;
export const db = typedSupabase as any;
