# 🐾 ACAPRA - Sistema de Gestão e Adoção de Animais

## 📋 Sobre o Projeto

Sistema web completo desenvolvido para a **ACAPRA** (Associação Contra Abuso e Proteção aos Animais de Franca), com o objetivo de facilitar o processo de adoção de animais, gerenciamento de doações, publicação de notícias e comunicação com adotantes e voluntários.

### 🎯 Missão

A ACAPRA atua há mais de 20 anos em Franca-SP, com trabalho 100% voluntário, resgatando e amparando animais em situação de maus-tratos e abandono. Este sistema foi desenvolvido para ampliar o alcance da ONG e tornar mais eficiente o processo de adoção responsável.

---

## ✨ Funcionalidades

### 👥 Área Pública

- **🏠 Página Inicial**: Hero section moderna com estatísticas em tempo real
- **🐕 Catálogo de Animais**: 
  - Listagem com filtros avançados (espécie, porte, idade, localização)
  - Busca por nome, raça ou características
  - Cards informativos com fotos e detalhes
  - Paginação otimizada
- **📝 Formulário de Adoção**: 
  - Questionário completo sobre o adotante
  - Validação de dados
  - Sistema de upload de documentos
- **💰 Área de Doações**:
  - Informações sobre como contribuir
  - PIX e outras formas de pagamento
  - Transparência financeira
- **📰 Notícias**: 
  - Blog com atualizações da ONG
  - Histórias de adoção bem-sucedidas
  - Eventos e campanhas
- **📞 Contato**: Formulário de contato com validação
- **ℹ️ Sobre**: História e missão da ACAPRA

### 🔐 Painel Administrativo

#### Dashboard
- Estatísticas gerais (animais, adoções, contatos)
- Solicitações pendentes em destaque
- Atividades recentes
- Ações rápidas

#### Gestão de Animais
- Cadastro completo com múltiplas fotos
- Edição de informações
- Controle de status (disponível, em processo, adotado)
- Histórico de adoções
- Filtros e busca avançada

#### Gestão de Adoções
- Listagem com todos os dados do adotante
- Modal detalhado com questionário completo
- Aprovação/rejeição de solicitações
- Controle de status do processo
- Visualização de documentos

#### Gestão de Notícias
- Editor de notícias com upload de imagens
- Publicação e rascunhos
- Estatísticas de visualizações
- Tags e categorização

#### Gestão de Contatos
- Visualização de mensagens recebidas
- Sistema de resposta
- Marcação de lido/não lido
- Filtros por status

#### Gestão Financeira
- Registro de doações e despesas
- Relatórios detalhados
- Gráficos e estatísticas
- Exportação de dados
- Análise de fluxo de caixa

#### Gestão de Usuários
- Controle de colaboradores
- Níveis de permissão
- Auditoria de ações

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para construção da interface
- **React Router v6** - Roteamento e navegação
- **React Query** - Gerenciamento de estado e cache
- **React Hook Form** - Formulários com validação
- **Tailwind CSS** - Estilização moderna e responsiva
- **Lucide React** - Ícones modernos
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Supabase** - Banco de dados PostgreSQL e storage
- **JWT** - Autenticação e autorização
- **Multer** - Upload de arquivos
- **Bcrypt** - Hash de senhas
- **CORS** - Controle de acesso

### Deploy e Infraestrutura
- **Render** - Hospedagem do backend
- **Render Static Site** - Hospedagem do frontend
- **Supabase Cloud** - Banco de dados e storage
- **GitHub** - Controle de versão

---

## 📁 Estrutura do Projeto

```
projeto/
├── client/                     # Frontend React
│   ├── public/
│   │   ├── index.html         # HTML principal
│   │   └── logo-acapra.png    # Favicon
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── Footer.js
│   │   │   ├── ImageUpload.js
│   │   │   └── Navbar.js
│   │   ├── contexts/          # Contexts (Auth, etc)
│   │   │   └── AuthContext.js
│   │   ├── pages/             # Páginas públicas
│   │   │   ├── Home.js
│   │   │   ├── Animals.js
│   │   │   ├── AnimalDetail.js
│   │   │   ├── AdoptionForm.js
│   │   │   ├── News.js
│   │   │   ├── NewsDetail.js
│   │   │   ├── Donations.js
│   │   │   ├── Contact.js
│   │   │   ├── About.js
│   │   │   └── Login.js
│   │   ├── pages/admin/       # Painel administrativo
│   │   │   ├── Dashboard.js
│   │   │   ├── Animals.js
│   │   │   ├── Adoptions.js
│   │   │   ├── News.js
│   │   │   ├── Contacts.js
│   │   │   ├── Financial.js
│   │   │   └── Users.js
│   │   ├── services/          # Serviços e APIs
│   │   │   └── api.js
│   │   ├── utils/             # Utilitários
│   │   │   └── images.js
│   │   ├── config/            # Configurações
│   │   │   └── api.js
│   │   ├── App.js            # Componente principal
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── server.js                  # Backend Express
├── package.json
├── render.yaml               # Configuração Render
└── README.md                 # Este arquivo
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase
- Git instalado

### 1. Clone o Repositório

```bash
git clone https://github.com/GustavoF442/AcapraDEV.git
cd AcapraDEV
```

### 2. Configuração do Backend

```bash
# Instalar dependências
npm install

