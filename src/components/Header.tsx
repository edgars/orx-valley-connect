
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isAdminRoute ? (
              <button onClick={handleLogoClick} className="text-2xl font-bold text-gradient hover:opacity-80">
                ORX Valley
              </button>
            ) : (
              <Link to="/" className="text-2xl font-bold text-gradient">
                ORX Valley
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-primary transition-colors">
              Início
            </a>
            <a href="#eventos" className="text-gray-700 hover:text-primary transition-colors">
              Eventos
            </a>
            <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors">
              Blog
            </Link>
            {user && (
              <>
                <Link to="/membros" className="text-gray-700 hover:text-primary transition-colors">
                  Membros
                </Link>
                <Link to="/meus-eventos" className="text-gray-700 hover:text-primary transition-colors">
                  Meus Eventos
                </Link>
                {isAdmin && (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-primary transition-colors">
                      Admin
                    </Link>
                    <Link to="/blog/gerenciar" className="text-gray-700 hover:text-primary transition-colors">
                      Gerenciar Blog
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/perfil">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {profile?.full_name || 'Perfil'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-orx-gradient hover:opacity-90 text-white">
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
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#inicio" 
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </a>
              <a 
                href="#eventos" 
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </a>
              <Link 
                to="/blog" 
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              {user && (
                <>
                  <Link 
                    to="/membros" 
                    className="text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Membros
                  </Link>
                  <Link 
                    to="/meus-eventos" 
                    className="text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Eventos
                  </Link>
                  {isAdmin && (
                    <>
                      <Link 
                        to="/admin" 
                        className="text-gray-700 hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                      <Link 
                        to="/blog/gerenciar" 
                        className="text-gray-700 hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Gerenciar Blog
                      </Link>
                    </>
                  )}
                  <Link 
                    to="/perfil" 
                    className="text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-primary transition-colors text-left"
                  >
                    Sair
                  </button>
                </>
              )}
              {!user && (
                <Link 
                  to="/auth" 
                  className="text-gray-700 hover:text-primary transition-colors"
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
