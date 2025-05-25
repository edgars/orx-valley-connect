
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, UsersIcon, Download, Globe, Eye } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { useRegisterForEvent } from '@/hooks/useEvents';
import { useCheckEventRegistration } from '@/hooks/useEventRegistrations';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const registerMutation = useRegisterForEvent();
  const { data: isRegistered, isLoading: checkingRegistration } = useCheckEventRegistration(event.id);

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

    registerMutation.mutate(event.id);
  };

  const handleViewDetails = () => {
    navigate(`/eventos/${event.id}`);
  };

  const generateCalendarEvent = () => {
    const startDate = new Date(event.date_time);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarData = {
      title: event.title,
      start: formatDateForCalendar(startDate),
      end: formatDateForCalendar(endDate),
      description: event.description,
      location: event.location
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.title)}&dates=${calendarData.start}/${calendarData.end}&details=${encodeURIComponent(calendarData.description)}&location=${encodeURIComponent(calendarData.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
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

  // Remove markdown formatting for preview
  const getPlainTextPreview = (markdown: string) => {
    return markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/`(.*?)`/g, '$1') // Remove code
      .replace(/^\s*[-*+]\s/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s/gm, '') // Remove ordered list markers
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
  };

  const spotsLeft = event.max_participants ? event.max_participants - event.current_participants : null;
  const isFull = spotsLeft === 0;
  const eventDate = new Date(event.date_time);
  const isPastEvent = eventDate < new Date();

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
        {isPastEvent && (
          <Badge className="absolute top-3 left-3 bg-gray-500">
            Finalizado
          </Badge>
        )}
      </div>
      
      <CardHeader>
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {getPlainTextPreview(event.description)}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>{format(eventDate, "dd 'de' MMMM, yyyy - HH:mm", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {(event.type === 'online' || event.type === 'hibrido') && event.stream_url && isRegistered && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <a 
                href={event.stream_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline line-clamp-1"
              >
                Acessar transmissão
              </a>
            </div>
          )}
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
          {isRegistered && (
            <p className="text-green-500 font-medium">
              ✓ Você está inscrito neste evento
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="space-y-2">
        <div className="w-full space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>

          {!isPastEvent && (
            <Button 
              className="w-full bg-orx-gradient hover:opacity-90 text-white"
              onClick={handleRegister}
              disabled={!user || isFull || registerMutation.isPending || checkingRegistration || isRegistered}
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
          >
            <Download className="w-4 h-4 mr-2" />
            Adicionar ao Calendário
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
