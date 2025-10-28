import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Testar conexão e buscar todos os animais
    const { data: animals, error: animalsError, count } = await supabase
      .from('animals')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true });

    // Buscar notícias
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('id', { ascending: true });

    return res.status(200).json({
      message: 'Teste após reconfiguração das chaves',
      timestamp: new Date(),
      environment: {
        supabaseUrl: process.env.SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
        hasJwtSecret: !!process.env.JWT_SECRET
      },
      data: {
        animals: {
          total: count || animals?.length || 0,
          data: animals || [],
          error: animalsError?.message || null
        },
        news: {
          total: news?.length || 0,
          data: news || [],
          error: newsError?.message || null
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Erro na conexão',
      error: error.message,
      environment: {
        supabaseUrl: process.env.SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY
      }
    });
  }
}
