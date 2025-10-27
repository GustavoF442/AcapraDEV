const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

// Conectar ao SQLite e sincronizar modelos
const { sequelize, testConnection } = require('./config/database');
const models = require('./models');

// Inicializar banco de dados
const initDatabase = async () => {
  try {
    console.log('🔌 Conectando ao banco SQLite...');
    await testConnection();
    await sequelize.sync({ force: false });
    console.log('✅ Banco SQLite conectado e sincronizado');
  } catch (error) {
    console.error('❌ Erro ao conectar banco:', error.message);
    process.exit(1);
  }
};

// Middlewares de segurança
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/animals', require('./routes/animals'));
app.use('/api/adoptions', require('./routes/adoptions'));
app.use('/api/news', require('./routes/news'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/setup', require('./routes/setup'));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API da ACAPRA funcionando!', 
    timestamp: new Date(),
    status: 'OK'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err.stack);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    await initDatabase();
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor ACAPRA rodando na porta ${PORT}`);
      console.log(`📡 API disponível em: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend deve rodar em: http://localhost:3000`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Recebido SIGTERM, fechando servidor...');
      server.close(() => {
        console.log('✅ Servidor fechado');
        sequelize.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
