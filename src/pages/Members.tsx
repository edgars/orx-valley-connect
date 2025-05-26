
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMembers } from '@/hooks/useMembers';
import Header from '@/components/Header';
import MemberCard from '@/components/MemberCard';
import { Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: members, isLoading } = useMembers(searchTerm);
  const navigate = useNavigate();

  const handleMemberClick = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-gradient">Nossos Membros</h1>
          <p>Carregando membros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Nossos Membros</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça os profissionais talentosos que fazem parte da comunidade ORX Valley.
            Cada membro traz sua experiência única e contribui para o crescimento do nosso ecossistema.
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar membros por nome, localização ou bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-orx-primary" />
                <div>
                  <p className="text-2xl font-bold">{members?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Membros Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {members?.filter(m => m.role === 'administrador').length || 0}
                </div>
                <div>
                  <p className="text-2xl font-bold">{members?.filter(m => m.role === 'administrador').length || 0}</p>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {new Set(members?.map(m => m.location).filter(Boolean)).size || 0}
                </div>
                <div>
                  <p className="text-2xl font-bold">{new Set(members?.map(m => m.location).filter(Boolean)).size || 0}</p>
                  <p className="text-sm text-muted-foreground">Cidades</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Grid */}
        {members && members.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <div key={member.id} onClick={() => handleMemberClick(member.id)} className="cursor-pointer">
                <MemberCard
                  name={member.full_name || 'Nome não informado'}
                  bio={member.bio || 'Bio não informada'}
                  location={member.location || 'Localização não informada'}
                  interests={member.interests || []}
                  avatar={member.avatar_url}
                  github={member.github_url}
                  linkedin={member.linkedin_url}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                {searchTerm ? 'Nenhum membro encontrado com os critérios de busca.' : 'Nenhum membro cadastrado ainda.'}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                >
                  Limpar Busca
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Members;
