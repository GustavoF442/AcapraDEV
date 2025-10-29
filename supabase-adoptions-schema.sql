-- ============================================
-- ACAPRA - Schema Completo para Tabela Adoptions
-- Execute no Supabase SQL Editor
-- ============================================

-- Drop e recria a tabela (CUIDADO: Remove dados existentes!)
-- Se você já tem dados, comente o DROP e use apenas o ALTER TABLE abaixo

-- DROP TABLE IF EXISTS "Adoptions" CASCADE;

-- Criar ou recriar tabela Adoptions
CREATE TABLE IF NOT EXISTS "Adoptions" (
  id SERIAL PRIMARY KEY,
  "animalId" INTEGER NOT NULL REFERENCES "Animals"(id) ON DELETE CASCADE,
  
  -- Dados do Adotante
  "adopterName" VARCHAR(255) NOT NULL,
  "adopterEmail" VARCHAR(255) NOT NULL,
  "adopterPhone" VARCHAR(20) NOT NULL,
  "adopterCpf" VARCHAR(14),
  "adopterAddress" TEXT,
  "adopterCity" VARCHAR(100),
  "adopterState" VARCHAR(2),
  
  -- Informações de Moradia
  "housingType" VARCHAR(50),
  "hasYard" BOOLEAN DEFAULT false,
  "isRented" BOOLEAN DEFAULT false,
  "ownerConsent" BOOLEAN DEFAULT false,
  
  -- Experiência com Pets
  "hadPetsBefore" BOOLEAN DEFAULT false,
  "currentPets" TEXT,
  "petCareExperience" TEXT,
  
  -- Motivação e Compromisso
  motivation TEXT NOT NULL,
  "timeForPet" TEXT,
  "whoWillCare" TEXT,
  
  -- Cuidados Veterinários
  "hasVet" BOOLEAN DEFAULT false,
  "vetInfo" TEXT,
  "emergencyPlan" TEXT,
  
  -- Status e Controle
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'cancelado')),
  "reviewedAt" TIMESTAMP,
  "reviewedBy" INTEGER REFERENCES "Users"(id),
  "reviewNotes" TEXT,
  
  -- Timestamps
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Se a tabela já existe e você quer adicionar as colunas faltantes sem perder dados:
-- Descomente e execute linha por linha conforme necessário:

-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterAddress" TEXT;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterCity" VARCHAR(100);
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterState" VARCHAR(2);
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "adopterCpf" VARCHAR(14);
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "housingType" VARCHAR(50);
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hasYard" BOOLEAN DEFAULT false;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "isRented" BOOLEAN DEFAULT false;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "ownerConsent" BOOLEAN DEFAULT false;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hadPetsBefore" BOOLEAN DEFAULT false;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "currentPets" TEXT;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "petCareExperience" TEXT;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "timeForPet" TEXT;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "whoWillCare" TEXT;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "hasVet" BOOLEAN DEFAULT false;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "vetInfo" TEXT;
-- ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS "emergencyPlan" TEXT;

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_adoptions_animal ON "Adoptions"("animalId");
CREATE INDEX IF NOT EXISTS idx_adoptions_status ON "Adoptions"(status);
CREATE INDEX IF NOT EXISTS idx_adoptions_email ON "Adoptions"("adopterEmail");
CREATE INDEX IF NOT EXISTS idx_adoptions_created ON "Adoptions"("createdAt");

-- Comentários
COMMENT ON TABLE "Adoptions" IS 'Solicitações de adoção de animais';
COMMENT ON COLUMN "Adoptions"."animalId" IS 'ID do animal que está sendo adotado';
COMMENT ON COLUMN "Adoptions"."adopterAddress" IS 'Endereço completo do adotante';
COMMENT ON COLUMN "Adoptions"."housingType" IS 'Tipo de moradia (casa, apartamento, chácara, etc)';
COMMENT ON COLUMN "Adoptions"."hasYard" IS 'Possui quintal/área externa';
COMMENT ON COLUMN "Adoptions"."isRented" IS 'Moradia é alugada';
COMMENT ON COLUMN "Adoptions"."ownerConsent" IS 'Proprietário permite animais (se alugado)';
COMMENT ON COLUMN "Adoptions"."motivation" IS 'Motivação para adotar';
COMMENT ON COLUMN "Adoptions"."emergencyPlan" IS 'Plano para emergências veterinárias';

-- RLS (Row Level Security)
ALTER TABLE "Adoptions" ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode inserir (formulário público)
CREATE POLICY "Anyone can insert adoptions" ON "Adoptions"
  FOR INSERT 
  WITH CHECK (true);

-- Política: Apenas admin/moderador pode ver todas
CREATE POLICY "Admins can view all adoptions" ON "Adoptions"
  FOR SELECT 
  USING (true);

-- Política: Apenas admin/moderador pode atualizar
CREATE POLICY "Admins can update adoptions" ON "Adoptions"
  FOR UPDATE 
  USING (true);

-- Política: Apenas admin pode deletar
CREATE POLICY "Admins can delete adoptions" ON "Adoptions"
  FOR DELETE 
  USING (true);

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Adoptions'
ORDER BY ordinal_position;

-- Contar registros
SELECT COUNT(*) as total_adoptions FROM "Adoptions";
