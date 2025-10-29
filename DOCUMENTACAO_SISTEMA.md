# 📚 DOCUMENTAÇÃO COMPLETA - SISTEMA ACAPRA

## 🎯 Visão Geral do Sistema

O **ACAPRA** é um sistema completo de gestão para ONGs de proteção animal, desenvolvido com tecnologias modernas e foco na experiência do usuário.

### Tecnologias Utilizadas

**Backend:**
- Node.js + Express.js
- Supabase (PostgreSQL)
- JWT para autenticação
- Brevo API para emails
- Nodemailer (alternativa SMTP)

**Frontend:**
- React 18
- React Router v6
- React Query
- TailwindCSS
- Lucide Icons
- Axios

**Hospedagem:**
- Frontend + Backend: Render
- Banco de Dados: Supabase
- Emails: Brevo (API HTTP)

---

## 📋 Funcionalidades Principais

### 1. **Sistema de Animais**
- ✅ Cadastro completo de animais
- ✅ Upload múltiplo de fotos
- ✅ Filtros avançados (espécie, porte, gênero, idade, cidade)
- ✅ Busca por nome, raça ou descrição
- ✅ Controle de status (disponível, em processo, adotado)
- ✅ Perfil detalhado de cada animal
- ✅ Sistema de destaque (featured)

### 2. **Sistema de Adoções**
- ✅ Formulário completo de solicitação
- ✅ Máscaras automáticas (CPF, telefone, CEP)
- ✅ Busca automática de endereço via CEP
- ✅ Validação de dados
- ✅ Email de confirmação ao adotante
- ✅ Email de notificação à ACAPRA
- ✅ Aprovação/rejeição de adoções
- ✅ **Controle automático**: Animal marcado como "adotado" ao aprovar
- ✅ **Rejeição automática** de outras solicitações do mesmo animal
- ✅ Email de status para o adotante

### 3. **Sistema de Contatos**
- ✅ Formulário de contato público
- ✅ **Email de confirmação automático** ao remetente
- ✅ Email de notificação à ACAPRA
- ✅ Gestão de mensagens no painel admin
- ✅ Controle de status (novo, em andamento, resolvido)

### 4. **Sistema de Doações**
- ✅ Registro de doações (dinheiro, ração, medicamentos, materiais, outros)
- ✅ **Máscaras**: Telefone, CPF/CNPJ, Valor em R$
- ✅ Histórico completo de doações
- ✅ Dashboard com estatísticas
- ✅ **Gráficos** de doações por tipo
- ✅ Filtros por status e tipo
- ✅ Ranking de doadores
- ✅ Email de confirmação ao doador
- ✅ Controle de métodos de pagamento

### 5. **Sistema de Eventos**
- ✅ Criação de eventos (feira de adoção, campanha, palestras, etc.)
- ✅ Controle de capacidade e participantes
- ✅ Eventos públicos e privados
- ✅ Status (planejado, confirmado, em andamento, concluído, cancelado)
- ✅ **Botão de envio de lembretes** por email
- ✅ Filtros por data, tipo e status

### 6. **Sistema de Notícias**
- ✅ Criação e gestão de notícias
- ✅ Upload de imagens
- ✅ Editor de conteúdo
- ✅ Controle de publicação (rascunho, publicado)
- ✅ Destaque de notícias

### 7. **Painel Administrativo**
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gestão completa de animais
- ✅ Gestão de adoções
- ✅ Gestão de contatos
- ✅ Gestão de doações
- ✅ Gestão de eventos
- ✅ Gestão de notícias
- ✅ Gestão de usuários

### 8. **Sistema de Autenticação**
- ✅ Login com JWT
- ✅ Proteção de rotas administrativas
- ✅ Controle de permissões (admin/usuário)
- ✅ Sessão persistente

### 9. **Sistema de Emails**
- ✅ **Emails assíncronos** (não bloqueiam requisições)
- ✅ Templates HTML profissionais
- ✅ Brevo API (HTTP - não bloqueado pelo Render)
- ✅ Fallback para SMTP
- ✅ Tipos de emails:
  - Confirmação de adoção (adotante)
  - Notificação de adoção (ACAPRA)
  - Atualização de status de adoção
  - Confirmação de contato (remetente)
  - Notificação de contato (ACAPRA)
  - Confirmação de doação
  - Lembrete de eventos

---

## 🔌 APIs Disponíveis

### **APIs PÚBLICAS** (Sem autenticação)

#### Animais
```
GET  /api/animals
     - Lista animais disponíveis para adoção
     - Parâmetros: page, limit, species, size, gender, age, city, state, search
     - Retorna: Lista paginada de animais + total

GET  /api/animals/:id
     - Detalhes de um animal específico
     - Retorna: Dados completos do animal
```

