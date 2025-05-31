import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserEventRegistrations } from "@/hooks/useEventRegistrations";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookOpen, List } from "lucide-react";
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

  const myRegisteredEvents =
    registrations?.map((reg) => reg.events).filter(Boolean) || [];
  const myRegisteredEventIds = new Set(
    myRegisteredEvents.map((event) => event.id)
  );

  const availableEvents =
    allEvents?.filter(
      (event) =>
        !myRegisteredEventIds.has(event.id) &&
        new Date(event.date_time) > new Date()
    ) || [];

  const renderEventCard = (event: any) => {
    const maxParticipants = event.max_participants || 0;
    const currentParticipants = event.current_participants || 0;
    const remainingSpots =
      maxParticipants > 0 ? maxParticipants - currentParticipants : null;

    return (
      <div
        key={event.id}
        className="bg-[#111] rounded-xl shadow-md border border-neutral-800 overflow-hidden text-white relative"
      >
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.image_url || "/orxvalley.white.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute top-3 right-3">
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
          <h3 className="text-lg font-semibold leading-snug">{event.title}</h3>

          <div className="mt-2 text-sm text-gray-300 space-y-1">
            <div>
              {format(new Date(event.date_time), "dd 'de' MMMM, yyyy - HH:mm", {
                locale: ptBR,
              })}
            </div>
            <div>{event.location}</div>
            <div>
              {currentParticipants}/{maxParticipants} participantes
            </div>
          </div>

          {remainingSpots !== null && remainingSpots > 0 && (
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
            {/*  <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => console.log("Inscrever-se clicado")}
            >
              Inscrever-se
            </Button>
            <Button
              variant="outline"
              className="w-full border border-neutral-600 bg-transparent text-white hover:bg-white/10"
              onClick={() => console.log("Adicionar ao calendário")}
            >
              Adicionar ao Calendário
            </Button> */}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Minhas Inscrições
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myRegisteredEvents.length === 0 ? (
                <p className="text-muted-foreground">
                  Você ainda não se inscreveu em nenhum evento.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {registrations?.map((registration) => {
                    const event = registration.events;
                    if (!event) return null;
                    return renderEventCard(event);
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5" />
                Todos os disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableEvents.length === 0 ? (
                <p className="text-muted-foreground">
                  Não há eventos disponíveis para inscrição no momento.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableEvents.map((event) => renderEventCard(event))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyEvents;
