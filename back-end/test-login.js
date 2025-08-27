const { sequelize } = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function testLogin() {
  try {
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao SQLite');
    
    // Buscar usuário admin
    const user = await User.findOne({ where: { email: 'admin@acapra.org' } });
    
    if (!user) {
      console.log('❌ Usuário admin não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', user.email);
    console.log('🔑 Role:', user.role);
    
    // Testar senha
    const testPassword = 'admin123';
    console.log('🧪 Testando senha:', testPassword);
    
    // Método 1: Usando o método do modelo
    try {
      const isMatch1 = await user.comparePassword(testPassword);
      console.log('📝 Método modelo:', isMatch1);
    } catch (error) {
      console.log('❌ Erro método modelo:', error.message);
    }
    
    // Método 2: Comparação direta
    try {
      const isMatch2 = await bcrypt.compare(testPassword, user.password);
      console.log('🔐 Comparação direta:', isMatch2);
    } catch (error) {
      console.log('❌ Erro comparação direta:', error.message);
    }
    
    // Se não funcionar, vamos recriar o usuário
    if (!await bcrypt.compare(testPassword, user.password)) {
      console.log('🔄 Recriando usuário admin...');
      
      const newPassword = await bcrypt.hash(testPassword, 10);
      await user.update({ password: newPassword });
      
      console.log('✅ Senha atualizada');
      
      // Testar novamente
      const finalTest = await bcrypt.compare(testPassword, user.password);
      console.log('🎯 Teste final:', finalTest);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
}

testLogin();
