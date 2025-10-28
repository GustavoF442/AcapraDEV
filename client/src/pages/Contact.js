import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Mail, Phone, MapPin, Clock, CheckCircle, Send } from 'lucide-react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post('/contact', data);
      setSubmitted(true);
      reset();
    } catch (error) {
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mensagem Enviada!
          </h2>
          <p className="text-gray-600 mb-6">
            Sua mensagem foi enviada com sucesso. Retornaremos o contato em breve.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Enviar Nova Mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Estamos aqui para ajudar! Entre em contato conosco para tirar dúvidas, ser voluntário ou reportar animais em situação de risco
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Fale Conosco
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-lg p-3">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Telefone</h3>
                  <p className="text-gray-600">(11) 9999-9999</p>
                  <p className="text-sm text-gray-500">Segunda a Sexta, 8h às 17h</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-lg p-3">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">contato@acapra.org</p>
                  <p className="text-sm text-gray-500">Respondemos em até 24 horas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-lg p-3">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
                  <p className="text-gray-600">
                    Rua dos Animais, 123<br />
                    Bairro Esperança<br />
                    São Paulo - SP, 01234-567
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-lg p-3">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Horário de Funcionamento</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Segunda a Sexta: 8h às 17h</p>
                    <p>Sábados: 8h às 12h</p>
                    <p>Domingos: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergências */}
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Emergências com Animais
              </h3>
              <p className="text-red-700 text-sm mb-3">
                Se você encontrou um animal ferido ou em situação de risco imediato, 
                entre em contato conosco urgentemente:
              </p>
              <p className="font-semibold text-red-800">
                WhatsApp: (11) 99999-9999
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envie sua Mensagem
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Nome é obrigatório' })}
                    className="input-field"
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="input-field"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-field"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                </label>
                <select
                  {...register('subject', { required: 'Assunto é obrigatório' })}
                  className="input-field"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="Adoção">Dúvidas sobre Adoção</option>
                  <option value="Voluntariado">Quero ser Voluntário</option>
                  <option value="Doação">Informações sobre Doações</option>
                  <option value="Animal em Risco">Animal em Situação de Risco</option>
                  <option value="Parceria">Proposta de Parceria</option>
                  <option value="Outros">Outros Assuntos</option>
                </select>
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  {...register('message', { 
                    required: 'Mensagem é obrigatória',
                    minLength: {
                      value: 10,
                      message: 'Mensagem deve ter pelo menos 10 caracteres'
                    }
                  })}
                  rows="6"
                  className="input-field"
                  placeholder="Escreva sua mensagem aqui..."
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Seções Adicionais */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Voluntariado */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Seja um Voluntário
            </h3>
            <p className="text-gray-600 mb-4">
              Ajude-nos no cuidado diário dos animais, eventos de adoção, 
              campanhas e muito mais.
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• Cuidados com os animais</li>
              <li>• Limpeza e manutenção</li>
              <li>• Eventos e campanhas</li>
              <li>• Apoio administrativo</li>
            </ul>
            <p className="text-sm text-gray-500">
              Entre em contato para saber como participar!
            </p>
          </div>

          {/* Parcerias */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Parcerias Empresariais
            </h3>
            <p className="text-gray-600 mb-4">
              Sua empresa pode fazer parte desta causa através de:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• Patrocínio de eventos</li>
              <li>• Doações regulares</li>
              <li>• Voluntariado corporativo</li>
              <li>• Campanhas de conscientização</li>
            </ul>
            <p className="text-sm text-gray-500">
              Vamos conversar sobre como sua empresa pode ajudar!
            </p>
          </div>

          {/* Denúncias */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Denunciar Maus-tratos
            </h3>
            <p className="text-gray-600 mb-4">
              Se você presenciou maus-tratos contra animais:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• Entre em contato conosco</li>
              <li>• Denuncie à Polícia Civil</li>
              <li>• Procure o Ministério Público</li>
              <li>• Documente com fotos/vídeos</li>
            </ul>
            <a href="/maus-tratos" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Saiba mais sobre como denunciar →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
