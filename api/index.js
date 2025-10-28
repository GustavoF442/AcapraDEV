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
  origin: true, // Permitir qualquer origem em produção para Vercel
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar ao PostgreSQL (Supabase) e sincronizar modelos
const { sequelize, testConnection } = require('../config/database');
require('../models'); // garante que os models são carregados

const initDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true }); // alter: true para atualizar tabelas existentes
    console.log('✅ Banco conectado e sincronizado');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error.message);
  }
};

// Inicializar banco
initDatabase();

// Rotas
app.use('/api/auth', require('../routes/auth'));
app.use('/api/animals', require('../routes/animals'));
app.use('/api/adoptions', require('../routes/adoptions'));
app.use('/api/news', require('../routes/news'));
app.use('/api/contacts', require('../routes/contacts'));
app.use('/api/users', require('../routes/users'));
app.use('/api/stats', require('../routes/stats'));
app.use('/api/uploads', require('../routes/uploads'));

// Health
app.get('/api/health', (_req, res) => {
  res.json({ message: 'API da ACAPRA funcionando!', timestamp: new Date() });
});

// Handler de erro (depois das rotas)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Export para Vercel
module.exports = app;
