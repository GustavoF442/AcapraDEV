const { sequelize } = require('../config/database');
const User = require('./User');
const Animal = require('./Animal');
const Adoption = require('./Adoption');
const News = require('./News');
const Contact = require('./Contact');
const Donation = require('./Donation');
const Event = require('./Event');

// Definir associações
User.hasMany(Animal, { foreignKey: 'createdBy', as: 'animals' });
Animal.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(News, { foreignKey: 'authorId', as: 'news' });
News.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Animal.hasMany(Adoption, { foreignKey: 'animalId', as: 'adoptions' });
Adoption.belongsTo(Animal, { foreignKey: 'animalId', as: 'animal' });

User.hasMany(Adoption, { foreignKey: 'reviewedBy', as: 'reviewedAdoptions' });
Adoption.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });

User.hasMany(Contact, { foreignKey: 'respondedBy', as: 'respondedContacts' });
Contact.belongsTo(User, { foreignKey: 'respondedBy', as: 'responder' });

// Doações
User.hasMany(Donation, { foreignKey: 'registeredBy', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'registeredBy', as: 'registrar' });

// Eventos
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  sequelize,
  User,
  Animal,
  Adoption,
  News,
  Contact,
  Donation,
  Event
};
