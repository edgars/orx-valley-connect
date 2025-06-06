import { useState } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
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

  if (!user) return <Navigate to="/auth" replace />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24 text-white text-center">
          Carregando...
        </div>
        <Footer />
      </div>
    );
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

        {members && members.length > 0 ? (
          <>
            {/* Admins */}
            {members.some((member) => member.role === 'administrador') && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-foreground">
                  Administradores
                </h2>
                <div className="border-b border-muted mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members
                    .filter((member) => member.role === 'administrador')
                    .map((member) => (
                      <MemberCard
                        key={member.id}
                        name={member.full_name || member.username || 'Membro'}
                        bio={member.bio || 'Administrador da comunidade ORX Valley'}
                        location={member.location || 'Localização não informada'}
                        interests={member.interests || []}
                        avatar={member.avatar_url}
                        github={member.github_url}
                        linkedin={member.linkedin_url}
                        isAdmin={true}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Membros comuns */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Membros</h2>
              <div className="border-b border-muted mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members
                  .filter((member) => member.role !== 'administrador')
                  .map((member) => (
                    <MemberCard
                      key={member.id}
                      name={member.full_name || member.username || 'Membro'}
                      bio={member.bio || 'Membro da comunidade ORX Valley'}
                      location={member.location || 'Localização não informada'}
                      interests={member.interests || []}
                      avatar={member.avatar_url}
                      github={member.github_url}
                      linkedin={member.linkedin_url}
                      isAdmin={false}
                    />
                  ))}
              </div>
            </div>
          </>
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
      <Footer />
    </div>
  );
};

export default Members;
