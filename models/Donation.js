const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Dados do doador
  donorName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  donorEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  donorPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  donorCPF: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [11, 14] // CPF com ou sem formatação
    }
  },
  // Tipo de doação
  donationType: {
    type: DataTypes.ENUM('dinheiro', 'ração', 'medicamentos', 'materiais', 'outros'),
    allowNull: false,
    defaultValue: 'dinheiro'
  },
  // Valor (para doações em dinheiro)
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  // Descrição da doação
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Método de pagamento (para doações em dinheiro)
  paymentMethod: {
    type: DataTypes.ENUM('pix', 'boleto', 'cartao', 'transferencia', 'dinheiro', 'outro'),
    allowNull: true
  },
  // Status da doação
  status: {
    type: DataTypes.ENUM('pendente', 'confirmado', 'recebido', 'cancelado'),
    defaultValue: 'pendente'
  },
  // Data da doação
  donationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // Notas internas
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Recibo emitido?
  receiptIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  receiptNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Doação recorrente?
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurringFrequency: {
    type: DataTypes.ENUM('mensal', 'trimestral', 'semestral', 'anual'),
    allowNull: true
  },
  // Registro feito por
  registeredBy: {
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
    { fields: ['donationType'] },
    { fields: ['donationDate'] },
    { fields: ['donorEmail'] }
  ]
});

module.exports = Donation;
