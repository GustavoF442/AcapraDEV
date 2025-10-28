import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    console.log('🔍 Testando conexão final...');
    
    // Log das variáveis (sem expor valores completos)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    
    console.log('URL:', supabaseUrl);
    console.log('Key exists:', !!supabaseKey);
    console.log('Key starts with:', supabaseKey?.substring(0, 20) + '...');
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Variáveis de ambiente não configuradas',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Buscar TODOS os dados sem filtros
    const [animalsResult, newsResult, usersResult] = await Promise.all([
      supabase.from('animals').select('*', { count: 'exact' }).order('id'),
      supabase.from('news').select('*', { count: 'exact' }).order('id'),
      supabase.from('users').select('id, name, email, role', { count: 'exact' }).order('id')
    ]);
    
    return res.status(200).json({
      message: '🎯 TESTE DEFINITIVO - Conexão com suas chaves',
      timestamp: new Date(),
      supabaseProject: supabaseUrl,
      data: {
        animals: {
          total: animalsResult.count || 0,
          data: animalsResult.data || [],
          error: animalsResult.error?.message || null
        },
        news: {
          total: newsResult.count || 0,
          data: newsResult.data || [],
          error: newsResult.error?.message || null
        },
        users: {
          total: usersResult.count || 0,
          data: usersResult.data || [],
          error: usersResult.error?.message || null
        }
      }
    });
    
  } catch (error) {
    console.error('Erro no teste:', error);
    return res.status(500).json({
      message: 'Erro no teste final',
      error: error.message,
      stack: error.stack
    });
  }
}
