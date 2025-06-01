import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserEventRegistrations } from "@/hooks/useEventRegistrations";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookOpen, List, History, Calendar, Clock, MapPin, Award } from "lucide-react";
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
        <div className="container py-8">
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
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-gradient">
            Meus Eventos
          </h1>
          <p>Carregando seus eventos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const myRegisteredEvents = registrations?.map((reg) => reg.events).filter(Boolean) || [];
  const myRegisteredEventIds = new Set(myRegisteredEvents.map((event) => event.id));

  // Separar eventos por data (futuro vs passado)
  const now = new Date();
  const upcomingEvents = myRegisteredEvents.filter(event => new Date(event.date_time) > now);
  const pastEvents = myRegisteredEvents.filter(event => new Date(event.date_time) <= now);

  const availableEvents = allEvents?.filter(
    (event) =>
      !myRegisteredEventIds.has(event.id) &&
      new Date(event.date_time) > new Date()
  ) || [];

  const renderEventCard = (event: any, isPast = false) => {
    const maxParticipants = event.max_participants || 0;
    const currentParticipants = event.current_participants || 0;
    const remainingSpots = maxParticipants > 0 ? maxParticipants - currentParticipants : null;
    const eventDate = new Date(event.date_time);

    return (
      <div
        key={event.id}
        className={`bg-[#111] rounded-xl shadow-md border border-neutral-800 overflow-hidden text-white relative ${
          isPast ? 'opacity-80' : ''
        }`}
      >
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.image_url || "/orxvalley.white.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {isPast && (
              <Badge className="bg-gray-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Finalizado
              </Badge>
            )}
            <Badge
              className={`
              text-white text-xs font-semibold px-3 py-1 rounded-full border-0
              ${event.type === "presencial" ? "bg-orange-500" : ""}
              ${event.type === "online" ? "bg-blue-500" : ""}
              ${event.type === "hibrido" ? "bg-purple-500" : ""}
            `}
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold leading-snug line-clamp-2">{event.title}</h3>

          <div className="mt-3 space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(eventDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {format(eventDate, "HH:mm", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            {event.workload && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Carga horária: {event.workload} horas
              </div>
            )}
            {event.speaker && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="line-clamp-1">Palestrante: {event.speaker}</span>
              </div>
            )}
          </div>

          {!isPast && remainingSpots !== null && remainingSpots > 0 && (
            <div className="flex items-center justify-center">
              <p className="text-yellow-400 font-semibold text-sm mt-3">
                Apenas {remainingSpots} vaga{remainingSpots !== 1 ? "s" : ""}{" "}
                restante{remainingSpots !== 1 ? "s" : ""}!
              </p>
            </div>
          )}

          <div className="mt-5 space-y-2">
            <Button
              variant="outline"
              className="w-full border border-neutral-600 bg-transparent text-white hover:bg-white/10"
              onClick={() => navigate(`/eventos/${event.id}`)}
            >
              Ver Detalhes
            </Button>
            
            {isPast && event.status === 'finalizado' && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate('/certificados')}
              >
                <Award className="w-4 h-4 mr-2" />
                Ver Certificado
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
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-gradient">Meus Eventos</h1>

        <div className="grid gap-8">
          {/* Próximos Eventos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Próximos Eventos
                {upcomingEvents.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {upcomingEvents.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">
                    Nenhum evento próximo
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Você não tem eventos agendados no momento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => renderEventCard(event, false))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Eventos Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5" />
                Eventos Disponíveis
                {availableEvents.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {availableEvents.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableEvents.length === 0 ? (
                <div className="text-center py-8">
                  <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">
                    Nenhum evento disponível
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Não há eventos disponíveis para inscrição no momento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableEvents.map((event) => renderEventCard(event, false))}
                </div>
              )}
            </CardContent>
          </Card>

               {/* Histórico de Eventos */}
          {pastEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Eventos Anteriores
                  <Badge variant="secondary" className="ml-2">
                    {pastEvents.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents
                    .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
                    .map((event) => renderEventCard(event, true))}
                </div>
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