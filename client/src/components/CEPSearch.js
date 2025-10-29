import React, { useState } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';
import MaskedInput from './MaskedInput';
import { getAddressByCEP } from '../services/viaCepService';
import { validateCEP } from '../utils/validators';

/**
 * Componente de busca de CEP com preenchimento automático
 * 
 * @param {function} onAddressFound - Callback chamado quando um endereço é encontrado
 * @param {string} value - Valor atual do CEP
 * @param {function} onChange - Função para atualizar o CEP
 * @param {string} className - Classes CSS adicionais
 */
const CEPSearch = ({ onAddressFound, value, onChange, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSearch = async () => {
    // Limpa erro anterior
    setError(null);
    
    // Valida o CEP
    if (!validateCEP(value)) {
      setError('CEP inválido. Digite um CEP válido com 8 dígitos.');
      return;
    }
    
    setLoading(true);
    
    try {
      const address = await getAddressByCEP(value);
      
      if (!address) {
        setError('CEP não encontrado. Verifique o número digitado.');
        return;
      }
      
      // Chama o callback com os dados do endereço
      if (onAddressFound) {
        onAddressFound(address);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Erro ao buscar CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        CEP
      </label>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <MaskedInput
            type="cep"
            name="zipCode"
            value={value}
            onChange={onChange}
            onKeyPress={handleKeyPress}
            placeholder="00000-000"
            className="w-full"
          />
        </div>
        
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !value}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Buscar
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mt-2 flex items-start gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Digite o CEP e clique em "Buscar" para preencher automaticamente o endereço
      </p>
    </div>
  );
};

export default CEPSearch;
