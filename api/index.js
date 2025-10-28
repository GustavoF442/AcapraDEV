const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares básicos
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check simples
app.get('/api/health', (_req, res) => {
  res.json({ 
    message: 'API da ACAPRA funcionando!', 
    timestamp: new Date(),
    status: 'ok'
  });
});

// Rota de teste
app.get('/api/test', (_req, res) => {
  res.json({ 
    message: 'Teste da API funcionando!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota para stats (mock temporário)
app.get('/api/stats', (_req, res) => {
  res.json({
    summary: {
      totalAnimals: 0,
      adoptedAnimals: 0,
      pendingAdoptions: 0,
      totalNews: 0
    }
  });
});

// Rota para animais (mock temporário)
app.get('/api/animals', (_req, res) => {
  res.json({
    animals: [],
    pagination: {
      page: 1,
      pages: 1,
      total: 0
    }
  });
});

// Rota para notícias (mock temporário)
app.get('/api/news', (_req, res) => {
  res.json({
    news: [],
    pagination: {
      page: 1,
      pages: 1,
      total: 0
    }
  });
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
