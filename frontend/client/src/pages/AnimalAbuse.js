import React from 'react';
import { AlertTriangle, Phone, FileText, Camera, Shield, Users, Gavel, Heart } from 'lucide-react';

const AnimalAbuse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Combate aos Maus-tratos
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Informações sobre como identificar, denunciar e combater os maus-tratos contra animais
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Lei de Proteção Animal */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <Gavel className="h-8 w-8 text-red-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">
                Legislação de Proteção Animal
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Lei Federal nº 9.605/98 - Lei de Crimes Ambientais
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium mb-2">Art. 32:</p>
                  <p className="text-red-700 text-sm">
                    "Praticar ato de abuso, maus-tratos, ferir ou mutilar animais silvestres, 
                    domésticos ou domesticados, nativos ou exóticos"
                  </p>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Pena:</strong> Detenção de 3 meses a 1 ano + multa</p>
                  <p><strong>Pena aumentada:</strong> 1/6 a 1/3 se resulta em morte do animal</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Constituição Federal - Art. 225
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-700 text-sm">
                    "Todos têm direito ao meio ambiente ecologicamente equilibrado... 
                    incumbindo ao Poder Público proteger a fauna e a flora, 
                    vedadas as práticas que coloquem em risco sua função ecológica, 
                    provoquem extinção de espécies ou submetam os animais à crueldade."
                  </p>
                </div>
                <p className="text-gray-700">
                  A Constituição Federal proíbe expressamente práticas que submetam animais à crueldade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Como Identificar Maus-tratos */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Como Identificar Maus-tratos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-red-100 rounded-lg p-3 w-fit mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sinais Físicos
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Ferimentos não tratados</li>
                <li>• Desnutrição evidente</li>
                <li>• Pelos em mau estado</li>
                <li>• Parasitas visíveis</li>
                <li>• Sinais de espancamento</li>
                <li>• Queimaduras ou cortes</li>
                <li>• Claudicação ou dificuldade de locomoção</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-orange-100 rounded-lg p-3 w-fit mb-4">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sinais Comportamentais
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Medo excessivo de humanos</li>
                <li>• Apatia ou depressão</li>
                <li>• Agressividade defensiva</li>
                <li>• Comportamentos repetitivos</li>
                <li>• Isolamento social</li>
                <li>• Tremores ou ansiedade</li>
                <li>• Submissão excessiva</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-yellow-100 rounded-lg p-3 w-fit mb-4">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Condições Ambientais
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Falta de abrigo adequado</li>
                <li>• Ausência de água limpa</li>
                <li>• Comida inadequada ou insuficiente</li>
                <li>• Espaço muito pequeno</li>
                <li>• Correntes muito curtas</li>
                <li>• Ambiente sujo e insalubre</li>
                <li>• Exposição a intempéries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Como Denunciar */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
            <div className="text-center mb-8">
              <Phone className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Como Fazer a Denúncia
              </h2>
              <p className="text-lg">
                Sua denúncia pode salvar uma vida. Saiba como proceder corretamente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Documente</h3>
                <p className="text-sm">Tire fotos e vídeos como evidência</p>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Anote Detalhes</h3>
                <p className="text-sm">Local, data, hora e descrição dos fatos</p>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Procure Autoridades</h3>
                <p className="text-sm">Polícia Civil, Ministério Público ou ONG</p>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Acompanhe</h3>
                <p className="text-sm">Mantenha contato sobre o andamento</p>
              </div>
            </div>
          </div>
        </section>

        {/* Onde Denunciar */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Onde Fazer a Denúncia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Órgãos Oficiais
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Polícia Civil</p>
                    <p className="text-sm text-gray-600">Delegacias especializadas ou comuns</p>
                    <p className="text-sm text-blue-600">Telefone: 197</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Ministério Público</p>
                    <p className="text-sm text-gray-600">Promotoria de Meio Ambiente</p>
                    <p className="text-sm text-green-600">Site: mpsp.mp.br</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Polícia Militar Ambiental</p>
                    <p className="text-sm text-gray-600">Casos de fauna silvestre</p>
                    <p className="text-sm text-purple-600">Telefone: 190</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Vigilância Sanitária</p>
                    <p className="text-sm text-gray-600">Questões de saúde pública</p>
                    <p className="text-sm text-orange-600">Prefeitura local</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Organizações de Proteção
              </h3>
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="font-medium text-primary-900 mb-2">ACAPRA</p>
                  <p className="text-sm text-primary-700 mb-2">
                    Nossa equipe está pronta para ajudar e orientar sobre denúncias
                  </p>
                  <div className="space-y-1 text-sm">
                    <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
                    <p><strong>Email:</strong> denuncia@acapra.org</p>
                    <p><strong>Telefone:</strong> (11) 9999-9999</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">UIPA</p>
                    <p className="text-sm text-gray-600">União Internacional Protetora dos Animais</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">APAC</p>
                    <p className="text-sm text-gray-600">Associação Protetora dos Animais</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">SOS Animal</p>
                    <p className="text-sm text-gray-600">Diversas ONGs locais</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dicas Importantes */}
        <section className="mb-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Camera className="h-8 w-8 text-yellow-600 mr-4" />
              <h2 className="text-2xl font-bold text-gray-900">
                Dicas Importantes para Denúncias
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ✅ O que FAZER
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Documente com fotos e vídeos</li>
                  <li>• Anote data, hora e local exatos</li>
                  <li>• Identifique testemunhas</li>
                  <li>• Mantenha-se em local seguro</li>
                  <li>• Procure ajuda de ONGs</li>
                  <li>• Acompanhe o processo</li>
                  <li>• Mantenha sigilo se necessário</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ❌ O que NÃO fazer
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Confrontar o agressor diretamente</li>
                  <li>• Invadir propriedade privada</li>
                  <li>• Fazer justiça com as próprias mãos</li>
                  <li>• Expor o caso nas redes sociais antes da denúncia</li>
                  <li>• Remover o animal sem autorização</li>
                  <li>• Fazer denúncias falsas</li>
                  <li>• Desistir se a primeira tentativa falhar</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Seja a Voz dos que Não Podem Falar
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Sua denúncia pode salvar vidas e garantir que animais em situação de maus-tratos 
              recebam o cuidado e proteção que merecem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contato" className="btn-primary">
                Fazer Denúncia
              </a>
              <a href="/animais" className="btn-outline">
                Adotar um Animal
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnimalAbuse;
