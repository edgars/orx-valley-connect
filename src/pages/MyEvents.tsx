
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserEventRegistrations } from '@/hooks/useEventRegistrations';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, Users, Award, Globe, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const MyEvents = () => {
  const { user } = useAuth();
  const { data: registrations, isLoading } = useUserEventRegistrations();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-gradient">Meus Eventos</h1>
          <p>Carregando seus eventos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const upcomingEvents = registrations?.filter(reg => 
    reg.events && new Date(reg.events.date_time) > new Date()
  ) || [];

  const pastEvents = registrations?.filter(reg => 
    reg.events && new Date(reg.events.date_time) <= new Date()
  ) || [];

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
                <Calendar className="w-5 h-5" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground">Você não tem eventos próximos.</p>
              ) : (
                <div className="grid gap-4">
                  {upcomingEvents.map((registration) => {
                    const event = registration.events;
                    if (!event) return null;

                    return (
                      <div key={registration.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline">{event.type}</Badge>
                              <Badge className="bg-blue-500">Inscrito</Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/eventos/${event.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(event.date_time), "dd 'de' MMMM, yyyy - HH:mm", { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{event.current_participants} participantes</span>
                          </div>
                        </div>

                        {(event.type === 'online' || event.type === 'hibrido') && event.stream_url && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-700">
                              <Globe className="w-4 h-4" />
                              <a 
                                href={event.stream_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline font-medium"
                              >
                                Acessar transmissão do evento
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Eventos Passados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Eventos Anteriores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pastEvents.length === 0 ? (
                <p className="text-muted-foreground">Você ainda não participou de eventos anteriores.</p>
              ) : (
                <div className="grid gap-4">
                  {pastEvents.map((registration) => {
                    const event = registration.events;
                    if (!event) return null;

                    return (
                      <div key={registration.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline">{event.type}</Badge>
                              {registration.attended ? (
                                <Badge className="bg-green-500">Presente</Badge>
                              ) : (
                                <Badge variant="secondary">Ausente</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/eventos/${event.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(event.date_time), "dd 'de' MMMM, yyyy - HH:mm", { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{event.current_participants} participantes</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
