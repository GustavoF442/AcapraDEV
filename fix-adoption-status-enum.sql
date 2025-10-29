-- Corrigir constraint de status na tabela Adoptions
-- Execute no Supabase SQL Editor

-- 1. Remover constraint antiga (se existir)
ALTER TABLE "Adoptions" DROP CONSTRAINT IF EXISTS "Adoptions_status_check";

-- 2. Adicionar novo constraint com valores corretos
ALTER TABLE "Adoptions" ADD CONSTRAINT "Adoptions_status_check" 
CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'cancelado'));

-- 3. Verificar constraint
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conname LIKE '%Adoptions%status%';

-- 4. Testar update (não vai executar, apenas validar)
-- UPDATE "Adoptions" SET status = 'em_analise' WHERE id = 1;
