const { Sequelize } = require('sequelize');

// Extrair database name da URL do Supabase
const extractDbName = (url) => {
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match ? match[1] : 'postgres';
};

// Configuração do banco PostgreSQL (Supabase)
// Supabase tem dois tipos de conexão:
// 1. Direct Connection: db.<project>.supabase.co:5432 com user "postgres"
// 2. Connection Pooling: pooler.supabase.com:6543 com user "postgres.<project>"
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'db.jjedtjerraejimhnudph.supabase.co',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
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
    console.log('✅ Conectado ao PostgreSQL (Supabase)');
  } catch (error) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', error);
    throw error;
  }
};

module.exports = { sequelize, testConnection };
