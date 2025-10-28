import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">ACAPRA</span>
            </div>
            <p className="text-gray-300 mb-4">
              A ACAPRA atua há mais de 20 anos em Franca com trabalho 100% voluntário, 
              resgatando e amparando animais em situação de maus-tratos e abandono.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/acapra" target="_blank" rel="noopener noreferrer" className="group p-2 rounded-full text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200" aria-label="Facebook da ACAPRA">
                <Facebook className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://instagram.com/acapra" target="_blank" rel="noopener noreferrer" className="group p-2 rounded-full text-gray-400 hover:text-pink-400 hover:bg-pink-400/10 transition-all duration-200" aria-label="Instagram da ACAPRA">
                <Instagram className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/animais" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Adotar
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/doacoes" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Como Doar
                </Link>
              </li>
              <li>
                <Link to="/historias" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Histórias de Sucesso
                </Link>
              </li>
              <li>
                <Link to="/maus-tratos" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Denunciar Maus-tratos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <a href="mailto:contato@acapra.org" className="text-gray-300 hover:text-primary-400 transition-colors">contato@acapra.org</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <a href="tel:+5516999999999" className="text-gray-300 hover:text-primary-400 transition-colors">(16) 99999-9999</a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary-400 mt-1" />
                <span className="text-gray-300">
                  Franca - SP<br />
                  Atendemos toda a região
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ACAPRA. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Feito com ❤️ para os animais
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
