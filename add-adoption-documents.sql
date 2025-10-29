-- Adicionar coluna de documentos na tabela Adoptions
-- Execute no Supabase SQL Editor

-- 1. Adicionar coluna documents (JSONB para armazenar array de documentos)
ALTER TABLE "Adoptions" ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- 2. Comentário
COMMENT ON COLUMN "Adoptions".documents IS 'Array JSON de documentos anexados (RG, comprovante residência, etc)';

-- 3. Exemplo de estrutura esperada:
-- [
--   {
--     "id": "uuid",
--     "type": "RG",
--     "fileName": "rg_joao.pdf",
--     "fileUrl": "https://...",
--     "uploadedAt": "2024-01-15T10:30:00.000Z",
--     "uploadedBy": 1
--   },
--   {
--     "type": "Comprovante Residência",
--     "fileName": "comprovante.pdf",
--     "fileUrl": "https://...",
--     "uploadedAt": "2024-01-15T10:32:00.000Z",
--     "uploadedBy": 1
--   }
-- ]

-- 4. Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Adoptions' AND column_name = 'documents';
