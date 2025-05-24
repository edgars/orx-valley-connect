import { useUsers, useUpdateUserRole, useUpdateUserStatus, useIsAdmin } from '@/hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import UserManagementCard from '@/components/UserManagementCard';
import { Search, Users, Shield, Ban } from 'lucide-react';

const Admin = () => {
  const isAdmin = useIsAdmin();
  const { data: users, isLoading } = useUsers();
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleRoleChange = (userId: string, newRole: 'usuario' | 'administrador') => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleStatusChange = (userId: string, status: 'active' | 'blocked') => {
    updateStatusMutation.mutate({ userId, status });
  };

  const filteredUsers = users?.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statsData = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'administrador').length || 0,
    blocked: users?.filter(u => u.status === 'blocked').length || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8 text-gradient">Administração</h1>
          <p className="text-white">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <h1 className="text-3xl font-bold mb-8 text-gradient">Administração</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Usuários</p>
                  <p className="text-2xl font-bold text-white">{statsData.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Administradores</p>
                  <p className="text-2xl font-bold text-white">{statsData.admins}</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Usuários Bloqueados</p>
                  <p className="text-2xl font-bold text-white">{statsData.blocked}</p>
                </div>
                <Ban className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Gerenciar Usuários ({filteredUsers?.length || 0})</span>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {filteredUsers?.map((user) => (
                <UserManagementCard
                  key={user.id}
                  user={user}
                  onRoleChange={handleRoleChange}
                  onStatusChange={handleStatusChange}
                  isUpdating={updateRoleMutation.isPending || updateStatusMutation.isPending}
                />
              ))}
              
              {(!filteredUsers || filteredUsers.length === 0) && (
                <p className="text-center text-gray-400 py-8">
                  {searchTerm ? 'Nenhum usuário encontrado com esse termo.' : 'Nenhum usuário encontrado.'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
