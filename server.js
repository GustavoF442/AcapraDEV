require('dotenv').config();

// Suprimir deprecation warnings de bibliotecas antigas
process.noDeprecation = true;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares básicos
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://acapradev.onrender.com', 'https://acapra-frontend.onrender.com', 'https://acapra-dev.vercel.app', 'https://acapra-platform.onrender.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Usar apenas Supabase client - sem Sequelize
const { createClient } = require('@supabase/supabase-js');

const initDatabase = async () => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('Variáveis SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias');
    }
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    // Teste simples de conexão
    const { data, error } = await supabase.from('animals').select('count', { count: 'exact', head: true });
    
    if (error) {
      throw new Error(`Erro ao conectar Supabase: ${error.message}`);
    }
    
    console.log('✅ Supabase conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar Supabase:', error.message);
    // Não sair do processo - continuar sem banco para debug
  }
};
initDatabase();

app.get('/api/placeholder/:w/:h', (req, res) => {
  const w = Number(req.params.w) || 400;
  const h = Number(req.params.h) || 300;
  res.redirect(`https://via.placeholder.com/${w}x${h}`);
});

// Rotas básicas - sem Sequelize
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API ACAPRA funcionando no Render!', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV 
  });
});

// Health
app.get('/api/health', (_req, res) => {
  res.json({ message: 'API da ACAPRA funcionando!', timestamp: new Date() });
});

// Servir arquivos estáticos do React (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  
  // Servir arquivos estáticos do build do React
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Todas as rotas não-API devem retornar o index.html do React
  app.get('*', (req, res) => {
    // Se a rota começar com /api, não interceptar
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint não encontrado' });
    }
    
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Handler de erro (depois das rotas)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Listen (para desenvolvimento e produção)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ACAPRA rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://0.0.0.0:${PORT}`);
});

// Export para Vercel (se necessário)
module.exports = app;