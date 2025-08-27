const { sequelize } = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function fixAdmin() {
  try {
    await sequelize.authenticate();
    
    // Deletar usuário admin existente
    await User.destroy({ where: { email: 'admin@acapra.org' } });
    
    // Criar novo usuário admin com hash correto
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Administrador ACAPRA',
      email: 'admin@acapra.org',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin recriado com sucesso');
    console.log('📧 Email: admin@acapra.org');
    console.log('🔑 Senha: admin123');
    
    // Testar login
    const testUser = await User.findOne({ where: { email: 'admin@acapra.org' } });
    const isValid = await bcrypt.compare('admin123', testUser.password);
    console.log('🧪 Teste de senha:', isValid ? '✅ OK' : '❌ FALHOU');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixAdmin();
