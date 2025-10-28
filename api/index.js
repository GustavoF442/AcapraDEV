import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { method, url } = req;
  const path = url.replace('/api', '');

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
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

    // Health check
    if (path === '/health' || path === '/') {
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
    }

    // Animals
    if (path === '/animals' && method === 'GET') {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { data: animals, error, count } = await supabase
          .from('animals')
          .select('*', { count: 'exact' })
          .eq('status', 'available')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          return res.status(200).json({
            animals: [],
            pagination: { page: 1, pages: 1, total: 0, limit },
            error: 'Erro ao carregar animais: ' + error.message
          });
        }

        return res.status(200).json({
          animals: animals || [],
          pagination: {
            page,
            pages: Math.ceil((count || 0) / limit),
            total: count || 0,
            limit
          }
        });
      } catch (err) {
        return res.status(200).json({
          animals: [],
          pagination: { page: 1, pages: 1, total: 0, limit: 12 },
          error: 'Erro ao conectar com banco de dados'
        });
      }
    }

    // News
    if (path === '/news' && method === 'GET') {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const offset = (page - 1) * limit;

      const { data: news, error, count } = await supabase
        .from('news')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return res.status(200).json({
        news: news || [],
        pagination: {
          page,
          pages: Math.ceil((count || 0) / limit),
          total: count || 0,
          limit
        }
      });
    }

    // Stats
    if (path === '/stats' && method === 'GET') {
      const [animalsCount, adoptionsCount, newsCount] = await Promise.all([
        supabase.from('animals').select('*', { count: 'exact', head: true }),
        supabase.from('adoptions').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true })
      ]);

      return res.status(200).json({
        summary: {
          totalAnimals: animalsCount.count || 0,
          adoptedAnimals: adoptionsCount.count || 0,
          pendingAdoptions: 0,
          totalNews: newsCount.count || 0
        }
      });
    }

    // 404 para rotas não encontradas
    return res.status(404).json({
      message: 'Rota não encontrada',
      path: url
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
