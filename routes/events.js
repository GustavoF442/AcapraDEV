const express = require('express');
const { body, validationResult } = require('express-validator');
const { Event, User } = require('../models');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const { Op } = require('sequelize');

const router = express.Router();

// Listar eventos (público - apenas eventos públicos; admin - todos)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    
    // Se não for admin, mostrar apenas eventos públicos
    if (!req.user || req.user.role !== 'admin') {
      where.isPublic = true;
    }

    if (req.query.status) where.status = req.query.status;
    if (req.query.eventType) where.eventType = req.query.eventType;
    
    // Filtro por período
    if (req.query.startDate || req.query.endDate) {
      where.eventDate = {};
      if (req.query.startDate) where.eventDate[Op.gte] = new Date(req.query.startDate);
      if (req.query.endDate) where.eventDate[Op.lte] = new Date(req.query.endDate);
    }

    // Mostrar apenas eventos futuros se solicitado
    if (req.query.upcoming === 'true') {
      where.eventDate = { [Op.gte]: new Date() };
      where.status = { [Op.notIn]: ['concluido', 'cancelado'] };
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ],
      order: [['eventDate', 'ASC']],
      limit,
      offset
    });

    res.json({
      events: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter evento por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ]
    });

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Se não for público e usuário não for admin, não mostrar
    if (!event.isPublic && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar evento (admin/volunteer)
router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Título deve ter pelo menos 3 caracteres'),
  body('eventType').isIn(['adocao', 'campanha', 'palestra', 'feira', 'arrecadacao', 'outro']).withMessage('Tipo de evento inválido'),
  body('eventDate').isISO8601().withMessage('Data inválida'),
  body('description').optional().trim(),
  body('location').optional().trim(),
  body('maxParticipants').optional().isInt({ min: 1 }).withMessage('Capacidade deve ser positiva')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user.id
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      message: 'Evento criado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar evento (admin/volunteer)
router.patch('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Apenas admin ou criador pode editar
    if (req.user.role !== 'admin' && event.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este evento' });
    }

    await event.update(req.body);

    res.json({
      message: 'Evento atualizado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar evento (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Apenas administradores podem deletar eventos' });
    }

    const deleted = await Event.destroy({ where: { id: req.params.id } });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.json({ message: 'Evento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Incrementar participantes (público)
router.post('/:id/participate', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Verificar se ainda há vagas
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: 'Evento lotado' });
    }

    await event.update({
      currentParticipants: event.currentParticipants + 1
    });

    res.json({
      message: 'Participação confirmada!',
      event
    });
  } catch (error) {
    console.error('Erro ao participar do evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Enviar lembrete de evento (admin only)
router.post('/:id/send-reminder', auth, [
  body('recipients').isArray().withMessage('Lista de destinatários é obrigatória'),
  body('recipients.*.email').isEmail().withMessage('Email inválido')
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Apenas administradores podem enviar lembretes' });
    }

    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    const { recipients } = req.body;
    const errors = [];
    const successes = [];

    for (const recipient of recipients) {
      try {
        await sendEmail(
          recipient.email,
          'eventReminder',
          {
            eventName: event.title,
            eventDate: new Date(event.eventDate).toLocaleDateString('pt-BR'),
            eventTime: event.eventTime || 'A definir',
            location: event.location || 'A definir',
            description: event.description
          }
        );
        successes.push(recipient.email);
      } catch (emailError) {
        console.error(`Erro ao enviar para ${recipient.email}:`, emailError);
        errors.push(recipient.email);
      }
    }

    res.json({
      message: 'Lembretes enviados',
      successes,
      errors
    });
  } catch (error) {
    console.error('Erro ao enviar lembretes:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
