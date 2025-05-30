import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Eye, Sun, Moon, X, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CertificateGenerator = () => {
  const { user } = useAuth();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Busca apenas eventos ATIVOS onde o usuário se inscreveu
  const { data: registrations, isLoading } = useQuery({
    queryKey: ['user-certificates-active'],
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
        .eq('events.status', 'ativo') // Apenas eventos ativos
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

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

  if (isLoading) {
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

  if (!registrations || registrations.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Meus Certificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Você não possui eventos ativos no momento. Inscreva-se em eventos para gerar certificados de teste.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Cursos concluídos</h1>
      </div>

      {/* Grid de cards dos certificados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {registrations.map((registration) => {
          const event = registration.events;
          if (!event) return null;

          return (
            <Card key={registration.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Ícone do evento */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight mb-1">
                      {event.title}
                    </h3>
                  </div>
                </div>

                {/* Informações do evento */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(event.date_time), "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>

                {/* Botão */}
                <Button 
                  className="w-full text-sm py-2"
                  onClick={() => handleCertificateClick(event)}
                >
                  📄 CERTIFICADO
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

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