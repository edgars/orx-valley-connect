
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings, Users, Calendar, FileText, Plus } from 'lucide-react';

interface AdminDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminDropdown = ({ isOpen, onToggle }: AdminDropdownProps) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggle}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-white hover:bg-gray-800  flex items-center gap-1">
          Admin
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-800 " align="end">
        <DropdownMenuLabel>Painel Administrativo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/admin" className="flex items-center gap-2 w-full">
            <Settings className="w-4 h-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/Comunidade" className="flex items-center gap-2 w-full">
            <Users className="w-4 h-4" />
            Membros
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/eventos/gerenciar" className="flex items-center gap-2 w-full">
            <Calendar className="w-4 h-4" />
            Gestão de Eventos
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Blog</DropdownMenuLabel>
        
        <DropdownMenuItem asChild>
          <Link to="/blog/gerenciar" className="flex items-center gap-2 w-full">
            <FileText className="w-4 h-4" />
            Gerenciar Posts
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/blog/criar" className="flex items-center gap-2 w-full">
            <Plus className="w-4 h-4" />
            Novo Post
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminDropdown;
