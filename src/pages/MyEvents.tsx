import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserEventRegistrations } from "@/hooks/useEventRegistrations";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookOpen, List, History, Calendar, Clock, MapPin, Award, Play, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useEvents } from "@/hooks/useEvents";

const MyEvents = () => {
  const { user } = useAuth();
  const { data: registrations, isLoading: loadingRegistrations } =
    useUserEventRegistrations();
  const { data: allEvents, isLoading: loadingAllEvents } = useEvents();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                Faça login para ver seus eventos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loadingRegistrations || loadingAllEvents) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gradient">
            Meus Eventos
          </h1>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const myRegisteredEvents = registrations?.map((reg) => reg.events).filter(Boolean) || [];
  const myRegisteredEventIds = new Set(myRegisteredEvents.map((event) => event.id));

  // Função para verificar se evento está acontecendo agora
  const isEventHappening = (event: any) => {
    const eventDate = new Date(event.date_time);
    const now = new Date();
    return eventDate <= now && eventDate.getTime() + (2 * 60 * 60 * 1000) > now.getTime(); // Evento + 2 horas
  };

  // Separar eventos por status
  const now = new Date();
  const happeningNowEvents = myRegisteredEvents.filter(event => isEventHappening(event));
  const upcomingRegisteredEvents = myRegisteredEvents.filter(event => 
    new Date(event.date_time) > now && !isEventHappening(event)
  );
  const pastRegisteredEvents = myRegisteredEvents.filter(event => 
    new Date(event.date_time) <= now && event.status === 'finalizado' && !isEventHappening(event)
  );

  // Eventos disponíveis (não inscritos)
  const availableEvents = allEvents?.filter(
    (event) =>
      !myRegisteredEventIds.has(event.id) &&
      new Date(event.date_time) > new Date() &&
      event.status === 'ativo'
  ) || [];

  const renderEventCard = (event: any, type: 'happening' | 'upcoming' | 'past' | 'available' = 'upcoming') => {
    const maxParticipants = event.max_participants || 0;
    const currentParticipants = event.current_participants || 0;
    const remainingSpots = maxParticipants > 0 ? maxParticipants - currentParticipants : null;
    const eventDate = new Date(event.date_time);
    const isHappening = type === 'happening';
    const isPast = type === 'past';
    const isAvailable = type === 'available';

    return (
      <div
        key={event.id}
        className={`
          rounded-xl shadow-md border overflow-hidden relative transition-all duration-300 hover:shadow-lg
          ${isHappening ? 'bg-card border-primary ring-2 ring-primary/30' : ''}
          ${isPast ? 'bg-card/70 border-border opacity-80' : ''}
          ${isAvailable ? 'bg-card border-border' : ''}
          ${type === 'upcoming' ? 'bg-card border-border' : ''}
        `}
      >
        <div className="relative h-24 sm:h-28 overflow-hidden">
          <img
            src={event.image_url || "/orxvalley.white.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {isHappening && (
              <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                <Play className="w-3 h-3" />
                Ao vivo
              </Badge>
            )}
            {isPast && (
              <Badge className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-1 rounded-full">
                Finalizado
              </Badge>
            )}
            {isAvailable && (
              <Badge className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                Disponível
              </Badge>
            )}
            <Badge
              className={`
              text-white text-xs font-semibold px-2 py-1 rounded-full border-0
              ${event.type === "presencial" ? "bg-orange-500" : ""}
              ${event.type === "online" ? "bg-blue-500" : ""}
              ${event.type === "hibrido" ? "bg-purple-500" : ""}
            `}
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2 mb-2">
            {event.title}
          </h3>

          <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{format(eventDate, "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{format(eventDate, "HH:mm", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            {event.workload && (
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{event.workload}h</span>
              </div>
            )}
            {event.speaker && (
              <div className="flex items-center gap-2">
                <Award className="w-3 h-3 flex-shrink-0" />
                <span className="line-clamp-1">{event.speaker}</span>
              </div>
            )}
          </div>

          {isAvailable && remainingSpots !== null && remainingSpots > 0 && remainingSpots <= 10 && (
            <div className="mt-2">
              <p className="text-yellow-600 dark:text-yellow-400 font-medium text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {remainingSpots} vaga{remainingSpots !== 1 ? "s" : ""} restante{remainingSpots !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          <div className="mt-3 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs sm:text-sm"
              onClick={() => navigate(`/eventos/${event.id}`)}
            >
              Ver Detalhes
            </Button>
            
            {isPast && event.status === 'finalizado' && (
              <Button
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                onClick={() => navigate('/certificados')}
              >
                <Award className="w-3 h-3 mr-1" />
                Certificado
              </Button>
            )}

            {isHappening && (
              <Button
                size="sm"
                className="w-full bg-orx-gradient hover:opacity-90 text-white text-xs sm:text-sm"
                onClick={() => navigate(`/eventos/${event.id}`)}
              >
                <Play className="w-3 h-3 mr-1" />
                Participar
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-4 sm:py-8 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gradient">Meus Eventos</h1>

        <div className="space-y-6 sm:space-y-8">
          {/* Eventos Acontecendo Agora */}
          {happeningNowEvents.length > 0 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Play className="w-5 h-5 animate-pulse" />
                  Acontecendo Agora
                  <Badge className="bg-primary text-primary-foreground animate-pulse">
                    {happeningNowEvents.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {happeningNowEvents.map((event) => renderEventCard(event, 'happening'))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meus Próximos Eventos */}
          {upcomingRegisteredEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Meus Próximos Eventos
                  <Badge variant="secondary">
                    {upcomingRegisteredEvents.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upcomingRegisteredEvents
                    .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
                    .map((event) => renderEventCard(event, 'upcoming'))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eventos Disponíveis para Inscrição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5" />
                Eventos Disponíveis
                {availableEvents.length > 0 && (
                  <Badge variant="secondary">
                    {availableEvents.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableEvents.length === 0 ? (
                <div className="text-center py-8">
                  <List className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground text-base sm:text-lg mb-2">
                    Nenhum evento disponível
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Não há eventos disponíveis para inscrição no momento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {availableEvents
                    .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
                    .map((event) => renderEventCard(event, 'available'))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Eventos Anteriores */}
          {pastRegisteredEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Meus Eventos Anteriores
                  <Badge variant="secondary">
                    {pastRegisteredEvents.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pastRegisteredEvents
                    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
                    .map((event) => renderEventCard(event, 'past'))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado vazio - quando não há eventos inscritos */}
          {myRegisteredEvents.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground text-base sm:text-lg mb-2">
                  Você ainda não se inscreveu em nenhum evento
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  Explore os eventos disponíveis abaixo e se inscreva!
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-orx-gradient hover:opacity-90"
                >
                  Explorar Eventos
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyEvents;