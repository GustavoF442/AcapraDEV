require('dotenv').config();
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function testAdmin() {
  try {
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao SQLite');

    // Sincronizar tabelas
    await sequelize.sync();
    console.log('✅ Tabelas sincronizadas');

    // Remover admin existente
    await User.destroy({ where: { email: 'admin@acapra.org' } });
    console.log('🗑️ Admin anterior removido');

    // Criar admin
    const admin = await User.create({
      name: 'Administrador ACAPRA',
      email: 'admin@acapra.org',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin criado:', admin.email);

    // Testar senha
    const testUser = await User.findOne({ where: { email: 'admin@acapra.org' } });
    const isValid = await testUser.comparePassword('admin123');
    console.log('🧪 Teste senha:', isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA');

    console.log('\n🎯 CREDENCIAIS:');
    console.log('📧 Email: admin@acapra.org');
    console.log('🔑 Senha: admin123');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await sequelize.close();
  }
}

testAdmin();
