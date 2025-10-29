import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { 
  Heart, DollarSign, Package, Check, AlertCircle,
  CreditCard, Gift, PawPrint, Pill, Trash2, Droplet
} from 'lucide-react';
import api from '../services/api';
import MaskedInput from '../components/MaskedInput';

const DonationForm = () => {
  const [donationType, setDonationType] = useState('dinheiro'); // dinheiro ou item
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  // Lista de itens disponíveis para doação
  const availableItems = [
    { id: 'racao_cao', name: 'Ração para Cães', icon: PawPrint, unit: 'kg', color: 'blue' },
    { id: 'racao_gato', name: 'Ração para Gatos', icon: PawPrint, unit: 'kg', color: 'purple' },
    { id: 'medicamento', name: 'Medicamentos', icon: Pill, unit: 'unidade', color: 'red' },
    { id: 'vermifugo', name: 'Vermífugo', icon: Droplet, unit: 'unidade', color: 'green' },
    { id: 'vacina', name: 'Vacinas', icon: Pill, unit: 'dose', color: 'yellow' },
    { id: 'material_limpeza', name: 'Material de Limpeza', icon: Trash2, unit: 'unidade', color: 'indigo' },
    { id: 'cobertor', name: 'Cobertores', icon: Gift, unit: 'unidade', color: 'pink' },
    { id: 'toalha', name: 'Toalhas', icon: Gift, unit: 'unidade', color: 'teal' },
    { id: 'brinquedo', name: 'Brinquedos', icon: Gift, unit: 'unidade', color: 'orange' },
    { id: 'coleira', name: 'Coleiras/Guias', icon: Gift, unit: 'unidade', color: 'cyan' },
  ];

  const paymentMethods = [
    { value: 'pix', label: 'PIX' },
    { value: 'transferencia', label: 'Transferência Bancária' },
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'deposito', label: 'Depósito' },
  ];

  const watchDonationType = watch('donationType');

  const donationMutation = useMutation(
    (data) => api.post('/api/donations', data),
    {
      onSuccess: () => {
        setShowSuccess(true);
        reset();
        setSelectedItems([]);
        setTimeout(() => setShowSuccess(false), 5000);
      },
      onError: (error) => {
        alert('Erro ao registrar doação: ' + (error.response?.data?.error || error.message));
      }
    }
  );

  const addItem = (item) => {
    const existing = selectedItems.find(i => i.id === item.id);
    if (!existing) {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const onSubmit = (data) => {
    const payload = {
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      donorCPF: data.donorCPF,
      donationType: donationType,
    };

    if (donationType === 'dinheiro') {
      payload.amount = data.amount;
      payload.paymentMethod = data.paymentMethod;
      payload.description = `Doação em dinheiro via ${data.paymentMethod}`;
    } else {
      // Montar descrição dos itens
      const itemsDescription = selectedItems.map(item => 
        `${item.name}: ${item.quantity} ${item.unit}${item.quantity > 1 ? 's' : ''}`
      ).join(', ');
      
      payload.description = itemsDescription;
      payload.paymentMethod = 'item_fisico';
    }

    donationMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero compacto */}
      <div className="text-white py-12" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Faça sua Doação
          </h1>
          <p className="text-xl text-purple-100">
            Cada contribuição salva vidas e transforma histórias! 🐾
          </p>
        </div>
      </div>

      {/* Mensagem de sucesso */}
      {showSuccess && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-green-100 border-2 border-green-500 rounded-xl p-6 flex items-center space-x-4 animate-bounce">
            <div className="flex-shrink-0 bg-green-500 rounded-full p-3">
              <Check className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900">Doação Registrada com Sucesso!</h3>
              <p className="text-green-700 mt-1">
                Obrigado por fazer a diferença na vida dos nossos protegidos! ❤️
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formulário */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Toggle Tipo de Doação */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={() => setDonationType('dinheiro')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  donationType === 'dinheiro'
                    ? 'bg-white text-purple-600 shadow-lg scale-105'
                    : 'bg-purple-700 text-white hover:bg-purple-800'
                }`}
              >
                <DollarSign className="h-6 w-6" />
                <span>Doação em Dinheiro</span>
              </button>
              
              <button
                type="button"
                onClick={() => setDonationType('item')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  donationType === 'item'
                    ? 'bg-white text-pink-600 shadow-lg scale-105'
                    : 'bg-pink-700 text-white hover:bg-pink-800'
                }`}
              >
                <Package className="h-6 w-6" />
                <span>Doação de Itens</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            
            {/* Dados do Doador */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="h-6 w-6 mr-3" style={{color: '#555086'}} />
                Seus Dados
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    {...register('donorName', { required: 'Nome é obrigatório' })}
                    className="input-field"
                    placeholder="Seu nome"
                  />
                  {errors.donorName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.donorName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('donorEmail', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="input-field"
                    placeholder="Email"
                  />
                  {errors.donorEmail && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.donorEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <MaskedInput
                    type="phone"
                    {...register('donorPhone', { required: 'Telefone é obrigatório' })}
                    className="input-field"
                  />
                  {errors.donorPhone && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.donorPhone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    CPF/CNPJ (Opcional)
                  </label>
                  <MaskedInput
                    type="cpf"
                    {...register('donorCPF')}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Doação em Dinheiro */}
            {donationType === 'dinheiro' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DollarSign className="h-6 w-6 mr-3 text-green-600" />
                  Detalhes da Doação
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Valor *
                    </label>
                    <MaskedInput
                      type="money"
                      {...register('amount', { required: 'Valor é obrigatório' })}
                      className="input-field text-2xl font-bold"
                      placeholder="0,00"
                    />
                    {errors.amount && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Forma de Pagamento *
                    </label>
                    <select
                      {...register('paymentMethod', { required: 'Selecione a forma de pagamento' })}
                      className="input-field"
                    >
                      <option value="">Selecione...</option>
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    {errors.paymentMethod && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dados bancários */}
                <div className="mt-6 bg-white rounded-lg p-4 border border-green-300">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Dados para Transferência
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>PIX:</strong> <span className="font-mono bg-green-100 px-2 py-1 rounded">acapra@protecao.org.br</span></p>
                    <p><strong>Banco:</strong> Banco do Brasil</p>
                    <p><strong>Agência:</strong> 1234-5 | <strong>Conta:</strong> 12345-6</p>
                  </div>
                </div>
              </div>
            )}

            {/* Doação de Itens */}
            {donationType === 'item' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Package className="h-6 w-6 mr-3 text-blue-600" />
                  Selecione os Itens para Doar
                </h3>

                {/* Grid de itens disponíveis */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {availableItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addItem(item)}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-2 ${
                        selectedItems.find(i => i.id === item.id)
                          ? `bg-${item.color}-100 border-${item.color}-500`
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <item.icon className={`h-8 w-8 text-${item.color}-600`} />
                      <span className="text-xs font-medium text-center text-gray-900">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Lista de itens selecionados */}
                {selectedItems.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border-2 border-blue-300">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Gift className="h-5 w-5 mr-2 text-blue-600" />
                      Itens Selecionados ({selectedItems.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3 flex-1">
                            <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold"
                            />
                            <span className="text-sm text-gray-600 w-16">{item.unit}(s)</span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-16 w-16 mx-auto mb-3 opacity-30" />
                    <p>Selecione os itens que deseja doar acima</p>
                  </div>
                )}
              </div>
            )}

            {/* Botão Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={donationMutation.isLoading || (donationType === 'item' && selectedItems.length === 0)}
                className="w-full py-5 px-8 rounded-xl text-white font-bold text-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl"
                style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
              >
                {donationMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-6 w-6" />
                    <span>Confirmar Doação</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📍 Informações para Entrega de Itens</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Endereço:</strong> Rua dos Animais, 123 - Franca, SP</p>
            <p><strong>Horário:</strong> Segunda a Sexta: 8h-17h | Sábado: 8h-12h</p>
            <p><strong>Contato:</strong> (16) 99999-9999 | acapratest@gmail.com</p>
            <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg mt-3">
              ⚠️ <strong>Importante:</strong> Entre em contato antes de levar itens físicos para confirmar necessidade e agendar entrega.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
