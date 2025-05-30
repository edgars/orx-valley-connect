import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';
import AdminDropdown from './AdminDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const isActiveTab = (path) => {
    if (path === '#eventos') {
      return location.pathname === '/' && location.hash === '#eventos';
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleEventosClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = '/#eventos';
    } else {
      window.location.hash = '#eventos';
    }
  };

  const NavLink = ({ href, to, children, onClick }: { 
    href?: string; 
    to?: string; 
    children: React.ReactNode; 
    onClick?: (e?: React.MouseEvent) => void; 
  }) => {
    const isActive = isActiveTab(to || href);
    const baseClasses = "relative text-gray-300 hover:text-white transition-colors pb-1";
    const activeClasses = isActive ? "text-white" : "";
    
    const linkContent = (
      <span className={`${baseClasses} ${activeClasses}`}>
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
        )}
      </span>
    );

    if (href) {
      return (
        <a href={href} onClick={onClick}>
          {linkContent}
        </a>
      );
    }

    return (
      <Link to={to || ''} onClick={onClick}>
        {linkContent}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isAdminRoute ? (
              <button onClick={handleLogoClick} className="flex items-center space-x-2">
                <img
                  src="/orxvalley.white.svg"
                  alt="ORX Valley Logo"
                  className="h-8 w-auto"
                />
              </button>
            ) : (
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/orxvalley.white.svg"
                  alt="ORX Valley Logo"
                  className="h-8 w-auto"
                />
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#eventos" onClick={handleEventosClick}>
              Eventos
            </NavLink>
            <NavLink to="/comunidade">
              Comunidade
            </NavLink>
            <NavLink to="/blog">
              Blog
            </NavLink>
            
            {user && (
              <>
                <NavLink to="/meus-eventos">
                  Meus Eventos
                </NavLink>
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
                <div className="relative" ref={profileDropdownRef}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="text-white hover:bg-gray-800"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {profile?.username || 'Perfil'}
                  </Button>
                  
                  {/* Profile Dropdown - Estilo Escuro */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                      <Link 
                        to="/perfil" 
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Meu Perfil
                      </Link>
                      <Link 
                        to="/certificados" 
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Certificados
                      </Link>
                      <Link 
                        to="/configuracoes" 
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configurações
                      </Link>
                      <hr className="my-2 border-gray-600" />
                      <button 
                        onClick={() => {
                          signOut();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
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
              <NavLink 
                href="#eventos"
                onClick={(e) => {
                  handleEventosClick(e);
                  setIsMenuOpen(false);
                }}
              >
                Eventos
              </NavLink>
              <NavLink 
                to="/membros"
                onClick={() => setIsMenuOpen(false)}
              >
                Comunidade
              </NavLink>
              <NavLink 
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </NavLink>
              {user && (
                <>
                  <NavLink 
                    to="/meus-eventos"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Eventos
                  </NavLink>
                  {isAdmin && (
                    <>
                      <NavLink 
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </NavLink>
                      <NavLink 
                        to="/eventos/gerenciar"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Gestão de Eventos
                      </NavLink>
                      <NavLink 
                        to="/blog/gerenciar"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Gerenciar Blog
                      </NavLink>
                    </>
                  )}
                  <div className="border-t border-gray-600 pt-4 mt-4">
                    <NavLink 
                      to="/perfil"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Meu Perfil
                    </NavLink>
                    <NavLink 
                      to="/certificados"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Certificados
                    </NavLink>
                    <NavLink 
                      to="/configuracoes"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Configurações
                    </NavLink>
                    <button 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-300 hover:text-white transition-colors text-left"
                    >
                      Sair
                    </button>
                  </div>
                </>
              )}
              {!user && (
                <NavLink 
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;