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
    ? ['https://acapra-frontend.onrender.com', 'https://acapra.onrender.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar ao PostgreSQL (Supabase) e sincronizar modelos
const { sequelize, testConnection } = require('./config/database');
require('./models'); // garante que os models são carregados

const initDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true }); // alter: true para atualizar tabelas existentes
    console.log('✅ Banco PostgreSQL sincronizado');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
    process.exit(1);
  }
};
initDatabase();

app.get('/api/placeholder/:w/:h', (req, res) => {
  const w = Number(req.params.w) || 400;
  const h = Number(req.params.h) || 300;
  res.redirect(`https://via.placeholder.com/${w}x${h}`);
});

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/animals', require('./routes/animals'));
app.use('/api/adoptions', require('./routes/adoptions'));
app.use('/api/news', require('./routes/news'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/setup', require('./routes/setup'));

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

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});