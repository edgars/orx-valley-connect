import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, ChevronDown, Settings, Users, FileText } from "lucide-react";
import AdminDropdown from "./AdminDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isMobileAdminOpen, setIsMobileAdminOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fechar menus quando a tela mudar de tamanho
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsMobileProfileOpen(false);
        setIsMobileAdminOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdmin = profile?.role === "administrador";
  const isAdminRoute =
    location.pathname.includes("/admin") ||
    location.pathname.includes("/gerenciar") ||
    location.pathname === "/eventos/gerenciar" ||
    location.pathname === "/blog/gerenciar";

  // Função para gerar iniciais do username
  const getInitials = (username: string) => {
    if (!username) return "U";
    
    const words = username.trim().split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Componente Avatar
  const UserAvatar = ({ size = "sm", showName = false }: { size?: "sm" | "xs", showName?: boolean }) => {
    const [imageError, setImageError] = useState(false);
    const sizeClasses = size === "sm" ? "w-8 h-8" : "w-6 h-6";
    const textSizeClasses = size === "sm" ? "text-sm" : "text-xs";
    const username = profile?.username || profile?.full_name || "User";
    const avatarUrl = profile?.avatar_url;

    return (
      <div className="flex items-center gap-2">
        <div className={`${sizeClasses} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0`}>
          {avatarUrl && !imageError ? (
            <img 
              src={avatarUrl} 
              alt={username}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className={`text-white font-semibold ${textSizeClasses}`}>
              {getInitials(username)}
            </span>
          )}
        </div>
        {showName && (
          <span className="text-white truncate max-w-24">
            {username}
          </span>
        )}
      </div>
    );
  };

  const handleLogoClick = () => {
    if (isAdminRoute) {
      window.location.href = "/";
    }
  };

  const isActiveTab = (path) => {
    if (path === "#home") {
      return location.pathname === "/" && location.hash === "#home";
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleEventosClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      window.location.href = "/#home";
    } else {
      window.location.hash = "#home";
    }
  };

  const NavLink = ({
    href,
    to,
    children,
    onClick,
  }: {
    href?: string;
    to?: string;
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent) => void;
  }) => {
    const isActive = isActiveTab(to || href);
    const baseClasses =
      "relative text-gray-300 hover:text-white transition-colors pb-2";
    const activeClasses = isActive ? "text-white" : "";

    const linkContent = (
      <span className={`${baseClasses} ${activeClasses}`}>
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fff] rounded-full"></span>
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
      <Link to={to || ""} onClick={onClick}>
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
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-2"
              >
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
                  className="h-10 w-auto"
                />
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#home" onClick={handleEventosClick}>
              Home
            </NavLink>
            <NavLink to="/comunidade">Comunidade</NavLink>
            <NavLink to="/blog">Blog</NavLink>

            {!user && <NavLink to="/sobre">Sobre</NavLink>}

            {user && (
              <>
                <NavLink to="/meus-eventos">Eventos</NavLink>
                <NavLink to="/sobre">Sobre</NavLink>

                {isAdmin && (
                  <AdminDropdown
                    isOpen={isAdminDropdownOpen}
                    onToggle={() =>
                      setIsAdminDropdownOpen(!isAdminDropdownOpen)
                    }
                  />
                )}
              </>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={profileDropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="text-white hover:bg-gray-800 flex items-center gap-2 pl-2 pr-3"
                  >
                    <UserAvatar size="sm" />
                    <span className="text-sm">
                      {profile?.username || profile?.full_name || "Perfil"}
                    </span>
                  </Button>

                  {/* Profile Dropdown - Desktop */}
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
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Certificados
                      </Link>
                     {/*  <Link
                        to="/configuracoes"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Configurações
                      </Link> */}
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
          <div className="md:hidden flex items-center space-x-2">
            {user && <UserAvatar size="xs" />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              <NavLink
                href="#home"
                onClick={(e) => {
                  handleEventosClick(e);
                  setIsMenuOpen(false);
                }}
              >
                Home
              </NavLink>
              <NavLink to="/comunidade" onClick={() => setIsMenuOpen(false)}>
                Comunidade
              </NavLink>
              <NavLink to="/blog" onClick={() => setIsMenuOpen(false)}>
                Blog
              </NavLink>
              
              {!user && <NavLink to="/sobre" onClick={() => setIsMenuOpen(false)}>Sobre</NavLink>}
              
              {user && (
                <>
                  <NavLink to="/meus-eventos" onClick={() => setIsMenuOpen(false)}>
                    Eventos
                  </NavLink>
                  <NavLink to="/sobre" onClick={() => setIsMenuOpen(false)}>
                    Sobre
                  </NavLink>
                  
                  {isAdmin && (
                    <>
                      {/* Mobile Admin Section */}
                      <div className="border-t border-gray-600 pt-4 mt-4">
                        <button
                          onClick={() => setIsMobileAdminOpen(!isMobileAdminOpen)}
                          className="flex items-center justify-between w-full text-gray-300 hover:text-white transition-colors py-2"
                        >
                          <div className="flex items-center">
                            <Settings className="w-4 h-4 mr-3" />
                            <span>Administração</span>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              isMobileAdminOpen ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        
                        {/* Mobile Admin Submenu */}
                        {isMobileAdminOpen && (
                          <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-600 pl-4">
                            <Link
                              to="/admin"
                              className="flex items-center text-gray-400 hover:text-white transition-colors py-1"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsMobileAdminOpen(false);
                              }}
                            >
                              <Settings className="w-3 h-3 mr-2" />
                              Dashboard
                            </Link>
                            <Link
                              to="/eventos/gerenciar"
                              className="flex items-center text-gray-400 hover:text-white transition-colors py-1"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsMobileAdminOpen(false);
                              }}
                            >
                              <Users className="w-3 h-3 mr-2" />
                              Gestão de Eventos
                            </Link>
                            <Link
                              to="/blog/gerenciar"
                              className="flex items-center text-gray-400 hover:text-white transition-colors py-1"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsMobileAdminOpen(false);
                              }}
                            >
                              <FileText className="w-3 h-3 mr-2" />
                              Gerenciar Blog
                            </Link>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Mobile Profile Section */}
                  <div className="border-t border-gray-600 pt-4 mt-4">
                    <button
                      onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                      className="flex items-center justify-between w-full text-gray-300 hover:text-white transition-colors py-2"
                    >
                      <div className="flex items-center">
                        <UserAvatar size="xs" />
                        <span className="ml-3">Minha Conta</span>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          isMobileProfileOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Mobile Profile Submenu */}
                    {isMobileProfileOpen && (
                      <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-600 pl-4">
                        <Link
                          to="/perfil"
                          className="block text-gray-400 hover:text-white transition-colors py-1"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileProfileOpen(false);
                          }}
                        >
                          Meu Perfil
                        </Link>
                        <Link
                          to="/certificados"
                          className="block text-gray-400 hover:text-white transition-colors py-1"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileProfileOpen(false);
                          }}
                        >
                          Certificados
                        </Link>
                        {/* <Link
                          to="/configuracoes"
                          className="block text-gray-400 hover:text-white transition-colors py-1"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileProfileOpen(false);
                          }}
                        >
                          Configurações
                        </Link> */}
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                        setIsMobileProfileOpen(false);
                        setIsMobileAdminOpen(false);
                      }}
                      className="flex items-center text-gray-300 hover:text-white transition-colors mt-4 py-2"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sair
                    </button>
                  </div>
                </>
              )}
              
              {!user && (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors"
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