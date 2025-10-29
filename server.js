require('dotenv').config();

// Suprimir deprecation warnings de bibliotecas antigas
process.noDeprecation = true;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { sendEmail, sendSimpleEmail } = require('./services/emailService');

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
  res.json({ 
    message: 'API da ACAPRA funcionando!', 
    timestamp: new Date(),
    version: '2.0-debug',
    publicRoutesActive: true
  });
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

// Endpoint para testar envio de email
app.get('/api/test-email', async (req, res) => {
  try {
    const testEmail = req.query.email || 'teste@acapra.com';
    
    console.log('🧪 Testando envio de email...');
    console.log('Configurações:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM
    });

    // Verificar se tem Brevo API configurada (preferencial)
    const hasBrevoAPI = !!process.env.BREVO_API_KEY;
    
    // Ou se tem configuração SMTP tradicional
    const emailConfigured = !!(
      process.env.EMAIL_HOST && 
      process.env.EMAIL_PORT && 
      process.env.EMAIL_USER && 
      process.env.EMAIL_PASS &&
      process.env.EMAIL_FROM
    );

    if (!hasBrevoAPI && !emailConfigured) {
      return res.status(500).json({
        success: false,
        error: 'Configurações de email incompletas',
        config: {
          BREVO_API_KEY: !!process.env.BREVO_API_KEY,
          EMAIL_HOST: !!process.env.EMAIL_HOST,
          EMAIL_PORT: !!process.env.EMAIL_PORT,
          EMAIL_USER: !!process.env.EMAIL_USER,
          EMAIL_PASS: !!process.env.EMAIL_PASS,
          EMAIL_FROM: !!process.env.EMAIL_FROM
        }
      });
    }

    // Tentar enviar email de teste (com timeout curto)
    try {
      const emailResult = await Promise.race([
        sendSimpleEmail(
          testEmail,
          'Teste ACAPRA - Sistema de Email',
          '<h1>Email de Teste</h1><p>Se você recebeu este email, o sistema está funcionando!</p>',
          process.env.EMAIL_FROM
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de 5 segundos no envio de email')), 5000)
        )
      ]);

      res.json({
        success: true,
        message: 'Email enviado com sucesso!',
        to: testEmail,
        emailResult,
        timestamp: new Date()
      });
    } catch (emailError) {
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar email',
        details: emailError.message,
        config: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          user: process.env.EMAIL_USER?.substring(0, 5) + '***'
        },
        timestamp: new Date()
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro no teste de email',
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
    const { 
      status = 'disponível', 
      page = 1, 
      limit = 12,
      species,
      size,
      gender,
      age,
      city,
      state,
      search
    } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Animals')
      .select('*', { count: 'exact' })
      .eq('status', status);

    // Aplicar filtros opcionais
    if (species) query = query.eq('species', species);
    if (size) query = query.eq('size', size);
    if (gender) query = query.eq('gender', gender);
    if (age) query = query.eq('age', age);
    if (city) query = query.ilike('city', `%${city}%`);
    if (state) query = query.eq('state', state);
    
    // Busca por nome ou raça
    if (search) {
      query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query
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
        pages: Math.ceil((count || 0) / limit)
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

// News - Buscar notícia individual por ID (público)
app.get('/api/news/:id', async (req, res) => {
  console.log('🔵 PUBLIC NEWS DETAIL ROUTE HIT - ID:', req.params.id);
  
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('News')
      .select('*')
      .eq('id', id)
      .eq('status', 'publicado')
      .single();

    if (error || !data) {
      console.log('❌ News not found:', id);
      return res.status(404).json({ 
        error: 'Notícia não encontrada',
        message: 'A notícia solicitada não existe ou não está publicada'
      });
    }

    console.log('✅ News found:', data.title);
    res.json(data);

  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// News - Incrementar visualizações (público)
app.patch('/api/news/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar views atual
    const { data: newsData } = await supabase
      .from('News')
      .select('views')
      .eq('id', id)
      .single();

    if (newsData) {
      // Incrementar views
      await supabase
        .from('News')
        .update({ views: (newsData.views || 0) + 1 })
        .eq('id', id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao incrementar views:', error);
    res.status(500).json({ error: 'Erro ao incrementar visualizações' });
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar contato:', error);
      return res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }

    // Enviar emails (de forma assíncrona)
    setImmediate(async () => {
      try {
        // 1. Email de confirmação para quem enviou o contato
        await sendSimpleEmail(
          email,
          'Recebemos sua mensagem - ACAPRA',
          `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🐾 ACAPRA</h1>
                  <h2>Mensagem Recebida!</h2>
                </div>
                <div class="content">
                  <p>Olá <strong>${name}</strong>,</p>
                  
                  <p>Recebemos sua mensagem sobre "<strong>${subject}</strong>" e agradecemos pelo contato!</p>
                  
                  <p><strong>Resumo da sua mensagem:</strong></p>
                  <div style="background-color: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                  
                  <p>Nossa equipe analisará sua mensagem e retornaremos o mais breve possível através do email <strong>${email}</strong>${phone ? ` ou telefone <strong>${phone}</strong>` : ''}.</p>
                  
                  <p>Normalmente respondemos em até 48 horas úteis.</p>
                  
                  <p>Obrigado pelo interesse na ACAPRA!</p>
                  
                  <p>Atenciosamente,<br><strong>Equipe ACAPRA</strong></p>
                </div>
                <div class="footer">
                  <p>Este é um email automático de confirmação.</p>
                  <p>Para mais informações, visite nosso site.</p>
                </div>
              </div>
            </body>
            </html>
          `,
          process.env.EMAIL_FROM
        );
        console.log('✅ Email de confirmação enviado para o remetente');

        // 2. Email de notificação para ACAPRA
        await sendSimpleEmail(
          'acapratest@gmail.com',
          `Novo Contato do Site - ${subject}`,
          `
            <h2>Nova Mensagem de Contato</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
            <p><strong>Assunto:</strong> ${subject}</p>
            <p><strong>Mensagem:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          `,
          email
        );
        console.log('✅ Email de notificação de contato enviado para ACAPRA');
      } catch (emailError) {
        console.error('❌ Erro ao enviar emails de contato:', emailError);
      }
    });

    res.status(201).json({ 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      contact: data 
    });

  } catch (error) {
    console.error('Erro na API contact:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adoptions - Solicitar adoção (público) - SEM AUTENTICAÇÃO
app.post('/api/adoptions', async (req, res) => {
  console.log('🔵 PUBLIC ADOPTION ROUTE HIT - No auth required');
  console.log('Body:', Object.keys(req.body));
  console.log('Headers:', req.headers.authorization ? 'Has auth header' : 'No auth header');
  
  try {
    const { 
      animalId,
      adopterName,
      adopterEmail,
      adopterPhone,
      adopterCpf,
      adopterAddress,
      adopterCity,
      adopterState,
      housingType,
      hasYard,
      isRented,
      ownerConsent,
      hadPetsBefore,
      currentPets,
      petCareExperience,
      motivation,
      timeForPet,
      whoWillCare,
      hasVet,
      vetInfo,
      emergencyPlan
    } = req.body;

    if (!animalId || !adopterName || !adopterEmail || !adopterPhone || !motivation) {
      console.log('❌ Missing required fields');
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
        adopterName,
        adopterEmail,
        adopterPhone,
        adopterCpf: adopterCpf || null,
        adopterAddress: adopterAddress || null,
        adopterCity: adopterCity || null,
        adopterState: adopterState || null,
        housingType: housingType || null,
        hasYard: hasYard || false,
        isRented: isRented || false,
        ownerConsent: ownerConsent || false,
        hadPetsBefore: hadPetsBefore || false,
        currentPets: currentPets || null,
        petCareExperience: petCareExperience || null,
        motivation,
        timeForPet: timeForPet || null,
        whoWillCare: whoWillCare || null,
        hasVet: hasVet || false,
        vetInfo: vetInfo || null,
        emergencyPlan: emergencyPlan || null,
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar solicitação de adoção:', error);
      return res.status(500).json({ error: 'Erro ao enviar solicitação de adoção: ' + error.message });
    }

    // Enviar emails de confirmação (de forma assíncrona para não bloquear resposta)
    setImmediate(async () => {
      try {
        // Email de confirmação para o adotante
        await sendEmail(
          adopterEmail,
          'adoptionConfirmation',
          {
            adopterName: adopterName,
            animalName: animal.name,
            adopterEmail: adopterEmail,
            adopterPhone: adopterPhone
          }
        );
        console.log('✅ Email de confirmação enviado para o adotante');

        // Email de notificação para ACAPRA
        await sendEmail(
          process.env.EMAIL_USER,
          'adoptionReceived',
          {
            animalName: animal.name,
            animalId: animal.id,
            adopterName: adopterName,
            adopterEmail: adopterEmail,
            adopterPhone: adopterPhone,
            city: adopterCity,
            motivation: motivation
          }
        );
        console.log('✅ Email de notificação enviado para ACAPRA');
      } catch (emailError) {
        console.error('❌ Erro ao enviar emails de adoção:', emailError);
      }
    });

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
  console.log('🔒 Auth middleware triggered for:', req.method, req.path);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ No token provided for protected route:', req.path);
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Invalid token for:', req.path);
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    console.log('✅ Token valid for user:', user.id);
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
      supabase.from('Adoptions').select('*, animal:Animals(id, name, species)').order('createdAt', { ascending: false }).limit(5),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      .select(`
        *,
        animal:Animals(id, name, species, breed, age, size, photos, status)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Erro ao buscar adoções:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Adoções encontradas:', data?.length);
    
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

// Adoptions - Buscar por animal
app.get('/api/animals/:animalId/adoptions', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Adoptions')
      .select('*')
      .eq('animalId', req.params.animalId)
      .order('createdAt', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ adoptions: data || [] });
  } catch (error) {
    console.error('Erro ao buscar adoções do animal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adoptions - Atualizar status
app.patch('/api/adoptions/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Buscar adoção e animal relacionado
    const { data: adoption, error: fetchError } = await supabase
      .from('Adoptions')
      .select('*, animalId')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !adoption) {
      return res.status(404).json({ error: 'Adoção não encontrada' });
    }

    // Buscar informações do animal
    const { data: animal, error: animalError } = await supabase
      .from('Animals')
      .select('id, name, status')
      .eq('id', adoption.animalId)
      .single();

    if (animalError || !animal) {
      return res.status(404).json({ error: 'Animal não encontrado' });
    }

    // Atualizar status da adoção
    const { data, error } = await supabase
      .from('Adoptions')
      .update({ 
        status,
        notes: notes || adoption.notes,
        reviewedAt: new Date().toISOString(),
        reviewedBy: req.user.id
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Se aprovado, marcar animal como adotado
    if (status === 'aprovado') {
      const { error: updateAnimalError } = await supabase
        .from('Animals')
        .update({ 
          status: 'adotado',
          updatedAt: new Date().toISOString()
        })
        .eq('id', adoption.animalId);

      if (updateAnimalError) {
        console.error('❌ Erro ao atualizar status do animal:', updateAnimalError);
      } else {
        console.log(`✅ Animal ${animal.name} marcado como adotado`);
      }

      // Rejeitar outras adoções pendentes do mesmo animal
      await supabase
        .from('Adoptions')
        .update({ 
          status: 'rejeitado',
          notes: 'Animal já foi adotado por outro solicitante',
          reviewedAt: new Date().toISOString(),
          reviewedBy: req.user.id
        })
        .eq('animalId', adoption.animalId)
        .neq('id', req.params.id)
        .in('status', ['pendente', 'em análise']);
    }

    // Se rejeitado e animal estava "em processo", voltar para disponível
    if (status === 'rejeitado' && animal.status === 'em processo') {
      // Verificar se não há outras adoções aprovadas para este animal
      const { data: otherApprovals } = await supabase
        .from('Adoptions')
        .select('id')
        .eq('animalId', adoption.animalId)
        .eq('status', 'aprovado')
        .limit(1);

      if (!otherApprovals || otherApprovals.length === 0) {
        await supabase
          .from('Animals')
          .update({ 
            status: 'disponível',
            updatedAt: new Date().toISOString()
          })
          .eq('id', adoption.animalId);
        
        console.log(`✅ Animal ${animal.name} voltou para disponível`);
      }
    }

    // Enviar email ao adotante notificando mudança de status
    try {
      await sendEmail(
        adoption.adopterEmail,
        'adoptionStatusUpdate',
        {
          adopterName: adoption.adopterName,
          animalName: animal.name,
          status: status,
          notes: notes || ''
        }
      );
      console.log(`✅ Email de ${status} enviado para ${adoption.adopterEmail}`);
    } catch (emailError) {
      console.error('❌ Erro ao enviar email de atualização:', emailError);
      // Não falhar a requisição por erro de email
    }

    res.json({ 
      message: 'Status atualizado com sucesso', 
      adoption: data,
      animalUpdated: status === 'aprovado' ? 'Animal marcado como adotado' : null
    });
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
    const { adoptionId, adopterName, adopterEmail, adopterPhone } = req.body;

    // Se tem adoptionId, atualizar a adoption também
    if (adoptionId) {
      const { error: adoptionError } = await supabase
        .from('Adoptions')
        .update({
          status: 'aprovado',
          reviewedAt: new Date().toISOString(),
          reviewedBy: req.user.id
        })
        .eq('id', adoptionId);

      if (adoptionError) {
        console.error('Erro ao atualizar adoption:', adoptionError);
      }
    }

    const { data, error } = await supabase
      .from('Animals')
      .update({
        status: 'adotado',
        adoptedAt: new Date().toISOString(),
        adoptionId: adoptionId || null,
        adopterName: adopterName || null,
        adopterEmail: adopterEmail || null,
        adopterPhone: adopterPhone || null
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

// ========== ROTAS DE DOAÇÕES E FINANÇAS ==========

// Donations - Listar todas as doações (Admin)
app.get('/api/donations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Donations')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('donatedAt', { ascending: false });

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar doações:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      donations: data || [],
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Erro na API donations:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Donations - Criar nova doação
app.post('/api/donations', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .insert([{
        ...req.body,
        registeredBy: req.user?.id || null,
        donationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar doação:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Doação registrada com sucesso', donation: data });
  } catch (error) {
    console.error('Erro na API donations:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Donations - Atualizar doação
app.put('/api/donations/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .update({
        ...req.body,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar doação:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Doação atualizada com sucesso', donation: data });
  } catch (error) {
    console.error('Erro na API donations:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Donations - Deletar doação
app.delete('/api/donations/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Donations')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Doação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar doação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Financial Transactions - Listar transações
app.get('/api/financial-transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('FinancialTransactions')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('transactionDate', { ascending: false });

    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);
    if (startDate) query = query.gte('transactionDate', startDate);
    if (endDate) query = query.lte('transactionDate', endDate);

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar transações:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      transactions: data || [],
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Erro na API financial-transactions:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Financial Transactions - Criar transação
app.post('/api/financial-transactions', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('FinancialTransactions')
      .insert([{
        ...req.body,
        createdBy: req.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar transação:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Transação registrada com sucesso', transaction: data });
  } catch (error) {
    console.error('Erro na API financial-transactions:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Financial Transactions - Atualizar transação
app.put('/api/financial-transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('FinancialTransactions')
      .update({
        ...req.body,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar transação:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Transação atualizada com sucesso', transaction: data });
  } catch (error) {
    console.error('Erro na API financial-transactions:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Financial Transactions - Deletar transação
app.delete('/api/financial-transactions/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('FinancialTransactions')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Transação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Financial Stats - Resumo financeiro
app.get('/api/financial-stats', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let transactionsQuery = supabase.from('FinancialTransactions').select('type, amount');
    let donationsQuery = supabase.from('Donations').select('amount, status');

    if (startDate) {
      transactionsQuery = transactionsQuery.gte('transactionDate', startDate);
      donationsQuery = donationsQuery.gte('donatedAt', startDate);
    }
    if (endDate) {
      transactionsQuery = transactionsQuery.lte('transactionDate', endDate);
      donationsQuery = donationsQuery.lte('donatedAt', endDate);
    }

    const [transactionsResult, donationsResult] = await Promise.all([
      transactionsQuery,
      donationsQuery.eq('status', 'confirmado')
    ]);

    const transactions = transactionsResult.data || [];
    const donations = donationsResult.data || [];

    const receitas = transactions.filter(t => t.type === 'receita').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const despesas = transactions.filter(t => t.type === 'despesa').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const doacoes = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const saldo = receitas - despesas;

    res.json({
      receitas: receitas.toFixed(2),
      despesas: despesas.toFixed(2),
      doacoes: doacoes.toFixed(2),
      saldo: saldo.toFixed(2),
      totalTransacoes: transactions.length,
      totalDoacoes: donations.length
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas financeiras:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ========== ROTAS DE EVENTOS ==========

// Listar eventos (público - apenas eventos públicos; admin - todos)
app.get('/api/events', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, eventType, upcoming } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Events')
      .select('*', { count: 'exact' });

    // Filtros
    if (status) query = query.eq('status', status);
    if (eventType) query = query.eq('eventType', eventType);
    if (upcoming === 'true') {
      query = query.gte('eventDate', new Date().toISOString());
    }

    query = query
      .range(offset, offset + limit - 1)
      .order('eventDate', { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao listar eventos:', error);
      return res.status(500).json({ error: 'Erro ao buscar eventos' });
    }

    res.json({
      events: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Erro na API events:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter evento por ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar evento (autenticado)
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, eventType, eventDate, eventTime, location, maxParticipants, isPublic, status } = req.body;

    if (!title || !eventType || !eventDate) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const { data, error } = await supabase
      .from('Events')
      .insert([{
        title,
        description,
        eventType,
        eventDate,
        eventTime,
        location,
        maxParticipants: maxParticipants || null,
        currentParticipants: 0,
        isPublic: isPublic !== undefined ? isPublic : true,
        status: status || 'planejado',
        createdBy: req.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar evento:', error);
      return res.status(500).json({ error: 'Erro ao criar evento: ' + error.message });
    }

    res.status(201).json({
      message: 'Evento criado com sucesso',
      event: data
    });
  } catch (error) {
    console.error('Erro na API events:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar evento
app.patch('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Events')
      .update({
        ...req.body,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar evento:', error);
      return res.status(500).json({ error: 'Erro ao atualizar evento' });
    }

    res.json({
      message: 'Evento atualizado com sucesso',
      event: data
    });
  } catch (error) {
    console.error('Erro na API events:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar evento
app.delete('/api/events/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Events')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Evento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Enviar lembrete de evento
app.post('/api/events/:id/send-reminder', authenticateToken, async (req, res) => {
  try {
    const { data: event, error: eventError } = await supabase
      .from('Events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Enviar email de lembrete para o admin (você pode expandir para enviar para participantes registrados)
    setImmediate(async () => {
      try {
        await sendEmail(
          process.env.EMAIL_FROM,
          'eventReminder',
          {
            eventName: event.title,
            eventDate: new Date(event.eventDate).toLocaleDateString('pt-BR'),
            eventTime: event.eventTime,
            location: event.location,
            description: event.description
          }
        );
        console.log(`✅ Lembrete de evento enviado: ${event.title}`);
      } catch (emailError) {
        console.error('❌ Erro ao enviar lembrete de evento:', emailError);
      }
    });

    res.json({ message: 'Lembrete enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar lembrete:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ========== ROTAS DE DOAÇÕES ==========

// Registrar doação (público)
app.post('/api/donations', async (req, res) => {
  try {
    const { donorName, donorEmail, donorPhone, donorCPF, donationType, amount, description, paymentMethod } = req.body;

    if (!donorName || !donorEmail || !donationType) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const { data, error } = await supabase
      .from('Donations')
      .insert([{
        donorName,
        donorEmail,
        donorPhone,
        donorCPF,
        donationType,
        amount: amount || null,
        description,
        paymentMethod,
        status: 'pendente',
        donationDate: new Date().toISOString(),
        registeredBy: req.user ? req.user.id : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar doação:', error);
      return res.status(500).json({ error: 'Erro ao registrar doação: ' + error.message });
    }

    // Enviar email de confirmação
    try {
      await sendEmail(
        donorEmail,
        'donationConfirmation',
        {
          donorName,
          donationType,
          amount,
          description
        }
      );
      console.log('✅ Email de confirmação de doação enviado');
    } catch (emailError) {
      console.error('❌ Erro ao enviar email de doação:', emailError);
    }

    res.status(201).json({
      message: 'Doação registrada com sucesso! Obrigado pela sua contribuição.',
      donation: {
        id: data.id,
        status: data.status,
        createdAt: data.createdAt
      }
    });
  } catch (error) {
    console.error('Erro na API donations:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar doações (autenticado)
app.get('/api/donations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, donationType } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('Donations')
      .select('*', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (donationType) query = query.eq('donationType', donationType);

    query = query
      .range(offset, offset + limit - 1)
      .order('donationDate', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao listar doações:', error);
      return res.status(500).json({ error: 'Erro ao buscar doações' });
    }

    res.json({
      donations: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Erro na API donations:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas de doações
app.get('/api/donations/stats', authenticateToken, async (req, res) => {
  try {
    const { data: allDonations, error } = await supabase
      .from('Donations')
      .select('*');

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }

    const totalDonations = allDonations.length;
    const totalAmount = allDonations
      .filter(d => d.donationType === 'dinheiro' && (d.status === 'confirmado' || d.status === 'recebido'))
      .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
    
    const pendingCount = allDonations.filter(d => d.status === 'pendente').length;
    const confirmedCount = allDonations.filter(d => d.status === 'confirmado' || d.status === 'recebido').length;

    // Doações por tipo
    const byType = {};
    allDonations.forEach(d => {
      byType[d.donationType] = (byType[d.donationType] || 0) + 1;
    });

    res.json({
      totalDonations,
      totalAmount,
      pendingCount,
      confirmedCount,
      byType
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter doação por ID
app.get('/api/donations/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar doação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar doação
app.patch('/api/donations/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .update({
        ...req.body,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar doação:', error);
      return res.status(500).json({ error: 'Erro ao atualizar doação' });
    }

    res.json({
      message: 'Doação atualizada com sucesso',
      donation: data
    });
  } catch (error) {
    console.error('Erro na API donations:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar doação
app.delete('/api/donations/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Donations')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Doação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar doação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Handler para rotas de API não encontradas (todos os ambientes)
app.all('/api/*', (req, res) => {
  console.log('❌ 404 - API endpoint não encontrado:', req.method, req.path);
  return res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.path,
    method: req.method,
    message: 'Esta rota da API não existe. Verifique a documentação da API.',
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      public: [
        'GET /api/health',
        'GET /api/animals',
        'GET /api/animals/:id',
        'GET /api/news',
        'GET /api/stats',
        'POST /api/contact',
        'POST /api/adoptions'
      ],
      authenticated: [
        'POST /api/auth/login',
        'GET /api/auth/me',
        'GET /api/admin/stats',
        'GET /api/admin/animals',
        'GET /api/admin/adoptions',
        'GET /api/admin/contacts',
        'GET /api/users',
        'POST /api/users',
        'PUT /api/animals/:id',
        'DELETE /api/animals/:id',
        'GET /api/adoptions',
        'PATCH /api/adoptions/:id/status',
        'POST /api/news',
        'PUT /api/news/:id',
        'DELETE /api/news/:id'
      ]
    }
  });
});

// Servir arquivos estáticos do React (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  
  // Servir arquivos estáticos do build do React
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Todas as rotas não-API devem retornar o index.html do React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Handler de erro (depois das rotas)
app.use((err, req, res, next) => {
  console.error('🔴 Erro no servidor:', err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: 'Algo deu errado ao processar sua requisição',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
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