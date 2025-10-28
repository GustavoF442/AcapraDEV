# 🚀 Deploy no Render - ACAPRA Platform

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório no GitHub com o código atualizado
3. Variáveis de ambiente do Supabase configuradas

## 🔧 Configuração das Variáveis de Ambiente

### Backend (acapra-backend)
No painel do Render, configure as seguintes variáveis:

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://jjedtjerraejimhnudph.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWR0amVycmFlamltaG51ZHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Nzc3NDgsImV4cCI6MjA3NzE1Mzc0OH0.bTv-MtcFKyncws3prAJWmQwTbFcF-DzwpgIPZ0TSeUg
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWR0amVycmFlamltaG51ZHBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU3Nzc0OCwiZXhwIjoyMDc3MTUzNzQ4fQ.a33Guy-_ZLwrqNTlYV3BQF45iGN8iZb2dqzUjdA9b_0
JWT_SECRET=acapra-super-secret-key-2024-change-in-production
DB_HOST=db.jjedtjerraejimhnudph.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Bot@fog0123
```

### Frontend (acapra-frontend)
No painel do Render, configure as seguintes variáveis:

```env
REACT_APP_SUPABASE_URL=https://jjedtjerraejimhnudph.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWR0amVycmFlamltaG51ZHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Nzc3NDgsImV4cCI6MjA3NzE1Mzc0OH0.bTv-MtcFKyncws3prAJWmQwTbFcF-DzwpgIPZ0TSeUg
```

## 🏗️ Configuração dos Serviços

### 1. Backend (Node.js)
- **Type**: Web Service
- **Name**: acapra-backend
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 2. Frontend (Static Site)
- **Type**: Static Site
- **Name**: acapra-frontend
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `./client/build`
- **Plan**: Free

## 🔗 URLs Esperadas

Após o deploy, você terá:
- **Backend**: `https://acapra-backend.onrender.com`
- **Frontend**: `https://acapra-frontend.onrender.com`

## ✅ Verificações Pós-Deploy

### 1. Testar Backend
```bash
curl https://acapra-backend.onrender.com/api/health
```

### 2. Testar Conexão Supabase
```bash
curl https://acapra-backend.onrender.com/api/test
```

### 3. Verificar Frontend
Acesse: `https://acapra-frontend.onrender.com`

## 🐛 Troubleshooting

### Problema: Build do Frontend Falha
**Solução**: Verifique se as variáveis `REACT_APP_*` estão configuradas

### Problema: Backend não conecta ao Supabase
**Solução**: Verifique as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_KEY`

### Problema: CORS Error
**Solução**: Verifique se a URL do frontend está na lista de origins permitidas no `server.js`

## 📝 Notas Importantes

1. **Primeiro Deploy**: Pode levar até 15 minutos
2. **Cold Start**: Serviços gratuitos podem ter delay na primeira requisição
3. **Logs**: Use o painel do Render para monitorar logs em tempo real
4. **SSL**: Render fornece HTTPS automaticamente

## 🔄 Deploy Automático

Para habilitar deploy automático:
1. Conecte seu repositório GitHub
2. Configure branch principal (main/master)
3. Cada push disparará um novo deploy automaticamente

## 🚨 Segurança

⚠️ **IMPORTANTE**: Altere o `JWT_SECRET` em produção!
⚠️ **IMPORTANTE**: Nunca commite arquivos `.env` com credenciais reais!
