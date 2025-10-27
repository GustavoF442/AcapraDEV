# 🚀 Deploy ACAPRA no Vercel

## 📋 Passo a Passo Completo

### **1. Fazer Push para o GitHub**
```bash
# No diretório raiz do projeto
cd c:\projetos\projeto

# Remover git do client (se existir)
rmdir /s client\.git

# Adicionar repositório remoto
git remote add origin https://github.com/GustavoF442/AcapraDEV.git

# Adicionar arquivos e fazer commit
git add .
git commit -m "ACAPRA Platform - Ready for Vercel deploy"

# Push para GitHub
git push -f origin main
```

### **2. Deploy no Vercel**

1. **Acesse**: [vercel.com](https://vercel.com)
2. **Login**: Com GitHub
3. **Import Project**: Escolha `GustavoF442/AcapraDEV`
4. **Configure**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/build`

### **3. Variáveis de Ambiente**
No painel do Vercel, adicione:

```env
NODE_ENV=production
SUPABASE_URL=https://jjedtjerraejimhnudph.supabase.co
SUPABASE_SERVICE_KEY=seu_service_key_aqui
JWT_SECRET=seu_jwt_secret_super_secreto
MAX_FILE_SIZE=5242880
```

### **4. Configurações Avançadas**
- **Node.js Version**: 18.x
- **Install Command**: `npm install`
- **Build Command**: `npm run vercel-build`

## 🌐 Resultado Final

Após o deploy:
- **URL**: `https://seu-projeto.vercel.app`
- **Admin**: `https://seu-projeto.vercel.app/login`
- **API**: `https://seu-projeto.vercel.app/api/health`

## 🔑 Credenciais Admin
- **Email**: admin@acapra.org  
- **Senha**: admin123

## ✅ Vantagens do Vercel
- ✅ **Fullstack** - Frontend + Backend em uma URL
- ✅ **Deploy automático** via GitHub
- ✅ **SSL gratuito**
- ✅ **CDN global**
- ✅ **Domínio personalizado** gratuito

## 🐛 Troubleshooting
- **500 Error**: Verificar variáveis de ambiente
- **Build Error**: Verificar se `npm run vercel-build` funciona localmente
- **API Error**: Verificar se server.js está na raiz
