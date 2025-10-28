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
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

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
    return res.status(500).json({
      animals: [],
      pagination: { page: 1, pages: 1, total: 0, limit: 12 },
      error: 'Erro ao conectar com banco de dados'
    });
  }
}
