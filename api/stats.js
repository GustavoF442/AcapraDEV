import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Buscar estatísticas do banco
      const [
        { count: totalAnimals },
        { count: adoptedAnimals },
        { count: pendingAdoptions },
        { count: totalNews }
      ] = await Promise.all([
        supabase.from('animals').select('*', { count: 'exact', head: true }),
        supabase.from('animals').select('*', { count: 'exact', head: true }).eq('status', 'Adotado'),
        supabase.from('adoptions').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase.from('news').select('*', { count: 'exact', head: true })
      ]);

      res.status(200).json({
        summary: {
          totalAnimals: totalAnimals || 0,
          adoptedAnimals: adoptedAnimals || 0,
          pendingAdoptions: pendingAdoptions || 0,
          totalNews: totalNews || 0
        }
      });

    } catch (error) {
      console.error('Stats API error:', error);
      res.status(500).json({
        message: 'Erro ao buscar estatísticas',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
