import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jjedtjerraejimhnudph.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWR0amVycmFlamltaG51ZHBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDEwMjk2NSwiZXhwIjoyMDQ1Njc4OTY1fQ.YQJWTJGGTLdXJGJGJGJGJGJGJGJGJGJGJGJGJGJGJGJGJGJG';

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para testar conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Conexão com Supabase falhou:', error);
      return false;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return false;
  }
}

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
