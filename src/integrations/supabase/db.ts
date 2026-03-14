// Untyped Supabase client wrapper for tables not yet in the schema.
// Once tables are created via migrations and types.ts regenerates, 
// switch back to the typed `supabase` import.
import { supabase } from './client';

export const db = supabase as any;
