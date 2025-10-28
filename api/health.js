import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // Testar conexão com Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    const { data, error } = await supabase
      .from('animals')
      .select('count')
      .limit(1);
    
    const supabaseStatus = error ? 'error' : 'connected';
    
    res.status(200).json({
      message: 'API da ACAPRA funcionando!',
      timestamp: new Date(),
      status: 'ok',
      supabase: supabaseStatus,
      environment: process.env.NODE_ENV || 'development',
      method: req.method,
      url: req.url
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro no health check',
      error: error.message,
      supabase: 'error'
    });
  }
}
