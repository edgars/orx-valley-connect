
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsAdmin } from '@/hooks/useUsers';
import Header from '@/components/Header';
import UserManagementCard from '@/components/UserManagementCard';
import SponsorManagementCard from '@/components/SponsorManagementCard';
import StatsCards from '@/components/StatsCards';

const Admin = () => {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-gradient">Painel Administrativo</h1>
        
        <StatsCards />
        
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Gestão de Usuários</TabsTrigger>
            <TabsTrigger value="sponsors">Gestão de Apoiadores</TabsTrigger>
            <TabsTrigger value="content">Gestão de Conteúdo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagementCard />
          </TabsContent>
          
          <TabsContent value="sponsors">
            <SponsorManagementCard />
          </TabsContent>
          
          <TabsContent value="content">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Conteúdo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Em breve: ferramentas para gerenciar eventos, blog posts e outros conteúdos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
