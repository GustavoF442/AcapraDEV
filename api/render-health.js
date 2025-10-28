import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // Health check específico para Render
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Teste rápido de conexão
    const { data, error } = await supabase
      .from('animals')
      .select('count', { count: 'exact', head: true });

    return res.status(200).json({
      status: 'healthy',
      service: 'ACAPRA API on Render',
      timestamp: new Date(),
      environment: process.env.NODE_ENV,
      supabase: {
        connected: !error,
        animals_count: data || 0,
        error: error?.message || null
      },
      render: {
        service: 'acapra-backend',
        url: 'https://acapra-backend.onrender.com'
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      service: 'ACAPRA API on Render',
      error: error.message,
      timestamp: new Date()
    });
  }
}
