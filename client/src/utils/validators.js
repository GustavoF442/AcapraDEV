// Utilitários para validação de campos

// Valida CPF
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

// Valida telefone/celular
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Remove caracteres não numéricos
  phone = phone.replace(/\D/g, '');
  
  // Verifica se tem 10 ou 11 dígitos
  if (phone.length < 10 || phone.length > 11) return false;
  
  // Verifica se o DDD é válido (11 a 99)
  const ddd = parseInt(phone.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  
  return true;
};

// Valida email
export const validateEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valida CEP
export const validateCEP = (cep) => {
  if (!cep) return false;
  
  // Remove caracteres não numéricos
  cep = cep.replace(/\D/g, '');
  
  // Verifica se tem 8 dígitos
  return cep.length === 8;
};

// Valida data no formato DD/MM/AAAA
export const validateDate = (date) => {
  if (!date) return false;
  
  // Verifica formato
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!dateRegex.test(date)) return false;
  
  const [, day, month, year] = date.match(dateRegex);
  
  const d = parseInt(day);
  const m = parseInt(month);
  const y = parseInt(year);
  
  // Verifica se os valores são válidos
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1900 || y > 2100) return false;
  
  // Verifica dias do mês
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d > daysInMonth) return false;
  
  return true;
};

// Valida hora no formato HH:MM
export const validateTime = (time) => {
  if (!time) return false;
  
  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(time);
};

// Valida nome (mínimo 2 palavras)
export const validateFullName = (name) => {
  if (!name) return false;
  
  const words = name.trim().split(/\s+/);
  return words.length >= 2 && words.every(word => word.length >= 2);
};

// Valida valor mínimo
export const validateMinValue = (value, min) => {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= min;
};

// Valida valor máximo
export const validateMaxValue = (value, max) => {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue <= max;
};

// Valida comprimento mínimo
export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

// Valida comprimento máximo
export const validateMaxLength = (value, max) => {
  return value && value.length <= max;
};

// Valida campo obrigatório
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

// Valida URL
export const validateURL = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validação composta de formulário
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      if (rule.validator) {
        const isValid = rule.validator(value);
        if (!isValid) {
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(rule.message || `Campo ${field} inválido`);
        }
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
