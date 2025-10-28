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
        .from('contacts')
        .select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      query = query
        .range(offset, offset + parseInt(limit) - 1)
        .order('created_at', { ascending: false });

      const { data: contacts, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalPages = Math.ceil(count / parseInt(limit));

      res.status(200).json({
        contacts: contacts || [],
        pagination: {
          page: parseInt(page),
          pages: totalPages,
          total: count,
          limit: parseInt(limit)
        }
      });

    } else if (req.method === 'POST') {
      const contactData = req.body;
      
      const { data: contact, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        message: 'Contato enviado com sucesso',
        contact
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Contacts API error:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
