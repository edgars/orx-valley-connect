import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile } from '@/hooks/useUsers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Shield, ShieldX, Ban, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';

interface UserManagementCardProps {
  user: UserProfile;
  onRoleChange: (userId: string, role: 'usuario' | 'administrador') => void;
  onStatusChange: (userId: string, status: 'active' | 'blocked') => void;
  onDeleteUser: (userId: string) => void;
  isUpdating: boolean;
}

const UserManagementCard = ({ user, onRoleChange, onStatusChange, onDeleteUser, isUpdating }: UserManagementCardProps) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [userStatus, setUserStatus] = useState(user.status || 'active');
  
  // Estados para confirmação de exclusão
  const [deleteConfirmationName, setDeleteConfirmationName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRoleChange = (newRole: 'usuario' | 'administrador') => {
    setSelectedRole(newRole);
    onRoleChange(user.id, newRole);
  };

  const handleStatusChange = (newStatus: 'active' | 'blocked') => {
    setUserStatus(newStatus);
    onStatusChange(user.id, newStatus);
  };

  const handleDeleteUser = () => {
    onDeleteUser(user.id);
    setIsDeleteDialogOpen(false);
    setDeleteConfirmationName('');
  };

  const resetDeleteDialog = () => {
    setDeleteConfirmationName('');
    setIsDeleteDialogOpen(false);
  };

  const getRoleIcon = (role: string) => {
    return role === 'administrador' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const getStatusIcon = (status: string) => {
    return status === 'blocked' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />;
  };

  const expectedName = user.full_name || user.username || 'Usuário';
  const isDeleteConfirmationValid = deleteConfirmationName.trim().toLowerCase() === expectedName.toLowerCase();

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-gray-700 text-white">
                {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white text-lg">{user.full_name || 'Sem nome'}</CardTitle>
              <p className="text-gray-400 text-sm">@{user.username || 'sem-username'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge 
              variant={user.role === 'administrador' ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              {getRoleIcon(user.role)}
              {user.role === 'administrador' ? 'Admin' : 'Usuário'}
            </Badge>
            <Badge 
              variant={userStatus === 'blocked' ? 'destructive' : 'outline'}
              className="flex items-center gap-1"
            >
              {getStatusIcon(userStatus)}
              {userStatus === 'blocked' ? 'Bloqueado' : 'Ativo'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.company && (
          <p className="text-gray-300 text-sm">
            <strong>Empresa:</strong> {user.company}
          </p>
        )}
        {user.position && (
          <p className="text-gray-300 text-sm">
            <strong>Cargo:</strong> {user.position}
          </p>
        )}
        <p className="text-gray-400 text-xs">
          Criado em {format(new Date(user.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
        
        <div className="flex flex-col gap-3 pt-3 border-t border-gray-700">
          {/* Seção de Permissão e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Permissão</label>
              <Select
                value={selectedRole}
                onValueChange={handleRoleChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="usuario" className="text-white hover:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Usuário
                    </div>
                  </SelectItem>
                  <SelectItem value="administrador" className="text-white hover:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Administrador
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Status</label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant={userStatus === 'blocked' ? 'default' : 'destructive'}
                    size="sm"
                    className="w-full"
                    disabled={isUpdating}
                  >
                    {userStatus === 'blocked' ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Desbloquear
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4 mr-2" />
                        Bloquear
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-800 border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      {userStatus === 'blocked' ? 'Desbloquear usuário' : 'Bloquear usuário'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      {userStatus === 'blocked' 
                        ? `Tem certeza que deseja desbloquear ${user.full_name}? O usuário poderá acessar a plataforma novamente.`
                        : `Tem certeza que deseja bloquear ${user.full_name}? O usuário não poderá mais acessar a plataforma.`
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusChange(userStatus === 'blocked' ? 'active' : 'blocked')}
                      className={userStatus === 'blocked' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    >
                      {userStatus === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Zona de Perigo - Exclusão */}
          <div className="border-t border-red-900/30 pt-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <label className="text-sm font-medium text-red-400">Zona de Perigo</label>
            </div>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  size="sm"
                  className="w-full bg-red-900 hover:bg-red-800 border border-red-700"
                  disabled={isUpdating}
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Usuário
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 border-red-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Excluir usuário permanentemente
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300 space-y-3">
                    <p>
                      <strong className="text-red-400">ATENÇÃO:</strong> Esta ação não pode ser desfeita! 
                      Todos os dados do usuário serão removidos permanentemente.
                    </p>
                    <p>
                      Para confirmar, digite o nome <strong>"{expectedName}"</strong> abaixo:
                    </p>
                    <Input
                      value={deleteConfirmationName}
                      onChange={(e) => setDeleteConfirmationName(e.target.value)}
                      placeholder={`Digite "${expectedName}" para confirmar`}
                      className="bg-gray-900 border-gray-700 text-white"
                      autoFocus
                    />
                    <div className="text-xs text-gray-400">
                      <p>• O usuário será removido do sistema</p>
                      <p>• Todos os dados associados serão perdidos</p>
                      <p>• Esta ação é irreversível</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    className="bg-gray-700 text-white hover:bg-gray-600"
                    onClick={resetDeleteDialog}
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteUser}
                    disabled={!isDeleteConfirmationValid}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Permanentemente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementCard;