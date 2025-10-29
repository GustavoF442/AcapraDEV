# ✅ CHECKLIST DE VALIDAÇÃO - SISTEMA ACAPRA

## 📋 Antes do Deploy/Apresentação

### Configuração do Ambiente
- [ ] Variáveis de ambiente configuradas no Render
- [ ] BREVO_API_KEY configurada
- [ ] EMAIL_FROM configurado
- [ ] SUPABASE_URL e SUPABASE_SERVICE_KEY corretos
- [ ] JWT_SECRET definido
- [ ] NODE_ENV=production

### Banco de Dados
- [ ] Todas as tabelas criadas
- [ ] Dados de teste inseridos
- [ ] Pelo menos 5 animais cadastrados
- [ ] Pelo menos 1 usuário admin criado
- [ ] Fotos dos animais carregadas

---

## 🧪 Testes de Funcionalidades

### 1. Área Pública

#### Home Page
- [ ] Página carrega corretamente
- [ ] Estatísticas aparecem
- [ ] Links funcionam
- [ ] Design responsivo (mobile/desktop)

#### Catálogo de Animais
- [ ] Lista de animais carrega
- [ ] Filtros funcionam:
  - [ ] Por espécie
  - [ ] Por porte
  - [ ] Por gênero  
  - [ ] Por idade
  - [ ] Por cidade/estado
- [ ] Busca por nome funciona
- [ ] Paginação funciona
- [ ] Fotos carregam corretamente
- [ ] Apenas animais "disponíveis" aparecem

#### Detalhes do Animal
- [ ] Página de detalhes abre
- [ ] Todas as informações aparecem
- [ ] Fotos em galeria funcionam
- [ ] Botão "Adotar" aparece apenas se disponível
- [ ] Animais "adotados" NÃO mostram botão de adotar

#### Formulário de Adoção
- [ ] Formulário abre corretamente
- [ ] Máscaras funcionam:
  - [ ] CPF: 000.000.000-00
  - [ ] Telefone: (00) 00000-0000
  - [ ] CEP: 00000-000
- [ ] Busca de CEP automática funciona
- [ ] Validações funcionam
- [ ] Envio do formulário funciona
- [ ] Mensagem de sucesso aparece
- [ ] **Email de confirmação chega ao adotante**
- [ ] **Email de notificação chega à ACAPRA**
- [ ] Solicitação aparece no painel admin

#### Página de Contato
- [ ] Formulário de contato funciona
- [ ] Validações OK
- [ ] Envio funciona
- [ ] **Email de confirmação chega ao remetente**
- [ ] **Email de notificação chega à ACAPRA**
- [ ] Mensagem aparece no painel admin

#### Eventos
- [ ] Lista de eventos públicos aparece
- [ ] Detalhes dos eventos funcionam
- [ ] Filtros funcionam

#### Notícias
- [ ] Lista de notícias aparece
- [ ] Detalhes das notícias funcionam
- [ ] Imagens carregam

---

### 2. Painel Administrativo

#### Login
- [ ] Página de login funciona
- [ ] Validação de credenciais OK
- [ ] Token JWT gerado
- [ ] Redirecionamento para dashboard
- [ ] Logout funciona

#### Dashboard
- [ ] Estatísticas carregam:
  - [ ] Total de animais
  - [ ] Adoções pendentes
  - [ ] Adoções em análise
  - [ ] Contatos não lidos
  - [ ] Total de doações
- [ ] Gráficos aparecem (se houver)
- [ ] Links rápidos funcionam

#### Gestão de Animais
- [ ] Lista de animais carrega
- [ ] Filtros funcionam
- [ ] Busca funciona
- [ ] **Criar novo animal:**
  - [ ] Upload de fotos funciona
  - [ ] Todos os campos salvam
  - [ ] Animal aparece na lista
- [ ] **Editar animal:**
  - [ ] Modal abre
  - [ ] Dados carregam
  - [ ] Edição salva
- [ ] **Deletar animal:**
  - [ ] Confirmação aparece
  - [ ] Animal é deletado
- [ ] Status dos animais reflete corretamente

#### Gestão de Adoções
- [ ] Lista de adoções carrega
- [ ] Filtros por status funcionam
- [ ] **Visualizar detalhes:**
  - [ ] Modal abre
  - [ ] Todas as informações aparecem
- [ ] **Aprovar adoção:**
  - [ ] Status muda para "aprovado"
  - [ ] **Animal automaticamente marcado como "adotado"**
  - [ ] **Outras solicitações automaticamente rejeitadas**
  - [ ] **Email de aprovação enviado ao adotante**
  - [ ] **Animal desaparece da lista pública**
