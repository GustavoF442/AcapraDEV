import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  throw new Error('REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY devem estar definidos');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Função para testar conexão
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('animals')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Conexão com Supabase falhou:', error);
      return false;
    }
    
    console.log('✅ Conexão com Supabase estabelecida no frontend');
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return false;
  }
}

export default supabase;
