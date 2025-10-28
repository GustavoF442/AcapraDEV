require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { supabase, testConnection } = require('./_lib/supabase');

const app = express();

// Middlewares básicos
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check com teste do Supabase
app.get('/api/health', async (_req, res) => {
  try {
    const supabaseConnected = await testConnection();
    res.json({ 
      message: 'API da ACAPRA funcionando!', 
      timestamp: new Date(),
      status: 'ok',
      supabase: supabaseConnected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro no health check',
      error: error.message,
      supabase: 'error'
    });
  }
});

// Rota de teste
app.get('/api/test', (_req, res) => {
  res.json({ 
    message: 'Teste da API funcionando!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota para stats conectada ao Supabase
app.get('/api/stats', async (_req, res) => {
  try {
    // Buscar estatísticas reais do Supabase
    const [animalsCount, adoptionsCount, newsCount] = await Promise.all([
      supabase.from('animals').select('*', { count: 'exact', head: true }),
      supabase.from('adoptions').select('*', { count: 'exact', head: true }),
      supabase.from('news').select('*', { count: 'exact', head: true })
    ]);

    res.json({
      summary: {
        totalAnimals: animalsCount.count || 0,
        adoptedAnimals: adoptionsCount.count || 0,
        pendingAdoptions: 0, // Calcular baseado no status
        totalNews: newsCount.count || 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    // Fallback para dados mock em caso de erro
    res.json({
      summary: {
        totalAnimals: 0,
        adoptedAnimals: 0,
        pendingAdoptions: 0,
        totalNews: 0
      },
      error: 'Dados temporários - erro na conexão com banco'
    });
  }
});

// Rota para animais conectada ao Supabase
app.get('/api/animals', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { data: animals, error, count } = await supabase
      .from('animals')
      .select('*', { count: 'exact' })
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / limit);

    res.json({
      animals: animals || [],
      pagination: {
        page,
        pages: totalPages,
        total: count || 0,
        limit
      }
    });
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.json({
      animals: [],
      pagination: {
        page: 1,
        pages: 1,
        total: 0
      },
      error: 'Erro ao carregar animais'
    });
  }
});

// Rota para notícias conectada ao Supabase
app.get('/api/news', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const { data: news, error, count } = await supabase
      .from('news')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / limit);

    res.json({
      news: news || [],
      pagination: {
        page,
        pages: totalPages,
        total: count || 0,
        limit
      }
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.json({
      news: [],
      pagination: {
        page: 1,
        pages: 1,
        total: 0
      },
      error: 'Erro ao carregar notícias'
    });
  }
});

// Handler de erro
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: err.message
  });
});

// Catch all para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

module.exports = app;