- [ ] **Rejeitar adoção:**
  - [ ] Status muda para "rejeitado"
  - [ ] Email de rejeição enviado
  - [ ] Animal continua disponível (se aplicável)

#### Gestão de Contatos
- [ ] Lista de contatos carrega
- [ ] Filtros funcionam
- [ ] Visualizar mensagem completa
- [ ] Marcar como lido/respondido
- [ ] Atualizar status

#### Gestão de Doações
- [ ] Lista de doações carrega
- [ ] Filtros funcionam (status, tipo)
- [ ] **Criar nova doação:**
  - [ ] Máscaras funcionam:
    - [ ] Telefone: (00) 00000-0000
    - [ ] CPF/CNPJ: 000.000.000-00
    - [ ] Valor: R$ 0.000,00
  - [ ] Todos os campos salvam
  - [ ] Email de agradecimento enviado
- [ ] Dashboard de doações:
  - [ ] Total arrecadado aparece
  - [ ] Gráfico por tipo funciona
  - [ ] Estatísticas corretas
- [ ] Editar doação funciona
- [ ] Deletar doação funciona

#### Gestão de Eventos
- [ ] Lista de eventos carrega
- [ ] **Criar evento:**
  - [ ] Todos os campos salvam
  - [ ] Evento aparece na lista
- [ ] **Editar evento:**
  - [ ] Modal abre
  - [ ] Edição salva
- [ ] **Enviar lembrete:**
  - [ ] Botão "Lembrete" funciona
  - [ ] **Email enviado**
  - [ ] Confirmação aparece
- [ ] Deletar evento funciona

#### Gestão de Notícias
- [ ] Lista de notícias carrega
- [ ] Criar notícia funciona
- [ ] Upload de imagem funciona
- [ ] Editar notícia funciona
- [ ] Deletar notícia funciona
- [ ] Publicar/rascunho funciona

---

### 3. Sistema de Emails

#### Testes de Envio
- [ ] **Endpoint de teste:**
  - [ ] GET /api/test-email funciona
  - [ ] Email de teste chega
  - [ ] Sem erros de timeout
  - [ ] Usando Brevo API

#### Templates de Email
- [ ] **Confirmação de adoção** (adotante)
- [ ] **Notificação de adoção** (ACAPRA)
- [ ] **Aprovação de adoção** (adotante)
- [ ] **Rejeição de adoção** (adotante)
- [ ] **Confirmação de contato** (remetente)
- [ ] **Notificação de contato** (ACAPRA)
- [ ] **Agradecimento de doação** (doador)
- [ ] **Lembrete de evento** (admin)

#### Verificações
- [ ] Emails chegam em até 30 segundos
- [ ] HTML renderiza corretamente
- [ ] Não vão para SPAM
- [ ] Links funcionam (se houver)
- [ ] Remetente correto (EMAIL_FROM)

---

### 4. Segurança

#### Autenticação
- [ ] Login com credenciais erradas falha
- [ ] Token JWT expira corretamente
- [ ] Rotas protegidas sem token retornam 401
- [ ] Logout limpa o token

#### Autorização
- [ ] Rotas admin bloqueadas para usuários comuns
- [ ] DELETE só funciona para admin
- [ ] Dados sensíveis não vazam

#### Validações
- [ ] XSS protection funciona
- [ ] SQL Injection bloqueado
- [ ] CORS configurado corretamente
- [ ] Uploads validados (tipo e tamanho)

---

### 5. Performance

#### Tempo de Carregamento
- [ ] Home page < 2 segundos
- [ ] Lista de animais < 2 segundos
- [ ] Dashboard < 2 segundos
- [ ] Formulários < 1 segundo

#### Otimizações
- [ ] Imagens otimizadas/comprimidas
- [ ] Paginação funcionando
- [ ] Cache de dados (React Query)
- [ ] Lazy loading de imagens

---

### 6. Responsividade

#### Mobile (< 768px)
- [ ] Menu hamburguer funciona
- [ ] Formulários ajustam
- [ ] Cards empilham corretamente
- [ ] Imagens responsivas
- [ ] Touch events funcionam

#### Tablet (768px - 1024px)
- [ ] Layout ajusta
- [ ] Grid de animais OK
- [ ] Modais centralizados

#### Desktop (> 1024px)
- [ ] Layout completo
- [ ] Sidebar fixa (se houver)
- [ ] Múltiplas colunas

---

### 7. APIs

#### Endpoints Públicos
- [ ] GET /api/animals
- [ ] GET /api/animals/:id
- [ ] POST /api/adoptions
- [ ] POST /api/contact
- [ ] POST /api/donations
- [ ] GET /api/events
- [ ] GET /api/news
- [ ] GET /api/health
- [ ] GET /api/test-email

