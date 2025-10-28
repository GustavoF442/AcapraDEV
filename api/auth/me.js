import { supabase } from '../_lib/supabase.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          message: 'Token não fornecido'
        });
      }

      const token = authHeader.substring(7);
      
      // Verificar JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'acapra-secret-key-2024');
      
      // Buscar usuário atualizado no banco
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at, updated_at')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        return res.status(401).json({
          message: 'Usuário não encontrado'
        });
      }

      res.status(200).json({
        user
      });

    } catch (error) {
      console.error('Auth verification error:', error);
      res.status(401).json({
        message: 'Token inválido'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
