-- Criar tabela de Castrações
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "Castrations" (
  id SERIAL PRIMARY KEY,
  
  -- Dados do Animal
  "animalName" VARCHAR(255) NOT NULL,
  "animalSpecies" VARCHAR(50) NOT NULL,
  "animalBreed" VARCHAR(100),
  "animalAge" VARCHAR(50),
  "animalGender" VARCHAR(20),
  "animalWeight" DECIMAL(5,2),
  
  -- Dados do Dono/Responsável
  "ownerName" VARCHAR(255) NOT NULL,
  "ownerEmail" VARCHAR(255),
  "ownerPhone" VARCHAR(20) NOT NULL,
  "ownerCPF" VARCHAR(14),
  "ownerAddress" TEXT,
  "ownerCity" VARCHAR(100),
  "ownerState" VARCHAR(2),
  
  -- Informações da Castração
  "castrationDate" DATE NOT NULL,
  "veterinarianName" VARCHAR(255),
  "clinic" VARCHAR(255),
  "procedure" VARCHAR(100) DEFAULT 'Castração',
  "observations" TEXT,
  
  -- Vínculo com Evento (opcional)
  "eventId" INTEGER REFERENCES "Events"(id) ON DELETE SET NULL,
  
  -- Controle
  status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'realizado', 'cancelado')),
  "registeredBy" INTEGER REFERENCES "Users"(id),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_castrations_date ON "Castrations"("castrationDate");
CREATE INDEX IF NOT EXISTS idx_castrations_event ON "Castrations"("eventId");
CREATE INDEX IF NOT EXISTS idx_castrations_status ON "Castrations"(status);
CREATE INDEX IF NOT EXISTS idx_castrations_owner ON "Castrations"("ownerName", "ownerCPF");

-- Comentários
COMMENT ON TABLE "Castrations" IS 'Registro de castrações realizadas';
COMMENT ON COLUMN "Castrations"."eventId" IS 'ID do evento onde a castração foi realizada (opcional)';
COMMENT ON COLUMN "Castrations"."castrationDate" IS 'Data em que a castração foi/será realizada';

-- RLS (Row Level Security)
ALTER TABLE "Castrations" ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Anyone can view castrations" ON "Castrations"
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert castrations" ON "Castrations"
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update castrations" ON "Castrations"
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admins can delete castrations" ON "Castrations"
  FOR DELETE 
  USING (true);

-- Verificar estrutura
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Castrations'
ORDER BY ordinal_position;