#### Adoções
```
POST /api/adoptions
     - Enviar solicitação de adoção
     - Body: animalId, adopterName, adopterEmail, adopterPhone, adopterCpf, 
             adopterAddress, city, state, housingType, motivation, etc.
     - Retorna: Confirmação + Emails automáticos
```

#### Contatos
```
POST /api/contact
     - Enviar mensagem de contato
     - Body: name, email, phone, subject, message
     - Retorna: Confirmação + Email automático de resposta
```

#### Doações
```
POST /api/donations
     - Registrar nova doação (público)
     - Body: donorName, donorEmail, donorPhone, donorCPF, donationType, 
             amount, description, paymentMethod
     - Retorna: Confirmação + Email de agradecimento
```

#### Eventos
```
GET  /api/events
     - Lista eventos públicos
     - Parâmetros: page, limit, status, eventType, upcoming
     - Retorna: Lista paginada de eventos

GET  /api/events/:id
     - Detalhes de um evento
     - Retorna: Dados completos do evento
```

#### Notícias
```
GET  /api/news
     - Lista notícias publicadas
     - Parâmetros: page, limit
     - Retorna: Lista paginada de notícias
```

#### Estatísticas
```
GET  /api/stats
     - Estatísticas públicas do sistema
     - Retorna: Total de animais disponíveis, adoções realizadas, etc.
```

#### Utilitários
```
GET  /api/health
     - Verifica status da API
     - Retorna: Status OK + timestamp

GET  /api/test-email
     - Testa envio de emails
     - Parâmetro: ?email=teste@email.com
     - Retorna: Status do teste + configurações
```

---

### **APIs AUTENTICADAS** (Requer token JWT)

#### Autenticação
```
POST /api/auth/login
     - Login de usuário
     - Body: email, password
     - Retorna: Token JWT + dados do usuário

GET  /api/auth/me
     - Dados do usuário logado
     - Retorna: Informações do usuário autenticado
```

#### Animais (Admin)
```
POST   /api/animals
       - Criar novo animal
       - Body: name, species, breed, age, gender, size, description, photos, etc.
       - Autenticado
       
PUT    /api/animals/:id
       - Atualizar animal
       - Body: Dados do animal
       - Autenticado
       
DELETE /api/animals/:id
       - Deletar animal
       - Admin only
```

#### Adoções (Admin)
```
GET    /api/adoptions
       - Listar todas as adoções
       - Parâmetros: page, limit, status
       - Retorna: Lista paginada + total
       - Autenticado

PATCH  /api/adoptions/:id/status
       - Atualizar status de adoção
       - Body: status, notes
       - Funcionalidade automática:
         * Se aprovado → Animal marcado como "adotado"
         * Se aprovado → Outras solicitações rejeitadas automaticamente
         * Email enviado ao adotante com atualização
       - Autenticado

GET    /api/animals/:id/adoptions
       - Listar adoções de um animal específico
       - Autenticado
```

#### Contatos (Admin)
```
GET    /api/admin/contacts
       - Listar mensagens de contato
       - Parâmetros: page, limit, status
       - Autenticado

PATCH  /api/contacts/:id
       - Atualizar status de contato
       - Body: status, notes
       - Autenticado
```

#### Doações (Admin)
```
POST   /api/donations
       - Registrar doação (pelo admin)
       - Body: donorName, donorEmail, donationType, amount, etc.
       - Autenticado

GET    /api/donations
       - Listar todas as doações
       - Parâmetros: page, limit, status, type
       - Autenticado

GET    /api/donations/stats
       - Estatísticas de doações
       - Retorna: totalAmount, totalDonations, byType, confirmedCount
       - Autenticado

PATCH  /api/donations/:id
       - Atualizar doação
       - Body: status, notes, etc.
       - Autenticado

DELETE /api/donations/:id
       - Deletar doação
       - Admin only
```

#### Eventos (Admin)
```
POST   /api/events
       - Criar evento
       - Body: title, description, eventType, eventDate, eventTime, location, etc.
       - Autenticado

PATCH  /api/events/:id
       - Atualizar evento
       - Body: Dados do evento
       - Autenticado

DELETE /api/events/:id
       - Deletar evento
       - Admin only

POST   /api/events/:id/send-reminder
       - Enviar lembrete de evento por email
       - Envia email com detalhes do evento
       - Autenticado
```

#### Notícias (Admin)
```
POST   /api/news
       - Criar notícia
       - Body: title, content, excerpt, imageUrl, status
       - Autenticado

PUT    /api/news/:id
       - Atualizar notícia
       - Body: Dados da notícia
       - Autenticado

DELETE /api/news/:id
       - Deletar notícia
       - Admin only
```

