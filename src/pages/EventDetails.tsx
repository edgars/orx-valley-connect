
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';
import { useEventRegistrations } from '@/hooks/useEventRegistrations';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
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

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { 
    data: registrations, 
    registerForEvent, 
    unregisterFromEvent,
    isLoading: registrationLoading 
  } = useEventRegistrations();

  const event = events?.find(e => e.id === id);
  const isRegistered = registrations?.some(r => r.event_id === id);
  const canRegister = event && event.current_participants < (event.max_participants || Infinity);

  const handleRegistration = async () => {
    if (!user || !event) return;

    try {
      if (isRegistered) {
        await unregisterFromEvent.mutateAsync({ eventId: event.id });
      } else {
        await registerForEvent.mutateAsync({ eventId: event.id });
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

                <div className="prose max-w-none">
                  <h3>Sobre o evento</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {event.description}
                  </p>
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
                        disabled={registrationLoading || (!isRegistered && !canRegister)}
                        className="w-full"
                        variant={isRegistered ? "outline" : "default"}
                      >
                        {registrationLoading
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
