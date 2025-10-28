import { supabase, executeQuery } from '../_lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário no banco
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(401).json({
          message: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Credenciais inválidas'
        });
      }

      // Gerar JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'acapra-secret-key-2024',
        { expiresIn: '7d' }
      );

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Login realizado com sucesso',
        token,
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
