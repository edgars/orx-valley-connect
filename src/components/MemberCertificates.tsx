
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserEventRegistrations } from '@/hooks/useEventRegistrations';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MemberCertificates = () => {
  const { data: registrations, isLoading } = useUserEventRegistrations();
  const { user } = useAuth();

  // Filtrar apenas eventos onde o usuário esteve presente
  const attendedEvents = registrations?.filter(reg => 
    reg.attended && reg.events?.status === 'finalizado'
  ) || [];

  const generateCertificate = (eventTitle: string, eventDate: string, userName: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICADO DE PARTICIPAÇÃO', canvas.width / 2, 100);

    // Event info
    ctx.font = '24px Arial';
    ctx.fillText('Certificamos que', canvas.width / 2, 180);

    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#6366f1';
    ctx.fillText(userName, canvas.width / 2, 230);

    ctx.fillStyle = '#1f2937';
    ctx.font = '24px Arial';
    ctx.fillText('participou do evento', canvas.width / 2, 280);

    ctx.font = 'bold 28px Arial';
    ctx.fillText(eventTitle, canvas.width / 2, 330);

    ctx.font = '20px Arial';
    ctx.fillText(`realizado em ${format(new Date(eventDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, canvas.width / 2, 380);

    // Organization
    ctx.font = '18px Arial';
    ctx.fillText('ORX Valley Community', canvas.width / 2, 480);

    // Download
    const link = document.createElement('a');
    link.download = `certificado-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Meus Certificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando certificados...</p>
        </CardContent>
      </Card>
    );
  }

  if (attendedEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Meus Certificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Você ainda não possui certificados disponíveis. Participe de eventos e sua presença seja confirmada para gerar certificados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Meus Certificados ({attendedEvents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attendedEvents.map((registration) => {
            const event = registration.events;
            if (!event) return null;

            return (
              <div key={registration.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.date_time), "dd 'de' MMMM, yyyy - HH:mm", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <Badge className="bg-green-500 mb-3">
                      Presença Confirmada
                    </Badge>
                  </div>

                  <Button
                    onClick={() => generateCertificate(
                      event.title, 
                      event.date_time, 
                      user?.email || 'Participante'
                    )}
                    className="ml-4"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Certificado
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCertificates;
