const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Animal = sequelize.define('Animal', {
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
  species: {
    type: DataTypes.ENUM('Cão', 'Gato', 'Outro'),
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.ENUM('Filhote', 'Jovem', 'Adulto', 'Idoso'),
    allowNull: true
  },
  size: {
    type: DataTypes.ENUM('Pequeno', 'Médio', 'Grande'),
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Macho', 'Fêmea'),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: 'SP'
  },
  // Campos de saúde
  vaccinated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  neutered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dewormed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  specialNeeds: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  healthNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Campos de temperamento
  friendly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  playful: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  calm: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  protective: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  social: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  independent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  docile: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Fotos como JSON
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('disponível', 'em processo', 'adotado'),
    defaultValue: 'disponível'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
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
    { fields: ['species', 'status'] },
    { fields: ['city'] },
    { fields: ['status', 'createdAt'] }
  ]
});

module.exports = Animal;
