import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Download, Eye, Sun, Moon } from 'lucide-react';

const CertificateGeneratorPage = () => {
  const [formData, setFormData] = useState({
    participantName: 'Andressa Lopes',
    eventTitle: 'UX/UI Design para iniciantes',
    eventDate: '25/05/2025',
    duration: '4 horas',
    eventDescription: 'aprofundar conhecimentos em UX/UI Design e promover a troca de experiências sobre práticas de mercado',
    location: 'Oriximiná',
    coordinator: 'Edgar Silva',
    designer: 'Ellen Viana'
  });

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const canvasRef = useRef(null);

  const generateCertificate = (download = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    if (isDarkTheme) {
      // Dark theme background
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.3, '#16213e');
      gradient.addColorStop(0.7, '#0f3460');
      gradient.addColorStop(1, '#1a1a2e');
    } else {
      // Light theme background
      gradient.addColorStop(0, '#f8f9ff');
      gradient.addColorStop(0.3, '#ffffff');
      gradient.addColorStop(0.7, '#ffffff');
      gradient.addColorStop(1, '#e8e9ff');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Purple geometric shapes (background decoration)
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

    // Medal/Seal (left side)
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
    // Ribbon tail (triangle)
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

    // Subtitle "DE CONCLUSÃO"
    ctx.fillStyle = isDarkTheme ? '#e5e7eb' : '#2c3e50';
    ctx.font = 'bold 32px serif';
    ctx.fillText('DE CONCLUSÃO', canvas.width / 2, 180);

    // "Este certificado é orgulhosamente apresentado a:"
    ctx.fillStyle = isDarkTheme ? '#d1d5db' : '#34495e';
    ctx.font = '24px serif';
    ctx.fillText('Este certificado é orgulhosamente apresentado a:', canvas.width / 2, 240);

    // Participant name (stylized)
    ctx.fillStyle = '#d4af37';
    ctx.font = 'italic bold 48px serif';
    ctx.fillText(formData.participantName, canvas.width / 2, 300);

    // Underline for name
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    const nameWidth = ctx.measureText(formData.participantName).width;
    ctx.beginPath();
    ctx.moveTo((canvas.width - nameWidth) / 2, 310);
    ctx.lineTo((canvas.width + nameWidth) / 2, 310);
    ctx.stroke();

    // Event details
    ctx.fillStyle = isDarkTheme ? '#e5e7eb' : '#2c3e50';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    
    const line1 = `que participou do minicurso intitulado "${formData.eventTitle}", realizado no dia`;
    const line2 = `${formData.eventDate}, com carga horária total de ${formData.duration}, o qual foi concluído com sucesso.`;
    const line3 = `A atividade foi promovida pelo projeto ORX Valley, com o objetivo de "${formData.eventDescription}".`;
    const line4 = `${formData.location}, 15 de maio de 2025.`;

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
    
    // Left signature (Coordinator)
    ctx.fillStyle = isDarkTheme ? '#d1d5db' : '#2c3e50';
    ctx.font = 'italic 28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('_________________', canvas.width / 2 - 200, sigY);
    ctx.font = 'bold 18px serif';
    ctx.fillText(formData.coordinator, canvas.width / 2 - 200, sigY + 25);
    ctx.font = '16px serif';
    ctx.fillText('Coordenador', canvas.width / 2 - 200, sigY + 45);

    // Right signature (Designer)
    ctx.font = 'italic 28px serif';
    ctx.fillText('_________________', canvas.width / 2 + 200, sigY);
    ctx.font = 'bold 18px serif';
    ctx.fillText(formData.designer, canvas.width / 2 + 200, sigY + 25);
    ctx.font = '16px serif';
    ctx.fillText('UX/UI Designer', canvas.width / 2 + 200, sigY + 45);

    if (download) {
      // Download the certificate
      const link = document.createElement('a');
      link.download = `certificado-${formData.participantName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Certificados - ORX Valley</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="participantName">Nome do Participante</Label>
                <Input
                  id="participantName"
                  value={formData.participantName}
                  onChange={(e) => handleInputChange('participantName', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="eventTitle">Título do Evento</Label>
                <Input
                  id="eventTitle"
                  value={formData.eventTitle}
                  onChange={(e) => handleInputChange('eventTitle', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="eventDate">Data do Evento</Label>
                  <Input
                    id="eventDate"
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="eventDescription">Objetivo do Evento</Label>
                <Textarea
                  id="eventDescription"
                  value={formData.eventDescription}
                  onChange={(e) => handleInputChange('eventDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="coordinator">Coordenador</Label>
                  <Input
                    id="coordinator"
                    value={formData.coordinator}
                    onChange={(e) => handleInputChange('coordinator', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="designer">Designer</Label>
                  <Input
                    id="designer"
                    value={formData.designer}
                    onChange={(e) => handleInputChange('designer', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gray-black">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Claro</span>
                </div>
                <Switch
                  checked={isDarkTheme}
                  onCheckedChange={setIsDarkTheme}
                />
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Escuro</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => generateCertificate(false)} variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar
                </Button>
                <Button onClick={() => generateCertificate(true)}>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Certificado
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border border-gray-300 rounded"
                style={{ aspectRatio: '3/2' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateGeneratorPage;