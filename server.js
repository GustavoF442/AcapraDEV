require('dotenv').config();

// Suprimir deprecation warnings de bibliotecas antigas
process.noDeprecation = true;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Configuração do Multer - usar memoryStorage para Supabase
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function (req, file, cb) {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
  }
});

// Middlewares básicos
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https:", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:", "https://jjedtjerraejimhnudph.supabase.co", "https://acapradev.onrender.com"],
      mediaSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      objectSrc: ["'none'"],
      connectSrc: ["'self'", "https:", "wss:", "blob:", "data:", "https://jjedtjerraejimhnudph.supabase.co"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"],
      frameSrc: ["'self'", "https:"],
      formAction: ["'self'", "https:"]
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

// Servir arquivos de upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar apenas Supabase client - sem Sequelize
const { createClient } = require('@supabase/supabase-js');

// Helper para upload no Supabase Storage
const uploadImageToSupabase = async (file) => {
  const supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
  const filePath = `animals/${fileName}`;

  const { error } = await supabaseClient.storage
    .from('acapra-files')
    .upload(filePath, file.buffer, { contentType: file.mimetype });

  if (error) throw new Error('Erro ao fazer upload: ' + error.message);

  const { data: { publicUrl } } = supabaseClient.storage
    .from('acapra-files')
    .getPublicUrl(filePath);

  return {
    filename: fileName,
    originalname: file.originalname,
    url: publicUrl,
    path: publicUrl,
    size: file.size,
    supabasePath: filePath
  };
};

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
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count || 0) / limit)
      }
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
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count || 0) / limit)
      }
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

// ========== ROTAS PÚBLICAS ==========

