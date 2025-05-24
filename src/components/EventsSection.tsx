
import EventCard from './EventCard';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useUsers';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateEventDialog from './CreateEventDialog';

const EventsSection = () => {
  const { data: events, isLoading } = useEvents();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (isLoading) {
    return (
      <section id="eventos" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Próximos Eventos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Carregando eventos...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="eventos" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl font-bold text-gradient">Próximos Eventos</h2>
            {isAdmin && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                size="sm"
                className="bg-orx-gradient hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Evento
              </Button>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Participe dos nossos eventos e expanda sua rede de contatos enquanto aprende 
            com especialistas da área de tecnologia.
          </p>
        </div>
        
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum evento ativo no momento.
            </p>
            {isAdmin && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="mt-4 bg-orx-gradient hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Evento
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateEventDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
      />
    </section>
  );
};

export default EventsSection;
