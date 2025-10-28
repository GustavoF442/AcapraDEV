-- ============================================
-- ACAPRA - Schema para Sistema de Doações
-- Execute no Supabase SQL Editor
-- ============================================

-- Tabela de Doações
CREATE TABLE IF NOT EXISTS "Donations" (
  id SERIAL PRIMARY KEY,
  "donorName" VARCHAR(255) NOT NULL,
  "donorEmail" VARCHAR(255),
  "donorPhone" VARCHAR(20),
  "donorCpf" VARCHAR(14),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  type VARCHAR(50) NOT NULL CHECK (type IN ('dinheiro', 'pix', 'cartão', 'transferência', 'material', 'voluntariado')),
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  "paymentMethod" VARCHAR(50),
  "transactionId" VARCHAR(255),
  description TEXT,
  notes TEXT,
  "receiptUrl" VARCHAR(500),
  "donatedAt" TIMESTAMP DEFAULT NOW(),
  "confirmedAt" TIMESTAMP,
  "confirmedBy" INTEGER REFERENCES "Users"(id),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Tabela de Lançamentos Financeiros (Receitas e Despesas)
CREATE TABLE IF NOT EXISTS "FinancialTransactions" (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL CHECK (type IN ('receita', 'despesa')),
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  "transactionDate" TIMESTAMP NOT NULL,
  "paymentMethod" VARCHAR(50),
  "referenceNumber" VARCHAR(255),
  "attachmentUrl" VARCHAR(500),
  notes TEXT,
  "relatedDonationId" INTEGER REFERENCES "Donations"(id),
  "createdBy" INTEGER REFERENCES "Users"(id) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON "Donations"(status);
CREATE INDEX IF NOT EXISTS idx_donations_donated_at ON "Donations"("donatedAt");
CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON "Donations"("donorEmail");
CREATE INDEX IF NOT EXISTS idx_financial_type ON "FinancialTransactions"(type);
CREATE INDEX IF NOT EXISTS idx_financial_category ON "FinancialTransactions"(category);
CREATE INDEX IF NOT EXISTS idx_financial_date ON "FinancialTransactions"("transactionDate");

-- Comentários nas tabelas
COMMENT ON TABLE "Donations" IS 'Tabela de doações recebidas pela ACAPRA';
COMMENT ON TABLE "FinancialTransactions" IS 'Tabela de lançamentos financeiros (receitas e despesas)';

-- Inserir dados de exemplo (opcional - remova se não quiser)
INSERT INTO "Donations" ("donorName", "donorEmail", "donorPhone", amount, type, status, description, "donatedAt") VALUES
('João Silva', 'joao@email.com', '(11) 98765-4321', 150.00, 'pix', 'confirmado', 'Doação para ração', NOW() - INTERVAL '5 days'),
('Maria Santos', 'maria@email.com', '(11) 91234-5678', 300.00, 'transferência', 'confirmado', 'Doação para tratamento veterinário', NOW() - INTERVAL '3 days'),
('Pedro Oliveira', NULL, NULL, 50.00, 'dinheiro', 'pendente', 'Doação em dinheiro', NOW() - INTERVAL '1 day');

INSERT INTO "FinancialTransactions" (type, category, description, amount, "transactionDate", "createdBy") VALUES
('receita', 'Doação', 'Doação recebida de João Silva', 150.00, NOW() - INTERVAL '5 days', 1),
('receita', 'Doação', 'Doação recebida de Maria Santos', 300.00, NOW() - INTERVAL '3 days', 1),
('despesa', 'Alimentação', 'Compra de ração - 3 sacos 15kg', 220.00, NOW() - INTERVAL '2 days', 1),
('despesa', 'Veterinária', 'Consulta e vacinas para 5 animais', 450.00, NOW() - INTERVAL '1 day', 1),
('despesa', 'Infraestrutura', 'Materiais de limpeza e higiene', 85.00, NOW(), 1);

-- RLS (Row Level Security) - Desabilitar para admin ter acesso total
ALTER TABLE "Donations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FinancialTransactions" ENABLE ROW LEVEL SECURITY;

-- Política: Admin e moderadores podem ver tudo
CREATE POLICY "Admins can view all donations" ON "Donations"
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert donations" ON "Donations"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update donations" ON "Donations"
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete donations" ON "Donations"
  FOR DELETE USING (true);

CREATE POLICY "Admins can view all transactions" ON "FinancialTransactions"
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert transactions" ON "FinancialTransactions"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update transactions" ON "FinancialTransactions"
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete transactions" ON "FinancialTransactions"
  FOR DELETE USING (true);

-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Donations', 'FinancialTransactions');
