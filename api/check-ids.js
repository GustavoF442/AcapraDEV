import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Buscar animais com IDs específicos que vimos na imagem
    const { data: animalsById, error: animalsByIdError } = await supabase
      .from('animals')
      .select('*')
      .in('id', [14, 15, 16, 17, 18]); // IDs que vi na imagem

    // Buscar todos os animais ordenados por ID
    const { data: allAnimals, error: allAnimalsError } = await supabase
      .from('animals')
      .select('*')
      .order('id', { ascending: true });

    // Buscar últimos 10 animais
    const { data: lastAnimals, error: lastAnimalsError } = await supabase
      .from('animals')
      .select('*')
      .order('id', { ascending: false })
      .limit(10);

    // Contar total de registros
    const { count: totalCount, error: countError } = await supabase
      .from('animals')
      .select('*', { count: 'exact', head: true });

    return res.status(200).json({
      message: 'Verificação detalhada de IDs',
      data: {
        totalCount: totalCount,
        countError: countError?.message || null,
        animalsById: {
          data: animalsById || [],
          error: animalsByIdError?.message || null
        },
        allAnimals: {
          count: allAnimals?.length || 0,
          data: allAnimals || [],
          error: allAnimalsError?.message || null
        },
        lastAnimals: {
          data: lastAnimals || [],
          error: lastAnimalsError?.message || null
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao verificar IDs',
      error: error.message
    });
  }
}
