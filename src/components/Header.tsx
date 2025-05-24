
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';
import AdminDropdown from './AdminDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const isAdmin = profile?.role === 'administrador';
  const isAdminRoute = location.pathname.includes('/admin') || 
                      location.pathname.includes('/gerenciar') ||
                      location.pathname === '/eventos/gerenciar' ||
                      location.pathname === '/blog/gerenciar';

  const handleLogoClick = () => {
    if (isAdminRoute) {
      window.location.href = '/';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isAdminRoute ? (
              <button onClick={handleLogoClick} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                  ORX
                </div>
                <span className="text-white text-xl font-semibold">ORX Valley</span>
              </button>
            ) : (
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                  ORX
                </div>
                <span className="text-white text-xl font-semibold">ORX Valley</span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#eventos" className="text-gray-300 hover:text-white transition-colors">
              Eventos
            </a>
            <Link to="/membros" className="text-gray-300 hover:text-white transition-colors">
              Comunidade
            </Link>
            <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
            {user && (
              <>
                <Link to="/meus-eventos" className="text-gray-300 hover:text-white transition-colors">
                  Meus Eventos
                </Link>
                {isAdmin && (
                  <AdminDropdown 
                    isOpen={isAdminDropdownOpen} 
                    onToggle={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)} 
                  />
                )}
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/perfil">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                    <User className="w-4 h-4 mr-2" />
                    {profile?.full_name || 'Perfil'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-white hover:bg-gray-800">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#eventos" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </a>
              <Link 
                to="/membros" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Comunidade
              </Link>
              <Link 
                to="/blog" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              {user && (
                <>
                  <Link 
                    to="/meus-eventos" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Eventos
                  </Link>
                  {isAdmin && (
                    <>
                      <Link 
                        to="/admin" 
                        className="text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                      <Link 
                        to="/eventos/gerenciar" 
                        className="text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Gestão de Eventos
                      </Link>
                      <Link 
                        to="/blog/gerenciar" 
                        className="text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Gerenciar Blog
                      </Link>
                    </>
                  )}
                  <Link 
                    to="/perfil" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                  >
                    Sair
                  </button>
                </>
              )}
              {!user && (
                <Link 
                  to="/auth" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
