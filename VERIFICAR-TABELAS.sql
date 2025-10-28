-- EXECUTE ESTES COMANDOS NO SUPABASE SQL EDITOR PARA VERIFICAR AS TABELAS

-- 1. Verificar estrutura da tabela Adoptions
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Adoptions' 
ORDER BY ordinal_position;

-- 2. Verificar estrutura da tabela Animals
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Animals' 
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela News
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'News' 
ORDER BY ordinal_position;

-- 4. Verificar estrutura da tabela Users
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Users' 
ORDER BY ordinal_position;

-- 5. Verificar estrutura da tabela Contacts
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Contacts' 
ORDER BY ordinal_position;
