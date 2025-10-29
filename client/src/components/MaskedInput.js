import React from 'react';
import { 
  maskCPF, 
  maskPhone, 
  maskCEP, 
  maskMoney, 
  maskDate, 
  maskTime,
  onlyNumbers,
  onlyLetters
} from '../utils/masks';

/**
 * Componente de input com máscara automática
 * 
 * @param {string} type - Tipo de máscara: 'cpf', 'phone', 'cep', 'money', 'date', 'time', 'number', 'letters', 'text'
 * @param {string} value - Valor do input
 * @param {function} onChange - Função chamada quando o valor muda
 * @param {string} className - Classes CSS adicionais
 * @param {number} maxLength - Tamanho máximo (para tipo 'number')
 * @param {object} ...props - Outras props do input
 */
const MaskedInput = ({ 
  type = 'text', 
  value, 
  onChange, 
  className = '',
  maxLength,
  ...props 
}) => {
  
  const handleChange = (e) => {
    let maskedValue = e.target.value;
    
    // Aplica a máscara de acordo com o tipo
    switch (type) {
      case 'cpf':
        maskedValue = maskCPF(maskedValue);
        break;
      case 'phone':
        maskedValue = maskPhone(maskedValue);
        break;
      case 'cep':
        maskedValue = maskCEP(maskedValue);
        break;
      case 'money':
        maskedValue = maskMoney(maskedValue);
        break;
      case 'date':
        maskedValue = maskDate(maskedValue);
        break;
      case 'time':
        maskedValue = maskTime(maskedValue);
        break;
      case 'number':
        maskedValue = onlyNumbers(maskedValue, maxLength);
        break;
      case 'letters':
        maskedValue = onlyLetters(maskedValue);
        break;
      default:
        maskedValue = e.target.value;
    }
    
    // Cria um evento sintético com o valor mascarado
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: maskedValue,
        name: e.target.name
      }
    };
    
    onChange(syntheticEvent);
  };
  
  // Define placeholders padrão para cada tipo
  const getPlaceholder = () => {
    if (props.placeholder) return props.placeholder;
    
    switch (type) {
      case 'cpf':
        return 'CPF ou CNPJ';
      case 'phone':
        return '(00) 00000-0000';
      case 'cep':
        return '00000-000';
      case 'money':
        return '0,00';
      case 'date':
        return 'DD/MM/AAAA';
      case 'time':
        return 'HH:MM';
      default:
        return '';
    }
  };
  
  // Define o tipo do input HTML
  const getInputType = () => {
    if (type === 'money' || type === 'number') {
      return 'text'; // Usamos text para poder aplicar máscaras
    }
    return 'text';
  };
  
  return (
    <input
      {...props}
      type={getInputType()}
      value={value || ''}
      onChange={handleChange}
      placeholder={getPlaceholder()}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
      autoComplete="off"
    />
  );
};

export default MaskedInput;