# Criar arquivo .env na raiz
```

Conteúdo do `.env`:
```env
PORT=5000
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua_service_key_aqui
NODE_ENV=development
```

### 3. Configuração do Frontend

```bash
cd client
npm install

# Criar arquivo .env
```

Conteúdo do `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 4. Configuração do Banco de Dados (Supabase)

#### Criar as Tabelas

Execute os seguintes SQLs no Supabase SQL Editor:

```sql
-- Tabela Animals
CREATE TABLE "Animals" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100),
  age VARCHAR(50),
  gender VARCHAR(20),
  size VARCHAR(50),
  color VARCHAR(100),
  photos JSONB DEFAULT '[]',
  description TEXT,
  health_info TEXT,
  temperament TEXT[],
  special_needs TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  status VARCHAR(50) DEFAULT 'disponível',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela Adoptions
CREATE TABLE "Adoptions" (
  id SERIAL PRIMARY KEY,
  "animalId" INTEGER REFERENCES "Animals"(id),
  "adopterName" VARCHAR(255) NOT NULL,
  "adopterEmail" VARCHAR(255) NOT NULL,
  "adopterPhone" VARCHAR(20) NOT NULL,
  "adopterCpf" VARCHAR(14),
  "adopterAddress" TEXT,
  "adopterCity" VARCHAR(100),
  "adopterState" VARCHAR(2),
  "housingType" VARCHAR(50),
  "hasYard" BOOLEAN DEFAULT false,
  "isRented" BOOLEAN DEFAULT false,
  "ownerConsent" BOOLEAN DEFAULT false,
  "hadPetsBefore" BOOLEAN DEFAULT false,
  "currentPets" TEXT,
  "petCareExperience" TEXT,
  "timeForPet" TEXT,
  "whoWillCare" TEXT,
  "hasVet" BOOLEAN DEFAULT false,
  "vetInfo" TEXT,
  "emergencyPlan" TEXT,
  motivation TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  "reviewedAt" TIMESTAMP,
  "reviewedBy" INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Tabela News
CREATE TABLE "News" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image JSONB,
  author INTEGER,
  status VARCHAR(50) DEFAULT 'rascunho',
  views INTEGER DEFAULT 0,
  tags TEXT[],
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Tabela Contacts
CREATE TABLE "Contacts" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'novo',
  response TEXT,
  "respondedAt" TIMESTAMP,
  "respondedBy" INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Tabela Users
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'colaborador',
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Tabela Donations
CREATE TABLE "Donations" (
  id SERIAL PRIMARY KEY,
  "donorName" VARCHAR(255),
  "donorEmail" VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50),
  method VARCHAR(50),
  "transactionId" VARCHAR(255),
  status VARCHAR(50) DEFAULT 'confirmado',
  notes TEXT,
  date TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Tabela FinancialTransactions
CREATE TABLE "FinancialTransactions" (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  date TIMESTAMP NOT NULL,
  "relatedTo" VARCHAR(255),
  notes TEXT,
  "createdBy" INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

#### Configurar Storage

1. Acesse o Supabase Dashboard
2. Vá em Storage → Create Bucket
3. Crie um bucket chamado `animals` (público)
4. Crie um bucket chamado `news` (público)

### 5. Executar o Projeto

#### Backend:
```bash
# Na raiz do projeto
npm run dev
# Servidor rodando em http://localhost:5000
```

#### Frontend:
```bash
cd client
npm start
# Aplicação rodando em http://localhost:3000
```

---

## 🌐 Deploy

O projeto está configurado para deploy automático no Render através do arquivo `render.yaml`.

### Variáveis de Ambiente no Render

**Backend:**
- `JWT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `NODE_ENV=production`

**Frontend:**
- `REACT_APP_API_URL=https://seu-backend.onrender.com/api`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

### Processo de Deploy

1. Push para branch `main` no GitHub
2. Render detecta automaticamente e faz deploy
3. Build do frontend e backend
4. Deploy automático

URL de Produção: https://acapradev.onrender.com

---

## 👨‍💻 Uso do Sistema

### Acesso Administrativo

1. Acesse `/login`
2. Use credenciais de administrador
3. Navegue pelo painel admin em `/admin`

### Primeiro Usuário Admin

Execute no Supabase SQL Editor:

```sql
INSERT INTO "Users" (name, email, password, role) 
VALUES (
  'Administrador',
  'admin@acapra.org',
  '$2b$10$hashed_password_here', -- Use bcrypt para gerar
  'admin'
);
```

