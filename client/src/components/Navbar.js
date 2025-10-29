import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Instagram, Facebook, Heart } from 'lucide-react';
import logo from '../materiais/logo roxa.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/animais', label: 'Adotar' },
    { path: '/eventos', label: 'Eventos' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/doacoes', label: 'Doações' },
    { path: '/noticias', label: 'Notícias' },
    { path: '/contato', label: 'Contato' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="ACAPRA" className="h-10 w-auto" />
              <span className="text-xl font-bold text-purple-700">ACAPRA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Redes Sociais */}
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
              <a
                href="https://instagram.com/acapra"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200 transform hover:scale-110"
                aria-label="Instagram da ACAPRA"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/acapra"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                aria-label="Facebook da ACAPRA"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <Link
                to="/doacoes"
                className="p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                aria-label="Fazer doação"
              >
                <Heart className="h-5 w-5" />
              </Link>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                >
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
