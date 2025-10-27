# 🚀 Deploy da Plataforma ACAPRA

## 📋 Pré-requisitos
- Conta no GitHub
- Conta no Render.com (gratuita)
- Projeto já configurado com Supabase

## 🔧 Passo a Passo - Deploy no Render

### 1. **Preparar o Repositório GitHub**
```bash
# Se ainda não tem Git configurado
git init
git add .
git commit -m "Initial commit - ACAPRA Platform"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/SEU_USUARIO/acapra-platform.git
git branch -M main
git push -u origin main
```

### 2. **Configurar no Render**

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `acapra-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. **Variáveis de Ambiente**
No painel do Render, adicione estas variáveis:

```env
NODE_ENV=production
SUPABASE_URL=https://jjedtjerraejimhnudph.supabase.co
SUPABASE_SERVICE_KEY=seu_service_key_aqui
JWT_SECRET=seu_jwt_secret_super_secreto_aqui
MAX_FILE_SIZE=5242880
PORT=10000
```

### 4. **Deploy do Frontend**
1. Criar outro serviço: **"New +"** → **"Static Site"**
2. Mesmo repositório GitHub
3. Configure:
   - **Name**: `acapra-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`

### 5. **Conectar Frontend ao Backend**
No frontend, criar arquivo `client/src/config/api.js`:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://acapra-backend.onrender.com'
  : 'http://localhost:5000';

export default API_URL;
```

## 🌐 URLs Finais
- **Frontend**: `https://acapra-frontend.onrender.com`
- **Backend**: `https://acapra-backend.onrender.com`
- **Admin**: `https://acapra-frontend.onrender.com/login`

## 🔑 Credenciais Admin
- **Email**: admin@acapra.org
- **Senha**: admin123

## ⚠️ Importante
- Primeira requisição pode demorar ~30s (cold start)
- Render hiberna após 15min sem uso
- Plano gratuito tem limitações de CPU/memória

## 🐛 Troubleshooting
- **500 Error**: Verificar variáveis de ambiente
- **CORS Error**: Verificar URL do backend no frontend
- **DB Error**: Verificar credenciais do Supabase