### Fluxo de Adoção

1. **Usuário público**:
   - Navega pelos animais
   - Aplica filtros
   - Visualiza detalhes
   - Preenche formulário de adoção

2. **Administrador**:
   - Recebe notificação no dashboard
   - Analisa o formulário completo
   - Contata o adotante
   - Aprova ou rejeita a solicitação
   - Atualiza status do animal

---

## 🔒 Segurança

- **Autenticação JWT** com tokens seguros
- **Bcrypt** para hash de senhas
- **CORS configurado** para permitir apenas origens confiáveis
- **Validação de dados** no frontend e backend
- **SQL Injection protection** com Supabase
- **Rate limiting** em produção
- **HTTPS** obrigatório em produção

---

## 📊 Banco de Dados

### Schema Simplificado

```
Animals (Animais)
├── id, name, species, breed, age
├── gender, size, color, photos
├── description, health_info
├── temperament, special_needs
├── city, state, status
└── created_at, updated_at

Adoptions (Adoções)
├── id, animalId → Animals
├── Dados do Adotante
├── Informações de Moradia
├── Experiência com Pets
├── Motivação e Compromisso
├── status, reviewedAt, reviewedBy
└── createdAt

News (Notícias)
├── id, title, excerpt, content
├── image, author, status
├── views, tags
└── createdAt, updatedAt

Contacts (Contatos)
├── id, name, email, phone
├── subject, message
├── status, response
└── respondedAt, createdAt

Users (Usuários)
├── id, name, email
├── password, role, active
└── createdAt

Donations (Doações)
├── id, donorName, donorEmail
├── amount, type, method
├── transactionId, status
└── date, createdAt

FinancialTransactions (Transações)
├── id, description, amount
├── type, category, date
├── relatedTo, notes
└── createdBy, createdAt
```

---

## 🎨 Design System

### Cores Principais
```css
--primary-600: #9333ea  /* Roxo ACAPRA */
--primary-700: #7e22ce
--pink-500: #ec4899     /* Rosa */
--pink-600: #db2777
```

### Componentes Reutilizáveis
- `Navbar` - Menu de navegação responsivo
- `Footer` - Rodapé com redes sociais
- `ImageUpload` - Upload de imagens com preview
- `AnimatedStats` - Estatísticas animadas

### Responsividade
- Mobile First
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## 🐛 Troubleshooting

### Problema: Imagens não carregam

**Solução**: Verificar se os buckets do Supabase estão públicos e se as URLs estão corretas.

### Problema: Erro 401 ao fazer login

**Solução**: Verificar se o JWT_SECRET está configurado corretamente e se as credenciais estão corretas no banco.

### Problema: Filtros não funcionam

**Solução**: Verificar se a rota `/api/animals` no backend está aceitando todos os parâmetros de query.

### Problema: Deploy falha no Render

**Solução**: 
1. Verificar logs no Render Dashboard
2. Confirmar variáveis de ambiente
3. Verificar se o build do React está correto

---

## 📈 Melhorias Futuras

- [ ] Sistema de notificações por email
- [ ] Chat em tempo real com adotantes
- [ ] App mobile React Native
- [ ] Sistema de voluntariado
- [ ] Agenda de eventos
- [ ] Sistema de apadrinhamento
- [ ] Integração com redes sociais
- [ ] Dashboard com BI avançado
- [ ] API pública para integrações
- [ ] Modo offline (PWA)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto foi desenvolvido para a ACAPRA e é de propriedade da organização.

---

## 📞 Contato

**ACAPRA - Associação Contra Abuso e Proteção aos Animais**

- 📧 Email: contato@acapra.org
- 📱 Instagram: [@acaprafranca](https://instagram.com/acaprafranca)
- 📘 Facebook: [ACAPRA Franca](https://facebook.com/acaprafranca)
- 🌐 Website: [acapradev.onrender.com](https://acapradev.onrender.com)

**Desenvolvedor:**
- 👨‍💻 Gustavo F.
- 📧 Email: gustavohenriquef04@gmail.com
- 💼 GitHub: [@GustavoF442](https://github.com/GustavoF442)

---

## 🙏 Agradecimentos

- A todos os voluntários da ACAPRA
- Aos adotantes que dão uma segunda chance aos animais
- À comunidade open source pelas ferramentas incríveis
- A você, por considerar contribuir ou adotar!

---

## 💝 Faça a Diferença

Se você chegou até aqui, considere:

1. **Adotar** um animal através do site
2. **Doar** para ajudar nos custos veterinários
3. **Ser voluntário** e fazer parte da equipe
4. **Compartilhar** o trabalho da ACAPRA
5. **Contribuir** com código para melhorar o sistema

**Cada animal resgatado é uma vida transformada. Junte-se a nós nessa missão! 🐾**

---

<div align="center">

**Feito com ❤️ para os animais da ACAPRA**

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!

</div>
