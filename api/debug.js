import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Listar todas as tabelas e seus dados
    const { data: animals, error: animalsError } = await supabase
      .from('animals')
      .select('*');

    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*');

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role, created_at');

    return res.status(200).json({
      message: 'Debug - Todos os dados do banco',
      data: {
        animals: {
          count: animals?.length || 0,
          data: animals || [],
          error: animalsError?.message || null
        },
        news: {
          count: news?.length || 0,
          data: news || [],
          error: newsError?.message || null
        },
        users: {
          count: users?.length || 0,
          data: users || [],
          error: usersError?.message || null
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar dados',
      error: error.message
    });
  }
}
