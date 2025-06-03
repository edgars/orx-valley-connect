import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useUsers, useUpdateUserRole, useUpdateUserStatus, useDeleteUser } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import UserManagementCard from '@/components/UserManagementCard';

const UserManagementList = () => {
  const { data: users, isLoading } = useUsers();
  const updateUserRole = useUpdateUserRole();
  const updateUserStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users?.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId: string, role: 'usuario' | 'administrador') => {
    updateUserRole.mutate({ userId, role });
  };

  const handleStatusChange = (userId: string, status: 'active' | 'blocked') => {
    updateUserStatus.mutate({ userId, status });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users?.find(user => user.id === userId);
    
    deleteUser.mutate(userId, {
      onSuccess: () => {
        toast({
          title: "Usuário excluído",
          description: `${userToDelete?.full_name || 'Usuário'} foi removido permanentemente do sistema.`,
          variant: "default",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro ao excluir usuário",
          description: error.message || "Ocorreu um erro inesperado. Tente novamente.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar usuários por nome, username ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filteredUsers?.map((user) => (
              <UserManagementCard
                key={user.id}
                user={user}
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
                onDeleteUser={handleDeleteUser}
                isUpdating={updateUserRole.isPending || updateUserStatus.isPending || deleteUser.isPending}
              />
            ))}
            {(!filteredUsers || filteredUsers.length === 0) && (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchTerm ? 'Nenhum usuário encontrado com os critérios de busca.' : 'Nenhum usuário cadastrado.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementList;