# 🔍 DIAGNÓSTICO COMPLETO - ERROS 400

## ❌ PROBLEMA: Erro 400 em todos os formulários

O erro 400 indica que o backend está rejeitando os dados. Possíveis causas:
1. Campos que o frontend envia mas a tabela Supabase não tem
2. Campos obrigatórios faltando
3. Tipos de dados incompatíveis

## 📋 MAPEAMENTO COMPLETO

### 1️⃣ CONTACT FORM

**Frontend envia:**
- name (string)
- email (string)
- phone (string, opcional)
- subject (string)
- message (string)

**Backend insere em Contacts:**
```javascript
{
  name,
  email,
  phone,
  subject,
  message,
  status: 'novo',
  createdAt: new Date().toISOString()
}
```

**Tabela Contacts DEVE TER:**
- id (serial primary key)
- name (text NOT NULL)
- email (text NOT NULL)
- phone (text)
- subject (text NOT NULL)
- message (text NOT NULL)
- status (text DEFAULT 'novo')
- createdAt (timestamp with time zone)

---

### 2️⃣ ADOPTIONS FORM

**Frontend envia (camelCase):**
- animalId
- adopterName, adopterEmail, adopterPhone, adopterCpf
- adopterAddress, adopterCity, adopterState
- housingType, hasYard, isRented, ownerConsent
- hadPetsBefore, currentPets, petCareExperience
- motivation, timeForPet, whoWillCare
- hasVet, vetInfo, emergencyPlan

**Backend insere em Adoptions (camelCase):**
```javascript
{
  animalId: parseInt(animalId),
  adopterName,
  adopterEmail,
  adopterPhone,
  adopterCpf,
  adopterAddress,
  adopterCity,
  adopterState,
  housingType,
  hasYard,
  isRented,
  ownerConsent,
  hadPetsBefore,
  currentPets,
  petCareExperience,
  motivation,
  timeForPet,
  whoWillCare,
  hasVet,
  vetInfo,
  emergencyPlan,
  status: 'pendente',
  createdAt: new Date().toISOString()
}
```

**Tabela Adoptions DEVE TER (TODOS em camelCase):**
- id (serial primary key)
- animalId (integer NOT NULL, foreign key)
- adopterName (text NOT NULL)
- adopterEmail (text NOT NULL)
- adopterPhone (text NOT NULL)
- adopterCpf (text)
- adopterAddress (text)
- adopterCity (text)
- adopterState (text)
- housingType (text)
- hasYard (boolean DEFAULT false)
- isRented (boolean DEFAULT false)
- ownerConsent (boolean DEFAULT false)
- hadPetsBefore (boolean DEFAULT false)
- currentPets (text)
- petCareExperience (text)
- motivation (text NOT NULL)
- timeForPet (text)
- whoWillCare (text)
- hasVet (boolean DEFAULT false)
- vetInfo (text)
- emergencyPlan (text)
- status (text DEFAULT 'pendente')
- createdAt (timestamp with time zone)

---

### 3️⃣ USERS FORM

**Frontend envia:**
- name (string)
- email (string)
- password (string, opcional em edição)
- role (string: 'admin', 'moderator', 'volunteer', 'user')
- status (string: 'active', 'inactive')

**Backend insere em Users:**
```javascript
{
  name,
  email: email.toLowerCase(),
  password: hashedPassword,
  role: role || 'user',
  status: status || 'active',
  createdAt: new Date().toISOString()
}
```

**Tabela Users DEVE TER:**
- id (serial primary key)
- name (text NOT NULL)
- email (text NOT NULL UNIQUE)
- password (text NOT NULL)
- role (text DEFAULT 'user')
- status (text DEFAULT 'active')
- createdAt (timestamp with time zone)

---

### 4️⃣ ANIMALS FORM

**Frontend envia (FormData com fotos):**
- name, species, breed, age, gender, size
- description, city, state
- vaccinated, neutered, dewormed, specialNeeds, healthNotes
- friendly, playful, calm, protective, social, independent, active, docile
- status, featured
- photos (array de arquivos)

**Backend insere em Animals:**
```javascript
{
  name, species, breed, age, gender, size, description,
  city: city || 'São Paulo',
  state: state || 'SP',
  vaccinated, neutered, dewormed, specialNeeds, healthNotes,
  friendly, playful, calm, protective, social, independent, active, docile,
  status: status || 'disponível',
  featured,
  photos: [array de objetos com URL do Supabase],
  createdBy: req.user.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

**Tabela Animals DEVE TER:**
- id (serial primary key)
- name (text NOT NULL)
- species (text NOT NULL)
- breed (text)
- age (text)
- gender (text)
- size (text)
- description (text)
- city (text NOT NULL DEFAULT 'São Paulo')
- state (text NOT NULL DEFAULT 'SP')
- vaccinated (boolean DEFAULT false)
- neutered (boolean DEFAULT false)
- dewormed (boolean DEFAULT false)
- specialNeeds (boolean DEFAULT false)
- healthNotes (text)
- friendly (boolean DEFAULT false)
- playful (boolean DEFAULT false)
- calm (boolean DEFAULT false)
- protective (boolean DEFAULT false)
- social (boolean DEFAULT false)
- independent (boolean DEFAULT false)
- active (boolean DEFAULT false)
- docile (boolean DEFAULT false)
- status (text DEFAULT 'disponível')
- featured (boolean DEFAULT false)
- photos (jsonb DEFAULT '[]')
- createdBy (integer)
- adoptionId (integer)
- adopterName (text)
- adopterEmail (text)
- adopterPhone (text)
- adoptedAt (timestamp with time zone)
- createdAt (timestamp with time zone)
- updatedAt (timestamp with time zone NOT NULL)

---

### 5️⃣ NEWS FORM

**Frontend envia:**
- title, content, excerpt, status, tags
- image (objeto: {filename, path, url, size})

**Backend insere em News:**
```javascript
{
  title,
  content,
  excerpt,
  status: status || 'rascunho',
  tags: tags || [],
  image: image || null,
  author: req.user.id,
  views: 0,
  createdAt: new Date().toISOString()
}
```

**Tabela News DEVE TER:**
- id (serial primary key)
- title (text NOT NULL)
- content (text NOT NULL)
- excerpt (text)
- status (text DEFAULT 'rascunho')
- tags (jsonb DEFAULT '[]')
- image (jsonb)
- author (integer)
- views (integer DEFAULT 0)
- createdAt (timestamp with time zone)
- updatedAt (timestamp with time zone)

---

## 🔧 SOLUÇÃO

### PASSO 1: Execute o SQL abaixo no Supabase

Vá em: https://supabase.com/dashboard → Seu Projeto → SQL Editor

Cole e execute o arquivo `FIX-TABELAS.sql` que vou criar agora.

### PASSO 2: Teste cada formulário

Após executar o SQL, teste:
1. /contato → Enviar mensagem
2. /adotar/:id → Solicitar adoção
3. /admin/usuarios/novo → Criar usuário
4. /admin/animais/novo → Cadastrar animal
5. /admin/noticias/nova → Criar notícia

### PASSO 3: Verificar logs

Se ainda der erro, veja os logs do Render:
https://dashboard.render.com → Seu serviço → Logs
