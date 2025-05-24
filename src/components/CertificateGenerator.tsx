
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Download, Award, Users } from 'lucide-react';

interface CertificateGeneratorProps {
  event: any;
}

const CertificateGenerator = ({ event }: CertificateGeneratorProps) => {
  const { toast } = useToast();
  const [generatingAll, setGeneratingAll] = useState(false);

  const { data: participants, isLoading } = useQuery({
    queryKey: ['event-participants', event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          id,
          registered_at,
          profiles!inner(
            id,
            full_name,
            username,
            email
          )
        `)
        .eq('event_id', event.id);

      if (error) throw error;
      return data;
    }
  });

  const generateCertificate = (participant: any) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Configurar canvas
    canvas.width = 1200;
    canvas.height = 900;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#06b6d4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICADO DE PARTICIPAÇÃO', canvas.width / 2, 200);

    // ORX Valley logo/text
    ctx.font = 'bold 40px Inter, sans-serif';
    ctx.fillText('ORX VALLEY', canvas.width / 2, 280);

    // Main text
    ctx.font = '30px Inter, sans-serif';
    ctx.fillText('Certificamos que', canvas.width / 2, 380);

    // Participant name
    ctx.font = 'bold 50px Inter, sans-serif';
    ctx.fillText(participant.profiles.full_name || participant.profiles.username, canvas.width / 2, 450);

    // Event participation text
    ctx.font = '30px Inter, sans-serif';
    ctx.fillText('participou do evento', canvas.width / 2, 520);

    // Event title
    ctx.font = 'bold 40px Inter, sans-serif';
    ctx.fillText(event.title, canvas.width / 2, 590);

    // Event details
    ctx.font = '25px Inter, sans-serif';
    const eventDate = format(new Date(event.date_time), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    ctx.fillText(`Realizado em ${eventDate}`, canvas.width / 2, 650);
    ctx.fillText(`Local: ${event.location}`, canvas.width / 2, 690);

    // Footer
    ctx.font = '20px Inter, sans-serif';
    const issueDate = format(new Date(), "dd/MM/yyyy", { locale: ptBR });
    ctx.fillText(`Certificado emitido em ${issueDate}`, canvas.width / 2, 800);

    // Download certificate
    const link = document.createElement('a');
    link.download = `certificado-${participant.profiles.username || 'participante'}-${event.title.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const generateAllCertificates = async () => {
    if (!participants) return;
    
    setGeneratingAll(true);
    
    try {
      for (const participant of participants) {
        generateCertificate(participant);
        // Delay entre downloads para evitar problemas no navegador
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: "Certificados gerados!",
        description: `${participants.length} certificados foram baixados com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar certificados",
        description: "Ocorreu um erro durante a geração dos certificados.",
        variant: "destructive",
      });
    } finally {
      setGeneratingAll(false);
    }
  };

  if (isLoading) {
    return <div>Carregando participantes...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Informações do Evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Título:</strong> {event.title}</p>
            <p><strong>Data:</strong> {format(new Date(event.date_time), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            <p><strong>Local:</strong> {event.location}</p>
            <p><strong>Tipo:</strong> <Badge>{event.type}</Badge></p>
            <p><strong>Status:</strong> <Badge>{event.status}</Badge></p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participantes ({participants?.length || 0})
            </CardTitle>
            {participants && participants.length > 0 && (
              <Button
                onClick={generateAllCertificates}
                disabled={generatingAll}
                className="bg-orx-gradient hover:opacity-90"
              >
                <Download className="w-4 h-4 mr-2" />
                {generatingAll ? 'Gerando...' : 'Baixar Todos'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {participants && participants.length > 0 ? (
            <div className="space-y-3">
              {participants.map((participant: any) => (
                <div key={participant.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-semibold">{participant.profiles.full_name || 'Nome não informado'}</p>
                    <p className="text-sm text-muted-foreground">@{participant.profiles.username || 'username-não-informado'}</p>
                    <p className="text-xs text-muted-foreground">
                      Inscrito em {format(new Date(participant.registered_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateCertificate(participant)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Certificado
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum participante inscrito neste evento.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateGenerator;
