const express = require('express');
const { body, validationResult } = require('express-validator');
const { Contact, User } = require('../models');
const { auth } = require('../middleware/auth');
const { sendSimpleEmail } = require('../services/emailService');
const { Op } = require('sequelize');

const router = express.Router();

// Enviar mensagem de contato (público)
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Assunto deve ter pelo menos 5 caracteres'),
  body('message').trim().isLength({ min: 10 }).withMessage('Mensagem deve ter pelo menos 10 caracteres'),
  body('phone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.create(req.body);

    // Enviar email para ACAPRA
    try {
      await sendSimpleEmail(
        process.env.EMAIL_USER,
        `Contato do Site - ${req.body.subject}`,
        `
          <h2>Nova Mensagem de Contato</h2>
          <p><strong>Nome:</strong> ${req.body.name}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          ${req.body.phone ? `<p><strong>Telefone:</strong> ${req.body.phone}</p>` : ''}
          <p><strong>Assunto:</strong> ${req.body.subject}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${req.body.message.replace(/\n/g, '<br>')}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        `,
        req.body.email
      );
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não falhar a requisição por erro de email
    }

    res.status(201).json({
      message: 'Mensagem enviada com sucesso! Retornaremos o contato em breve.'
    });
  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar mensagens de contato (admin/volunteer)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;

    const { count, rows } = await Contact.findAndCountAll({
      where,
      include: [{ model: User, as: 'responder', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      contacts: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar contatos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter contato por ID (admin/volunteer)
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id, {
      include: [{ model: User, as: 'responder', attributes: ['id', 'name'] }]
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    // Marcar como lido se ainda não foi
    if (contact.status === 'novo') {
      await contact.update({ status: 'lido' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Responder contato (admin/volunteer)
router.patch('/:id/respond', auth, [
  body('response').trim().isLength({ min: 10 }).withMessage('Resposta deve ter pelo menos 10 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { response } = req.body;

    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    await contact.update({
      status: 'respondido',
      response,
      respondedBy: req.user.id,
      respondedAt: new Date()
    });

    res.json({
      message: 'Resposta registrada com sucesso',
      contact
    });
  } catch (error) {
    console.error('Erro ao responder contato:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar contato (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Apenas administradores podem deletar contatos' });
    }

    const deleted = await Contact.destroy({ where: { id: req.params.id } });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    res.json({ message: 'Contato removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar contato:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
