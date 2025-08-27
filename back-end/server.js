require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');   // UMA vez só
const fs = require('fs');       // UMA vez só

const app = express();

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Garantir pastas de upload (na raiz do projeto)
const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };
const UPLOADS_ROOT = path.resolve(__dirname, 'uploads');
ensureDir(UPLOADS_ROOT);
ensureDir(path.join(UPLOADS_ROOT, 'animals'));
ensureDir(path.join(UPLOADS_ROOT, 'news'));

// Servir /uploads como estático (uma vez só)
app.use('/uploads', express.static(UPLOADS_ROOT));

// Conectar ao SQLite e sincronizar modelos
const { sequelize, testConnection } = require('./config/database');
require('./models'); // garante que os models são carregados

const initDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ force: false });
    console.log('✅ Banco SQLite sincronizado');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});