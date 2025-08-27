const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Adoption = sequelize.define('Adoption', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  animalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Animals',
      key: 'id'
    }
  },
  // Dados do adotante
  adopterName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  adopterEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  adopterPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  adopterAge: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Endereço
  street: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Habitação
  housingType: {
    type: DataTypes.ENUM('casa', 'apartamento', 'chácara', 'outro'),
    allowNull: true
  },
  hasYard: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isRented: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allowsPets: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Família
  adults: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  children: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  childrenAges: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  hasOtherPets: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  otherPetsDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Motivação e disponibilidade
  motivation: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  timePerDay: {
    type: DataTypes.STRING,
    allowNull: true
  },
  workSchedule: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Veterinário
  hasVet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  vetName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vetContact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Status e revisão
  status: {
    type: DataTypes.ENUM('pendente', 'em análise', 'aprovado', 'rejeitado'),
    defaultValue: 'pendente'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['status', 'createdAt'] },
    { fields: ['animalId'] },
    { fields: ['adopterEmail'] }
  ]
});

module.exports = Adoption;
