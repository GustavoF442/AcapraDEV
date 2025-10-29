const express = require('express');
const { body, validationResult } = require('express-validator');
const { Donation, User } = require('../models');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const { Op } = require('sequelize');

const router = express.Router();

// Registrar doação (público ou admin)
router.post('/', [
  body('donorName').trim().isLength({ min: 2 }).withMessage('Nome é obrigatório'),
  body('donorEmail').isEmail().withMessage('Email inválido'),
  body('donorPhone').optional().trim(),
  body('donorCPF').optional().trim().isLength({ min: 11, max: 14 }).withMessage('CPF inválido'),
  body('donationType').isIn(['dinheiro', 'ração', 'medicamentos', 'materiais', 'outros']).withMessage('Tipo de doação inválido'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Valor deve ser positivo'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Se autenticado, registrar quem criou
    const donationData = {
      ...req.body,
      registeredBy: req.user ? req.user.id : null
    };

    const donation = await Donation.create(donationData);

    // Enviar email de confirmação para o doador
    try {
      await sendEmail(
        donation.donorEmail,
        'donationConfirmation',
        {
          donorName: donation.donorName,
          donationType: donation.donationType,
          amount: donation.amount,
          description: donation.description
        }
      );
    } catch (emailError) {
      console.error('Erro ao enviar email de confirmação:', emailError);
    }

    // Enviar email para ACAPRA notificando a nova doação
    try {
      await sendEmail(
        process.env.EMAIL_USER,
        'donationConfirmation',
        {
          donorName: donation.donorName,
          donationType: donation.donationType,
          amount: donation.amount,
          description: donation.description,
          donorEmail: donation.donorEmail,
          donorPhone: donation.donorPhone
        }
      );
    } catch (emailError) {
      console.error('Erro ao enviar email para ACAPRA:', emailError);
    }

    res.status(201).json({
      message: 'Doação registrada com sucesso! Obrigado pela sua contribuição.',
      donation: {
        id: donation.id,
        status: donation.status,
        createdAt: donation.createdAt
      }
    });
  } catch (error) {
    console.error('Erro ao registrar doação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar doações (admin/volunteer)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.donationType) where.donationType = req.query.donationType;
    
    // Filtro por período
    if (req.query.startDate || req.query.endDate) {
      where.donationDate = {};
      if (req.query.startDate) where.donationDate[Op.gte] = new Date(req.query.startDate);
      if (req.query.endDate) where.donationDate[Op.lte] = new Date(req.query.endDate);
    }

    const { count, rows } = await Donation.findAndCountAll({
      where,
      include: [
        { model: User, as: 'registrar', attributes: ['id', 'name'] }
      ],
      order: [['donationDate', 'DESC']],
      limit,
      offset
    });

    res.json({
      donations: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de doações (admin/volunteer)
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    
    if (startDate || endDate) {
      where.donationDate = {};
      if (startDate) where.donationDate[Op.gte] = new Date(startDate);
      if (endDate) where.donationDate[Op.lte] = new Date(endDate);
    }

    // Total de doações
    const totalDonations = await Donation.count({ where });

    // Total em dinheiro
    const moneyDonations = await Donation.sum('amount', {
      where: {
        ...where,
        donationType: 'dinheiro',
        status: ['confirmado', 'recebido']
      }
    });

    // Por tipo
    const donationsByType = await Donation.findAll({
      where,
      attributes: [
        'donationType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['donationType']
    });

    // Top doadores
    const topDonors = await Donation.findAll({
      where: {
        ...where,
        status: ['confirmado', 'recebido']
      },
      attributes: [
        'donorName',
        'donorEmail',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['donorName', 'donorEmail'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      limit: 10
    });

    res.json({
      totalDonations,
      totalAmount: moneyDonations || 0,
      byType: donationsByType,
      topDonors
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter doação por ID (admin/volunteer)
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        { model: User, as: 'registrar', attributes: ['id', 'name'] }
      ]
    });

    if (!donation) {
      return res.status(404).json({ message: 'Doação não encontrada' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Erro ao buscar doação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar doação (admin/volunteer)
router.patch('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Doação não encontrada' });
    }

    await donation.update(req.body);

    res.json({
      message: 'Doação atualizada com sucesso',
      donation
    });
  } catch (error) {
    console.error('Erro ao atualizar doação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar doação (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Apenas administradores podem deletar doações' });
    }

    const deleted = await Donation.destroy({ where: { id: req.params.id } });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Doação não encontrada' });
    }

    res.json({ message: 'Doação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar doação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
