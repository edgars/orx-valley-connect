
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, UsersIcon, Clock, Globe, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRegisterForEvent } from '@/hooks/useEvents';
import { useCheckEventRegistration } from '@/hooks/useEventRegistrations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegisterForEvent();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do evento não fornecido');

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: isRegistered } = useCheckEventRegistration(id || '');

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para se inscrever no evento.",
        variant: "destructive",
      });
      return;
    }

    if (isRegistered) {
      toast({
        title: "Já inscrito",
        description: "Você já está cadastrado para este evento.",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(id);
  };

  const generateCalendarEvent = () => {
    if (!event) return;
    
    const startDate = new Date(event.date_time);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presencial': return 'bg-green-500';
      case 'online': return 'bg-blue-500';
      case 'hibrido': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'presencial': return 'Presencial';
      case 'online': return 'Online';
      case 'hibrido': return 'Híbrido';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
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
          <Card>
            <CardContent className="py-12 text-center">
              <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
              <p className="text-muted-foreground">O evento que você está procurando não foi encontrado.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date_time);
  const isPastEvent = eventDate < new Date();
  const spotsLeft = event.max_participants ? event.max_participants - event.current_participants : null;
  const isFull = spotsLeft === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header da página */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${getTypeColor(event.type)} text-white`}>
                {getTypeName(event.type)}
              </Badge>
              {isPastEvent && (
                <Badge className="bg-gray-500 text-white">
                  Finalizado
                </Badge>
              )}
              {isRegistered && (
                <Badge className="bg-green-500 text-white">
                  Você está inscrito
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gradient">{event.title}</h1>
          </div>

          {/* Imagem do evento */}
          {event.image_url && (
            <div className="mb-8">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo principal */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre o Evento</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar com informações */}
            <div className="space-y-6">
              {/* Informações do evento */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Data e Hora</p>
                      <p className="text-sm text-muted-foreground">
                        {format(eventDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(eventDate, "HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Local</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>

                  {event.max_participants && (
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Participantes</p>
                        <p className="text-sm text-muted-foreground">
                          {event.current_participants}/{event.max_participants}
                        </p>
                        {spotsLeft && spotsLeft > 0 && spotsLeft <= 10 && (
                          <p className="text-sm text-amber-500 font-medium">
                            Apenas {spotsLeft} vagas restantes!
                          </p>
                        )}
                        {isFull && (
                          <p className="text-sm text-red-500 font-medium">
                            Evento lotado
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(event.type === 'online' || event.type === 'hibrido') && event.stream_url && isRegistered && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Transmissão Online</p>
                        <a 
                          href={event.stream_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Acessar transmissão
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ações */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  {!isPastEvent && (
                    <Button 
                      className="w-full bg-orx-gradient hover:opacity-90 text-white"
                      onClick={handleRegister}
                      disabled={!user || isFull || registerMutation.isPending || isRegistered}
                      size="lg"
                    >
                      {!user ? 'Faça login para se inscrever' : 
                       isFull ? 'Evento lotado' :
                       isRegistered ? 'Já inscrito' :
                       registerMutation.isPending ? 'Inscrevendo...' : 'Inscrever-se'}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={generateCalendarEvent}
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Adicionar ao Calendário
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
