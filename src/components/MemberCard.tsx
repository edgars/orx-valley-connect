
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface MemberCardProps {
  name: string;
  bio: string;
  location: string;
  interests: string[];
  avatar?: string;
  github?: string;
  linkedin?: string;
}

const MemberCard = ({ name, bio, location, interests, avatar, github, linkedin }: MemberCardProps) => {
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-orx-gradient text-white text-lg">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="font-semibold text-lg group-hover:text-orx-primary transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-muted-foreground">📍 {location}</p>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-4 line-clamp-3">{bio}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
          {interests.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{interests.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {github && (
            <a 
              href={github} 
              className="text-muted-foreground hover:text-orx-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {linkedin && (
            <a 
              href={linkedin} 
              className="text-muted-foreground hover:text-orx-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
