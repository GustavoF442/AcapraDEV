// routes/news.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { News, User } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../middleware/upload');
const { Op } = require('sequelize');

const router = express.Router();

// helpers
const mapStatus = (s) => {
  if (!s) return s;
  const v = String(s).toLowerCase();
  if (v === 'draft') return 'rascunho';
  if (v === 'published') return 'publicado';
  return s;
};
const parseTags = (v) => {
  if (!v) return undefined;
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map(t=>t.trim()).filter(Boolean);
  return String(v).split(',').map(t=>t.trim()).filter(Boolean);
};
const parseImageJson = (v) => { try { return v ? (typeof v==='string'? JSON.parse(v) : v) : undefined; } catch { return undefined; } };

// upload isolado
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Imagem não enviada' });
    
    const uploaded = await uploadToSupabase(req.file, 'news');
    
    return res.json({
      image: uploaded
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
  }
});

// admin list
router.get('/admin/all', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page||'1',10);
    const limit = parseInt(req.query.limit||'10',10);
    const offset = (page-1)*limit;
    const where = {};
    if (req.query.status) where.status = mapStatus(req.query.status);

    const { count, rows } = await News.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id','name'] }],
      order: [['createdAt','DESC']],
      limit, offset
    });

    res.json({ news: rows, pagination:{ page, limit, total: count, pages: Math.ceil(count/limit) }});
  } catch(e) {
    console.error('Erro ao listar notícias admin:', e);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// admin get by id
router.get('/admin/:id', auth, async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id','name'] }]
    });
    if (!news) return res.status(404).json({ message: 'Notícia não encontrada' });
    res.json(news);
  } catch(e) {
    console.error('Erro ao buscar notícia admin:', e);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// remover arquivo de imagem (opcional)
router.delete('/image', auth, async (req, res) => {
  try {
    const supabasePath = req.body?.supabasePath;
    if (!supabasePath) return res.status(400).json({ message: 'Caminho da imagem não informado' });
    
    await deleteFromSupabase(supabasePath);
    res.json({ message: 'Imagem removida' });
  } catch(e) {
    console.error('Erro ao remover imagem:', e);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// pública list
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page||'1',10);
    const limit = parseInt(req.query.limit||'6',10);
    const offset = (page-1)*limit;
    const where = { status: 'publicado' };

    if (req.query.tag) where.tags = { [Op.like]: '%"'+req.query.tag+'%"' };
    if (req.query.search) {
      const term = `%${req.query.search}%`;
      where[Op.or] = [
        { title:   { [Op.like]: term } },
        { content: { [Op.like]: term } },
        { excerpt: { [Op.like]: term } }
      ];
    }

    const { count, rows } = await News.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id','name'] }],
      attributes: { exclude: ['content'] },
      order: [['publishedAt','DESC'],['createdAt','DESC']],
      limit, offset
    });

    res.json({ news: rows, pagination:{ page, limit, total: count, pages: Math.ceil(count/limit) }});
  } catch(e) {
    console.error('Erro ao listar notícias:', e);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// pública by id
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id','name'] }]
    });
    if (!news || news.status !== 'publicado') return res.status(404).json({ message: 'Notícia não encontrada' });
    await news.update({ views: (news.views||0)+1 });
    res.json(news);
  } catch(e) {
    console.error('Erro ao buscar notícia:', e);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// criar
router.post(
  '/',
  auth,
  upload.single('image'),
  [
    body('title').trim().isLength({ min:5 }).withMessage('Título deve ter pelo menos 5 caracteres'),
    body('content').trim().isLength({ min:50 }).withMessage('Conteúdo deve ter pelo menos 50 caracteres'),
    body('excerpt').trim().isLength({ min:10, max:200 }).withMessage('Resumo deve ter entre 10 e 200 caracteres'),
    body('status').optional().customSanitizer(mapStatus).isIn(['rascunho','publicado']).withMessage('Status inválido'),
    body('tags').optional().customSanitizer(parseTags),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const newsData = {
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt,
        status: req.body.status || 'rascunho',
        tags: req.body.tags,
        authorId: req.user.id
      };

      if (req.file) {
        newsData.image = await uploadToSupabase(req.file, 'news');
      } else if (req.body.image) {
        const img = parseImageJson(req.body.image);
        if (img) newsData.image = img;
      }

      if (newsData.status === 'publicado') newsData.publishedAt = new Date();

      const news = await News.create(newsData);
      res.status(201).json({ message: 'Notícia criada com sucesso', news });
    } catch(e) {
      console.error('Erro ao criar notícia:', e);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
);

// atualizar
router.put(
  '/:id',
  auth,
  upload.single('image'),
  [
    body('status').optional().customSanitizer(mapStatus).isIn(['rascunho','publicado']).withMessage('Status inválido'),
    body('tags').optional().customSanitizer(parseTags),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const news = await News.findByPk(req.params.id);
      if (!news) return res.status(404).json({ message: 'Notícia não encontrada' });
      if (req.user.role !== 'admin' && news.authorId !== req.user.id) return res.status(403).json({ message: 'Sem permissão' });

      const updateData = { ...req.body };

      if (req.file) {
        // Deletar imagem antiga do Supabase
        if (news.image?.supabasePath) {
          await deleteFromSupabase(news.image.supabasePath);
        }
        updateData.image = await uploadToSupabase(req.file, 'news');
      } else if (updateData.image) {
        const img = parseImageJson(updateData.image);
        if (img) { updateData.image = img; } else { delete updateData.image; }
      }

      if (typeof updateData.status === 'string') {
        if (updateData.status === 'publicado' && news.status !== 'publicado') updateData.publishedAt = new Date();
        else if (updateData.status === 'rascunho') updateData.publishedAt = null;
      }

      await news.update(updateData);
      const updated = await News.findByPk(req.params.id, {
        include: [{ model: User, as: 'author', attributes: ['id','name'] }]
      });
      res.json({ message: 'Notícia atualizada com sucesso', news: updated });
    } catch(e) {
      console.error('Erro ao atualizar notícia:', e);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
);

// deletar
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'Notícia não encontrada' });
    
    // Deletar imagem do Supabase Storage
    if (news.image?.supabasePath) {
      await deleteFromSupabase(news.image.supabasePath);
    }
    
    await News.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Notícia removida com sucesso' });
  } catch(e) {
    console.error('Erro ao deletar notícia:', e);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
