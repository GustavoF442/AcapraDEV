import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { limit = 10, page = 1, species, status, search } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let query = supabase
        .from('animals')
        .select(`
          *,
          photos:animal_photos(*)
        `, { count: 'exact' });

      // Filtros
      if (species) {
        query = query.eq('species', species);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Paginação
      query = query
        .range(offset, offset + parseInt(limit) - 1)
        .order('created_at', { ascending: false });

      const { data: animals, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalPages = Math.ceil(count / parseInt(limit));

      res.status(200).json({
        animals: animals || [],
        pagination: {
          page: parseInt(page),
          pages: totalPages,
          total: count,
          limit: parseInt(limit)
        }
      });

    } else if (req.method === 'POST') {
      const animalData = req.body;
      
      const { data: animal, error } = await supabase
        .from('animals')
        .insert([animalData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        message: 'Animal criado com sucesso',
        animal
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Animals API error:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
