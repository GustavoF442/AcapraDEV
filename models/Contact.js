const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.ENUM('novo', 'lido', 'respondido', 'arquivado'),
    defaultValue: 'novo'
  },
  priority: {
    type: DataTypes.ENUM('baixa', 'normal', 'alta', 'urgente'),
    defaultValue: 'normal'
  },
  category: {
    type: DataTypes.ENUM('geral', 'adocao', 'denuncia', 'doacao', 'voluntariado', 'outro'),
    defaultValue: 'geral'
  },
  respondedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['status', 'createdAt'] },
    { fields: ['category'] },
    { fields: ['email'] }
  ]
});

module.exports = Contact;
