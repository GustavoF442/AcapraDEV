const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/acapra');
    console.log('✅ Conectado ao MongoDB');

    // Verificar se já existe um admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('❌ Já existe um usuário administrador:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Nome: ${existingAdmin.name}`);
      process.exit(0);
    }

    // Dados do admin
    const adminData = {
      name: 'Administrador ACAPRA',
      email: 'admin@acapra.org',
      password: 'admin123', // Será criptografada
      role: 'admin'
    };

    // Criptografar senha
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Criar usuário
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email: admin@acapra.org');
    console.log('🔑 Senha: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    console.log('🌐 Acesse: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin();
