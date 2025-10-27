require('dotenv').config();
const { sequelize } = require('./config/database');
const { User, Animal, News } = require('./models');

async function setupDatabase() {
  try {
    console.log('🔧 Iniciando configuração do banco Supabase...');

    // Testar conexão
    await sequelize.authenticate();
    console.log('✅ Conectado ao Supabase PostgreSQL');

    // Sincronizar modelos (criar tabelas)
    await sequelize.sync({ force: false });
    console.log('✅ Tabelas sincronizadas');

    // Verificar se já existe admin
    const existingAdmin = await User.findOne({ where: { email: 'admin@acapra.org' } });
    
    if (!existingAdmin) {
      // Criar usuário admin
      const admin = await User.create({
        name: 'Administrador ACAPRA',
        email: 'admin@acapra.org',
        password: 'admin123', // Será hasheado automaticamente pelo hook do model
        role: 'admin'
      });
      console.log('✅ Usuário admin criado:', admin.email);
    } else {
      console.log('ℹ️ Usuário admin já existe');
    }

    // Criar alguns animais de exemplo (opcional)
    const animalCount = await Animal.count();
    if (animalCount === 0) {
      await Animal.bulkCreate([
        {
          name: 'Rex',
          species: 'Cão',
          breed: 'Vira-lata',
          age: 'Adulto',
          size: 'Médio',
          gender: 'Macho',
          description: 'Rex é um cachorro muito carinhoso e brincalhão, adora crianças!',
          city: 'São Paulo',
          state: 'SP',
          vaccinated: true,
          neutered: true,
          dewormed: true,
          specialNeeds: false,
          friendly: true,
          playful: true,
          calm: false,
          protective: true,
          social: true,
          independent: false,
          active: true,
          docile: true,
          status: 'disponível',
          featured: true,
          photos: [],
          createdBy: 1
        },
        {
          name: 'Mimi',
          species: 'Gato',
          breed: 'Siamês',
          age: 'Jovem',
          size: 'Pequeno',
          gender: 'Fêmea',
          description: 'Mimi é uma gatinha muito carinhosa e tranquila, perfeita para apartamento.',
          city: 'São Paulo',
          state: 'SP',
          vaccinated: true,
          neutered: true,
          dewormed: true,
          specialNeeds: false,
          friendly: true,
          playful: true,
          calm: true,
          protective: false,
          social: true,
          independent: true,
          active: false,
          docile: true,
          status: 'disponível',
          featured: true,
          photos: [],
          createdBy: 1
        }
      ]);
      console.log('✅ Animais de exemplo criados');
    } else {
      console.log('ℹ️ Animais já existem no banco');
    }

    console.log('\n✨ Configuração concluída com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('   Email: admin@acapra.org');
    console.log('   Senha: admin123');
    console.log('\n⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!\n');

  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
