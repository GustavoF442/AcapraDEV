const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Informações básicas do evento
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Tipo de evento
  eventType: {
    type: DataTypes.ENUM('adocao', 'campanha', 'palestra', 'feira', 'arrecadacao', 'outro'),
    allowNull: false,
    defaultValue: 'outro'
  },
  // Data e hora
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  eventTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  // Local
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  // Mapa/coordenadas
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  // Capacidade
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Status do evento
  status: {
    type: DataTypes.ENUM('planejado', 'confirmado', 'em_andamento', 'concluido', 'cancelado'),
    defaultValue: 'planejado'
  },
  // Visibilidade
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Imagem/banner
  bannerUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Contato
  contactName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  // Notas internas
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Criado por
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['eventType'] },
    { fields: ['eventDate'] },
    { fields: ['isPublic'] }
  ]
});

module.exports = Event;
