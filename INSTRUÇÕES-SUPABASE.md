# 🔧 INSTRUÇÕES URGENTES - Corrigir Tabela Adoptions no Supabase

## ⚠️ ERRO ATUAL
```
Could not find the 'adopterAddress' column of 'Adoptions' in the schema cache
```

## 🎯 SOLUÇÃO

A tabela `Adoptions` no Supabase está incompleta. Você precisa adicionar as colunas faltantes.

---

## 📝 PASSO A PASSO

### 1. Acesse o Supabase
1. Vá para: https://supabase.com/dashboard
2. Login no seu projeto
3. Clique no seu projeto **ACAPRA**

### 2. Abra o SQL Editor
1. No menu lateral, clique em **SQL Editor** (ícone </> )
2. Clique em **New query** ou **Nova consulta**

### 3. Execute o SQL

**OPÇÃO A - Se você JÁ TEM dados na tabela Adoptions (recomendado):**

Cole este SQL para adicionar apenas as colunas faltantes:

```sql
-- Adicionar colunas faltantes SEM perder dados
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterAddress" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterCity" VARCHAR(100);
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterState" VARCHAR(2);
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterCpf" VARCHAR(14);
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "housingType" VARCHAR(50);
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hasYard" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "isRented" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "ownerConsent" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hadPetsBefore" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "currentPets" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "petCareExperience" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "timeForPet" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "whoWillCare" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hasVet" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "vetInfo" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "emergencyPlan" TEXT;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_adoptions_animal ON "Adoptions"("animalId");
CREATE INDEX IF NOT EXISTS idx_adoptions_status ON "Adoptions"(status);
CREATE INDEX IF NOT EXISTS idx_adoptions_email ON "Adoptions"("adopterEmail");
CREATE INDEX IF NOT EXISTS idx_adoptions_created ON "Adoptions"("createdAt");
```

**OPÇÃO B - Se a tabela está VAZIA ou você pode recriá-la:**

Cole todo o conteúdo do arquivo: `supabase-adoptions-schema.sql`

### 4. Clique em RUN ou Execute

Aguarde aparecer: **Success. No rows returned**

### 5. Verificar se funcionou

Execute este SQL para ver todas as colunas:

```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'Adoptions'
ORDER BY ordinal_position;
```

Deve aparecer TODAS estas colunas:
- ✅ id
- ✅ animalId
- ✅ adopterName
- ✅ adopterEmail
- ✅ adopterPhone
- ✅ adopterCpf
- ✅ **adopterAddress** ← PRINCIPAL!
- ✅ adopterCity
- ✅ adopterState
- ✅ housingType
- ✅ hasYard
- ✅ isRented
- ✅ ownerConsent
- ✅ hadPetsBefore
- ✅ currentPets
- ✅ petCareExperience
- ✅ motivation
- ✅ timeForPet
- ✅ whoWillCare
- ✅ hasVet
- ✅ vetInfo
- ✅ emergencyPlan
- ✅ status
- ✅ reviewedAt
- ✅ reviewedBy
- ✅ reviewNotes
- ✅ createdAt
- ✅ updatedAt

---

## 🧪 TESTAR DEPOIS

Após executar o SQL:

1. **Não precisa fazer novo deploy!** O Supabase atualiza na hora
2. Aguarde 30 segundos (cache do Supabase limpar)
3. Teste novamente: https://acapradev.onrender.com/adotar/35
4. Preencha o formulário
5. Envie
6. ✅ **Deve funcionar agora!**

---

## ❓ PROBLEMAS?

### Erro: "relation Adoptions does not exist"
**Solução**: A tabela não existe. Use o script completo do `supabase-adoptions-schema.sql`

### Erro: "column already exists"
**Solução**: Normal! A coluna já existe. Continue executando os outros ALTER TABLE.

### Ainda dá erro 500
**Solução**: 
1. Verifique se TODAS as colunas foram criadas (query de verificação acima)
2. Aguarde 1 minuto (cache do Supabase)
3. Teste em janela anônima do navegador

---

## 🎯 QUICK FIX (Copie e cole direto)

**Para aplicar AGORA sem ler tudo:**

```sql
-- Cole isso e execute:
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterAddress" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterCity" VARCHAR(100);
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterState" VARCHAR(2);
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterCpf" VARCHAR(14);
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "housingType" VARCHAR(50);
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hasYard" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "isRented" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "ownerConsent" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hadPetsBefore" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "currentPets" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "petCareExperience" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "timeForPet" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "whoWillCare" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hasVet" BOOLEAN DEFAULT false;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "vetInfo" TEXT;
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "emergencyPlan" TEXT;
```

**Pronto! Aguarde 30 segundos e teste o formulário.**

---

## 📊 Estrutura de Campos do Formulário

Os campos do formulário são mapeados assim:

| Campo do Formulário | Coluna no Banco | Obrigatório |
|---------------------|-----------------|-------------|
| Nome Completo | adopterName | ✅ Sim |
| Email | adopterEmail | ✅ Sim |
| Telefone | adopterPhone | ✅ Sim |
| CPF | adopterCpf | ❌ Não |
| Endereço | **adopterAddress** | ❌ Não |
| Cidade | adopterCity | ❌ Não |
| Estado | adopterState | ❌ Não |
| Tipo de Moradia | housingType | ❌ Não |
| Tem quintal? | hasYard | ❌ Não |
| Moradia alugada? | isRented | ❌ Não |
| Proprietário permite? | ownerConsent | ❌ Não |
| Teve pets antes? | hadPetsBefore | ❌ Não |
| Pets atuais | currentPets | ❌ Não |
| Experiência | petCareExperience | ❌ Não |
| Motivação | motivation | ✅ Sim |
| Tempo disponível | timeForPet | ❌ Não |
| Quem cuidará | whoWillCare | ❌ Não |
| Tem veterinário | hasVet | ❌ Não |
| Info veterinário | vetInfo | ❌ Não |
| Plano emergência | emergencyPlan | ❌ Não |

---

## ✅ RESUMO

1. ☑️ Acesse Supabase
2. ☑️ SQL Editor
3. ☑️ Cole os ALTER TABLE
4. ☑️ Execute (RUN)
5. ☑️ Aguarde 30 seg
6. ☑️ Teste o formulário
7. ✅ **RESOLVIDO!**
