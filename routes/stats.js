const express = require('express');
const { Animal, Adoption, News, Contact } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const router = express.Router();

// Obter estatísticas públicas
router.get('/', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      availableAnimals,
      totalAdoptions,
      animalsInProcess,
      totalAnimals,
      adoptionsBySpeciesRows,
      animalsBySizeRows,
      adoptionsLastMonthsRows
    ] = await Promise.all([
      // Animais disponíveis
      Animal.count({ where: { status: 'disponível' } }),

      // Total de adoções (animais com status adotado)
      Animal.count({ where: { status: 'adotado' } }),

      // Animais em processo de adoção
      Animal.count({ where: { status: 'em processo' } }),

      // Total de animais cadastrados
      Animal.count(),

      // Adoções por espécie (contar animais adotados por espécie)
      Animal.findAll({
        where: { status: 'adotado' },
        attributes: ['species', [fn('COUNT', col('id')), 'count']],
        group: ['species']
      }),

      // Animais por porte (disponíveis)
      Animal.findAll({
        where: { status: 'disponível' },
        attributes: ['size', [fn('COUNT', col('id')), 'count']],
        group: ['size']
      }),

      // Adoções nos últimos 6 meses (usando Adoption.aprovado com reviewedAt)
      Adoption.findAll({
        where: {
          status: 'aprovado',
          reviewedAt: { [Op.gte]: sixMonthsAgo }
        },
        attributes: [
          [fn('EXTRACT', literal('YEAR FROM "reviewedAt"')), 'year'],
          [fn('EXTRACT', literal('MONTH FROM "reviewedAt"')), 'month'],
          [fn('COUNT', col('id')), 'count']
        ],
        group: [literal('EXTRACT(YEAR FROM "reviewedAt")'), literal('EXTRACT(MONTH FROM "reviewedAt")')],
        order: [[literal('EXTRACT(YEAR FROM "reviewedAt")'), 'ASC'], [literal('EXTRACT(MONTH FROM "reviewedAt")'), 'ASC']]
      })
    ]);

    // Estimativa de animais na rua (valor fictício para demonstração)
    const estimatedStreetAnimals = 15000;

    // Castrações realizadas (valor fictício)
    const totalCastrations = 2847;

    res.json({
      summary: {
        availableAnimals,
        totalAdoptions,
        animalsInProcess,
        totalAnimals,
        estimatedStreetAnimals,
        totalCastrations
      },
      charts: {
        adoptionsBySpecies: adoptionsBySpeciesRows.reduce((acc, row) => {
          acc[row.get('species')] = Number(row.get('count'));
          return acc;
        }, {}),
        animalsBySize: animalsBySizeRows.reduce((acc, row) => {
          acc[row.get('size')] = Number(row.get('count'));
          return acc;
        }, {}),
        adoptionsLastMonths: adoptionsLastMonthsRows.map(row => ({
          month: `${row.get('year')}-${String(row.get('month')).padStart(2, '0')}`,
          count: Number(row.get('count'))
        }))
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter estatísticas administrativas (admin/volunteer)
router.get('/admin', async (req, res) => {
  try {
    const [
      pendingAdoptions,
      adoptionsInReview,
      unreadContacts,
      publishedNews,
      draftNews,
      recentAdoptions,
      recentContacts,
      recentAnimals
    ] = await Promise.all([
      Adoption.count({ where: { status: 'pendente' } }),
      Adoption.count({ where: { status: 'em análise' } }),
      Contact.count({ where: { status: 'novo' } }),
      News.count({ where: { status: 'publicado' } }),
      News.count({ where: { status: 'rascunho' } }),
      Adoption.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: Animal, as: 'animal', attributes: ['id', 'name'] }]
      }),
      Contact.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'name', 'subject', 'createdAt', 'status']
      }),
      Animal.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'name', 'species', 'createdAt', 'status']
      })
    ]);

    res.json({
      dashboard: {
        pendingAdoptions,
        adoptionsInReview,
        unreadContacts,
        publishedNews,
        draftNews
      },
      recentActivity: {
        adoptions: recentAdoptions,
        contacts: recentContacts,
        animals: recentAnimals
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas admin:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
