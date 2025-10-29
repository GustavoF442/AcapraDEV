-- Corrigir ENUM de status na tabela Adoptions
-- Execute no Supabase SQL Editor linha por linha

-- OPÇÃO 1: Adicionar valor faltante ao ENUM existente (RECOMENDADO)
-- Execute APENAS esta linha:
ALTER TYPE "enum_Adoptions_status" ADD VALUE IF NOT EXISTS 'em_analise';

-- Verificar se funcionou:
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'enum_Adoptions_status'
)
ORDER BY enumlabel;

-- Resultado esperado: cancelado, em_analise, aprovado, pendente, rejeitado

-- Se ainda der erro, tente a OPÇÃO 2 abaixo:

-- ============================================================
-- OPÇÃO 2: Remover ENUM e usar VARCHAR (se a opção 1 falhar)
-- ============================================================

-- 1. Alterar coluna para VARCHAR temporariamente
ALTER TABLE "Adoptions" 
ALTER COLUMN status TYPE VARCHAR(50);

-- 2. Remover o ENUM type antigo
DROP TYPE IF EXISTS "enum_Adoptions_status" CASCADE;

-- 3. Adicionar constraint com CHECK
ALTER TABLE "Adoptions" 
ADD CONSTRAINT "Adoptions_status_check" 
CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'cancelado'));

-- 4. Definir valor padrão
ALTER TABLE "Adoptions" 
ALTER COLUMN status SET DEFAULT 'pendente';

-- 5. Verificar estrutura
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'Adoptions' AND column_name = 'status';

-- 6. Testar update
UPDATE "Adoptions" SET status = 'em_analise' WHERE id = 1;
-- Se funcionar, desfaça:
UPDATE "Adoptions" SET status = 'pendente' WHERE id = 1;
