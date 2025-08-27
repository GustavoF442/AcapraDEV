const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');

// Teste simples da rota de login
async function testLogin() {
  try {
    console.log('🧪 Testando rota de login...');
    
    const email = 'admin@acapra.org';
    const password = 'admin123';
    
    console.log('1. Buscando usuário...');
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', user.email);
    
    console.log('2. Testando comparePassword...');
    const isMatch = await user.comparePassword(password);
    console.log('✅ Senha válida:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Senha inválida');
      return;
    }
    
    console.log('3. Gerando token...');
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );
    
    console.log('✅ Token gerado:', token.substring(0, 20) + '...');
    
    console.log('4. Preparando resposta...');
    const response = {
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    
    console.log('✅ Login funcionando perfeitamente!');
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', password);
    
  } catch (error) {
    console.error('❌ Erro no teste de login:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLogin();
