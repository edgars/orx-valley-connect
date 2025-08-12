import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Eye, Sun, Moon, X, Calendar, MapPin, CheckCircle, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CertificateGenerator = () => {
  const { user } = useAuth();
  const [isDarkTheme, setIsDarkTheme] = useState(true);
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
            speaker,
            workload,
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
            status,
            speaker,
            workload
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
    canvas.height = 180;

    // Background gradient - tema escuro
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.3, '#16213e');
    gradient.addColorStop(0.7, '#0f3460');
    gradient.addColorStop(1, '#1a1a2e');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    ctx.fillStyle = '#e5e7eb';
    ctx.font = 'bold 10px serif';
    ctx.fillText('DE PARTICIPAÇÃO', canvas.width / 2, 45);

    // User name
    const userName = user?.user_metadata?.full_name || user?.email || 'Participante';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'italic bold 14px serif';
    const displayName = userName.length > 25 ? userName.substring(0, 25) + '...' : userName;
    ctx.fillText(displayName, canvas.width / 2, 75);

    // Event title (smaller and lower)
    ctx.fillStyle = '#d1d5db';
    ctx.font = '10px serif';
    const eventTitle = event.title.length > 30 ? event.title.substring(0, 30) + '...' : event.title;
    ctx.fillText(`"${eventTitle}"`, canvas.width / 2, 100);

    // Date
    ctx.fillStyle = '#9ca3af';
    ctx.font = '9px serif';
    const eventDate = format(new Date(event.date_time), "dd/MM/yyyy", { locale: ptBR });
    ctx.fillText(eventDate, canvas.width / 2, 120);

    // ORX Valley signature
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 8px serif';
    ctx.fillText('ORX Valley', canvas.width / 2, 140);

    // Decorative lines
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 30, 85);
    ctx.lineTo(canvas.width / 2 + 30, 85);
    ctx.stroke();
  };

  // Função auxiliar para gerar certificado em qualquer canvas
  const generateCertificateOnCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, event: any, download = false) => {
    if (!user) return;

    canvas.width = 1200;
    canvas.height = 800;

    // Função para desenhar o certificado após carregar a assinatura
    const drawCertificate = (signatureImg?: HTMLImageElement) => {

    // Background gradient - estilo das imagens de referência
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (isDarkTheme) {
      gradient.addColorStop(0, '#1a1f3a');
      gradient.addColorStop(0.5, '#2d3561');
      gradient.addColorStop(1, '#1a1f3a');
    } else {
      gradient.addColorStop(0, '#f5f5f5');
      gradient.addColorStop(0.5, '#ffffff');
      gradient.addColorStop(1, '#f5f5f5');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Elementos decorativos geométricos roxos no canto superior direito
    ctx.save();
    ctx.fillStyle = isDarkTheme ? '#4a5187' : '#6366f1';
    ctx.globalAlpha = 0.8;

    // Formas geométricas no canto superior direito
    ctx.beginPath();
    ctx.moveTo(canvas.width - 250, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, 180);
    ctx.closePath();
    ctx.fill();

    // Linhas douradas decorativas no canto superior direito
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(canvas.width - 200 + i * 20, 20 + i * 15);
      ctx.lineTo(canvas.width - 50 + i * 20, 120 + i * 15);
      ctx.stroke();
    }

    ctx.restore();

    // Elementos decorativos no canto inferior esquerdo
    ctx.save();
    ctx.fillStyle = isDarkTheme ? '#4a5187' : '#6366f1';
    ctx.globalAlpha = 0.8;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 180);
    ctx.lineTo(250, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Linhas douradas no canto inferior esquerdo
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(20 + i * 20, canvas.height - 150 + i * 15);
      ctx.lineTo(170 + i * 20, canvas.height - 20 + i * 15);
      ctx.stroke();
    }

    ctx.restore();

    // Bordas douradas elegantes - estilo das imagens
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

    // Borda interna mais fina
    ctx.strokeStyle = '#f4d03f';
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

    // Fita/Medalha no estilo das imagens de referência - posicionada mais à esquerda
    const ribbonX = 150; // Movido para a esquerda
    const ribbonY = 0;
    const ribbonWidth = 80;
    const ribbonHeight = 250; 

    // Fita vertical central
    const ribbonGradient = ctx.createLinearGradient(ribbonX - ribbonWidth/2, ribbonY, ribbonX + ribbonWidth/2, ribbonY);
    ribbonGradient.addColorStop(0, '#b8860b');
    ribbonGradient.addColorStop(0.5, '#d4af37');
    ribbonGradient.addColorStop(1, '#b8860b');

    ctx.fillStyle = ribbonGradient;
    ctx.fillRect(ribbonX - ribbonWidth/2, ribbonY, ribbonWidth, ribbonHeight);

    // Medalha circular no estilo das imagens - posicionada mais à esquerda
    const sealX = ribbonX;
    const sealY = 240; // Subido um pouco
    const sealRadius = 80; // Reduzido um pouco

    // Círculo externo da medalha com efeito dentado
    ctx.save();
    ctx.translate(sealX, sealY);
    
    // Efeito dentado
    ctx.beginPath();
    const spikes = 20;
    const outerRadius = sealRadius;
    const innerRadius = sealRadius - 8;
    
    for (let i = 0; i < spikes; i++) {
      const angle = (i * Math.PI * 2) / spikes;
      const nextAngle = ((i + 1) * Math.PI * 2) / spikes;
      const midAngle = (angle + nextAngle) / 2;
      
      const outerX = Math.cos(angle) * outerRadius;
      const outerY = Math.sin(angle) * outerRadius;
      const innerX = Math.cos(midAngle) * innerRadius;
      const innerY = Math.sin(midAngle) * innerRadius;
      
      if (i === 0) ctx.moveTo(outerX, outerY);
      else ctx.lineTo(outerX, outerY);
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();

    // Gradiente dourado para a medalha
    const medalGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius);
    medalGradient.addColorStop(0, '#f4d03f');
    medalGradient.addColorStop(0.6, '#d4af37');
    medalGradient.addColorStop(1, '#b8860b');
    
    ctx.fillStyle = medalGradient;
    ctx.fill();

    // Centro da medalha
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius - 15, 0, Math.PI * 2);
    ctx.fillStyle = '#f4d03f';
    ctx.fill();

    // Círculo interno brilhante
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius - 25, 0, Math.PI * 2);
    const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, innerRadius - 25);
    centerGradient.addColorStop(0, '#ffd700');
    centerGradient.addColorStop(1, '#d4af37');
    ctx.fillStyle = centerGradient;
    ctx.fill();

    ctx.restore();

    // Title "CERTIFICADO" com styling no estilo das imagens - mais próximo do topo
    const titleGradient = ctx.createLinearGradient(0, 200, 0, 240);
    titleGradient.addColorStop(0, '#d4af37');
    titleGradient.addColorStop(1, '#b8860b');
    
    ctx.fillStyle = titleGradient;
    ctx.font = 'bold 72px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICADO', canvas.width / 2, 220);

    // Subtitle "DE PARTICIPAÇÃO"
    ctx.fillStyle = isDarkTheme ? '#e2e8f0' : '#374151';
    ctx.font = 'bold 32px serif';
    ctx.fillText('DE PARTICIPAÇÃO', canvas.width / 2, 260);

    // Linhas decorativas embaixo do subtítulo
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 150, 275);
    ctx.lineTo(canvas.width / 2 + 150, 275);
    ctx.stroke();

    // Main text
    ctx.fillStyle = isDarkTheme ? '#d1d5db' : '#4b5563';
    ctx.font = '24px serif';
    ctx.fillText('Este certificado é orgulhosamente apresentado a:', canvas.width / 2, 320);

    // User name com efeito especial - dourado
    const userName = user?.user_metadata?.full_name || user?.email || 'Participante';
    
    const nameGradient = ctx.createLinearGradient(0, 350, 0, 390);
    nameGradient.addColorStop(0, '#d4af37');
    nameGradient.addColorStop(1, '#b8860b');
    
    ctx.fillStyle = nameGradient;
    ctx.font = 'italic bold 48px serif';
    ctx.fillText(userName, canvas.width / 2, 380);

    // Linha decorativa embaixo do nome
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    const nameWidth = ctx.measureText(userName).width;
    
    ctx.beginPath();
    ctx.moveTo((canvas.width - nameWidth) / 2, 395);
    ctx.lineTo((canvas.width + nameWidth) / 2, 395);
    ctx.stroke();

    // Event details com melhor formatação
    ctx.fillStyle = isDarkTheme ? '#d1d5db' : '#4b5563';
    ctx.font = '22px serif';
    ctx.textAlign = 'center';

    const eventDate = format(new Date(event.date_time), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const workloadText = event.workload ? `${event.workload} horas` : '2 horas';

    // Texto do certificado
    const line1 = `que participou do evento "${event.title}", realizado no dia`;
    const line2 = `${eventDate}, em ${event.location}.`;
    const line3 = `A atividade foi promovida pela Comunidade de Tecnologia ORX Valley, do tipo ${event.type},`;
    const line4 = `com carga horária de ${workloadText}, ministrada pelo Time ORX Valley.`;
    const line5 = `Certificado emitido em ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.`;

    let currentY = 440; // Subido bastante para dar mais espaço
    const lineHeight = 30;
    
    ctx.fillText(line1, canvas.width / 2, currentY);
    currentY += lineHeight;
    ctx.fillText(line2, canvas.width / 2, currentY);
    currentY += lineHeight + 10;

    // Break long lines into multiple lines if needed
    const maxWidth = canvas.width - 200;

    // Line 3
    const words3 = line3.split(' ');
    let currentLine3 = '';
    for (let word of words3) {
      const testLine = currentLine3 + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine3 !== '') {
        ctx.fillText(currentLine3.trim(), canvas.width / 2, currentY);
        currentLine3 = word + ' ';
        currentY += lineHeight;
      } else {
        currentLine3 = testLine;
      }
    }
    if (currentLine3.trim() !== '') {
      ctx.fillText(currentLine3.trim(), canvas.width / 2, currentY);
      currentY += lineHeight;
    }

    // Line 4
    const words4 = line4.split(' ');
    let currentLine4 = '';
    for (let word of words4) {
      const testLine = currentLine4 + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine4 !== '') {
        ctx.fillText(currentLine4.trim(), canvas.width / 2, currentY);
        currentLine4 = word + ' ';
        currentY += lineHeight;
      } else {
        currentLine4 = testLine;
      }
    }
    if (currentLine4.trim() !== '') {
      ctx.fillText(currentLine4.trim(), canvas.width / 2, currentY);
      currentY += lineHeight + 15;
    }

    // Data de emissão
    ctx.font = 'italic 20px serif';
    ctx.fillStyle = isDarkTheme ? '#9ca3af' : '#6b7280';
    ctx.fillText(line5, canvas.width / 2, currentY);

    // Assinatura única centralizada - estilo das imagens de referência
    const sigY = canvas.height - 100; // Subido um pouco mais
    
    // Linha da assinatura com ornamentos - dourado
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 120, sigY);
    ctx.lineTo(canvas.width / 2 + 120, sigY);
    ctx.stroke();
    
    // Se temos uma imagem de assinatura, desenhar ela SOBRE a linha
    if (signatureImg) {
      const sigWidth = 200;
      const sigHeight = (signatureImg.height / signatureImg.width) * sigWidth;
      const sigX = canvas.width / 2 - sigWidth / 2;
      const sigImageY = sigY - sigHeight + 15; // Posiciona sobre a linha
      
      // Desenhar a imagem da assinatura
      if (isDarkTheme) {
        // No modo escuro, aplicar efeito dourado sutil
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(signatureImg, sigX, sigImageY, sigWidth, sigHeight);
        ctx.restore();
        
        ctx.globalAlpha = 0.8;
        ctx.drawImage(signatureImg, sigX, sigImageY, sigWidth, sigHeight);
        ctx.globalAlpha = 1;
      } else {
        // No modo claro, desenhar normalmente
        ctx.drawImage(signatureImg, sigX, sigImageY, sigWidth, sigHeight);
      }
    }
    
    // Nome da organização - TEXTO DOURADO NO MODO ESCURO
    if (isDarkTheme) {
      // Criar gradiente dourado para o texto no modo escuro
      const orgGradient = ctx.createLinearGradient(0, sigY + 20, 0, sigY + 40);
      orgGradient.addColorStop(0, '#fbbf24');
      orgGradient.addColorStop(1, '#f59e0b');
      ctx.fillStyle = orgGradient;
    } else {
      ctx.fillStyle = '#2c3e50';
    }
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.fillText('ORX Valley', canvas.width / 2, sigY + 30);
    
    // Título da organização - TEXTO DOURADO NO MODO ESCURO
    ctx.font = '18px serif';
    if (isDarkTheme) {
      // Usar um tom dourado mais suave para o subtítulo
      ctx.fillStyle = '#d4af37';
    } else {
      ctx.fillStyle = '#6b7280';
    }
    ctx.fillText('Organização', canvas.width / 2, sigY + 50);

      if (download) {
        const link = document.createElement('a');
        link.download = `certificado-${userName.replace(/\s+/g, '-').toLowerCase()}-${event.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    };

    // Carregar a imagem de assinatura
    const signatureImg = new Image();
    signatureImg.onload = () => {
      drawCertificate(signatureImg);
    };
    signatureImg.onerror = () => {
      // Se a imagem não carregar, desenhar sem ela
      console.warn('Não foi possível carregar a assinatura. Usando fallback.');
      drawCertificate();
    };
    signatureImg.src = '/assinatura.svg';
  };

  // Função principal que usa o canvas do modal
  const generateCertificate = (event: any, download = false) => {
    const canvas = canvasRef.current;
    if (!canvas || !user) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    generateCertificateOnCanvas(canvas, ctx, event, download);
  };

  // Função para baixar certificado diretamente
  const handleDownloadCertificate = (event: any) => {
    // Criar um canvas temporário para gerar o certificado
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx || !user) return;

    generateCertificateOnCanvas(tempCanvas, tempCtx, event, true);
  };

  // Função para lidar com o clique no botão do certificado
  const handleCertificateClick = (event: any) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Função para visualizar certificado
  const handleVisualizarClick = (event: any) => {
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
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center">Carregando certificados...</p>
        </div>
      </div>
    );
  }

  const hasEventsWithoutAttendance = eventsWithoutAttendance && eventsWithoutAttendance.length > 0;
  const hasEventsWithAttendance = registrations && registrations.length > 0;

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold text-white mb-2">Certificados Disponíveis</h1>

      <div className="max-w-7xl p-6">
        {/* Alerta de eventos sem certificado */}
        {hasEventsWithoutAttendance && !dismissedAlert && (
          <div className="mb-8 bg-orange-900/20 border border-orange-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-orange-200 mb-1">
                      {eventsWithoutAttendance.length} evento(s) sem certificado
                    </h3>
                    <p className="text-orange-300 text-sm mb-2">
                      Sua presença ainda não foi confirmada:
                    </p>
                    <div className="space-y-1">
                      {eventsWithoutAttendance.map((reg) => (
                        <div key={reg.id} className="flex items-center gap-2 text-orange-300 text-sm">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                          <span className="font-medium">{reg.events.title}</span>
                          <span className="text-orange-400">•</span>
                          <span className="text-orange-400">{format(new Date(reg.events.date_time), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDismissedAlert(true)}
                    className="text-orange-400 hover:text-orange-200 hover:bg-orange-900/30 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de Certificados - Estilo da UX */}
        {hasEventsWithAttendance ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((registration, index) => {
              const event = registration.events;
              if (!event) return null;

              return (
                <div key={registration.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300">
                  {/* Certificado Preview */}
                  <div className="relative h-48 p-4">
                    <canvas
                      id={`mini-canvas-${index}`}
                      width="300"
                      height="180"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  {/* Informações do Evento */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(event.date_time), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        Carga horária: {event.workload ? `${event.workload} horas` : '2 horas'}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Time ORX Valley
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                        onClick={() => handleDownloadCertificate(event)}
                      >
                        Baixar Certificado
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => handleVisualizarClick(event)}
                      >
                        Visualizar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum certificado disponível</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {hasEventsWithoutAttendance 
                ? "Sua presença precisa ser confirmada pelos organizadores."
                : "Participe de eventos e tenha sua presença marcada para gerar certificados."
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal do certificado */}
      {selectedEvent && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 space-y-4">
              {/* Header do modal */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Certificado de Participação
                  </h2>
                  <p className="text-gray-300">{selectedEvent.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-gray-300" />
                    <Switch
                      checked={isDarkTheme}
                      onCheckedChange={setIsDarkTheme}
                    />
                    <Moon className="w-4 h-4 text-gray-300" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
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
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
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
              <div className="bg-gray-800 p-4 rounded-lg">
                <canvas
                  ref={canvasRef}
                  className="w-full border border-gray-600 rounded shadow-lg"
                  style={{ aspectRatio: '3/2' }}
                />
              </div>

              {/* Informações do evento */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-800 p-4 rounded">
                <div>
                  <strong className="text-white">Data de realização:</strong><br />
                  <span className="text-gray-300">{format(new Date(selectedEvent.date_time), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
                <div>
                  <strong className="text-white">Local:</strong><br />
                  <span className="text-gray-300">{selectedEvent.location}</span>
                </div>
                <div>
                  <strong className="text-white">Carga Horária:</strong><br />
                  <span className="text-gray-300">{selectedEvent.workload ? `${selectedEvent.workload} horas` : '2 horas'}</span>
                </div>
                <div>
                  <strong className="text-white">Ministrado por:</strong><br />
                  <span className="text-gray-300">Time ORX Valley</span>
                </div>
                <div>
                  <strong className="text-white">Tipo:</strong><br />
                  <span className="text-gray-300">{selectedEvent.type}</span>
                </div>
                <div>
                  <strong className="text-white">Participante:</strong><br />
                  <span className="text-gray-300">{user?.user_metadata?.full_name || user?.email || 'Participante'}</span>
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