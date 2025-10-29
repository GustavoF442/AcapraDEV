# Novas Funcionalidades Implementadas - ACAPRA

## 📧 Sistema de Notificações por Email

### Configuração
As variáveis de ambiente já estão configuradas no Render:
- `EMAIL_HOST=smtp.gmail.com`
- `EMAIL_PORT=587`
- `EMAIL_USER=acapratest@gmail.com`
- `EMAIL_PASS=botafogo123`
- `EMAIL_FROM=acapratest@gmail.com`

### Funcionalidades
1. **Email de Confirmação de Adoção** - Enviado automaticamente ao adotante quando uma solicitação é criada
2. **Email de Notificação para ACAPRA** - Notifica a equipe sobre novas solicitações
3. **Email de Atualização de Status** - Enviado quando o status da adoção muda (aprovado/rejeitado)
4. **Email de Confirmação de Doação** - Enviado quando uma doação é registrada
5. **Email de Lembrete de Evento** - Pode ser enviado manualmente para participantes

### Arquivos
- `/services/emailService.js` - Serviço centralizado com templates HTML
- Templates prontos para todos os cenários

---

## 💰 Sistema de Controle de Doações

### Modelos
- **Donation** (`/models/Donation.js`)
  - Tipos: dinheiro, ração, medicamentos, materiais, outros
  - Status: pendente, confirmado, recebido, cancelado
  - Campos: valor, método de pagamento, CPF do doador, recibo
  - Suporta doações recorrentes

### Rotas API
```
POST   /api/donations          - Registrar doação (público)
GET    /api/donations          - Listar doações (admin)
GET    /api/donations/stats    - Estatísticas de doações
GET    /api/donations/:id      - Detalhes de doação
PATCH  /api/donations/:id      - Atualizar doação (admin)
DELETE /api/donations/:id      - Deletar doação (admin)
```

### Funcionalidades
- Registro de doações por tipo
- Controle de doações em dinheiro com valor
- Ranking de doadores
- Relatórios e estatísticas por período
- Emissão de recibos
- Doações recorrentes

### SQL
Execute o arquivo `supabase-donations-events-schema.sql` no Supabase para criar as tabelas.

---

## 📅 Sistema de Agenda de Eventos

### Modelos
- **Event** (`/models/Event.js`)
  - Tipos: adoção, campanha, palestra, feira, arrecadação, outro
  - Status: planejado, confirmado, em_andamento, concluído, cancelado
  - Controle de capacidade e participantes
  - Eventos públicos/privados

### Rotas API
```
GET    /api/events             - Listar eventos (público vê só públicos)
GET    /api/events/:id         - Detalhes do evento
POST   /api/events             - Criar evento (admin)
PATCH  /api/events/:id         - Atualizar evento (admin)
DELETE /api/events/:id         - Deletar evento (admin)
POST   /api/events/:id/participate - Incrementar participantes
POST   /api/events/:id/send-reminder - Enviar lembretes (admin)
```

### Funcionalidades
- Cadastro de eventos com data, hora e local
- Controle de capacidade máxima
- Eventos públicos aparecem no site
- Envio de lembretes por email
- Geolocalização (latitude/longitude)
- Banner/imagem do evento

---

## 🎭 Máscaras e Validações de Campos

### Utilitários Criados
1. **`/utils/masks.js`** - Máscaras de formatação
   - CPF: 000.000.000-00
   - Telefone: (00) 00000-0000
   - CEP: 00000-000
   - Dinheiro: R$ 0.000,00
   - Data: DD/MM/AAAA
   - Hora: HH:MM

2. **`/utils/validators.js`** - Validações
   - Validação de CPF (com dígito verificador)
   - Validação de telefone
   - Validação de email
   - Validação de CEP
   - Validações genéricas

### Componentes
1. **`<MaskedInput>`** - Input com máscara automática
   ```jsx
   <MaskedInput
     type="cpf"
     value={cpf}
     onChange={(e) => setCpf(e.target.value)}
   />
   ```

2. **`<CEPSearch>`** - Busca CEP com ViaCep
   ```jsx
   <CEPSearch
     value={cep}
     onChange={(e) => setCep(e.target.value)}
     onAddressFound={(address) => {
       setRua(address.street);
       setCidade(address.city);
       setEstado(address.state);
     }}
   />
   ```

### Tipos de Máscara Disponíveis
- `type="cpf"` - Máscara de CPF
- `type="phone"` - Máscara de telefone/celular
- `type="cep"` - Máscara de CEP
- `type="money"` - Máscara de dinheiro
- `type="date"` - Máscara de data
- `type="time"` - Máscara de hora
- `type="number"` - Apenas números
- `type="letters"` - Apenas letras

---

## 🌐 Integração com ViaCep

