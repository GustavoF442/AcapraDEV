const { sequelize } = require('./config/database');
const models = require('./models');

async function recreateDatabase() {
  try {
    console.log('🗑️ Recriando banco de dados...');
    
    // Forçar recriação de todas as tabelas
    await sequelize.sync({ force: true });
    console.log('✅ Tabelas recriadas com sucesso');

    // Criar usuário admin
    const { User } = models;
    const adminUser = await User.create({
      name: 'Administrador ACAPRA',
      email: 'admin@acapra.org',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Usuário admin criado:', adminUser.email);

    // Criar animais com fotos
    const { Animal } = models;
    const animals = [
      {
        name: 'Branca',
        species: 'Cão',
        breed: 'SRD',
        age: 'Adulto',
        size: 'Médio',
        gender: 'Fêmea',
        description: 'Branca é uma cadela muito carinhosa e dócil. Adora brincar e é muito sociável com outros animais e pessoas.',
        city: 'São Paulo',
        state: 'SP',
        vaccinated: true,
        neutered: true,
        dewormed: true,
        specialNeeds: false,
        healthNotes: 'Saudável',
        friendly: true,
        playful: true,
        calm: true,
        protective: false,
        social: true,
        independent: false,
        active: true,
        docile: true,
        status: 'disponível',
        featured: true,
        photos: [
          {
            filename: 'branca_1.jpeg',
            originalName: 'WhatsApp Image 2025-03-17 at 08.05.09.jpeg',
            path: '/uploads/animals/branca_1.jpeg',
            mimetype: 'image/jpeg',
            size: 356396,
            isMain: true
          }
        ],
        createdBy: adminUser.id
      },
      {
        name: 'Cléo',
        species: 'Cão',
        breed: 'SRD',
        age: 'Jovem',
        size: 'Médio',
        gender: 'Fêmea',
        description: 'Cléo é uma cadela jovem e muito brincalhona. Adora correr e brincar, ideal para famílias ativas.',
        city: 'São Paulo',
        state: 'SP',
        vaccinated: true,
        neutered: false,
        dewormed: true,
        specialNeeds: false,
        healthNotes: 'Saudável, precisa castrar',
        friendly: true,
        playful: true,
        calm: false,
        protective: false,
        social: true,
        independent: false,
        active: true,
        docile: true,
        status: 'disponível',
        featured: true,
        photos: [
          {
            filename: 'cleo_1.jpeg',
            originalName: 'WhatsApp Image 2025-03-17 at 08.05.10.jpeg',
            path: '/uploads/animals/cleo_1.jpeg',
            mimetype: 'image/jpeg',
            size: 552040,
            isMain: true
          },
          {
            filename: 'cleo_2.jpeg',
            originalName: 'WhatsApp Image 2025-03-17 at 08.05.10 (1).jpeg',
            path: '/uploads/animals/cleo_2.jpeg',
            mimetype: 'image/jpeg',
            size: 1617456,
            isMain: false
          }
        ],
        createdBy: adminUser.id
      },
      {
        name: 'Glória',
        species: 'Cão',
        breed: 'SRD',
        age: 'Jovem',
        size: 'Médio',
        gender: 'Fêmea',
        description: 'Glória é irmã da Cléo, igualmente carinhosa e brincalhona. As duas podem ser adotadas juntas ou separadas.',
        city: 'São Paulo',
        state: 'SP',
        vaccinated: true,
        neutered: false,
        dewormed: true,
        specialNeeds: false,
        healthNotes: 'Saudável, precisa castrar',
        friendly: true,
        playful: true,
        calm: false,
        protective: false,
        social: true,
        independent: false,
        active: true,
        docile: true,
        status: 'disponível',
        featured: false,
        photos: [
          {
            filename: 'gloria_1.jpeg',
            originalName: 'WhatsApp Image 2025-03-17 at 08.05.10.jpeg',
            path: '/uploads/animals/gloria_1.jpeg',
            mimetype: 'image/jpeg',
            size: 552040,
            isMain: true
          }
        ],
        createdBy: adminUser.id
      },
      {
        name: 'Luma',
        species: 'Cão',
        breed: 'SRD',
        age: 'Adulto',
        size: 'Grande',
        gender: 'Fêmea',
        description: 'Luma é uma cadela adulta muito tranquila e carinhosa. Ideal para quem busca um companheiro calmo e fiel.',
        city: 'São Paulo',
        state: 'SP',
        vaccinated: true,
        neutered: true,
        dewormed: true,
        specialNeeds: false,
        healthNotes: 'Saudável',
        friendly: true,
        playful: false,
        calm: true,
        protective: true,
        social: true,
        independent: true,
        active: false,
        docile: true,
        status: 'disponível',
        featured: false,
        photos: [],
        createdBy: adminUser.id
      }
    ];

    for (const animalData of animals) {
      await Animal.create(animalData);
      console.log(`✅ ${animalData.name} criado(a) com sucesso`);
    }

    console.log('🎉 Banco de dados recriado com sucesso!');
    console.log('📧 Login: admin@acapra.org');
    console.log('🔑 Senha: admin123');

  } catch (error) {
    console.error('❌ Erro ao recriar banco:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

recreateDatabase();
