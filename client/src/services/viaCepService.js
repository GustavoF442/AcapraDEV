import { useState } from 'react';
import axios from 'axios';

const VIACEP_URL = 'https://viacep.com.br/ws';

/**
 * Busca endereço pelo CEP usando a API ViaCep
 * @param {string} cep - CEP a ser consultado (com ou sem máscara)
 * @returns {Promise<Object>} Dados do endereço ou null se não encontrado
 */
export const getAddressByCEP = async (cep) => {
  try {
    // Remove caracteres não numéricos do CEP
    const cleanCEP = cep.replace(/\D/g, '');
    
    // Valida se o CEP tem 8 dígitos
    if (cleanCEP.length !== 8) {
      throw new Error('CEP inválido');
    }
    
    // Faz a requisição para a API ViaCep
    const response = await axios.get(`${VIACEP_URL}/${cleanCEP}/json/`);
    
    // Verifica se o CEP foi encontrado
    if (response.data.erro) {
      return null;
    }
    
    // Retorna os dados formatados
    return {
      cep: response.data.cep,
      street: response.data.logradouro,
      neighborhood: response.data.bairro,
      city: response.data.localidade,
      state: response.data.uf,
      complement: response.data.complemento,
      ibge: response.data.ibge,
      gia: response.data.gia,
      ddd: response.data.ddd,
      siafi: response.data.siafi
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    
    if (error.response && error.response.status === 400) {
      throw new Error('CEP inválido');
    }
    
    throw new Error('Erro ao consultar CEP. Tente novamente.');
  }
};

/**
 * Busca endereço por UF, cidade e logradouro
 * @param {string} state - UF (2 letras)
 * @param {string} city - Nome da cidade
 * @param {string} street - Nome da rua (mínimo 3 caracteres)
 * @returns {Promise<Array>} Lista de endereços encontrados
 */
export const searchAddress = async (state, city, street) => {
  try {
    // Valida os parâmetros
    if (!state || state.length !== 2) {
      throw new Error('UF inválida');
    }
    
    if (!city || city.length < 3) {
      throw new Error('Nome da cidade muito curto');
    }
    
    if (!street || street.length < 3) {
      throw new Error('Nome da rua muito curto (mínimo 3 caracteres)');
    }
    
    // Faz a requisição para a API ViaCep
    const url = `${VIACEP_URL}/${state}/${city}/${street}/json/`;
    const response = await axios.get(url);
    
    // Verifica se encontrou resultados
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Retorna os dados formatados
    return response.data.map(address => ({
      cep: address.cep,
      street: address.logradouro,
      neighborhood: address.bairro,
      city: address.localidade,
      state: address.uf,
      complement: address.complemento,
      ibge: address.ibge,
      gia: address.gia,
      ddd: address.ddd,
      siafi: address.siafi
    }));
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    
    if (error.response && error.response.status === 400) {
      throw new Error('Parâmetros inválidos');
    }
    
    throw new Error('Erro ao consultar endereço. Tente novamente.');
  }
};

/**
 * Hook personalizado para usar com React
 */
export const useViaCep = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  
  const fetchAddress = async (cep) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAddressByCEP(cep);
      setAddress(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    address,
    fetchAddress
  };
};

export default {
  getAddressByCEP,
  searchAddress,
  useViaCep
};
