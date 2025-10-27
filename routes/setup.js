const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Rota para criar primeiro admin (apenas se não existir nenhum)
router.post('/create-admin', async (req, res) => {
  try {
    // Verificar se já existe algum admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ 
        message: 'Já existe um administrador cadastrado',
        admin: {
          name: existingAdmin.name,
          email: existingAdmin.email
        }
      });
    }

    // Verificar se já existe algum usuário
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ 
        message: 'Sistema já foi inicializado' 
      });
    }

    // Criar admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      name: 'Administrador ACAPRA',
      email: 'admin@acapra.org',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    res.json({
      message: 'Administrador criado com sucesso!',
      credentials: {
        email: 'admin@acapra.org',
        password: 'admin123'
      },
      warning: 'Altere a senha após o primeiro login!'
    });

  } catch (error) {
    console.error('Erro ao criar admin:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});

// Rota para verificar se existe admin
router.get('/check-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    const userCount = await User.countDocuments();
    
    res.json({
      hasAdmin: !!adminExists,
      totalUsers: userCount,
      needsSetup: userCount === 0
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao verificar administrador',
      error: error.message 
    });
  }
});

module.exports = router;
