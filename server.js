require('dotenv').config();

// Suprimir deprecation warnings de bibliotecas antigas
process.noDeprecation = true;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares básicos
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https:"],
      styleElem: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://jjedtjerraejimhnudph.supabase.co", "https:"],
      connectSrc: ["'self'", "https://jjedtjerraejimhnudph.supabase.co", "https:"]
    }
  }
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://acapradev.onrender.com', 'https://acapra-frontend.onrender.com', 'https://acapra-dev.vercel.app', 'https://acapra-platform.onrender.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Usar apenas Supabase client - sem Sequelize
const { createClient } = require('@supabase/supabase-js');

const initDatabase = async () => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('Variáveis SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias');
    }
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    // Teste simples de conexão
    const { data, error } = await supabase.from('animals').select('count', { count: 'exact', head: true });
    
    if (error) {
      throw new Error(`Erro ao conectar Supabase: ${error.message}`);
    }
    
    console.log('✅ Supabase conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar Supabase:', error.message);
    // Não sair do processo - continuar sem banco para debug
  }
};
initDatabase();

app.get('/api/placeholder/:w/:h', (req, res) => {
  const w = Number(req.params.w) || 400;
  const h = Number(req.params.h) || 300;
  res.redirect(`https://via.placeholder.com/${w}x${h}`);
});

// Rotas básicas - sem Sequelize
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API ACAPRA funcionando no Render!', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV 
  });
});

// Health
app.get('/api/health', (_req, res) => {
  res.json({ message: 'API da ACAPRA funcionando!', timestamp: new Date() });
});

// Debug endpoint para verificar arquivos estáticos
app.get('/api/debug', (_req, res) => {
  const path = require('path');
  const fs = require('fs');
  
  const buildPath = path.join(__dirname, 'client/build');
  const indexPath = path.join(buildPath, 'index.html');
  
  res.json({
    message: 'Debug info',
    environment: process.env.NODE_ENV,
    buildPathExists: fs.existsSync(buildPath),
    indexExists: fs.existsSync(indexPath),
    buildPath: buildPath,
    indexPath: indexPath,
    supabaseUrl: process.env.SUPABASE_URL ? 'Configurada' : 'FALTANDO',
    supabaseKey: process.env.SUPABASE_SERVICE_KEY ? 'Configurada' : 'FALTANDO',
    timestamp: new Date()
  });
});

// Endpoint específico para testar Supabase
app.get('/api/test-supabase', async (_req, res) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({
        error: 'Variáveis SUPABASE_URL ou SUPABASE_SERVICE_KEY não configuradas',
        supabaseUrl: !!process.env.SUPABASE_URL,
        supabaseKey: !!process.env.SUPABASE_SERVICE_KEY
      });
    }

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Teste simples de conexão
    const { data, error } = await supabase
      .from('animals')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({
        error: 'Erro na consulta Supabase',
        details: error.message,
        code: error.code
      });
    }

    res.json({
      message: 'Conexão Supabase OK!',
      supabaseUrl: process.env.SUPABASE_URL,
      timestamp: new Date()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao conectar Supabase',
      details: error.message,
      timestamp: new Date()
    });
  }
});

