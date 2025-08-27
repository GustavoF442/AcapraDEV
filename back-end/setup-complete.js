const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Animal = require('./models/Animal');
require('dotenv').config();

const setupComplete = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/acapra');
    console.log('✅ Conectado ao MongoDB');

    // 1. Criar usuário admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const admin = new User({
        name: 'Administrador ACAPRA',
        email: 'admin@acapra.org',
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Usuário admin criado!');
      console.log('📧 Email: admin@acapra.org');
      console.log('🔑 Senha: admin123');
    } else {
      console.log('✅ Admin já existe');
    }

    // 2. Criar animais de exemplo
    const animalCount = await Animal.countDocuments();
    if (animalCount === 0) {
      const sampleAnimals = [
        {
          name: 'Luna',
          species: 'Cão',
          breed: 'SRD',
          age: 'Jovem',
          size: 'Médio',
          gender: 'Fêmea',
          description: 'Luna é uma cadelinha muito carinhosa e brincalhona. Adora crianças e se dá bem com outros animais. Está procurando uma família que lhe dê muito amor e carinho.',
          location: {
            city: 'São Paulo',
            state: 'SP'
          },
          health: {
            vaccinated: true,
            neutered: true,
            dewormed: true,
            specialNeeds: false
          },
          temperament: {
            friendly: true,
            playful: true,
            calm: false,
            protective: false,
            social: true
          },
          status: 'disponível',
          photos: []
        },
        {
          name: 'Thor',
          species: 'Cão',
          breed: 'Labrador Mix',
          age: 'Adulto',
          size: 'Grande',
          gender: 'Macho',
          description: 'Thor é um cão grande e protetor, mas muito dócil com a família. Ideal para casas com quintal. É muito leal e companheiro.',
          location: {
            city: 'Santos',
            state: 'SP'
          },
          health: {
            vaccinated: true,
            neutered: true,
            dewormed: true,
            specialNeeds: false
          },
          temperament: {
            friendly: true,
            playful: false,
            calm: true,
            protective: true,
            social: true
          },
          status: 'disponível',
          photos: []
        },
        {
          name: 'Mimi',
          species: 'Gato',
          breed: 'SRD',
          age: 'Filhote',
          size: 'Pequeno',
          gender: 'Fêmea',
          description: 'Mimi é uma gatinha muito fofa e brincalhona. Adora brincar com bolinhas e dormir no sol. Perfeita para apartamentos.',
          location: {
            city: 'Campinas',
            state: 'SP'
          },
          health: {
            vaccinated: true,
            neutered: false,
            dewormed: true,
            specialNeeds: false
          },
          temperament: {
            friendly: true,
            playful: true,
            calm: false,
            protective: false,
            social: true
          },
          status: 'disponível',
          photos: []
        },
        {
          name: 'Bella',
          species: 'Cão',
          breed: 'Golden Retriever Mix',
          age: 'Idoso',
          size: 'Grande',
          gender: 'Fêmea',
          description: 'Bella é uma senhora muito carinhosa que merece passar seus anos dourados com muito amor. É calma e companheira.',
          location: {
            city: 'São Paulo',
            state: 'SP'
          },
          health: {
            vaccinated: true,
            neutered: true,
            dewormed: true,
            specialNeeds: true,
            notes: 'Precisa de medicação para artrite'
          },
          temperament: {
            friendly: true,
            playful: false,
            calm: true,
            protective: false,
            social: true
          },
          status: 'disponível',
          photos: []
        },
        {
          name: 'Simba',
          species: 'Gato',
          breed: 'Persa Mix',
          age: 'Adulto',
          size: 'Médio',
          gender: 'Macho',
          description: 'Simba é um gato independente mas carinhoso. Gosta de carinho mas também valoriza seu espaço. Ideal para pessoas calmas.',
          location: {
            city: 'Guarulhos',
            state: 'SP'
          },
          health: {
            vaccinated: true,
            neutered: true,
            dewormed: true,
            specialNeeds: false
          },
          temperament: {
            friendly: true,
            playful: false,
            calm: true,
            protective: false,
            social: false
          },
          status: 'disponível',
          photos: []
        }
      ];

      await Animal.insertMany(sampleAnimals);
      console.log('✅ Animais de exemplo criados!');
    } else {
      console.log('✅ Já existem animais no banco');
    }

    console.log('\n='.repeat(60));
    console.log('🎉 SETUP COMPLETO!');
    console.log('='.repeat(60));
    console.log('🌐 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:5000');
    console.log('👤 Admin: admin@acapra.org / admin123');
    console.log('📱 Animais cadastrados: ' + await Animal.countDocuments());
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Erro no setup:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

setupComplete();
