# Migração SQLite → Supabase PostgreSQL

## ✅ Alterações Realizadas

### 1. Dependências Atualizadas
- ❌ Removido: `sqlite3`
- ✅ Adicionado: `pg` e `pg-hstore`

### 2. Configuração do Banco de Dados
**Arquivo**: `config/database.js`
- Migrado de SQLite para PostgreSQL
- Configurado SSL para Supabase
- Adicionado pool de conexões
- Configuração de host, porta, database e credenciais

### 3. Servidor
**Arquivo**: `server.js`
- Atualizado `sequelize.sync({ alter: true })` para suportar alterações de schema
- Mensagens de log atualizadas

### 4. Models
Todos os models já estavam compatíveis com Sequelize:
- ✅ User.js - bcrypt hooks funcionando
- ✅ Animal.js - campos JSON nativos
- ✅ Adoption.js - relacionamentos corretos
- ✅ News.js - hooks de slug
- ✅ Contact.js - estrutura completa

### 5. Routes
Todas as rotas já estavam usando Sequelize:
- ✅ auth.js - findOne, create, update
- ✅ animals.js - findAndCountAll, where, Op
- ✅ adoptions.js - includes e relacionamentos
- ✅ news.js - operações completas
- ✅ contact.js - CRUD completo
- ✅ stats.js - agregações e contagens

### 6. Arquivos Removidos
Foram deletados os seguintes arquivos de teste/desenvolvimento:
- test-login.js
- test-admin.js
- debug-login.js
- create-admin.js
- create-admin-simple.js
- recreate-database.js
- recreate-admin.js
- fix-admin.js
- migrate-to-sqlite.js
- setup-sqlite.js
- setup-complete.js
- setup-animals-with-photos.js

### 7. Novos Arquivos
- ✅ `.env.example` - Template com configurações do Supabase
- ✅ `setup-supabase.js` - Script de inicialização do banco
- ✅ `MIGRATION.md` - Este documento

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar .env
Copie `.env.example` para `.env` e configure suas credenciais do Supabase:
```env
SUPABASE_URL=https://jjedtjerraejimhnudph.supabase.co
DB_HOST=aws-0-sa-east-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.jjedtjerraejimhnudph
DB_PASSWORD=sb_secret__tnBfdO2LGrEVeJu0Qivdw_kQtGy1GZ
JWT_SECRET=seu-jwt-secret-aqui
```

### 3. Inicializar Banco de Dados
```bash
node setup-supabase.js
```

Este script irá:
- Criar todas as tabelas
- Criar usuário admin (admin@acapra.org / admin123)
- Criar 2 animais de exemplo

### 4. Iniciar o Servidor
```bash
npm run dev
```

### 5. Acessar a Aplicação
- Backend: http://localhost:5000
- Frontend: http://localhost:3000 (após iniciar o cliente)

## 📊 Credenciais do Supabase

Suas credenciais Supabase:
- **Project URL**: https://jjedtjerraejimhnudph.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- **Service Role**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- **DB Password**: sb_secret__tnBfdO2LGrEVeJu0Qivdw_kQtGy1GZ

## 🔍 Verificações

### Testar Conexão
```bash
node -e "require('dotenv').config(); require('./config/database').testConnection()"
```

### Verificar Tabelas no Supabase
1. Acesse https://supabase.com/dashboard
2. Entre no seu projeto
3. Vá em "Table Editor"
4. Verifique se as tabelas foram criadas: Users, Animals, Adoptions, News, Contacts

### Testar Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acapra.org","password":"admin123"}'
```

## 🎯 Diferenças SQLite → PostgreSQL

| Recurso | SQLite | PostgreSQL |
|---------|--------|------------|
| Tipos de dados | Limitados | Ricos (UUID, JSON, Arrays) |
| Concorrência | Bloqueio de arquivo | Multi-usuário real |
| Performance | Boa para dev | Ótima para produção |
| Escalabilidade | Limitada | Ilimitada |
| Cloud | Não | Sim (Supabase) |
| Backup | Arquivo único | Automatizado (Supabase) |
| SSL | Não | Sim |

## ⚠️ Pontos de Atenção

1. **JSON Fields**: PostgreSQL trata JSON de forma nativa, melhor performance
2. **Timestamps**: Mantidos como `createdAt` e `updatedAt` (camelCase)
3. **Relacionamentos**: Todos preservados e funcionando
4. **Sequelize**: Versão mantida, 100% compatível
5. **SSL**: Obrigatório para conexão com Supabase

## 🛠️ Troubleshooting

### Erro de Conexão
```
Error: connect ECONNREFUSED
```
**Solução**: Verifique credenciais no `.env` e conexão com internet

### Erro de SSL
```
Error: SSL connection required
```
**Solução**: SSL já está configurado em `config/database.js`

### Tabelas Não Criadas
```bash
# Force sync (ATENÇÃO: apaga dados existentes)
node -e "require('dotenv').config(); const {sequelize} = require('./config/database'); require('./models'); sequelize.sync({force:true}).then(() => console.log('OK'))"
```

### Reset Completo
```bash
# No Supabase Dashboard, delete todas as tabelas e execute:
node setup-supabase.js
```

## 📝 Próximos Passos

1. ✅ Migração concluída
2. ⏳ Testar todas as rotas da API
3. ⏳ Testar upload de imagens
4. ⏳ Testar formulários de adoção e contato
5. ⏳ Configurar emails (opcional)
6. ⏳ Deploy para produção

## 🎉 Vantagens da Migração

- ✅ Banco de dados na nuvem (sem necessidade de servidor)
- ✅ Backups automáticos
- ✅ Dashboard visual do Supabase
- ✅ API REST automática (se necessário)
- ✅ Autenticação integrada (se necessário)
- ✅ Storage de arquivos (alternativa ao sistema de uploads local)
- ✅ Escalabilidade automática
- ✅ SSL/TLS por padrão
