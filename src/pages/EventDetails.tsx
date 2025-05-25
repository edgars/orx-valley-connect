
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';
import { useUserEventRegistrations, useCheckEventRegistration } from '@/hooks/useEventRegistrations';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ReactMarkdown from 'react-markdown';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Clock, 
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: userRegistrations, isLoading: registrationLoading } = useUserEventRegistrations();
  const { data: isRegistered } = useCheckEventRegistration(id || '');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const event = events?.find(e => e.id === id);
  const canRegister = event && event.current_participants < (event.max_participants || Infinity);

  const registerMutation = useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{ event_id: eventId, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-event-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event-registration-check'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Inscrição realizada!",
        description: "Você foi inscrito no evento com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na inscrição",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const unregisterMutation = useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-event-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event-registration-check'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Inscrição cancelada!",
        description: "Sua inscrição foi cancelada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cancelar inscrição",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleRegistration = async () => {
    if (!user || !event) return;

    try {
      if (isRegistered) {
        await unregisterMutation.mutateAsync({ eventId: event.id });
      } else {
        await registerMutation.mutateAsync({ eventId: event.id });
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presencial':
        return 'bg-blue-100 text-blue-800';
      case 'online':
        return 'bg-purple-100 text-purple-800';
      case 'hibrido':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
              <p className="text-muted-foreground">
                O evento que você está procurando não existe ou foi removido.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date_time);
  const isEventPast = eventDate < new Date();
  const isMutating = registerMutation.isPending || unregisterMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                  <Badge className={getTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(eventDate, "HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.current_participants}
                      {event.max_participants && ` / ${event.max_participants}`} participantes
                    </span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <h3>Sobre o evento</h3>
                  <div className="markdown-content">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-foreground">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-foreground">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                        a: ({ children, href }) => <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                        code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>,
                        pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">{children}</blockquote>,
                      }}
                    >
                      {event.description}
                    </ReactMarkdown>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Requisitos</h4>
                    <p className="text-muted-foreground">
                      {event.type === 'online' 
                        ? 'Acesso à internet e dispositivo com navegador atualizado.'
                        : event.type === 'hibrido'
                        ? 'Você pode participar presencialmente ou online. Para participação online, é necessário acesso à internet.'
                        : 'Compareça ao local do evento no horário indicado.'
                      }
                    </p>
                  </div>
                  
                  {event.type !== 'presencial' && (
                    <div>
                      <h4 className="font-semibold mb-2">Link de Acesso</h4>
                      <p className="text-muted-foreground">
                        O link para participação online será enviado por email aos inscritos próximo ao evento.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Inscrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      {isRegistered ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Você está inscrito!</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                          <XCircle className="h-5 w-5" />
                          <span>Você não está inscrito</span>
                        </div>
                      )}
                    </div>

                    {!isEventPast && event.status === 'ativo' && (
                      <Button
                        onClick={handleRegistration}
                        disabled={isMutating || (!isRegistered && !canRegister)}
                        className="w-full"
                        variant={isRegistered ? "outline" : "default"}
                      >
                        {isMutating
                          ? "Processando..."
                          : isRegistered
                          ? "Cancelar Inscrição"
                          : canRegister
                          ? "Inscrever-se"
                          : "Vagas Esgotadas"
                        }
                      </Button>
                    )}

                    {isEventPast && (
                      <div className="text-center text-muted-foreground">
                        Este evento já aconteceu
                      </div>
                    )}

                    {event.status !== 'ativo' && (
                      <div className="text-center text-muted-foreground">
                        Inscrições não disponíveis
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Faça login para se inscrever no evento
                    </p>
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="w-full"
                    >
                      Fazer Login
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Participantes:</span>
                    <span className="font-medium">{event.current_participants}</span>
                  </div>
                  {event.max_participants && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vagas totais:</span>
                      <span className="font-medium">{event.max_participants}</span>
                    </div>
                  )}
                  {event.max_participants && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vagas restantes:</span>
                      <span className="font-medium">
                        {Math.max(0, event.max_participants - event.current_participants)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
