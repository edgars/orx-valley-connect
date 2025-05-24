
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useUsers';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useIsAdmin();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (hash: string) => {
    // Se estiver numa página de administração, redireciona para home primeiro
    const isAdminPage = location.pathname.includes('/admin') || location.pathname.includes('/eventos/gerenciar');
    
    if (isAdminPage) {
      navigate('/' + hash);
    } else {
      // Se já estiver na home, apenas faz scroll
      if (location.pathname === '/') {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/' + hash);
      }
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-orx-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">ORX</span>
          </div>
          <span className="text-xl font-bold text-gradient">ORX Valley</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleNavigation('#eventos')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Eventos
          </button>
          <button
            onClick={() => handleNavigation('#comunidade')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Comunidade
          </button>
          <button
            onClick={() => handleNavigation('#sobre')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sobre
          </button>
          {user && (
            <>
              <button
                onClick={() => navigate('/membros')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Membros
              </button>
              <button
                onClick={() => navigate('/meus-eventos')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Meus Eventos
              </button>
            </>
          )}
          {isAdmin && (
            <>
              <button
                onClick={() => navigate('/admin')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => navigate('/eventos/gerenciar')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Gestão de Eventos
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-orx-gradient text-white">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border z-50">
                <DropdownMenuItem>
                  <span className="font-medium">{getUserDisplayName()}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/perfil')}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/meus-eventos')}>
                  Meus Eventos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/membros')}>
                  Membros
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Administração
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/eventos/gerenciar')}>
                      Gestão de Eventos
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Entrar
              </Button>
              <Button 
                className="bg-orx-gradient hover:opacity-90 text-white"
                onClick={() => navigate('/auth')}
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
