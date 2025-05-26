
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEventRegistrations, useUpdateAttendance } from '@/hooks/useEventRegistrations';
import { Event } from '@/hooks/useEvents';
import { UserCheck, Users, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AttendanceTableProps {
  event: Event;
}

const AttendanceTable = ({ event }: AttendanceTableProps) => {
  const { data: registrations, isLoading } = useEventRegistrations(event.id);
  const updateAttendanceMutation = useUpdateAttendance();
  const { toast } = useToast();
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const handleAttendanceChange = async (registrationId: string, attended: boolean) => {
    setUpdatingIds(prev => new Set(prev).add(registrationId));
    
    try {
      await updateAttendanceMutation.mutateAsync({
        registrationId,
        attended
      });
      
      toast({
        title: attended ? "Presença marcada" : "Presença desmarcada",
        description: "Lista de presença atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a presença.",
        variant: "destructive",
      });
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const generateCertificate = (participantName: string, eventTitle: string, eventDate: string) => {
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
    ctx.fillText(participantName, canvas.width / 2, 230);

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
            <UserCheck className="w-5 h-5" />
            Lista de Presença
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando participantes...</p>
        </CardContent>
      </Card>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Lista de Presença
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhum participante inscrito ainda.</p>
        </CardContent>
      </Card>
    );
  }

  const attendedCount = registrations.filter(reg => reg.attended).length;
  const totalCount = registrations.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Lista de Presença - {event.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {attendedCount}/{totalCount} presentes
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Presente</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Inscrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    <Checkbox
                      checked={registration.attended || false}
                      onCheckedChange={(checked) => 
                        handleAttendanceChange(registration.id, checked as boolean)
                      }
                      disabled={updatingIds.has(registration.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {registration.profiles?.full_name || 'Nome não disponível'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(registration.registered_at || ''), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {registration.attended ? (
                      <Badge className="bg-green-500">Presente</Badge>
                    ) : (
                      <Badge variant="outline">Ausente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {registration.attended && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateCertificate(
                          registration.profiles?.full_name || 'Participante',
                          event.title,
                          event.date_time
                        )}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Certificado
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