// Criar cliente Supabase global (reutilizar do topo do arquivo)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// API Routes - Animals
app.get('/api/animals', async (req, res) => {
  try {
    const { status = 'disponível', page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Animals')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar animais:', error);
      return res.status(500).json({
        error: 'Erro ao buscar animais',
        details: error.message
      });
    }

    res.json({
      animals: data || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Erro na API animals:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// API Route - Single Animal
app.get('/api/animals/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('Animals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Animal não encontrado' });
      }
      return res.status(500).json({
        error: 'Erro ao buscar animal',
        details: error.message
      });
    }

    res.json(data);

  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// API Route - News
app.get('/api/news', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('News')
      .select('*', { count: 'exact' })
      .eq('status', 'publicado')
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Erro ao buscar notícias:', error);
      return res.status(500).json({
        error: 'Erro ao buscar notícias',
        details: error.message
      });
    }

    res.json({
      news: data || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Erro na API news:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// API Route - Stats (para o frontend público)
app.get('/api/stats', async (req, res) => {
  try {
    const [animalsResult, adoptionsResult] = await Promise.all([
      supabase.from('Animals').select('status', { count: 'exact' }),
      supabase.from('Adoptions').select('status', { count: 'exact' })
    ]);

    res.json({
      total: animalsResult.count || 0,
      available: animalsResult.data?.filter(a => a.status === 'disponível').length || 0,
      adopted: animalsResult.data?.filter(a => a.status === 'adotado').length || 0,
      adoptions: adoptionsResult.count || 0
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      total: 0,
      available: 0,
      adopted: 0,
      adoptions: 0
    });
  }
});

// ========== ROTAS ADMINISTRATIVAS ==========

// Login Admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário no Supabase
    const { data: users, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (error || !users || users.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];

    // Verificar senha (assumindo que está hasheada com bcrypt)
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Rota para verificar usuário atual
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('Users')
      .select('id, name, email, role, status')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota alternativa para stats admin (compatibilidade)
app.get('/api/stats/admin', authenticateToken, async (req, res) => {
  try {
    const [animalsResult, adoptionsResult, contactsResult, newsResult] = await Promise.all([
      supabase.from('Animals').select('status', { count: 'exact' }),
      supabase.from('Adoptions').select('status', { count: 'exact' }),
      supabase.from('Contacts').select('status', { count: 'exact' }),
      supabase.from('News').select('status', { count: 'exact' })
    ]);

    res.json({
      animals: {
        total: animalsResult.count || 0,
        available: animalsResult.data?.filter(a => a.status === 'disponível').length || 0
      },
      adoptions: {
        total: adoptionsResult.count || 0,
        pending: adoptionsResult.data?.filter(a => a.status === 'pendente').length || 0
      },
      contacts: {
        total: contactsResult.count || 0,
        unread: contactsResult.data?.filter(c => c.status === 'novo').length || 0
      },
      news: {
        total: newsResult.count || 0,
        published: newsResult.data?.filter(n => n.status === 'publicado').length || 0
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Dashboard Stats (Admin)
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [animalsResult, adoptionsResult, contactsResult, newsResult] = await Promise.all([
      supabase.from('Animals').select('status', { count: 'exact' }),
      supabase.from('Adoptions').select('status', { count: 'exact' }),
      supabase.from('Contacts').select('status', { count: 'exact' }),
      supabase.from('News').select('status', { count: 'exact' })
    ]);

    res.json({
      animals: {
        total: animalsResult.count || 0,
        available: animalsResult.data?.filter(a => a.status === 'disponível').length || 0
      },
      adoptions: {
        total: adoptionsResult.count || 0,
        pending: adoptionsResult.data?.filter(a => a.status === 'pendente').length || 0
      },
      contacts: {
        total: contactsResult.count || 0,
        unread: contactsResult.data?.filter(c => c.status === 'novo').length || 0
      },
      news: {
        total: newsResult.count || 0,
        published: newsResult.data?.filter(n => n.status === 'publicado').length || 0
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar Animais (Admin)
app.get('/api/admin/animals', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Animals')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      animals: data || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Erro ao listar animais admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar Adoções (Admin)
app.get('/api/admin/adoptions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Adoptions')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      adoptions: data || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Erro ao listar adoções admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar Contatos (Admin)
app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Contacts')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      contacts: data || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Erro ao listar contatos admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Servir arquivos estáticos do React (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  
  // Servir arquivos estáticos do build do React
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Todas as rotas não-API devem retornar o index.html do React
  app.get('*', (req, res) => {
    // Se a rota começar com /api, não interceptar
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint não encontrado' });
    }
    
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Handler de erro (depois das rotas)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Listen (para desenvolvimento e produção)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ACAPRA rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://0.0.0.0:${PORT}`);
});

// Export para Vercel (se necessário)
module.exports = app;