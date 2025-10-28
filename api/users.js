import { supabase } from './_lib/supabase.js';
import bcrypt from 'bcryptjs';

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
      const { limit = 10, page = 1 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { data: users, error, count } = await supabase
        .from('users')
        .select('id, name, email, role, created_at, updated_at', { count: 'exact' })
        .range(offset, offset + parseInt(limit) - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const totalPages = Math.ceil(count / parseInt(limit));

      res.status(200).json({
        users: users || [],
        pagination: {
          page: parseInt(page),
          pages: totalPages,
          total: count,
          limit: parseInt(limit)
        }
      });

    } else if (req.method === 'POST') {
      const { password, ...userData } = req.body;
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { data: user, error } = await supabase
        .from('users')
        .insert([{ ...userData, password: hashedPassword }])
        .select('id, name, email, role, created_at, updated_at')
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
