const express = require('express');
const { body, validationResult } = require('express-validator');
const { Adoption, Animal, User } = require('../models');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const { Op } = require('sequelize');

const router = express.Router();

// Criar solicitação de adoção (público)
router.post('/', [
  body('animalId').isInt().withMessage('ID do animal inválido'),
  body('adopterName').trim().isLength({ min: 2 }).withMessage('Nome é obrigatório'),
  body('adopterEmail').isEmail().withMessage('Email inválido'),
  body('adopterPhone').trim().isLength({ min: 10 }).withMessage('Telefone inválido'),
  body('motivation').trim().isLength({ min: 10 }).withMessage('Motivação deve ter pelo menos 10 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { animalId, ...adoptionData } = req.body;

    // Verificar se animal existe e está disponível
    const animal = await Animal.findByPk(animalId);
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    if (animal.status !== 'disponível') {
      return res.status(400).json({ message: 'Animal não está disponível para adoção' });
    }

    // Verificar se já existe solicitação pendente para este animal e email
    const existingAdoption = await Adoption.findOne({
      where: {
        animalId: animalId,
        adopterEmail: adoptionData.adopterEmail,
        status: { [Op.in]: ['pendente', 'em análise'] }
      }
    });

    if (existingAdoption) {
      return res.status(400).json({ message: 'Você já possui uma solicitação pendente para este animal' });
    }

    const adoption = await Adoption.create({
      animalId: animalId,
      ...adoptionData
    });

    // Enviar emails de confirmação e notificação
    try {
      // Email de confirmação para o adotante
      await sendEmail(
        adoptionData.adopterEmail,
        'adoptionConfirmation',
        {
          adopterName: adoptionData.adopterName,
          animalName: animal.name,
          adopterEmail: adoptionData.adopterEmail,
          adopterPhone: adoptionData.adopterPhone
        }
      );

      // Email de notificação para ACAPRA
      await sendEmail(
        process.env.EMAIL_USER,
        'adoptionReceived',
        {
          animalName: animal.name,
          animalId: animal.id,
          adopterName: adoptionData.adopterName,
          adopterEmail: adoptionData.adopterEmail,
          adopterPhone: adoptionData.adopterPhone,
          city: adoptionData.city,
          motivation: adoptionData.motivation
        }
      );
    } catch (emailError) {
      console.error('Erro ao enviar emails:', emailError);
      // Não falhar a requisição por erro de email
    }

    res.status(201).json({
      message: 'Solicitação de adoção enviada com sucesso! Entraremos em contato em breve.',
      adoption: {
        id: adoption.id,
        status: adoption.status,
        createdAt: adoption.createdAt
      }
    });
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar solicitações (admin/volunteer)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;

    const { count, rows } = await Adoption.findAndCountAll({
      where,
      include: [
        { model: Animal, as: 'animal', attributes: ['id', 'name', 'species', 'photos'] },
        { model: User, as: 'reviewer', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      adoptions: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter solicitação por ID (admin/volunteer)
router.get('/:id', auth, async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id, {
      include: [
        { model: Animal, as: 'animal' },
        { model: User, as: 'reviewer', attributes: ['id', 'name'] }
      ]
    });

    if (!adoption) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }

    res.json(adoption);
  } catch (error) {
    console.error('Erro ao buscar solicitação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar status da solicitação (admin/volunteer)
router.patch('/:id/status', auth, [
  body('status').isIn(['pendente', 'em análise', 'aprovado', 'rejeitado']).withMessage('Status inválido'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const adoption = await Adoption.findByPk(req.params.id, {
      include: [{ model: Animal, as: 'animal' }]
    });

    if (!adoption) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }

    await adoption.update({
      status,
      notes: notes || '',
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    });

    // Se aprovada, marcar animal como "em processo"
    if (status === 'aprovado') {
      await adoption.animal.update({ status: 'em processo' });
    }

    // Se rejeitada ou concluída, voltar animal para "disponível" (se não foi adotado)
    if (status === 'rejeitado') {
      await adoption.animal.update({ status: 'disponível' });
    }

    // Enviar email ao adotante notificando mudança de status
    try {
      await sendEmail(
        adoption.adopterEmail,
        'adoptionStatusUpdate',
        {
          adopterName: adoption.adopterName,
          animalName: adoption.animal.name,
          status: status,
          notes: notes || ''
        }
      );
    } catch (emailError) {
      console.error('Erro ao enviar email de atualização:', emailError);
    }

    res.json({
      message: 'Status atualizado com sucesso',
      adoption
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar solicitação (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Apenas administradores podem deletar solicitações' });
    }

    const deleted = await Adoption.destroy({ where: { id: req.params.id } });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }

    res.json({ message: 'Solicitação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar solicitação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
