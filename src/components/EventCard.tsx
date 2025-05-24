
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { useRegisterForEvent } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { user } = useAuth();
  const registerMutation = useRegisterForEvent();

  const handleRegister = () => {
    if (!user) {
      return;
    }
    registerMutation.mutate(event.id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presencial':
        return 'bg-green-500 hover:bg-green-600';
      case 'online':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'hibrido':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'presencial':
        return 'Presencial';
      case 'online':
        return 'Online';
      case 'hibrido':
        return 'Híbrido';
      default:
        return type;
    }
  };

  const spotsLeft = event.max_participants ? event.max_participants - event.current_participants : null;
  const isFull = spotsLeft === 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card border-border">
      <div className="aspect-video w-full bg-gradient-to-br from-orx-primary/20 to-orx-accent/20 relative overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CalendarIcon className="w-16 h-16 text-primary/50" />
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${getTypeColor(event.type)}`}>
          {getTypeName(event.type)}
        </Badge>
      </div>
      
      <CardHeader>
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {event.description}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>{format(new Date(event.date_time), "dd 'de' MMMM, yyyy - HH:mm", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {event.max_participants && (
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-primary" />
              <span>
                {event.current_participants}/{event.max_participants} participantes
              </span>
            </div>
          )}
          {spotsLeft && spotsLeft > 0 && spotsLeft <= 10 && (
            <p className="text-amber-500 font-medium">
              Apenas {spotsLeft} vagas restantes!
            </p>
          )}
          {isFull && (
            <p className="text-red-500 font-medium">
              Evento lotado
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-orx-gradient hover:opacity-90 text-white"
          onClick={handleRegister}
          disabled={!user || isFull || registerMutation.isPending}
        >
          {!user ? 'Faça login para se inscrever' : 
           isFull ? 'Evento lotado' :
           registerMutation.isPending ? 'Inscrevendo...' : 'Inscrever-se'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
