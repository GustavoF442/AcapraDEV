// Utilitários para máscaras de campos

// Máscara para CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00)
export const maskCPF = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Limita a 14 dígitos (CNPJ)
  value = value.substring(0, 14);
  
  // Aplica máscara de CPF (11 dígitos) ou CNPJ (14 dígitos)
  if (value.length <= 11) {
    // Máscara de CPF: 000.000.000-00
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // Máscara de CNPJ: 00.000.000/0000-00
    value = value.replace(/(\d{2})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1/$2');
    value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
  
  return value;
};

// Remove máscara do CPF
export const unmaskCPF = (value) => {
  return value ? value.replace(/\D/g, '') : '';
};

// Máscara para Telefone/Celular ((00) 00000-0000 ou (00) 0000-0000)
export const maskPhone = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  value = value.substring(0, 11);
  
  // Aplica a máscara
  if (value.length <= 10) {
    // Formato: (00) 0000-0000
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Formato: (00) 00000-0000
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  return value;
};

// Remove máscara do telefone
export const unmaskPhone = (value) => {
  return value ? value.replace(/\D/g, '') : '';
};

// Máscara para CEP (00000-000)
export const maskCEP = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Limita a 8 dígitos
  value = value.substring(0, 8);
  
  // Aplica a máscara
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  
  return value;
};

// Remove máscara do CEP
export const unmaskCEP = (value) => {
  return value ? value.replace(/\D/g, '') : '';
};

// Máscara para Moeda (R$ 0.000,00)
export const maskMoney = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Converte para número e formata
  const number = parseFloat(value) / 100;
  
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Remove máscara da moeda e retorna número
export const unmaskMoney = (value) => {
  if (!value) return 0;
  
  // Remove tudo que não é dígito ou vírgula
  value = value.replace(/[^\d,]/g, '');
  
  // Substitui vírgula por ponto
  value = value.replace(',', '.');
  
  return parseFloat(value) || 0;
};

// Máscara para Data (DD/MM/AAAA)
export const maskDate = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Limita a 8 dígitos
  value = value.substring(0, 8);
  
  // Aplica a máscara
  value = value.replace(/(\d{2})(\d)/, '$1/$2');
  value = value.replace(/(\d{2})(\d)/, '$1/$2');
  
  return value;
};

// Máscara para Hora (HH:MM)
export const maskTime = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Limita a 4 dígitos
  value = value.substring(0, 4);
  
  // Aplica a máscara
  value = value.replace(/(\d{2})(\d)/, '$1:$2');
  
  return value;
};

// Função genérica para aplicar máscara apenas aos dígitos
export const onlyNumbers = (value, maxLength = null) => {
  if (!value) return '';
  
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Limita ao tamanho máximo se especificado
  if (maxLength) {
    value = value.substring(0, maxLength);
  }
  
  return value;
};

// Função para aceitar apenas letras
export const onlyLetters = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é letra ou espaço
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
};
