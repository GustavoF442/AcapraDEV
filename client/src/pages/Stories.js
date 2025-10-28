import React from 'react';
import { Heart, Calendar, MapPin, Users, Award, ExternalLink } from 'lucide-react';

export default function Stories() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            História da ACAPRA
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            Mais de 25 anos transformando vidas e resgatando esperanças
          </p>
        </div>
      </section>

      {/* História do Nico */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-12">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">A História do Nico</h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-xl mb-6">
                Conheça a história do Nico e sua mãe @nicolie____. A Acapra mudou a vida do Nico e pode continuar mudando muitas outras, mas tudo depende da sua ajuda!⁣⁣
              </p>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-semibold text-purple-600 mb-4">𝐏𝐚𝐫𝐚 𝐚𝐣𝐮𝐝𝐚𝐫:</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Banco do Brasil 001</p>
                      <p>Ag: 5233-7 / Conta: 362763-2</p>
                      <p>CNPJ 03.772.251/0001-82</p>
                      <p className="text-sm text-gray-600">Associação Brusquense de Proteção aos Animais</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Pagseguro (para doar qualquer valor):</p>
                      <a href="https://pag.ae/bkpchRn" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 flex items-center">
                        https://pag.ae/bkpchRn
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Vakinha (doações a partir de R$25,00):</p>
                      <a href="http://vaka.me/1005028" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 flex items-center">
                        http://vaka.me/1005028
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-lg mt-6 text-center text-purple-600 font-medium">
                Continue acompanhando nossas redes sociais, que em breve postaremos a história de mais um resgatado ❤️⁣⁣
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campanha "Por que nós existimos?" */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Campanha "Por que nós existimos?"</h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">
                A Associação Brusquense de Proteção aos Animais (Acapra) criou a campanha "Por que nós existimos?" para contar a história de alguns animais que passaram por tratamento na associação e tiveram seu destino transformado.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                A Acapra está com atividades paralisadas desde 17 de abril por causa de dívidas e tenta angariar doações para voltar às atividades. Esta campanha é uma das ações desenvolvidas para angariar recursos e quitar o débito.
              </p>
              
              <blockquote className="border-l-4 border-purple-500 pl-6 py-4 bg-purple-50 rounded-r-lg">
                <p className="text-lg italic text-gray-800">
                  "Criamos esse projeto, em parceria com a Suelen Mota, na fotografia e o Anselmo Scarduelli Júnior na edição. Então, a tempo estávamos querendo fazer o antes e depois dos animais resgatados, porém somos em poucos voluntários e ninguém conseguia dedicar tempo a isso. Nós percorremos um longo caminho e infelizmente hoje estamos paralisados, mas essa realidade pode mudar, com a sua ajuda podemos zerar nossa dívida e retomar o trabalho"
                </p>
                <footer className="text-purple-600 font-medium mt-2">
                  — Daniely Melo, Vice-presidente da associação
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* História da ACAPRA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossa História</h2>
            <p className="text-xl text-gray-600">25 anos de dedicação aos animais em Brusque</p>
          </div>

          <div className="space-y-8">
            {/* Fundação */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Março de 1999 - Fundação</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A ACAPRA, atualmente denominada como Associação Brusquense de Proteção aos animais, foi fundada em Março de 1999, porém funcionava como uma filial da ACAPRA – Associação Catarinense de Proteção aos animais situada em Florianópolis.
              </p>
            </div>

            {/* Primeiros Voluntários */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Os Primeiros Voluntários</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Esta filial foi fundada em média por treze voluntários, e presidida pela Sra. Dulcinea Coelho. Estes reuniam-se quinzenalmente nas dependências da biblioteca pública municipal de Brusque, prefeitura municipal de Brusque e em outras escolas da região para debater assuntos ligados à associação e tomar iniciativas para o bem estar dos animais.
              </p>
            </div>

            {/* Crescimento */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Crescimento e Autonomia</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                À medida que o tempo passava tiveram um aumento significativo de voluntários, porém o trabalho voluntariado não é tarefa fácil e por vezes os voluntários ausentavam-se, como é ainda hoje e dificultava o trabalho em um todo.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Por diversos momentos ocorreu a troca de integrantes da diretoria e estatutos foram modificados até que a ACAPRA deixou de ser uma filial e tornou-se uma entidade autônoma, denominada como Associação Brusquense de Proteção aos Animais e por um longo período presidida pelo Sr. Moacir Giraldi, atualmente vereador da cidade de Brusque, eleito pela população para defender a causa animal.
              </p>
            </div>

            {/* Diretoria Atual */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Diretoria Atual</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Atualmente esta ONG conta com vinte voluntários e a diretoria é composta por:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Presidente:</strong> Lílian Dressel</p>
                  <p><strong>Vice-presidente:</strong> Lousiane Cunha</p>
                  <p><strong>1ª Tesoureira:</strong> Maiara Becker</p>
                  <p><strong>2ª Tesoureira:</strong> Ana Ghislandi</p>
                </div>
                <div className="space-y-2">
                  <p><strong>1ª Secretária:</strong> Roberta Kormann</p>
                  <p><strong>2ª Secretária:</strong> Cátia Pereira</p>
                  <p><strong>Conselheiras Fiscais:</strong> Fernanda Belli Mafra, Neliza Becker e Thais Nunes Rosa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Cada doação, cada adoção, cada compartilhamento faz a diferença na vida de um animal que precisa de ajuda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/doacoes" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-colors">
              Fazer uma Doação
            </a>
            <a href="/animais" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold py-3 px-8 rounded-full transition-colors">
              Adotar um Animal
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
