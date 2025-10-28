require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

async function setupAdminUser() {
  try {
    console.log('🔧 Configurando usuário admin no Supabase...');

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('Variáveis SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias');
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Verificar se já existe admin
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@acapra.org')
      .limit(1);

    if (checkError) {
      console.error('Erro ao verificar usuários existentes:', checkError);
      // Continuar mesmo com erro, pode ser que a tabela não exista ainda
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('ℹ️ Usuário admin já existe:', existingUsers[0].email);
      console.log('📋 Credenciais de acesso:');
      console.log('   Email: admin@acapra.org');
      console.log('   Senha: admin123');
      return;
    }

    // Criar hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Criar usuário admin
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          name: 'Administrador ACAPRA',
          email: 'admin@acapra.org',
          password: hashedPassword,
          role: 'admin',
          status: 'active',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (createError) {
      console.error('❌ Erro ao criar usuário admin:', createError);
      
      // Se a tabela não existir, mostrar instruções
      if (createError.code === '42P01') {
        console.log('\n📋 A tabela "users" não existe no Supabase.');
        console.log('Execute este SQL no Supabase SQL Editor:');
        console.log(`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  status VARCHAR(50) DEFAULT 'active',
  phone VARCHAR(50),
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário admin
INSERT INTO users (name, email, password, role, status) VALUES 
('Administrador ACAPRA', 'admin@acapra.org', '${hashedPassword}', 'admin', 'active');
        `);
      }
      return;
    }

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('   Email: admin@acapra.org');
    console.log('   Senha: admin123');
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('❌ Erro ao configurar admin:', error.message);
  }
}

// Função para testar login
async function testLogin() {
  try {
    console.log('\n🧪 Testando login admin...');

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@acapra.org',
        password: 'admin123'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Login funcionando!');
      console.log('Token gerado:', result.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Erro no login:', result.error);
    }

  } catch (error) {
    console.log('⚠️ Não foi possível testar login (servidor pode não estar rodando)');
  }
}

// Executar setup
setupAdminUser().then(() => {
  console.log('\n✨ Setup concluído!');
  process.exit(0);
}).catch(console.error);
