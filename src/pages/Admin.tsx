
import { useUsers, useUpdateUserRole, useIsAdmin } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Admin = () => {
  const isAdmin = useIsAdmin();
  const { data: users, isLoading } = useUsers();
  const updateRoleMutation = useUpdateUserRole();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleRoleChange = (userId: string, newRole: 'usuario' | 'administrador') => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-gradient">Administração</h1>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-gradient">Administração</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários ({users?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{user.full_name || 'Sem nome'}</h3>
                        <Badge variant={user.role === 'administrador' ? 'default' : 'secondary'}>
                          {user.role === 'administrador' ? 'Admin' : 'Usuário'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">@{user.username || 'sem-username'}</p>
                      {user.company && (
                        <p className="text-sm text-muted-foreground">{user.company}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Criado em {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Select
                        value={user.role}
                        onValueChange={(value: 'usuario' | 'administrador') => handleRoleChange(user.id, value)}
                        disabled={updateRoleMutation.isPending}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usuario">Usuário</SelectItem>
                          <SelectItem value="administrador">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                
                {(!users || users.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum usuário encontrado.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
