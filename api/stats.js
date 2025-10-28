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

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(200).json({
      summary: {
        totalAnimals: 0,
        adoptedAnimals: 0,
        pendingAdoptions: 0,
        totalNews: 0
      },
      error: 'Dados temporários - erro na conexão com banco'
    });
  }
}
