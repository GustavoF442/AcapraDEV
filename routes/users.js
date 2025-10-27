const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const router = express.Router();

// GET /api/users - Listar usuários (apenas admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;
    
    const where = {};
    
    // Filtros
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (role) {
      where.role = role;
    }
    
    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;
    
    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /api/users/:id - Buscar usuário por ID (apenas admin)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /api/users - Criar usuário (apenas admin)
router.post('/', [
  auth,
  adminOnly,
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').isIn(['admin', 'moderator', 'volunteer', 'user']).withMessage('Role inválido'),
  body('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Status inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { name, email, password, role, status, phone, department, permissions } = req.body;

    // Verificar se email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Criar usuário
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Será hasheado pelo hook beforeCreate
      role,
      status: status || 'active',
      phone: phone?.trim() || null,
      department: department?.trim() || null,
      permissions: permissions || {},
      createdBy: req.user.id
    });

    // Retornar sem a senha
    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PUT /api/users/:id - Atualizar usuário (apenas admin)
router.put('/:id', [
  auth,
  adminOnly,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').optional().isIn(['admin', 'moderator', 'volunteer', 'user']).withMessage('Role inválido'),
  body('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Status inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { name, email, password, role, status, phone, department, permissions } = req.body;

    // Verificar se email já existe (se foi alterado)
    if (email && email.toLowerCase().trim() !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email: email.toLowerCase().trim(),
          id: { [Op.ne]: user.id }
        }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
    }

    // Preparar dados para atualização
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (department !== undefined) updateData.department = department?.trim() || null;
    if (permissions !== undefined) updateData.permissions = permissions;

    // Hash da nova senha se fornecida
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    // Retornar usuário atualizado sem a senha
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PATCH /api/users/:id/status - Alterar status do usuário (apenas admin)
router.patch('/:id/status', [
  auth,
  adminOnly,
  body('status').isIn(['active', 'inactive', 'pending']).withMessage('Status inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Status inválido',
        errors: errors.array()
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.update({ status: req.body.status });

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE /api/users/:id - Excluir usuário (apenas admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Não permitir excluir admin
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Não é possível excluir administradores' });
    }

    // Não permitir excluir a si mesmo
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Não é possível excluir seu próprio usuário' });
    }

    await user.destroy();

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
