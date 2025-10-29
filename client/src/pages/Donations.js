import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, CreditCard, MapPin, Phone, Mail, Gift, Users, Truck, ArrowRight } from 'lucide-react';

const Donations = () => {
  const donationMethods = [
    {
      icon: CreditCard,
      title: 'PIX',
      description: 'Forma mais rápida e prática',
      details: 'PIX: acapra@proteção.org.br',
      highlight: true
    },
    {
      icon: CreditCard,
      title: 'Transferência Bancária',
      description: 'Banco do Brasil',
      details: 'Agência: 1234-5 | Conta: 12345-6'
    },
    {
      icon: Gift,
      title: 'Doações Físicas',
      description: 'Ração, medicamentos, materiais',
      details: 'Entregue em nosso abrigo'
    }
  ];

  const monthlyNeeds = [
    { item: 'Ração para cães', amount: 'R$ 2.500', description: '500kg mensais' },
    { item: 'Ração para gatos', amount: 'R$ 800', description: '150kg mensais' },
    { item: 'Medicamentos', amount: 'R$ 1.200', description: 'Vermífugos, vacinas, antibióticos' },
    { item: 'Consultas veterinárias', amount: 'R$ 1.500', description: 'Emergências e check-ups' },
    { item: 'Materiais de limpeza', amount: 'R$ 400', description: 'Higienização do abrigo' },
    { item: 'Contas básicas', amount: 'R$ 600', description: 'Água, luz, telefone' }
  ];

  const donationItems = [
    'Ração para cães e gatos (todas as idades)',
    'Medicamentos veterinários',
    'Materiais de limpeza e higiene',
    'Cobertores e toalhas',
    'Brinquedos para animais',
    'Coleiras e guias',
    'Caixas de transporte',
    'Materiais de construção para reformas'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-white py-20" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="h-20 w-20 mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Como Doar
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Sua doação salva vidas! Cada contribuição nos ajuda a cuidar melhor dos nossos protegidos
            </p>
            <Link
              to="/doacoes/nova"
              className="inline-flex items-center space-x-3 px-10 py-5 bg-white rounded-full font-bold text-xl shadow-2xl transform hover:scale-105 transition-all"
              style={{color: '#764ba2'}}
            >
              <Gift className="h-7 w-7" />
              <span>Fazer Doação Agora</span>
              <ArrowRight className="h-7 w-7" />
            </Link>
          </div>
        </div>
      </section>

      {/* Formas de Doação */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Formas de Contribuir
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Escolha a forma que for mais conveniente para você. Toda ajuda é bem-vinda!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationMethods.map((method, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-md p-8 text-center ${
                method.highlight ? 'ring-2 ring-primary-500 relative' : ''
              }`}>
                {method.highlight && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Recomendado
                    </span>
                  </div>
                )}
                <div className={`${method.highlight ? 'bg-primary-100' : 'bg-gray-100'} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                  <method.icon className={`h-8 w-8 ${method.highlight ? 'text-primary-600' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className={`${method.highlight ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4`}>
                  <p className="font-medium text-gray-900">{method.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Necessidades Mensais */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossas Necessidades Mensais
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Para manter nossos mais de 150 animais saudáveis e felizes, precisamos de aproximadamente R$ 7.000 por mês
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyNeeds.map((need, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{need.item}</h3>
                  <span className="text-primary-600 font-bold">{need.amount}</span>
                </div>
                <p className="text-gray-600 text-sm">{need.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-primary-900 mb-2">
              Total Mensal: R$ 7.000
            </h3>
            <p className="text-primary-700">
              Qualquer valor ajuda! Mesmo R$ 10 já fazem diferença na vida dos nossos protegidos.
            </p>
          </div>
        </div>
      </section>

      {/* Doações Físicas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Doações de Materiais
              </h2>
              <p className="text-gray-600 mb-6">
                Além das doações em dinheiro, também aceitamos materiais que nos ajudam 
                no dia a dia do abrigo. Confira a lista do que mais precisamos:
              </p>
              
              <div className="space-y-3">
                {donationItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Importante:</h4>
                <p className="text-yellow-700 text-sm">
                  Antes de trazer doações físicas, entre em contato conosco para confirmar 
                  se ainda precisamos do item e combinar o melhor horário para entrega.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Local para Entrega
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Endereço</p>
                    <p className="text-gray-600">
                      Rua dos Animais, 123<br />
                      Bairro Esperança<br />
                      São Paulo - SP, 01234-567
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Telefone</p>
                    <p className="text-gray-600">(11) 9999-9999</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">doacoes@acapra.org</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Horário de Funcionamento</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Segunda a Sexta: 8h às 17h</p>
                  <p>Sábados: 8h às 12h</p>
                  <p>Domingos: Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outras Formas de Ajudar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Outras Formas de Ajudar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nem toda ajuda precisa ser financeira. Existem várias maneiras de contribuir com nosso trabalho
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Voluntariado</h3>
              <p className="text-gray-600 mb-4">
                Doe seu tempo e habilidades. Precisamos de ajuda com cuidados, limpeza, 
                eventos e muito mais.
              </p>
              <a href="/contato" className="text-blue-600 hover:text-blue-700 font-medium">
                Quero ser voluntário →
              </a>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Adoção</h3>
              <p className="text-gray-600 mb-4">
                A melhor forma de ajudar é dando um lar para um de nossos protegidos. 
                Cada adoção salva duas vidas!
              </p>
              <a href="/animais" className="text-green-600 hover:text-green-700 font-medium">
                Ver animais disponíveis →
              </a>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Divulgação</h3>
              <p className="text-gray-600 mb-4">
                Compartilhe nosso trabalho nas redes sociais e ajude mais animais 
                a encontrarem um lar.
              </p>
              <a href="https://instagram.com/acapra" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium" aria-label="Seguir ACAPRA no Instagram">
                Seguir nas redes →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Transparência */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Transparência Total
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Acreditamos na transparência total. Todos os recursos recebidos são 
                aplicados diretamente no cuidado dos animais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Como Usamos as Doações
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Alimentação</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Cuidados veterinários</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Manutenção do abrigo</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Administrativo</span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Relatórios Financeiros
                </h3>
                <p className="text-gray-600 mb-4">
                  Publicamos relatórios mensais com todas as receitas e despesas. 
                  Você pode acompanhar exatamente como sua doação está sendo utilizada.
                </p>
                <a href="/relatorios" className="text-primary-600 hover:text-primary-700 font-medium" aria-label="Ver relatórios de transparência">
                  Ver relatórios →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Faça a Diferença Hoje
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-100">
            Cada doação, por menor que seja, representa esperança e uma nova chance de vida para nossos protegidos
          </p>
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-gray-900 font-semibold mb-2">PIX para Doação</h3>
            <p className="text-gray-700 font-mono text-lg">acapra@proteção.org.br</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donations;
