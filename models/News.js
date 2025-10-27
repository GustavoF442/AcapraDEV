const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Imagem como JSON
  image: {
    type: DataTypes.JSON,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('rascunho', 'publicado', 'arquivado'),
    defaultValue: 'rascunho'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (news) => {
      if (news.title && !news.slug) {
        news.slug = news.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      if (news.status === 'publicado' && !news.publishedAt) {
        news.publishedAt = new Date();
      }
    },
    beforeUpdate: (news) => {
      if (news.changed('title') && !news.slug) {
        news.slug = news.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      if (news.status === 'publicado' && !news.publishedAt) {
        news.publishedAt = new Date();
      }
    }
  },
  indexes: [
    { fields: ['status', 'publishedAt'] },
    { fields: ['slug'] },
    { fields: ['authorId'] }
  ]
});

module.exports = News;
