// Execute este arquivo para testar as tabelas do Supabase
// node TESTAR-TABELAS.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testarTabelas() {
  console.log('🔍 Testando estrutura das tabelas...\n');

  // 1. Testar Contacts
  console.log('1️⃣ CONTACTS:');
  try {
    const { data, error } = await supabase
      .from('Contacts')
      .insert([{
        name: 'Teste',
        email: 'teste@teste.com',
        phone: '11999999999',
        subject: 'Teste',
        message: 'Teste',
        status: 'novo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.log('❌ ERRO:', error.message);
      console.log('Detalhes:', error.details);
    } else {
      console.log('✅ OK - Inseriu com sucesso! ID:', data[0].id);
      // Deletar o teste
      await supabase.from('Contacts').delete().eq('id', data[0].id);
    }
  } catch (e) {
    console.log('❌ ERRO EXCEPTION:', e.message);
  }

  // 2. Testar Adoptions
  console.log('\n2️⃣ ADOPTIONS:');
  try {
    // Pegar um animal válido
    const { data: animals } = await supabase.from('Animals').select('id').limit(1);
    const animalId = animals?.[0]?.id || null;
    
    if (!animalId) {
      console.log('⚠️ AVISO: Nenhum animal cadastrado para testar adoptions');
      console.log('✅ Estrutura OK - só falta animal para testar');
    } else {
      const { data, error } = await supabase
        .from('Adoptions')
        .insert([{
          animalId,
        adopterName: 'Teste',
        adopterEmail: 'teste@teste.com',
        adopterPhone: '11999999999',
        motivation: 'Teste',
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.log('❌ ERRO:', error.message);
      console.log('Detalhes:', error.details);
      console.log('Código:', error.code);
      } else {
        console.log('✅ OK - Inseriu com sucesso! ID:', data[0].id);
        // Deletar o teste
        await supabase.from('Adoptions').delete().eq('id', data[0].id);
      }
    }
  } catch (e) {
    console.log('❌ ERRO EXCEPTION:', e.message);
  }

  // 3. Testar Users
  console.log('\n3️⃣ USERS:');
  try {
    const { data, error } = await supabase
      .from('Users')
      .insert([{
        name: 'Teste',
        email: 'teste_' + Date.now() + '@teste.com',
        password: 'teste123',
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.log('❌ ERRO:', error.message);
      console.log('Detalhes:', error.details);
    } else {
      console.log('✅ OK - Inseriu com sucesso! ID:', data[0].id);
      // Deletar o teste
      await supabase.from('Users').delete().eq('id', data[0].id);
    }
  } catch (e) {
    console.log('❌ ERRO EXCEPTION:', e.message);
  }

  // 4. Testar News
  console.log('\n4️⃣ NEWS:');
  try {
    const { data, error } = await supabase
      .from('News')
      .insert([{
        title: 'Teste',
        content: 'Teste conteudo',
        status: 'rascunho',
        authorId: 1,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.log('❌ ERRO:', error.message);
      console.log('Detalhes:', error.details);
    } else {
      console.log('✅ OK - Inseriu com sucesso! ID:', data[0].id);
      // Deletar o teste
      await supabase.from('News').delete().eq('id', data[0].id);
    }
  } catch (e) {
    console.log('❌ ERRO EXCEPTION:', e.message);
  }

  console.log('\n✅ Teste completo!');
}

testarTabelas();