// Contact - Enviar mensagem de contato (público)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    const { data, error } = await supabase
      .from('Contacts')
      .insert([{
        name,
        email,
        phone,
        subject,
        message,
        status: 'novo',
        createdAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar contato:', error);
      return res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }

    res.status(201).json({ 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      contact: data 
    });

  } catch (error) {
    console.error('Erro na API contact:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adoptions - Solicitar adoção (público)
app.post('/api/adoptions', async (req, res) => {
  try {
    const { 
      animalId, 
      adopter_name, 
      adopter_email, 
      adopter_phone, 
      adopter_address,
      adopter_city,
      adopter_state,
      adopter_zipcode,
      motivation,
      experience,
      housing_type,
      has_yard,
      other_pets,
      family_members,
      work_schedule,
      emergency_contact
    } = req.body;

    if (!animalId || !adopter_name || !adopter_email || !adopter_phone || !motivation) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    // Verificar se o animal existe e está disponível
    const { data: animal, error: animalError } = await supabase
      .from('Animals')
      .select('id, name, status')
      .eq('id', animalId)
      .single();

    if (animalError || !animal) {
      return res.status(404).json({ error: 'Animal não encontrado' });
    }

    if (animal.status !== 'disponível') {
      return res.status(400).json({ error: 'Este animal não está mais disponível para adoção' });
    }

    const { data, error } = await supabase
      .from('Adoptions')
      .insert([{
        animalId: parseInt(animalId),
        adopter_name,
        adopter_email,
        adopter_phone,
        adopter_address,
        adopter_city,
        adopter_state,
        adopter_zipcode,
        motivation,
        experience,
        housing_type,
        has_yard,
        other_pets,
        family_members,
        work_schedule,
        emergency_contact,
        status: 'pendente',
        createdAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar solicitação de adoção:', error);
      return res.status(500).json({ error: 'Erro ao enviar solicitação de adoção' });
    }

    res.status(201).json({ 
      message: 'Solicitação de adoção enviada com sucesso! Analisaremos seu pedido e entraremos em contato.',
      adoption: data 
    });

  } catch (error) {
    console.error('Erro na API adoptions:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
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
    const [animalsResult, adoptionsResult, contactsResult, newsResult, recentAnimalsResult, recentAdoptionsResult, recentContactsResult] = await Promise.all([
      supabase.from('Animals').select('status', { count: 'exact' }),
      supabase.from('Adoptions').select('status', { count: 'exact' }),
      supabase.from('Contacts').select('status', { count: 'exact' }),
      supabase.from('News').select('status', { count: 'exact' }),
      supabase.from('Animals').select('*').order('createdAt', { ascending: false }).limit(6),
      supabase.from('Adoptions').select('*, Animals(name)').order('createdAt', { ascending: false }).limit(5),
      supabase.from('Contacts').select('*').order('createdAt', { ascending: false }).limit(5)
    ]);

    res.json({
      dashboard: {
        pendingAdoptions: adoptionsResult.data?.filter(a => a.status === 'pendente').length || 0,
        adoptionsInReview: adoptionsResult.data?.filter(a => a.status === 'em análise').length || 0,
        unreadContacts: contactsResult.data?.filter(c => c.status === 'novo').length || 0,
        publishedNews: newsResult.data?.filter(n => n.status === 'publicado').length || 0
      },
      recentActivity: {
        animals: recentAnimalsResult.data || [],
        adoptions: recentAdoptionsResult.data || [],
        contacts: recentContactsResult.data || []
      },
      totals: {
        animals: animalsResult.count || 0,
        adoptions: adoptionsResult.count || 0,
        contacts: contactsResult.count || 0,
        news: newsResult.count || 0
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

// ========== ROTAS ADMINISTRATIVAS COMPLETAS ==========

// Users - Listar usuários
app.get('/api/users', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Users')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (role) query = query.eq('role', role);
    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      users: data || [],
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Users - Buscar usuário por ID
app.get('/api/users/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Users - Criar usuário
app.post('/api/users', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    // Hash da senha
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('Users')
      .insert([{
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'user',
        status: status || 'active',
        createdAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Users - Atualizar usuário
app.put('/api/users/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    const updateData = { name, email: email?.toLowerCase(), role, status };

    if (password) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase
      .from('Users')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Users - Alterar status
app.patch('/api/users/:id/status', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from('Users')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Status atualizado com sucesso', user: data });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Users - Deletar usuário
app.delete('/api/users/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Users')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Contacts - Listar contatos
app.get('/api/contact', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Contacts')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      contacts: data || [],
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar contatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Contacts - Responder contato
app.patch('/api/contact/:id/respond', authenticateToken, async (req, res) => {
  try {
    const { response } = req.body;

    const { data, error } = await supabase
      .from('Contacts')
      .update({ 
        status: 'respondido',
        response,
        respondedAt: new Date().toISOString(),
        respondedBy: req.user.id
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Resposta registrada com sucesso', contact: data });
  } catch (error) {
    console.error('Erro ao responder contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// News Admin - Listar todas as notícias (admin)
app.get('/api/news/admin/all', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('News')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      news: data || [],
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar notícias admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// News Admin - Buscar notícia por ID (admin)
app.get('/api/news/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('News')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar notícia admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// News - Criar notícia
app.post('/api/news', authenticateToken, async (req, res) => {
  try {
    const { title, content, excerpt, status, tags, image } = req.body;

    const { data, error } = await supabase
      .from('News')
      .insert([{
        title,
        content,
        excerpt,
        status: status || 'rascunho',
        tags: tags || [],
        image,
        authorId: req.user.id,
        createdAt: new Date().toISOString(),
        publishedAt: status === 'publicado' ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Notícia criada com sucesso', news: data });
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// News - Atualizar notícia
app.put('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, excerpt, status, tags, image } = req.body;
    const updateData = { title, content, excerpt, status, tags, image };

    if (status === 'publicado') {
      updateData.publishedAt = new Date().toISOString();
    } else if (status === 'rascunho') {
      updateData.publishedAt = null;
    }

    const { data, error } = await supabase
      .from('News')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Notícia atualizada com sucesso', news: data });
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// News - Deletar notícia
app.delete('/api/news/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('News')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Notícia removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar notícia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// News - Upload de imagem
app.post('/api/news/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Upload para Supabase Storage
    const uploadedImage = await uploadImageToSupabase(req.file);
    
    res.json({
      image: uploadedImage
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro no upload: ' + error.message });
  }
});

// Upload genérico de imagens (animals, news, etc)
app.post('/api/upload/:type', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Upload para Supabase Storage
    const uploadPromises = req.files.map(file => uploadImageToSupabase(file));
    const uploadedFiles = await Promise.all(uploadPromises);
    
    res.json({
      images: uploadedFiles
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro no upload: ' + error.message });
  }
});

// Remover imagem
app.delete('/api/upload/:type/:filename', authenticateToken, async (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', type, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Imagem removida com sucesso' });
    } else {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// News - Remover imagem (compatibilidade)
app.delete('/api/news/image', authenticateToken, async (req, res) => {
  try {
    res.json({ message: 'Imagem removida' });
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adoptions - Listar adoções
app.get('/api/adoptions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Adoptions')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      adoptions: data || [],
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar adoções:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adoptions - Atualizar status
app.patch('/api/adoptions/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from('Adoptions')
      .update({ 
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: req.user.id
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Status atualizado com sucesso', adoption: data });
  } catch (error) {
    console.error('Erro ao atualizar status adoção:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Animals - Criar animal
app.post('/api/animals', authenticateToken, upload.array('photos', 10), async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    console.log('Arquivos recebidos:', req.files);

    // Processar fotos e fazer upload para Supabase
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploadedPhoto = await uploadImageToSupabase(req.files[i]);
        photos.push({ ...uploadedPhoto, isMain: i === 0 });
      }
    }

    const animalData = {
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed || null,
      age: req.body.age || null,
      gender: req.body.gender || null,
      size: req.body.size || null,
      description: req.body.description || null,
      city: req.body.city || 'São Paulo', // Campo obrigatório
      state: req.body.state || 'SP', // Campo obrigatório  
      vaccinated: req.body.vaccinated === 'true',
      neutered: req.body.neutered === 'true',
      dewormed: req.body.dewormed === 'true',
      specialNeeds: req.body.specialNeeds === 'true',
      healthNotes: req.body.healthNotes || null,
      friendly: req.body.friendly === 'true',
      playful: req.body.playful === 'true',
      calm: req.body.calm === 'true',
      protective: req.body.protective === 'true',
      social: req.body.social === 'true',
      independent: req.body.independent === 'true',
      active: req.body.active === 'true',
      docile: req.body.docile === 'true',
      status: req.body.status || 'disponível',
      featured: req.body.featured === 'true',
      photos: photos,
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() // Campo obrigatório
    };

    console.log('Dados processados para inserção:', animalData);

    const { data, error } = await supabase
      .from('Animals')
      .insert([animalData])
      .select()
      .single();

    if (error) {
      console.error('Erro do Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Animal cadastrado com sucesso', animal: data });
  } catch (error) {
    console.error('Erro ao criar animal:', error);
    res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
  }
});

// Animals - Atualizar animal
app.put('/api/animals/:id', authenticateToken, upload.array('photos', 10), async (req, res) => {
  try {
    console.log('Atualizando animal ID:', req.params.id);
    console.log('Dados recebidos:', req.body);
    console.log('Arquivos recebidos:', req.files);

    // Processar novas fotos e fazer upload para Supabase
    const newPhotos = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploadedPhoto = await uploadImageToSupabase(req.files[i]);
        newPhotos.push({ ...uploadedPhoto, isMain: false });
      }
    }

    // Buscar dados atuais do animal para manter fotos existentes se necessário
    const { data: currentAnimal } = await supabase
      .from('Animals')
      .select('photos')
      .eq('id', req.params.id)
      .single();

    const existingPhotos = currentAnimal?.photos || [];
    const allPhotos = newPhotos.length > 0 ? newPhotos : existingPhotos;

    const animalData = {
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      age: req.body.age,
      gender: req.body.gender,
      size: req.body.size,
      description: req.body.description,
      city: req.body.city,
      state: req.body.state,
      vaccinated: req.body.vaccinated === 'true',
      neutered: req.body.neutered === 'true',
      dewormed: req.body.dewormed === 'true',
      specialNeeds: req.body.specialNeeds === 'true',
      healthNotes: req.body.healthNotes,
      friendly: req.body.friendly === 'true',
      playful: req.body.playful === 'true',
      calm: req.body.calm === 'true',
      protective: req.body.protective === 'true',
      social: req.body.social === 'true',
      independent: req.body.independent === 'true',
      active: req.body.active === 'true',
      docile: req.body.docile === 'true',
      status: req.body.status,
      featured: req.body.featured === 'true',
      photos: allPhotos,
      updatedAt: new Date().toISOString()
    };

    // Remover campos undefined
    Object.keys(animalData).forEach(key => {
      if (animalData[key] === undefined) {
        delete animalData[key];
      }
    });

    console.log('Dados processados para atualização:', animalData);

    const { data, error } = await supabase
      .from('Animals')
      .update(animalData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro do Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Animal atualizado com sucesso', animal: data });
  } catch (error) {
    console.error('Erro ao atualizar animal:', error);
    res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
  }
});

// Animals - Deletar animal
app.delete('/api/animals/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Animals')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Animal removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar animal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Animals - Marcar como adotado
app.patch('/api/animals/:id/adopt', authenticateToken, async (req, res) => {
  try {
    const { adopterName, adopterContact, adopterNotes } = req.body;

    const { data, error } = await supabase
      .from('Animals')
      .update({
        status: 'adotado',
        adoptedAt: new Date().toISOString(),
        adopterName,
        adopterContact,
        adopterNotes
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Animal marcado como adotado', animal: data });
  } catch (error) {
    console.error('Erro ao marcar adoção:', error);
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