import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Buscar TODOS os animais (sem filtro de status)
    const { data: allAnimals, error: animalsError } = await supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false });

    // Buscar TODAS as notícias (sem filtro de status)
    const { data: allNews, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    // Listar todas as tabelas disponíveis
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names');

    return res.status(200).json({
      message: 'Todos os dados sem filtros',
      data: {
        animals: {
          total: allAnimals?.length || 0,
          data: allAnimals || [],
          error: animalsError?.message || null
        },
        news: {
          total: allNews?.length || 0,
          data: allNews || [],
          error: newsError?.message || null
        },
        tables: {
          data: tables || [],
          error: tablesError?.message || null
        }
      },
      supabase_project: process.env.SUPABASE_URL
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar dados',
      error: error.message,
      supabase_project: process.env.SUPABASE_URL
    });
  }
}
