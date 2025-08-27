# ACAPRA - Plataforma de Adoção de Animais

Plataforma web completa para a ACAPRA (Associação de Cuidado e Proteção dos Animais) com catálogo público de animais, sistema de adoção e área administrativa.

## 🚀 Funcionalidades

### Área Pública
- **Catálogo de Animais**: Visualização com filtros por espécie, porte, sexo, idade e localização
- **Detalhes do Animal**: Galeria de fotos, informações completas e botão de adoção
- **Formulário de Adoção**: Coleta de dados do adotante com validações
- **Páginas Institucionais**: Sobre, Doações, Histórias de Adoção, Combate aos Maus-tratos
- **Sistema de Notícias**: Publicações e novidades da ONG
- **Contato**: Formulário para dúvidas e denúncias

### Área Administrativa
- **Dashboard**: Estatísticas e visão geral
- **Gestão de Animais**: CRUD completo com upload de fotos
- **Gestão de Adoções**: Acompanhamento e aprovação de solicitações
- **Gestão de Notícias**: Criação e edição de posts
- **Gestão de Contatos**: Visualização e resposta a mensagens
- **Autenticação**: Login seguro com JWT

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticação
- Bcrypt para criptografia
- Multer para upload de arquivos
- Nodemailer para envio de emails

### Frontend
- React 18
- React Router Dom
- React Query para cache
- React Hook Form para formulários
- Tailwind CSS para estilização
- Lucide React para ícones

## 📦 Instalação

### Pré-requisitos
- Node.js 16+
- MongoDB
- npm ou yarn

### Backend

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações:
```env
# Banco de dados
MONGODB_URI=mongodb://localhost:27017/acapra

# JWT
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRE=30d

# Email (configure com seu provedor SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=noreply@acapra.org

# Servidor
PORT=5000
NODE_ENV=development

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
```

4. Inicie o servidor:
```bash
npm run dev
```

### Frontend

1. Entre na pasta do cliente:
```bash
cd client
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## 🗂️ Estrutura do Projeto

```
projeto/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Contextos React
│   │   ├── pages/          # Páginas da aplicação
│   │   └── pages/admin/    # Páginas administrativas
├── middleware/             # Middlewares Express
├── models/                 # Modelos MongoDB
├── routes/                 # Rotas da API
├── uploads/                # Arquivos enviados
├── .env.example           # Exemplo de variáveis
├── package.json           # Dependências backend
└── server.js              # Servidor principal
```

## 🔧 Configuração Inicial

### 1. Criar Usuário Administrador

Execute no MongoDB ou via aplicação:
```javascript
// Criar primeiro usuário admin
{
  name: "Administrador",
  email: "admin@acapra.org",
  password: "senha_hash", // Use bcrypt
  role: "admin"
}
```

### 2. Configurar Email

Para funcionalidade de emails, configure:
- Gmail: Use senha de aplicativo
- Outros provedores: Configure SMTP

### 3. Estrutura de Pastas

O sistema criará automaticamente:
- `uploads/animals/` - Fotos dos animais
- `uploads/news/` - Imagens das notícias

## 🚀 Deploy

### Backend (Heroku/Railway/etc)
1. Configure variáveis de ambiente
2. Configure MongoDB Atlas
3. Configure serviço de email
4. Deploy com `npm start`

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Configure proxy para API
3. Deploy pasta `build/`

## 📱 Funcionalidades Detalhadas

### Sistema de Animais
- Upload múltiplo de fotos
- Filtros avançados
- Status de adoção
- Informações de saúde
- Temperamento

### Sistema de Adoção
- Formulário completo
- Validações rigorosas
- Email automático
- Acompanhamento admin

### Sistema de Notícias
- Editor de conteúdo
- Upload de imagem
- Sistema de tags
- Controle de publicação

### Segurança
- Autenticação JWT
- Proteção de rotas
- Validação de dados
- Rate limiting
- Helmet para headers

## 🐛 Solução de Problemas

### Erro de CORS
Configure o CORS no backend para aceitar o domínio do frontend.

### Erro de Upload
Verifique permissões da pasta `uploads/` e tamanho máximo.

### Erro de Email
Verifique configurações SMTP e credenciais.

### Erro de Banco
Verifique conexão MongoDB e string de conexão.

## 📄 Licença

Este projeto foi desenvolvido para a ACAPRA - Associação de Cuidado e Proteção dos Animais.

## 🤝 Contribuição

Para contribuir:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas sobre o sistema:
- Email: dev@acapra.org
- Documentação: Consulte este README
- Issues: Use o sistema de issues do repositório
