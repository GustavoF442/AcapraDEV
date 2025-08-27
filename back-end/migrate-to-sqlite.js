// Script para migrar de MongoDB para SQLite
const fs = require('fs');
const path = require('path');

console.log(' Migrando para SQLite...');

// 1. Instalar dependências SQLite
const newDependencies = {
  "sqlite3": "^5.1.6",
  "sequelize": "^6.32.1"
};

// 2. Atualizar package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Remover MongoDB dependencies
delete packageJson.dependencies.mongoose;

// Adicionar SQLite dependencies
Object.assign(packageJson.dependencies, newDependencies);

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

console.log(' package.json atualizado');
console.log(' Execute: npm install');
console.log(' SQLite será muito mais simples e confiável!');

const { sequelize } = require('./config/database');
const { User, Animal, Adoption, News, Contact } = require('./models');
const bcrypt = require('bcryptjs');

// Script para criar dados iniciais no SQLite
async function setupInitialData() {
  try {
    console.log(' Configurando dados iniciais no SQLite...');
    
    // Sincronizar modelos
    await sequelize.sync({ force: true });
    console.log(' Banco SQLite sincronizado');
    
    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Administrador ACAPRA',
      email: 'admin@acapra.org',
      password: adminPassword,
      role: 'admin'
    });
    console.log(' Usuário admin criado');
    
    // Criar alguns animais de exemplo
    const animals = [
      {
        name: 'Buddy',
        species: 'Cão',
        breed: 'Labrador',
        age: 'Adulto',
        size: 'Grande',
        gender: 'Macho',
        description: 'Buddy é um cão muito carinhoso e brincalhão. Adora crianças e outros animais.',
        city: 'São Paulo',
        state: 'SP',
        vaccinated: true,
        neutered: true,
        dewormed: true,
        friendly: true,
        playful: true,
        social: true,
        status: 'disponível',
        createdBy: admin.id
      },
      {
        name: 'Luna',
        species: 'Gato',
        breed: 'Siamês',
        age: 'Jovem',
        size: 'Pequeno',
        gender: 'Fêmea',
        description: 'Luna é uma gatinha muito carinhosa e independente. Perfeita para apartamento.',
        city: 'São Paulo',
        state: 'SP',
        vaccinated: true,
        neutered: true,
        dewormed: true,
        calm: true,
        independent: true,
        docile: true,
        status: 'disponível',
        createdBy: admin.id
      },
      {
        name: 'Max',
        species: 'Cão',
        breed: 'Golden Retriever',
        age: 'Filhote',
        size: 'Grande',
        gender: 'Macho',
        description: 'Max é um filhote muito energético e inteligente. Precisa de uma família ativa.',
        city: 'Campinas',
        state: 'SP',
        vaccinated: true,
        neutered: false,
        dewormed: true,
        playful: true,
        active: true,
        friendly: true,
        status: 'disponível',
        createdBy: admin.id
      }
    ];
    
    for (const animalData of animals) {
      await Animal.create(animalData);
    }
    console.log(` ${animals.length} animais de exemplo criados`);
    
    // Criar uma notícia de exemplo
    await News.create({
      title: 'Bem-vindos à nova plataforma ACAPRA!',
      content: 'Estamos muito felizes em apresentar nossa nova plataforma digital. Agora você pode encontrar seu novo melhor amigo de forma mais fácil e rápida. Navegue pelos nossos animais disponíveis e encontre o companheiro perfeito para sua família.',
      excerpt: 'Nova plataforma digital da ACAPRA está no ar!',
      status: 'publicado',
      featured: true,
      publishedAt: new Date(),
      authorId: admin.id,
      slug: 'bem-vindos-nova-plataforma-acapra'
    });
    console.log(' Notícia de exemplo criada');
    
    console.log(' Configuração inicial concluída com sucesso!');
    console.log(' Login admin: admin@acapra.org');
    console.log(' Senha admin: admin123');
    
  } catch (error) {
    console.error(' Erro na configuração inicial:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar configuração
if (require.main === module) {
  setupInitialData();
}

module.exports = { setupInitialData };
