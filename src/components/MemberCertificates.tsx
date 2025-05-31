import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Eye, Sun, Moon, X, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CertificateGenerator = () => {
  const { user } = useAuth();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  // Busca apenas eventos FINALIZADOS onde o usuário se inscreveu E tem presença marcada
  const { data: registrations, isLoading } = useQuery({
    queryKey: ['user-certificates-finished-attended'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events!inner (
            id,
            title,
            description,
            date_time,
            location,
            type,
            max_participants,
            current_participants,
            status,
            organizer_id,
            image_url,
            stream_url,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .eq('events.status', 'finalizado') // Apenas eventos finalizados
        .eq('attended', true) // Apenas com presença marcada
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Query separada para contar eventos finalizados sem presença marcada
  const { data: eventsWithoutAttendance, isLoading: loadingWithoutAttendance } = useQuery({
    queryKey: ['user-events-finished-without-attendance'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events!inner (
            id,
            title,
            date_time,
            location,
            status
          )
        `)
        .eq('user_id', user.id)
        .eq('events.status', 'finalizado')
        .eq('attended', false)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Função para gerar miniatura do certificado
  const generateCertificateMiniature = (event: any, canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas || !user) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 200;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9ff');
    gradient.addColorStop(0.3, '#ffffff');
    gradient.addColorStop(0.7, '#ffffff');
    gradient.addColorStop(1, '#e8e9ff');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Purple shapes (smaller)
    ctx.fillStyle = '#6366f1';
    ctx.globalAlpha = 0.1;

    // Top right triangle
    ctx.beginPath();
    ctx.moveTo(canvas.width - 50, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, 50);
    ctx.fill();

    // Bottom left shape
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 40);
    ctx.lineTo(40, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();

    ctx.globalAlpha = 1;

    // Golden border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    // Mini seal
    const sealX = 40;
    const sealY = 50;
    const sealRadius = 15;

    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();

    // Title
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICADO', canvas.width / 2, 30);

    // Subtitle
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 10px serif';
    ctx.fillText('DE PARTICIPAÇÃO', canvas.width / 2, 45);

    // Event title (truncated)
    ctx.fillStyle = '#34495e';
    ctx.font = '12px serif';
    const eventTitle = event.title.length > 25 ? event.title.substring(0, 25) + '...' : event.title;
    ctx.fillText(`"${eventTitle}"`, canvas.width / 2, 75);

    // User name
    const userName = user?.user_metadata?.full_name || user?.email || 'Participante';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 14px serif';
    const displayName = userName.length > 20 ? userName.substring(0, 20) + '...' : userName;
    ctx.fillText(displayName, canvas.width / 2, 100);

    // Date
    ctx.fillStyle = '#2c3e50';
    ctx.font = '10px serif';
    const eventDate = format(new Date(event.date_time), "dd/MM/yyyy", { locale: ptBR });
    ctx.fillText(eventDate, canvas.width / 2, 120);

    // ORX Valley signature
    ctx.fillStyle = '#666';
    ctx.font = 'bold 8px serif';
    ctx.fillText('ORX Valley', canvas.width / 2, 145);

    // Decorative lines
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 30, 110);
    ctx.lineTo(canvas.width / 2 + 30, 110);
    ctx.stroke();
  };

  const generateCertificate = (event: any, download = false) => {
    const canvas = canvasRef.current;
    if (!canvas || !user) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (isDarkTheme) {
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.3, '#16213e');
      gradient.addColorStop(0.7, '#0f3460');
      gradient.addColorStop(1, '#1a1a2e');
    } else {
      gradient.addColorStop(0, '#f8f9ff');
      gradient.addColorStop(0.3, '#ffffff');
      gradient.addColorStop(0.7, '#ffffff');
      gradient.addColorStop(1, '#e8e9ff');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Purple geometric shapes
    ctx.fillStyle = isDarkTheme ? '#4c1d95' : '#6366f1';
    ctx.globalAlpha = isDarkTheme ? 0.2 : 0.1;

    // Top right triangle
    ctx.beginPath();
    ctx.moveTo(canvas.width - 200, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, 200);
    ctx.fill();

    // Bottom left shapes
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 150);
    ctx.lineTo(150, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();

    ctx.globalAlpha = 1;

    // Golden border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner border
    ctx.strokeStyle = '#f4d03f';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Medal/Seal
    const sealX = 150;
    const sealY = 200;
    const sealRadius = 60;

    // Outer seal
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();

    // Inner seal
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 10, 0, Math.PI * 2);
    ctx.fillStyle = '#f1c40f';
    ctx.fill();

    // Seal center
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 25, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();

    // Ribbon
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(sealX - 15, sealY + 40, 30, 80);
    // Ribbon tail
    ctx.beginPath();
    ctx.moveTo(sealX - 15, sealY + 120);
    ctx.lineTo(sealX, sealY + 140);
    ctx.lineTo(sealX + 15, sealY + 120);
    ctx.fill();

    // Title "CERTIFICADO"
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 64px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICADO', canvas.width / 2, 140);

    // Subtitle
    ctx.fillStyle = isDarkTheme ? '#e5e7eb' : '#2c3e50';
    ctx.font = 'bold 32px serif';
    ctx.fillText('DE PARTICIPAÇÃO', canvas.width / 2, 180);

    // Main text
    ctx.fillStyle = isDarkTheme ? '#d1d5db' : '#34495e';
    ctx.font = '24px serif';
    ctx.fillText('Este certificado é orgulhosamente apresentado a:', canvas.width / 2, 240);

    // User name
    const userName = user?.user_metadata?.full_name || user?.email || 'Participante';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'italic bold 48px serif';
    ctx.fillText(userName, canvas.width / 2, 300);

    // Underline for name
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    const nameWidth = ctx.measureText(userName).width;
    ctx.beginPath();
    ctx.moveTo((canvas.width - nameWidth) / 2, 310);
    ctx.lineTo((canvas.width + nameWidth) / 2, 310);
    ctx.stroke();

    // Event details
    ctx.fillStyle = isDarkTheme ? '#e5e7eb' : '#2c3e50';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';

    const eventDate = format(new Date(event.date_time), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    const line1 = `que participou do evento "${event.title}", realizado no dia`;
    const line2 = `${eventDate}, em ${event.location}.`;
    const line3 = `A atividade foi promovida pelo projeto ORX Valley, do tipo ${event.type}.`;
    const line4 = `Certificado emitido em ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.`;

    ctx.fillText(line1, canvas.width / 2, 360);
    ctx.fillText(line2, canvas.width / 2, 390);

    // Break long line3 into multiple lines if needed
    const maxWidth = canvas.width - 200;
    const words = line3.split(' ');
    let currentLine = '';
    let lineY = 430;

    for (let word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        ctx.fillText(currentLine.trim(), canvas.width / 2, lineY);
        currentLine = word + ' ';
        lineY += 30;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.trim() !== '') {
      ctx.fillText(currentLine.trim(), canvas.width / 2, lineY);
    }
    ctx.fillText(line4, canvas.width / 2, lineY + 50);

    // Signatures
    const sigY = canvas.height - 120;
    ctx.fillStyle = isDarkTheme ? '#d1d5db' : '#2c3e50';
    ctx.font = 'italic 28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('_________________', canvas.width / 2 - 200, sigY);
    ctx.font = 'bold 18px serif';
    ctx.fillText('ORX Valley', canvas.width / 2 - 200, sigY + 25);
    ctx.font = '16px serif';
    ctx.fillText('Organização', canvas.width / 2 - 200, sigY + 45);

    ctx.font = 'italic 28px serif';
    ctx.fillText('_________________', canvas.width / 2 + 200, sigY);
    ctx.font = 'bold 18px serif';
    ctx.fillText('Organizador', canvas.width / 2 + 200, sigY + 25);
    ctx.font = '16px serif';
    ctx.fillText('Responsável', canvas.width / 2 + 200, sigY + 45);

    if (download) {
      const link = document.createElement('a');
      link.download = `certificado-${userName.replace(/\s+/g, '-').toLowerCase()}-${event.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  // Função para lidar com o clique no botão do certificado
  const handleCertificateClick = (event: any) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Gerar certificado quando evento selecionado
  useEffect(() => {
    if (selectedEvent) {
      setTimeout(() => generateCertificate(selectedEvent, false), 100);
    }
  }, [selectedEvent, isDarkTheme]);

  // Gerar miniaturas quando registrations carregam
  useEffect(() => {
    if (registrations && registrations.length > 0) {
      registrations.forEach((registration, index) => {
        const event = registration.events;
        if (event) {
          setTimeout(() => generateCertificateMiniature(event, `mini-canvas-${index}`), 100 + index * 50);
        }
      });
    }
  }, [registrations, user]);

  if (isLoading || loadingWithoutAttendance) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <p>Carregando certificados...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasEventsWithoutAttendance = eventsWithoutAttendance && eventsWithoutAttendance.length > 0;
  const hasEventsWithAttendance = registrations && registrations.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header simplificado */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Meus Certificados</h1>
      </div>

      {/* Alerta otimizado - pode ser dispensado */}
      {hasEventsWithoutAttendance && !dismissedAlert && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-1">
                      {eventsWithoutAttendance.length} evento(s) sem certificado
                    </h3>
                    <p className="text-orange-700 text-sm mb-2">
                      Sua presença ainda não foi confirmada:
                    </p>
                    <div className="space-y-1">
                      {eventsWithoutAttendance.map((reg) => (
                        <div key={reg.id} className="flex items-center gap-2 text-orange-700 text-sm">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                          <span className="font-medium">{reg.events.title}</span>
                          <span className="text-orange-600">•</span>
                          <span className="text-orange-600">{format(new Date(reg.events.date_time), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-orange-700 text-xs mt-2">
                      Entre em contato com os organizadores se necessário.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDismissedAlert(true)}
                    className="text-orange-600 hover:text-orange-800 hover:bg-orange-100 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card de Certificados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certificados Disponíveis
            {hasEventsWithAttendance && (
              <Badge variant="secondary">{registrations.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasEventsWithAttendance ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registrations.map((registration, index) => {
                const event = registration.events;
                if (!event) return null;

                return (
                  <div key={registration.id} className="relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white group">
                    {/* Canvas como fundo */}
                    <canvas
                      id={`mini-canvas-${index}`}
                      width="300"
                      height="200"
                      className="w-full h-32 object-cover"
                    />
                    
                    {/* Overlay com informações */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3">
                      {/* Badge de presença confirmada - canto superior direito */}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Confirmado
                        </Badge>
                      </div>

                      {/* Informações na parte inferior */}
                      <div className="text-white">
                        <h3 className="font-semibold text-sm leading-tight mb-1 drop-shadow-sm">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-xs opacity-90 mb-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(event.date_time), "dd/MM/yyyy", { locale: ptBR })}
                          <span className="mx-2">•</span>
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      {/* Botão - aparece no hover */}
                      <Button 
                        size="sm"
                        className="w-full text-xs py-2 bg-green-600 hover:bg-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => handleCertificateClick(event)}
                      >
                        📄 BAIXAR CERTIFICADO
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum certificado disponível</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {hasEventsWithoutAttendance 
                  ? "Sua presença precisa ser confirmada pelos organizadores."
                  : "Participe de eventos e tenha sua presença marcada para gerar certificados."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal do certificado */}
      {selectedEvent && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 space-y-4">
              {/* Header do modal */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Certificado de Participação
                  </h2>
                  <p className="text-gray-600">{selectedEvent.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4" />
                    <Switch
                      checked={isDarkTheme}
                      onCheckedChange={setIsDarkTheme}
                    />
                    <Moon className="w-4 h-4" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Controles */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => generateCertificate(selectedEvent, false)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Atualizar Visualização
                </Button>
                <Button
                  onClick={() => generateCertificate(selectedEvent, true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Certificado
                </Button>
              </div>

              {/* Certificado */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <canvas
                  ref={canvasRef}
                  className="w-full border border-gray-300 rounded shadow-lg"
                  style={{ aspectRatio: '3/2' }}
                />
              </div>

              {/* Informações do evento */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded">
                <div>
                  <strong>Data de realização:</strong><br />
                  {format(new Date(selectedEvent.date_time), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <div>
                  <strong>Local:</strong><br />
                  {selectedEvent.location}
                </div>
                <div>
                  <strong>Tipo:</strong><br />
                  {selectedEvent.type}
                </div>
                <div>
                  <strong>Participante:</strong><br />
                  {user?.user_metadata?.full_name || user?.email || 'Participante'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;