const { Animal } = require('./models');
const path = require('path');
const fs = require('fs');

async function setupAnimalsWithPhotos() {
  try {
    console.log('🐕 Configurando animais com fotos reais...');

    // Limpar animais existentes
    await Animal.destroy({ where: {} });

    // Animais com fotos reais da pasta materiais
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
        createdBy: 1
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
        createdBy: 1
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
        createdBy: 1
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
        createdBy: 1
      }
    ];

    // Criar diretório de uploads se não existir
    const uploadsDir = path.join(__dirname, 'uploads', 'animals');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Copiar fotos dos materiais para uploads
    const materialsDir = path.join(__dirname, 'client', 'src', 'materiais', 'CACHORROS');
    
    // Copiar foto da Branca
    const brancaSource = path.join(materialsDir, 'BRANCA', 'WhatsApp Image 2025-03-17 at 08.05.09.jpeg');
    const brancaDest = path.join(uploadsDir, 'branca_1.jpeg');
    if (fs.existsSync(brancaSource)) {
      fs.copyFileSync(brancaSource, brancaDest);
      console.log('✅ Foto da Branca copiada');
    }

    // Copiar fotos da Cléo e Glória
    const cleoGloriaDir = path.join(materialsDir, 'CLÉO E GLÓRIA');
    const cleoSource1 = path.join(cleoGloriaDir, 'WhatsApp Image 2025-03-17 at 08.05.10.jpeg');
    const cleoSource2 = path.join(cleoGloriaDir, 'WhatsApp Image 2025-03-17 at 08.05.10 (1).jpeg');
    
    if (fs.existsSync(cleoSource1)) {
      fs.copyFileSync(cleoSource1, path.join(uploadsDir, 'cleo_1.jpeg'));
      fs.copyFileSync(cleoSource1, path.join(uploadsDir, 'gloria_1.jpeg'));
      console.log('✅ Fotos da Cléo e Glória copiadas');
    }
    
    if (fs.existsSync(cleoSource2)) {
      fs.copyFileSync(cleoSource2, path.join(uploadsDir, 'cleo_2.jpeg'));
      console.log('✅ Segunda foto da Cléo copiada');
    }

    // Criar animais no banco
    for (const animalData of animals) {
      await Animal.create(animalData);
      console.log(`✅ ${animalData.name} criado(a) com sucesso`);
    }

    console.log('🎉 Setup completo! Animais com fotos reais configurados.');
    
  } catch (error) {
    console.error('❌ Erro no setup:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupAnimalsWithPhotos().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = setupAnimalsWithPhotos;
