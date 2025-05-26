
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { MapPin, Building, Briefcase, Calendar, Github, Linkedin, Globe, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const MemberDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: member, isLoading, error } = useQuery({
    queryKey: ['member', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (!id) {
    return <Navigate to="/members" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <p>Carregando perfil do membro...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">Membro não encontrado.</p>
              <Link to="/members">
                <Button className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Membros
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-6">
          <Link to="/members">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Membros
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback className="bg-orx-gradient text-white text-2xl">
                  {member.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <CardTitle className="text-2xl">{member.full_name || 'Nome não informado'}</CardTitle>
              <p className="text-muted-foreground">@{member.username || 'username-não-informado'}</p>
              
              <Badge 
                variant={member.role === 'administrador' ? 'default' : 'secondary'}
                className="mt-2"
              >
                {member.role === 'administrador' ? 'Administrador' : 'Membro'}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {member.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{member.location}</span>
                </div>
              )}
              
              {member.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{member.company}</span>
                </div>
              )}
              
              {member.position && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{member.position}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Membro desde {format(new Date(member.created_at), "MMMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {member.bio && (
                <div>
                  <h3 className="font-semibold mb-2">Biografia</h3>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              )}
              
              {member.interests && member.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Interesses</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.interests.map((interest: string) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {(member.github_url || member.linkedin_url || member.portfolio_url) && (
                <div>
                  <h3 className="font-semibold mb-3">Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {member.github_url && (
                      <a 
                        href={member.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a 
                        href={member.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {member.portfolio_url && (
                      <a 
                        href={member.portfolio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
