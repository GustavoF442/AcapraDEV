-- ============================================
-- Schema para Doações e Eventos - ACAPRA
-- ============================================

-- Tabela de Doações
CREATE TABLE IF NOT EXISTS "Donations" (
  "id" SERIAL PRIMARY KEY,
  "donorName" VARCHAR(255) NOT NULL,
  "donorEmail" VARCHAR(255) NOT NULL,
  "donorPhone" VARCHAR(20),
  "donorCPF" VARCHAR(14),
  "donationType" VARCHAR(50) NOT NULL CHECK ("donationType" IN ('dinheiro', 'ração', 'medicamentos', 'materiais', 'outros')),
  "amount" DECIMAL(10, 2) DEFAULT 0,
  "description" TEXT,
  "paymentMethod" VARCHAR(50) CHECK ("paymentMethod" IN ('pix', 'boleto', 'cartao', 'transferencia', 'dinheiro', 'outro')),
  "status" VARCHAR(50) DEFAULT 'pendente' CHECK ("status" IN ('pendente', 'confirmado', 'recebido', 'cancelado')),
  "donationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "receiptIssued" BOOLEAN DEFAULT FALSE,
  "receiptNumber" VARCHAR(100),
  "isRecurring" BOOLEAN DEFAULT FALSE,
  "recurringFrequency" VARCHAR(50) CHECK ("recurringFrequency" IN ('mensal', 'trimestral', 'semestral', 'anual')),
  "registeredBy" INTEGER REFERENCES "Users"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para Doações
CREATE INDEX IF NOT EXISTS "idx_donations_status" ON "Donations"("status");
CREATE INDEX IF NOT EXISTS "idx_donations_type" ON "Donations"("donationType");
CREATE INDEX IF NOT EXISTS "idx_donations_date" ON "Donations"("donationDate");
CREATE INDEX IF NOT EXISTS "idx_donations_email" ON "Donations"("donorEmail");
CREATE INDEX IF NOT EXISTS "idx_donations_registered_by" ON "Donations"("registeredBy");

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS "Events" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "eventType" VARCHAR(50) NOT NULL CHECK ("eventType" IN ('adocao', 'campanha', 'palestra', 'feira', 'arrecadacao', 'outro')),
  "eventDate" DATE NOT NULL,
  "eventTime" TIME,
  "endDate" DATE,
  "endTime" TIME,
  "location" VARCHAR(255),
  "address" TEXT,
  "city" VARCHAR(100),
  "state" VARCHAR(2),
  "zipCode" VARCHAR(10),
  "latitude" DECIMAL(10, 8),
  "longitude" DECIMAL(11, 8),
  "maxParticipants" INTEGER,
  "currentParticipants" INTEGER DEFAULT 0,
  "status" VARCHAR(50) DEFAULT 'planejado' CHECK ("status" IN ('planejado', 'confirmado', 'em_andamento', 'concluido', 'cancelado')),
  "isPublic" BOOLEAN DEFAULT TRUE,
  "bannerUrl" VARCHAR(500),
  "contactName" VARCHAR(255),
  "contactPhone" VARCHAR(20),
  "contactEmail" VARCHAR(255),
  "notes" TEXT,
  "createdBy" INTEGER REFERENCES "Users"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para Eventos
CREATE INDEX IF NOT EXISTS "idx_events_status" ON "Events"("status");
CREATE INDEX IF NOT EXISTS "idx_events_type" ON "Events"("eventType");
CREATE INDEX IF NOT EXISTS "idx_events_date" ON "Events"("eventDate");
CREATE INDEX IF NOT EXISTS "idx_events_public" ON "Events"("isPublic");
CREATE INDEX IF NOT EXISTS "idx_events_created_by" ON "Events"("createdBy");

-- Função para atualizar updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updatedAt
DROP TRIGGER IF EXISTS update_donations_updated_at ON "Donations";
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON "Donations"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON "Events";
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON "Events"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Adicionar política RLS (Row Level Security)
ALTER TABLE "Donations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Events" ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT público em eventos públicos
CREATE POLICY "Public events are viewable by everyone"
  ON "Events"
  FOR SELECT
  USING ("isPublic" = TRUE);

-- Política para permitir INSERT público em doações
CREATE POLICY "Anyone can create donations"
  ON "Donations"
  FOR INSERT
  WITH CHECK (TRUE);

-- Política para administradores terem acesso total
CREATE POLICY "Admins have full access to donations"
  ON "Donations"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Users"
      WHERE "Users"."id" = auth.uid()
      AND "Users"."role" IN ('admin', 'volunteer')
    )
  );

CREATE POLICY "Admins have full access to events"
  ON "Events"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Users"
      WHERE "Users"."id" = auth.uid()
      AND "Users"."role" IN ('admin', 'volunteer')
    )
  );

-- Comentários nas tabelas
COMMENT ON TABLE "Donations" IS 'Tabela para registrar todas as doações recebidas pela ACAPRA';
COMMENT ON TABLE "Events" IS 'Tabela para gerenciar eventos e agenda da ACAPRA';

-- Dados de exemplo (opcional - remover em produção)
-- INSERT INTO "Donations" ("donorName", "donorEmail", "donorPhone", "donationType", "amount", "status")
-- VALUES 
--   ('João Silva', 'joao@example.com', '(11) 99999-9999', 'dinheiro', 100.00, 'confirmado'),
--   ('Maria Santos', 'maria@example.com', '(11) 88888-8888', 'ração', 0, 'recebido');

-- INSERT INTO "Events" ("title", "description", "eventType", "eventDate", "eventTime", "location", "isPublic", "status")
-- VALUES 
--   ('Feira de Adoção', 'Feira de adoção mensal com diversos animais disponíveis', 'adocao', CURRENT_DATE + INTERVAL '7 days', '10:00:00', 'Parque Municipal', TRUE, 'confirmado'),
--   ('Campanha de Vacinação', 'Vacinação gratuita para animais resgatados', 'campanha', CURRENT_DATE + INTERVAL '14 days', '14:00:00', 'Sede da ACAPRA', TRUE, 'planejado');

-- Verificação final
SELECT 
  'Donations' as table_name, 
  COUNT(*) as row_count 
FROM "Donations"
UNION ALL
SELECT 
  'Events' as table_name, 
  COUNT(*) as row_count 
FROM "Events";