#### Endpoints Autenticados
- [ ] POST /api/auth/login
- [ ] GET /api/auth/me
- [ ] GET /api/admin/stats
- [ ] CRUD de animais
- [ ] CRUD de eventos
- [ ] CRUD de notícias
- [ ] GET /api/adoptions
- [ ] PATCH /api/adoptions/:id/status
- [ ] GET /api/donations/stats
- [ ] POST /api/events/:id/send-reminder

---

### 8. Banco de Dados

#### Integridade
- [ ] Todas as tabelas existem
- [ ] Foreign keys funcionam
- [ ] Cascata de deleção OK
- [ ] Índices criados

#### Dados
- [ ] Timestamps corretos
- [ ] Status padrões OK
- [ ] JSONB parseando corretamente
- [ ] Fotos salvando como array

---

### 9. Deploy

#### Render
- [ ] Build passa sem erros
- [ ] Servidor inicia corretamente
- [ ] Variáveis de ambiente carregadas
- [ ] Logs sem erros críticos
- [ ] Health check OK

#### URLs
- [ ] Frontend acessível
- [ ] API respondendo
- [ ] CORS permitindo frontend
- [ ] HTTPS funcionando

---

### 10. Documentação

#### Arquivos
- [ ] README.md completo
- [ ] DOCUMENTACAO_SISTEMA.md criado
- [ ] GUIA_APRESENTACAO.md criado
- [ ] CHECKLIST_VALIDACAO.md criado
- [ ] Comentários no código

---

## 🎯 TESTE FINAL COMPLETO (30 min)

### Fluxo 1: Adoção Completa (10 min)
1. Acessar site como visitante
2. Buscar e filtrar animais
3. Selecionar um animal disponível
4. Preencher formulário completo de adoção
5. Enviar solicitação
6. Verificar email de confirmação
7. Logar como admin
8. Visualizar solicitação no dashboard
9. Aprovar adoção
10. Verificar:
    - Animal marcado como "adotado"
    - Email de aprovação enviado
    - Animal não aparece mais na lista pública
    - Outras solicitações rejeitadas (se houver)

### Fluxo 2: Gestão de Doações (5 min)
1. Logar como admin
2. Ir em "Gestão de Doações"
3. Clicar em "Nova Doação"
4. Preencher formulário (testar máscaras)
5. Salvar doação
6. Verificar dashboard atualizado
7. Verificar gráfico de doações por tipo

### Fluxo 3: Evento e Lembrete (5 min)
1. Criar novo evento
2. Preencher todos os dados
3. Salvar evento
4. Clicar em "Lembrete"
5. Verificar email recebido

### Fluxo 4: Contato (5 min)
1. Acessar página de contato como visitante
2. Preencher formulário
3. Enviar mensagem
4. Verificar emails:
   - Confirmação ao remetente
   - Notificação à ACAPRA
5. Logar como admin
6. Visualizar mensagem
7. Marcar como respondido

### Fluxo 5: Responsividade (5 min)
1. Redimensionar navegador
2. Testar em mobile (DevTools)
3. Verificar menu responsivo
4. Testar formulários em mobile
5. Verificar imagens responsivas

---

## ✅ CRITÉRIOS DE APROVAÇÃO

### Obrigatório (100%)
- [ ] Todos os endpoints públicos funcionam
- [ ] Sistema de adoção completo funciona
- [ ] Emails automáticos enviados
- [ ] Aprovação marca animal como adotado
- [ ] Painel admin acessível
- [ ] Dashboard com estatísticas
- [ ] Sem erros no console
- [ ] Sem erros no servidor

### Importante (90%)
- [ ] Todas as máscaras funcionam
- [ ] Todos os filtros funcionam
- [ ] Sistema de eventos completo
- [ ] Sistema de doações completo
- [ ] Responsividade 100%

### Desejável (80%)
- [ ] Gráficos e estatísticas
- [ ] Performance otimizada
- [ ] Documentação completa

---

## 🐛 LOG DE PROBLEMAS

Se encontrar problemas, documente aqui:

### Problema 1
- **Descrição:**
- **Reprodução:**
- **Status:**
- **Solução:**

### Problema 2
- **Descrição:**
- **Reprodução:**
- **Status:**
- **Solução:**

---

## 📊 RESULTADO FINAL

**Data da Validação:** ___/___/______
**Validado por:** _________________
**Status:** ⬜ Aprovado ⬜ Aprovado com ressalvas ⬜ Reprovado

**Observações:**
_______________________________________________
_______________________________________________
_______________________________________________

**Funcionalidades OK:** ___/100
**Performance:** ⬜ Excelente ⬜ Boa ⬜ Regular
**Pronto para Produção:** ⬜ Sim ⬜ Não

---

**Sistema validado e pronto para apresentação! 🚀**