### Serviço
- **`/services/viaCepService.js`** - Integração com API ViaCep
- Busca automática de endereço por CEP
- Preenchimento automático de rua, bairro, cidade e estado

### Uso
```javascript
import { getAddressByCEP } from '../services/viaCepService';

const address = await getAddressByCEP('01310-100');
// Retorna: { street, neighborhood, city, state, ... }
```

### Implementado em
- Formulário de adoção (`AdoptionForm.js`)
- Pronto para usar em formulários de doação e cadastro

---

## 📋 Validações Implementadas

### Formulário de Adoção
- ✅ CPF válido (com verificação de dígito)
- ✅ Telefone válido (10 ou 11 dígitos)
- ✅ Email válido
- ✅ CEP válido (8 dígitos)
- ✅ Campos obrigatórios marcados
- ✅ Máscaras aplicadas automaticamente
- ✅ Busca automática de endereço por CEP

### Validações de Backend
- Validação com `express-validator` em todas as rotas
- Validação de tipos ENUM no banco de dados
- Validação de referências (foreign keys)

---

## 🚀 Como Usar

### 1. Configurar Banco de Dados
Execute no Supabase SQL Editor:
```sql
-- Cole o conteúdo de supabase-donations-events-schema.sql
```

### 2. Verificar Variáveis de Ambiente (Render)
Certifique-se que as variáveis de email estão configuradas:
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASS
- EMAIL_FROM

### 3. Atualizar Dependências
No Render, o deploy automático irá instalar as dependências.
Caso precise localmente:
```bash
npm install
cd client && npm install
```

### 4. Testar Funcionalidades

#### Testar Emails
1. Criar uma solicitação de adoção
2. Verificar inbox de acapratest@gmail.com
3. Atualizar status da adoção no admin

#### Testar Doações
```bash
# Registrar doação (público)
POST /api/donations
{
  "donorName": "João Silva",
  "donorEmail": "joao@email.com",
  "donorPhone": "(11) 99999-9999",
  "donationType": "dinheiro",
  "amount": 100.00
}

# Ver estatísticas (admin)
GET /api/donations/stats
```

#### Testar Eventos
```bash
# Criar evento (admin)
POST /api/events
{
  "title": "Feira de Adoção",
  "eventType": "adocao",
  "eventDate": "2024-12-15",
  "eventTime": "10:00",
  "location": "Parque Municipal",
  "isPublic": true
}

# Listar eventos públicos
GET /api/events?upcoming=true
```

#### Testar Máscaras
1. Acesse o formulário de adoção
2. Digite um CPF - deve formatar automaticamente
3. Digite um telefone - deve formatar automaticamente
4. Digite um CEP e clique em Buscar - deve preencher endereço

---

## 📱 Próximos Passos Sugeridos

### Frontend
1. Criar página pública de doações (`/doacoes`)
2. Criar página pública de eventos (`/eventos`)
3. Criar painel admin para gerenciar doações
4. Criar painel admin para gerenciar eventos
5. Adicionar gráficos e dashboards de doações

### Backend
1. Implementar webhook de pagamento (PIX, etc)
2. Criar relatórios em PDF de doações
3. Implementar notificações push
4. Adicionar logs de auditoria

### Melhorias
1. Internacionalização (i18n)
2. Testes automatizados
3. Documentação da API (Swagger)
4. Cache de consultas frequentes

---

## 🐛 Troubleshooting

### Emails não estão sendo enviados
1. Verifique as variáveis de ambiente no Render
2. Certifique-se que a senha de app do Gmail está correta
3. Verifique os logs do servidor para erros de SMTP

### Tabelas não existem no Supabase
1. Execute o SQL `supabase-donations-events-schema.sql`
2. Verifique permissões no Supabase
3. Confirme que as políticas RLS estão corretas

### Máscaras não funcionam
1. Verifique importações dos componentes
2. Certifique-se de usar `Controller` do react-hook-form
3. Veja o console do browser para erros

### ViaCep não retorna endereço
1. Verifique conexão com internet
2. Teste o CEP diretamente: https://viacep.com.br/ws/01310100/json/
3. Alguns CEPs podem não existir na base do ViaCep

---

## 📝 Notas Importantes

1. **Segurança**: Nunca exponha credenciais de email no código
2. **Performance**: As rotas de estatísticas podem ser pesadas, considere cache
3. **Backup**: Faça backup regular das tabelas de doações e eventos
4. **Testes**: Teste em ambiente de desenvolvimento antes de deploy

---

## 👥 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do Render
2. Consulte a documentação do Supabase
3. Revise este documento
4. Entre em contato com o desenvolvedor

---

**Data de Implementação**: Dezembro 2024
**Versão**: 2.0
**Status**: ✅ Implementado e Testado
