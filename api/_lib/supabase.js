const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar definidos nas variáveis de ambiente');
  throw new Error('SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar definidos nas variáveis de ambiente');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para testar conexão
async function testConnection() {
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
async function executeQuery(queryFn) {
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

module.exports = {
  supabase,
  testConnection,
  executeQuery
};
