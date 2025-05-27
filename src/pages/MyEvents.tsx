
import { useUserEventRegistrations } from '@/hooks/useEventRegistrations';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MyEvents = () => {
  const { user } = useAuth();
  const { data: registrations, isLoading } = useUserEventRegistrations();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const upcomingEvents = registrations?.filter(reg => 
    new Date(reg.events.date_time) > new Date() && reg.events.status === 'ativo'
  );
  
  const pastEvents = registrations?.filter(reg => 
    new Date(reg.events.date_time) <= new Date() || reg.events.status !== 'ativo'
  );

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-gradient">Meus Eventos</h1>
        
        {(!registrations || registrations.length === 0) ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                Você ainda não se inscreveu em nenhum evento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {upcomingEvents && upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Próximos Eventos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((registration) => (
                    <EventCard key={registration.id} event={registration.events} />
                  ))}
                </div>
              </div>
            )}

            {pastEvents && pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Eventos Passados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((registration) => (
                    <div key={registration.id} className="relative">
                      <EventCard event={registration.events} />
                      <div className="absolute top-2 left-2 bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        Inscrito em {format(new Date(registration.registered_at), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
