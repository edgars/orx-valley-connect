
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'presencial' | 'online';
  spotsLeft?: number;
  image?: string;
}

const EventCard = ({ title, description, date, location, type, spotsLeft, image }: EventCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-video w-full bg-gradient-to-br from-orx-primary/20 to-orx-accent/20 relative overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CalendarIcon className="w-12 h-12 text-orx-primary/50" />
          </div>
        )}
        <Badge 
          className={`absolute top-3 right-3 ${
            type === 'presencial' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {type === 'presencial' ? 'Presencial' : 'Online'}
        </Badge>
      </div>
      
      <CardHeader>
        <h3 className="font-semibold text-lg group-hover:text-orx-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-orx-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 flex items-center justify-center">📍</span>
            <span>{location}</span>
          </div>
          {spotsLeft && (
            <p className="text-orx-accent font-medium">
              {spotsLeft} vagas restantes
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full bg-orx-gradient hover:opacity-90 text-white">
          Inscrever-se
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