#### Usuários (Admin)
```
GET    /api/users
       - Listar usuários
       - Admin only

POST   /api/users
       - Criar novo usuário
       - Body: name, email, password, role
       - Admin only
```

#### Dashboard (Admin)
```
GET    /api/admin/stats
       - Estatísticas do painel administrativo
       - Retorna: pendingAdoptions, adoptionsInReview, unreadContacts, 
                 publishedNews, totalAnimals, totalAdoptions, totalContacts
       - Autenticado
```

---

## 🔄 Fluxos Principais

### Fluxo de Adoção

```
1. Usuário acessa /animais
   ↓
2. Filtra e busca animais disponíveis
   ↓
3. Clica em "Adotar" no animal desejado
   ↓
4. Preenche formulário completo com:
   - Dados pessoais (com máscaras automáticas)
   - Endereço (busca automática por CEP)
   - Informações sobre moradia
   - Experiência com pets
   - Motivação
   ↓
5. Envia formulário
   ↓
6. Sistema salva no banco de dados
   ↓
7. Emails enviados AUTOMATICAMENTE:
   - Email de confirmação para o adotante
   - Email de notificação para ACAPRA
   ↓
8. Admin analisa no painel
   ↓
9. Admin aprova ou rejeita
   ↓
10. Se APROVADO:
    - Animal marcado como "adotado" AUTOMATICAMENTE
    - Outras solicitações do animal rejeitadas AUTOMATICAMENTE
    - Email de aprovação enviado ao adotante
    - Animal não aparece mais na lista pública
    ↓
11. Se REJEITADO:
    - Email de rejeição enviado ao adotante
    - Animal continua disponível
```

### Fluxo de Contato

```
1. Usuário acessa página de contato
   ↓
2. Preenche formulário (nome, email, telefone, assunto, mensagem)
   ↓
3. Envia mensagem
   ↓
4. Sistema salva no banco
   ↓
5. Emails enviados AUTOMATICAMENTE:
   - Email de confirmação para o remetente (resposta automática)
   - Email de notificação para ACAPRA
   ↓
6. Admin visualiza e responde no painel
```

### Fluxo de Doação

```
1. Admin acessa "Gestão de Doações"
   ↓
2. Clica em "Nova Doação"
   ↓
3. Preenche formulário com:
   - Nome do doador
   - Email (com máscara)
   - Telefone (com máscara: (00) 00000-0000)
   - CPF ou CNPJ (com máscara: 000.000.000-00)
   - Tipo de doação
   - Se dinheiro: Valor (R$ 0,00) e método de pagamento
   - Descrição
   ↓
4. Salva doação
   ↓
5. Email de agradecimento enviado ao doador
   ↓
6. Dashboard atualizado com estatísticas e gráficos
```

### Fluxo de Evento

```
1. Admin cria evento no painel
   ↓
2. Define título, tipo, data, horário, local, capacidade
   ↓
3. Evento aparece na listagem (público ou privado)
   ↓
4. Admin pode clicar em "Lembrete"
   ↓
5. Email de lembrete enviado
```

---

## 📊 Estrutura do Banco de Dados (Supabase)

### Tabelas Principais

**Animals**
- id, name, species, breed, age, gender, size
- description, photos (JSONB)
- city, state, status (disponível, em processo, adotado)
- vaccinated, neutered, dewormed, specialNeeds
- Características: friendly, playful, calm, protective, etc.
- featured, createdBy, timestamps

**Adoptions**
- id, animalId (FK)
- Dados do adotante: nome, email, telefone, CPF, endereço
- Informações de moradia: tipo, quintal, alugado, consentimento
- Experiência com pets
- Motivação, tempo disponível, quem cuidará
- Veterinário, plano de emergência
- status (pendente, em análise, aprovado, rejeitado)
- reviewedBy, reviewedAt, timestamps

**Contacts**
- id, name, email, phone
- subject, message
- status (novo, em andamento, resolvido)
- timestamps

**Donations**
- id, donorName, donorEmail, donorPhone, donorCPF
- donationType (dinheiro, ração, medicamentos, materiais, outros)
- amount, description, paymentMethod
- status (pendente, confirmado, recebido, cancelado)
- registeredBy, donationDate, timestamps

**Events**
- id, title, description
- eventType (adoção, campanha, palestra, arrecadação, outro)
- eventDate, eventTime, location
- maxParticipants, currentParticipants
- status (planejado, confirmado, em andamento, concluído, cancelado)
- isPublic, createdBy, timestamps

