import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        message: 'Erro de configuração',
        error: 'Variáveis de ambiente do Supabase não encontradas',
        env: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      const { data, error } = await supabase
        .from('animals')
        .select('count')
        .limit(1);
      
      return res.status(200).json({
        message: 'API da ACAPRA funcionando!',
        timestamp: new Date(),
        status: 'ok',
        supabase: error ? 'error' : 'connected',
        supabaseError: error?.message || null,
        env: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey
        }
      });
    } catch (dbError) {
      return res.status(200).json({
        message: 'API funcionando, mas erro no Supabase',
        timestamp: new Date(),
        status: 'ok',
        supabase: 'error',
        error: dbError.message
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
