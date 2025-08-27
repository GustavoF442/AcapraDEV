require('dotenv').config();
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao SQLite');
    
    // Deletar admin existente
    await User.destroy({ where: { email: 'admin@acapra.org' } });
    console.log('🗑️ Admin anterior removido (se existia)');
    
    // Criar novo admin (a senha será hasheada automaticamente pelo hook)
    const admin = await User.create({
      name: 'Administrador ACAPRA',
      email: 'admin@acapra.org',
      password: 'admin123', // Será hasheada pelo beforeCreate hook
      role: 'admin'
    });
    
    console.log('✅ Admin criado com sucesso!');
    console.log('📧 Email: admin@acapra.org');
    console.log('🔑 Senha: admin123');
    console.log('🆔 ID:', admin.id);
    
    // Testar login
    const testUser = await User.findOne({ where: { email: 'admin@acapra.org' } });
    const isValid = await testUser.comparePassword('admin123');
    console.log('🧪 Teste de senha:', isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexão fechada');
  }
}

createAdmin();
