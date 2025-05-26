
import { useState } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import MemberCard from '@/components/MemberCard';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Members = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: members, isLoading } = useMembers(searchTerm);

  // Só permite ver membros se estiver logado
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gradient">Membros da Comunidade</h1>
          <p className="text-muted-foreground mb-6">
            Conecte-se com outros membros da ORX Valley e expanda sua rede de contatos.
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar membros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-muted rounded-full"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                    <div className="h-16 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                name={member.full_name || member.username || 'Membro'}
                bio={member.bio || 'Membro da comunidade ORX Valley'}
                location={member.location || 'Localização não informada'}
                interests={member.interests || []}
                avatar={member.avatar_url}
                github={member.github_url}
                linkedin={member.linkedin_url}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                {searchTerm 
                  ? 'Nenhum membro encontrado com os termos de busca.' 
                  : 'Nenhum membro encontrado.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Members;
