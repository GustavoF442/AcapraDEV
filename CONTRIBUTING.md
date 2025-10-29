# 🤝 Guia de Contribuição - ACAPRA

Obrigado por considerar contribuir com o projeto ACAPRA! Este documento fornece diretrizes para contribuições.

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### 1. Reportar Bugs

Ao reportar um bug, inclua:

- **Descrição clara** do problema
- **Passos para reproduzir**
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** se aplicável
- **Ambiente** (navegador, versão, sistema operacional)

### 2. Sugerir Funcionalidades

Ao sugerir novas funcionalidades:

- Descreva claramente a funcionalidade
- Explique **por que** seria útil
- Forneça exemplos de uso
- Considere a complexidade de implementação

### 3. Pull Requests

#### Preparação

```bash
# 1. Fork o repositório
# 2. Clone seu fork
git clone https://github.com/seu-usuario/AcapraDEV.git
cd AcapraDEV

# 3. Adicione o remote upstream
git remote add upstream https://github.com/GustavoF442/AcapraDEV.git

# 4. Crie uma branch para sua feature
git checkout -b feature/minha-funcionalidade
```

#### Desenvolvimento

1. **Código limpo**
   - Use nomes descritivos para variáveis e funções
   - Comente código complexo
   - Siga os padrões do projeto

2. **Commits semânticos**
   ```
   feat: Adiciona filtro de busca por raça
   fix: Corrige erro no formulário de adoção
   docs: Atualiza README com instruções de deploy
   style: Ajusta espaçamento no componente Card
   refactor: Melhora performance da query de animais
   test: Adiciona testes para AuthContext
   chore: Atualiza dependências
   ```

3. **Teste suas mudanças**
   - Teste localmente no frontend e backend
   - Verifique responsividade
   - Teste em diferentes navegadores

#### Enviando o PR

```bash
# 1. Commit suas mudanças
git add .
git commit -m "feat: Adiciona minha funcionalidade"

# 2. Atualize sua branch com main
git fetch upstream
git rebase upstream/main

# 3. Push para seu fork
git push origin feature/minha-funcionalidade

# 4. Abra um Pull Request no GitHub
```

#### Checklist do PR

- [ ] Código segue os padrões do projeto
- [ ] Comentários em código complexo
- [ ] Documentação atualizada se necessário
- [ ] Funciona em mobile e desktop
- [ ] Sem warnings no console
- [ ] Commit messages seguem padrão semântico

## 📝 Padrões de Código

### JavaScript/React

```javascript
// ✅ BOM
const fetchAnimals = async (filters) => {
  try {
    const response = await api.get('/animals', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    throw error;
  }
};

// ❌ EVITE
const fetch = async (f) => {
  const r = await api.get('/animals', { params: f });
  return r.data;
};
```

### CSS/Tailwind

```jsx
// ✅ BOM - Classes organizadas
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  
// ❌ EVITE - Classes desorganizadas
<div className="shadow-md flex bg-white hover:shadow-lg p-4 rounded-lg transition-shadow items-center justify-between">
```

### Componentes React

```jsx
// ✅ BOM - Componente bem estruturado
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';

const AnimalCard = ({ animal }) => {
  const [liked, setLiked] = useState(false);
  
  const handleLike = () => {
    setLiked(!liked);
  };
  
  return (
    <div className="card">
      <img src={animal.photo} alt={animal.name} />
      <h3>{animal.name}</h3>
      <button onClick={handleLike}>
        {liked ? 'Curtido' : 'Curtir'}
      </button>
    </div>
  );
};

export default AnimalCard;
```

## 🗂️ Estrutura de Arquivos

### Criar Novo Componente

```
components/
└── MeuComponente/
    ├── index.js          # Exportação
    ├── MeuComponente.js  # Componente principal
    └── MeuComponente.css # Estilos (se necessário)
```

### Criar Nova Página

```
pages/
└── MinhaPagina/
    ├── index.js
    └── MinhaPagina.js
```

## 🐛 Debug

### Frontend

```javascript
// Use console.log estratégico
console.log('📊 Dados recebidos:', data);
console.error('❌ Erro:', error);

// React Query Devtools
import { ReactQueryDevtools } from 'react-query/devtools';
// Adicione no App.js
```

### Backend

```javascript
// Logs descritivos
console.log('✅ Animal cadastrado:', animal.id);
console.error('❌ Erro ao salvar:', error.message);

// Use try-catch em async/await
try {
  const result = await operation();
} catch (error) {
  console.error('Erro detalhado:', error);
  res.status(500).json({ error: error.message });
}
```

## 🧪 Testes

```javascript
// Exemplo de teste básico
describe('AnimalCard', () => {
  it('deve renderizar o nome do animal', () => {
    const animal = { name: 'Bob', species: 'Cão' };
    render(<AnimalCard animal={animal} />);
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
```

## 📦 Dependências

### Adicionando Nova Dependência

```bash
# Antes de adicionar, considere:
# - É realmente necessário?
# - Está bem mantido?
# - Tem boas reviews?
# - Tamanho do pacote

# Frontend
cd client
npm install nome-do-pacote

# Backend
npm install nome-do-pacote
```

## 🎨 Design

### Cores

Sempre use as cores do tema:

```css
/* Primárias */
--primary-600: #9333ea  /* Roxo ACAPRA */
--primary-700: #7e22ce
--pink-500: #ec4899
--pink-600: #db2777

/* Neutras */
--gray-50: #f9fafb
--gray-900: #111827
```

### Ícones

Use Lucide React:

```jsx
import { Heart, User, Mail } from 'lucide-react';

<Heart className="h-5 w-5 text-red-500" />
```

## 📱 Responsividade

Sempre teste em:

- Mobile (375px)
- Tablet (768px)
- Desktop (1024px+)

```jsx
// Use classes Tailwind responsivas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🔐 Segurança

### Nunca Commite

- Senhas ou tokens
- Chaves de API
- Dados sensíveis
- Arquivos `.env`

### Sempre Use

- Variáveis de ambiente
- Validação de entrada
- Sanitização de dados
- HTTPS em produção

## 📚 Recursos Úteis

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com)
- [React Query](https://tanstack.com/query)

## 💬 Comunicação

- 🐛 **Bugs**: Abra uma issue no GitHub
- 💡 **Ideias**: Abra uma discussion
- ❓ **Dúvidas**: Comente em issues existentes

## 🎯 Prioridades

1. **Crítico**: Bugs que impedem uso do sistema
2. **Alto**: Funcionalidades essenciais
3. **Médio**: Melhorias de UX
4. **Baixo**: Refatorações e otimizações

## 🏆 Reconhecimento

Todos os contribuidores serão:
- Listados no README
- Mencionados nos releases
- Parte da comunidade ACAPRA

## ❤️ Obrigado!

Sua contribuição faz a diferença na vida dos animais resgatados pela ACAPRA!

---

**Dúvidas?** Abra uma issue ou entre em contato com o time de desenvolvimento.
