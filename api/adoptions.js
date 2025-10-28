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
      const { limit = 10, page = 1, status } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let query = supabase
        .from('adoptions')
        .select(`
          *,
          animal:animals(*),
          adopter:users(*)
        `, { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      query = query
        .range(offset, offset + parseInt(limit) - 1)
        .order('created_at', { ascending: false });

      const { data: adoptions, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalPages = Math.ceil(count / parseInt(limit));

      res.status(200).json({
        adoptions: adoptions || [],
        pagination: {
          page: parseInt(page),
          pages: totalPages,
          total: count,
          limit: parseInt(limit)
        }
      });

    } else if (req.method === 'POST') {
      const adoptionData = req.body;
      
      const { data: adoption, error } = await supabase
        .from('adoptions')
        .insert([adoptionData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        message: 'Solicitação de adoção criada com sucesso',
        adoption
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Adoptions API error:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
