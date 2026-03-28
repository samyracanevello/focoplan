import { createClient } from '@supabase/supabase-js';
import * as z from 'zod';

const envSchema = z.object({
    VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL deve ser uma URL válida configurada no .env'),
    VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY não pode estar vazio'),
});

const envParsed = envSchema.safeParse({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

if (!envParsed.success) {
    console.error('⚠️ Supabase environment variables missing or invalid:');
    envParsed.error.issues.forEach(issue => console.error(`- ${issue.message}`));
}

const supabaseUrl = envParsed.success ? envParsed.data.VITE_SUPABASE_URL : '';
const supabaseAnonKey = envParsed.success ? envParsed.data.VITE_SUPABASE_ANON_KEY : '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
