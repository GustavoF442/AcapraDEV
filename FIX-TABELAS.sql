-- =====================================================
-- SCRIPT DE CORREÇÃO DAS TABELAS DO SUPABASE
-- Execute no SQL Editor do Supabase
-- =====================================================

-- 1. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public."Contacts" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'novo',
    response TEXT,
    "respondedBy" INTEGER,
    "respondedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADOPTIONS TABLE (todos os campos em camelCase)
CREATE TABLE IF NOT EXISTS public."Adoptions" (
    id SERIAL PRIMARY KEY,
    "animalId" INTEGER NOT NULL,
    "adopterName" TEXT NOT NULL,
    "adopterEmail" TEXT NOT NULL,
    "adopterPhone" TEXT NOT NULL,
    "adopterCpf" TEXT,
    "adopterAddress" TEXT,
    "adopterCity" TEXT,
    "adopterState" TEXT,
    "housingType" TEXT,
    "hasYard" BOOLEAN DEFAULT FALSE,
    "isRented" BOOLEAN DEFAULT FALSE,
    "ownerConsent" BOOLEAN DEFAULT FALSE,
    "hadPetsBefore" BOOLEAN DEFAULT FALSE,
    "currentPets" TEXT,
    "petCareExperience" TEXT,
    motivation TEXT NOT NULL,
    "timeForPet" TEXT,
    "whoWillCare" TEXT,
    "hasVet" BOOLEAN DEFAULT FALSE,
    "vetInfo" TEXT,
    "emergencyPlan" TEXT,
    status TEXT DEFAULT 'pendente',
    "reviewedAt" TIMESTAMP WITH TIME ZONE,
    "reviewedBy" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("animalId") REFERENCES public."Animals"(id) ON DELETE CASCADE
);

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS public."Users" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    "lastLogin" TIMESTAMP WITH TIME ZONE,
    department TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ANIMALS TABLE
CREATE TABLE IF NOT EXISTS public."Animals" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT,
    age TEXT,
    gender TEXT,
    size TEXT,
    description TEXT,
    city TEXT NOT NULL DEFAULT 'São Paulo',
    state TEXT NOT NULL DEFAULT 'SP',
    vaccinated BOOLEAN DEFAULT FALSE,
    neutered BOOLEAN DEFAULT FALSE,
    dewormed BOOLEAN DEFAULT FALSE,
    "specialNeeds" BOOLEAN DEFAULT FALSE,
    "healthNotes" TEXT,
    friendly BOOLEAN DEFAULT FALSE,
    playful BOOLEAN DEFAULT FALSE,
    calm BOOLEAN DEFAULT FALSE,
    protective BOOLEAN DEFAULT FALSE,
    social BOOLEAN DEFAULT FALSE,
    independent BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT FALSE,
    docile BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'disponível',
    featured BOOLEAN DEFAULT FALSE,
    photos JSONB DEFAULT '[]',
    "createdBy" INTEGER,
    "adoptionId" INTEGER,
    "adopterName" TEXT,
    "adopterEmail" TEXT,
    "adopterPhone" TEXT,
    "adoptedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. NEWS TABLE
CREATE TABLE IF NOT EXISTS public."News" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    status TEXT DEFAULT 'rascunho',
    tags JSONB DEFAULT '[]',
    image JSONB,
    author INTEGER,
    views INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ADICIONAR COLUNAS FALTANTES (se as tabelas já existirem)
-- =====================================================

-- Animals
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Animals' AND column_name='updatedAt') THEN
        ALTER TABLE public."Animals" ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Animals' AND column_name='adoptionId') THEN
        ALTER TABLE public."Animals" ADD COLUMN "adoptionId" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Animals' AND column_name='adopterName') THEN
        ALTER TABLE public."Animals" ADD COLUMN "adopterName" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Animals' AND column_name='adopterEmail') THEN
        ALTER TABLE public."Animals" ADD COLUMN "adopterEmail" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Animals' AND column_name='adopterPhone') THEN
        ALTER TABLE public."Animals" ADD COLUMN "adopterPhone" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Animals' AND column_name='adoptedAt') THEN
        ALTER TABLE public."Animals" ADD COLUMN "adoptedAt" TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='department') THEN
        ALTER TABLE public."Users" ADD COLUMN department TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='lastLogin') THEN
        ALTER TABLE public."Users" ADD COLUMN "lastLogin" TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Contacts
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Contacts' AND column_name='response') THEN
        ALTER TABLE public."Contacts" ADD COLUMN response TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Contacts' AND column_name='respondedBy') THEN
        ALTER TABLE public."Contacts" ADD COLUMN "respondedBy" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Contacts' AND column_name='respondedAt') THEN
        ALTER TABLE public."Contacts" ADD COLUMN "respondedAt" TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- News
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='News' AND column_name='updatedAt') THEN
        ALTER TABLE public."News" ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- =====================================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_animals_status ON public."Animals"(status);
CREATE INDEX IF NOT EXISTS idx_animals_species ON public."Animals"(species);
CREATE INDEX IF NOT EXISTS idx_adoptions_animalid ON public."Adoptions"("animalId");
CREATE INDEX IF NOT EXISTS idx_adoptions_status ON public."Adoptions"(status);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public."Contacts"(status);
CREATE INDEX IF NOT EXISTS idx_news_status ON public."News"(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON public."Users"(email);

-- =====================================================
-- HABILITAR RLS (Row Level Security) - OPCIONAL
-- =====================================================

-- ALTER TABLE public."Animals" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public."Adoptions" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public."Contacts" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public."News" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- VERIFICAR SE DEU CERTO:
SELECT 'Contacts' as table_name, count(*) as column_count FROM information_schema.columns WHERE table_name='Contacts'
UNION ALL
SELECT 'Adoptions', count(*) FROM information_schema.columns WHERE table_name='Adoptions'
UNION ALL
SELECT 'Users', count(*) FROM information_schema.columns WHERE table_name='Users'
UNION ALL
SELECT 'Animals', count(*) FROM information_schema.columns WHERE table_name='Animals'
UNION ALL
SELECT 'News', count(*) FROM information_schema.columns WHERE table_name='News';
