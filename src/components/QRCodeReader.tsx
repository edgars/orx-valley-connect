// Versão do QRCodeReader com detecção real de QR Code
// npm install jsqr @types/jsqr

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, CameraOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpdateAttendance } from '@/hooks/useEventRegistrations';
import { supabase } from '@/integrations/supabase/client';
import jsQR from 'jsqr';

interface QRCodeReaderProps {
  eventId: string;
  userId: string;
  isRegistered: boolean;
  onAttendanceMarked?: () => void;
}

const QRCodeReader: React.FC<QRCodeReaderProps> = ({ 
  eventId, 
  userId, 
  isRegistered,
  onAttendanceMarked 
}) => {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error' | 'invalid'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const updateAttendanceMutation = useUpdateAttendance();

  // Cleanup function
  const cleanup = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
    setIsProcessing(false);
  };

  // Request camera permission and start video
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      toast({
        title: "Erro na câmera",
        description: "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Start QR code scanning with real detection
  const startScanning = () => {
    if (!canvasRef.current || !videoRef.current) return;

    setIsScanning(true);
    setScanStatus('idle');
    
    scanIntervalRef.current = setInterval(() => {
      if (isProcessing) return; // Evita múltiplos processamentos simultâneos
      
      try {
        const canvas = canvasRef.current!;
        const video = videoRef.current!;
        const context = canvas.getContext('2d')!;
        
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          // Usar jsQR para detectar QR Code
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          
          if (code) {
            handleQRCodeDetected(code.data);
          }
        }
      } catch (error) {
        console.error('Error during scanning:', error);
      }
    }, 250); // Scan every 250ms
  };

  // Handle QR code detection
  const handleQRCodeDetected = async (qrData: string) => {
    if (isProcessing) return; // Evita processamento duplicado
    
    setIsProcessing(true);
    cleanup();
    
    console.log('QR Code detected:', qrData);
    
    // Check if QR code matches expected format: EVENT_ATTENDANCE:eventId
    const expectedPrefix = `EVENT_ATTENDANCE:${eventId}`;
    if (!qrData.startsWith(expectedPrefix)) {
      setScanStatus('invalid');
      toast({
        title: "QR Code inválido",
        description: "Este QR Code não pertence a este evento.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    try {
      // Get user's registration for this event
      const { data: registration, error: regError } = await supabase
        .from('event_registrations')
        .select('id, attended')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (regError || !registration) {
        setScanStatus('error');
        toast({
          title: "Erro",
          description: "Você não está inscrito neste evento.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Check if already attended
      if (registration.attended) {
        setScanStatus('success');
        toast({
          title: "Presença já confirmada!",
          description: "Sua presença já foi marcada anteriormente.",
        });
        setIsProcessing(false);
        return;
      }

      // Mark attendance
      await updateAttendanceMutation.mutateAsync({
        registrationId: registration.id,
        attended: true
      });

      setScanStatus('success');
      toast({
        title: "Presença confirmada!",
        description: "Sua presença foi marcada com sucesso.",
      });

      if (onAttendanceMarked) {
        onAttendanceMarked();
      }

    } catch (error) {
      console.error('Error marking attendance:', error);
      setScanStatus('error');
      toast({
        title: "Erro",
        description: "Não foi possível marcar sua presença. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Open QR reader
  const openReader = async () => {
    setIsReaderOpen(true);
    setScanStatus('idle');
    setIsProcessing(false);
    
    const cameraStarted = await startCamera();
    if (cameraStarted) {
      // Wait a bit for video to be ready, then start scanning
      setTimeout(() => {
        startScanning();
      }, 1000);
    }
  };

  // Close QR reader
  const closeReader = () => {
    cleanup();
    setIsReaderOpen(false);
    setScanStatus('idle');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Manual input fallback
  const handleManualInput = async () => {
    const qrCode = prompt("Digite o código do QR Code:");
    if (qrCode) {
      await handleQRCodeDetected(qrCode);
    }
  };

  // Reset and try again
  const handleTryAgain = () => {
    setScanStatus('idle');
    setIsProcessing(false);
    if (videoRef.current && stream) {
      startScanning();
    } else {
      openReader();
    }
  };

  if (!isRegistered) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Você precisa estar inscrito no evento para marcar presença.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Marcar Presença
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isReaderOpen ? (
          <>
            <p className="text-sm text-muted-foreground">
              Escaneie o QR Code fornecido pelo organizador para marcar sua presença.
            </p>
            <Button onClick={openReader} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Abrir Leitor de QR Code
            </Button>
            <Button 
              onClick={handleManualInput} 
              variant="outline" 
              className="w-full"
            >
              Inserir código manualmente
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            {hasPermission === false ? (
              <div className="text-center space-y-2">
                <CameraOff className="w-8 h-8 mx-auto text-red-500" />
                <p className="text-sm text-red-600">
                  Acesso à câmera negado. Verifique as permissões do navegador.
                </p>
                <Button onClick={handleManualInput} variant="outline">
                  Inserir código manualmente
                </Button>
              </div>
            ) : (
              <>
                {/* Camera view */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover rounded-lg bg-black"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                      {isScanning && !isProcessing && (
                        <div className="animate-pulse text-white text-sm">
                          Escaneando...
                        </div>
                      )}
                      {isProcessing && (
                        <div className="text-white text-sm">
                          Processando...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status indicators */}
                {scanStatus === 'success' && (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Presença marcada com sucesso!</span>
                  </div>
                )}

                {scanStatus === 'error' && (
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span>Erro ao marcar presença</span>
                    </div>
                    <Button onClick={handleTryAgain} size="sm" variant="outline">
                      Tentar novamente
                    </Button>
                  </div>
                )}

                {scanStatus === 'invalid' && (
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-orange-600">
                      <AlertCircle className="w-5 h-5" />
                      <span>QR Code inválido para este evento</span>
                    </div>
                    <Button onClick={handleTryAgain} size="sm" variant="outline">
                      Tentar novamente
                    </Button>
                  </div>
                )}

                {/* Controls */}
                <div className="flex gap-2">
                  <Button onClick={closeReader} variant="outline" className="flex-1">
                    Fechar
                  </Button>
                  <Button onClick={handleManualInput} variant="outline" className="flex-1">
                    Inserir manualmente
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeReader;