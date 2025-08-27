const { Sequelize } = require('sequelize');
const path = require('path');

// Configuração do banco SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

// Testar conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao SQLite');
  } catch (error) {
    console.error('❌ Erro ao conectar ao SQLite:', error);
  }
};

module.exports = { sequelize, testConnection };
