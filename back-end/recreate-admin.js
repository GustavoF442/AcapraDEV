const { sequelize } = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function recreateAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao SQLite');
    
    // Deletar usuário admin existente
    await User.destroy({ where: { email: 'admin@acapra.org' } });
    console.log('🗑️ Admin anterior removido');
    
    // Hash da senha manualmente
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('🔐 Senha hasheada');
    
    // Criar novo admin
    const admin = await User.create({
      name: 'Administrador ACAPRA',
      email: 'admin@acapra.org',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin criado com ID:', admin.id);
    
    // Testar login
    const testUser = await User.findOne({ where: { email: 'admin@acapra.org' } });
    const isValid = await bcrypt.compare('admin123', testUser.password);
    
    console.log('🧪 Teste de login:', isValid ? '✅ SUCESSO' : '❌ FALHOU');
    console.log('📧 Email: admin@acapra.org');
    console.log('🔑 Senha: admin123');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await sequelize.close();
  }
}

recreateAdmin();