**News**
- id, title, content, excerpt
- imageUrl, status (rascunho, publicado)
- featured, createdBy, timestamps

**Users**
- id, name, email, password (hash bcrypt)
- role (admin, user)
- timestamps

---

## 🎨 Características Técnicas

### Máscaras e Validações
- **CPF**: 000.000.000-00 (com validação de dígito verificador)
- **Telefone**: (00) 00000-0000
- **CEP**: 00000-000 (com busca automática via ViaCEP)
- **Data**: DD/MM/AAAA
- **Hora**: HH:MM
- **Dinheiro**: R$ 0.000,00

### Segurança
- Senhas criptografadas com bcrypt
- Autenticação JWT
- Proteção de rotas sensíveis
- Middleware de admin
- Validação de inputs
- Sanitização de dados

### Performance
- Paginação em todas as listagens
- Lazy loading de imagens
- React Query para cache de dados
- Debounce em buscas
- Índices otimizados no banco

### UX/UI
- Design responsivo (mobile-first)
- Feedback visual em ações
- Confirmações em ações destrutivas
- Loading states
- Mensagens de erro amigáveis
- Ícones intuitivos (Lucide)

### Emails
- **Sistema assíncrono**: Não bloqueia requisições
- **Brevo API**: Via HTTP (não SMTP - evita bloqueios)
- **Templates HTML**: Profissionais e responsivos
- **Fallback**: SMTP via Nodemailer
- **Timeout**: 5 segundos para testes

---

## 🚀 Diferenciais do Sistema

1. **Totalmente Automático**
   - Emails enviados automaticamente
   - Status de animal atualizado ao aprovar adoção
   - Rejeição automática de outras solicitações
   - Resposta automática em contatos

2. **UX Excepcional**
   - Máscaras automáticas em formulários
   - Busca de CEP integrada
   - Validações em tempo real
   - Feedback imediato

3. **Gestão Completa**
   - Dashboard com estatísticas
   - Gráficos visuais
   - Filtros avançados
   - Paginação eficiente

4. **Escalável e Moderno**
   - API RESTful bem estruturada
   - Código limpo e documentado
   - Separação de responsabilidades
   - Fácil manutenção

5. **Email Profissional**
   - Templates HTML bonitos
   - Brevo API (300 emails/dia grátis)
   - Confirmações automáticas
   - Notificações em tempo real

---

## 📱 Páginas do Sistema

### Públicas
- `/` - Home
- `/animais` - Lista de animais para adoção
- `/animais/:id` - Detalhes do animal
- `/adotar/:id` - Formulário de adoção
- `/eventos` - Eventos públicos
- `/noticias` - Notícias
- `/contato` - Formulário de contato
- `/sobre` - Sobre a ACAPRA
- `/doar` - Como doar

### Administrativas
- `/admin` - Dashboard
- `/admin/animals` - Gestão de animais
- `/admin/adoptions` - Gestão de adoções
- `/admin/contacts` - Gestão de contatos
- `/admin/donations` - Gestão de doações
- `/admin/events` - Gestão de eventos
- `/admin/news` - Gestão de notícias
- `/admin/users` - Gestão de usuários

---

## 🔧 Configuração de Ambiente

### Variáveis Necessárias (.env)

```env
# Server
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET=sua-chave-secreta
JWT_EXPIRE=7d

# Supabase
SUPABASE_URL=sua-url
SUPABASE_SERVICE_KEY=sua-chave

# Email (Brevo API - Recomendado)
BREVO_API_KEY=xkeysib-sua-chave-api
EMAIL_FROM=seu@email.com

# Email (SMTP - Opcional/Fallback)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=seu-usuario
EMAIL_PASS=sua-senha
```

---

## 📈 Estatísticas do Código

- **APIs**: 40+ endpoints
- **Páginas**: 15+ telas
- **Componentes React**: 30+
- **Tabelas no Banco**: 7 principais
- **Tipos de Email**: 8 templates
- **Máscaras**: 6 tipos
- **Validações**: 10+ validadores

---

## 🎯 Próximas Melhorias (Roadmap)

- [ ] Sistema de agendamento de visitas
- [ ] Chat em tempo real
- [ ] Notificações push
- [ ] App mobile (React Native)
- [ ] Integração com redes sociais
- [ ] Sistema de voluntários
- [ ] Relatórios em PDF
- [ ] Painel financeiro avançado

---

## 📞 Suporte e Contato

**Desenvolvido para:** ACAPRA - Associação de Proteção Animal
**Tecnologias:** React + Node.js + Supabase + Brevo
**Hospedagem:** Render + Supabase
**Status:** ✅ 100% Funcional

---

**Última atualização:** Outubro 2025
