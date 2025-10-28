import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jjedtjerraejimhnudph.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWR0amVycmFlamltaG51ZHBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDEwMjk2NSwiZXhwIjoyMDQ1Njc4OTY1fQ.8wFCLqoqEjNnKUOGHLUvQJbGPCyNZqCGJGWJVGGJGJG';

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para executar queries com tratamento de erro
export async function executeQuery(queryFn) {
  try {
    const result = await queryFn(supabase);
    if (result.error) {
      console.error('Supabase error:', result.error);
      throw new Error(result.error.message);
    }
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
