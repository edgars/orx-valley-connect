
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orx-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">ORX</span>
          </div>
          <span className="text-xl font-bold text-gradient">ORX Valley</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#eventos" className="text-muted-foreground hover:text-foreground transition-colors">
            Eventos
          </a>
          <a href="#comunidade" className="text-muted-foreground hover:text-foreground transition-colors">
            Comunidade
          </a>
          <a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors">
            Sobre
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background z-50">
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Meus Eventos</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => setIsAuthenticated(true)}>
                Entrar
              </Button>
              <Button className="bg-orx-gradient hover:opacity-90 text-white">
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
