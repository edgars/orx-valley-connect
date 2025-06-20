import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEventRegistrations, useUpdateAttendance } from '@/hooks/useEventRegistrations';
import { Event } from '@/hooks/useEvents';
import { UserCheck, Users, AlertCircle, Search, QrCode as QrCodeIcon, Copy, Gift, Trophy, Shuffle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface AttendanceListProps {
  event: Event;
}

const AttendanceList = ({ event }: AttendanceListProps) => {
  const {
    data: registrations,
    isLoading,
    error,
  } = useEventRegistrations(event.id);
  const updateAttendanceMutation = useUpdateAttendance();
  const { toast } = useToast();
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);

  // Estados do sorteio - ADICIONADO
  const [showRaffle, setShowRaffle] = useState(false);
  const [isRaffling, setIsRaffling] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [raffledParticipants, setRaffledParticipants] = useState<Set<string>>(new Set());

  const handleAttendanceChange = async (
    registrationId: string,
    attended: boolean
  ) => {
    setUpdatingIds((prev) => new Set(prev).add(registrationId));

    try {
      await updateAttendanceMutation.mutateAsync({
        registrationId,
        attended,
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
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  // Gerar código QR simples com ID do evento
  const qrCodeData = `EVENT_ATTENDANCE:${event.id}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Código copiado!",
        description: "Código do evento copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código.",
        variant: "destructive",
      });
    }
  };

  // Função para realizar sorteio - ADICIONADO
  const performRaffle = () => {
    const eligibleParticipants = registrations?.filter(reg => 
      !raffledParticipants.has(reg.id)
    ) || [];
    
    if (eligibleParticipants.length === 0) {
      toast({
        title: "Nenhum participante elegível",
        description: "Não há participantes que ainda não foram sorteados.",
        variant: "destructive",
      });
      return;
    }

    setIsRaffling(true);
    setWinner(null);

    // Simular animação de sorteio
    let shuffleCount = 0;
    const maxShuffles = 20;
    
    const shuffleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
      setWinner(eligibleParticipants[randomIndex]);
      shuffleCount++;

      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        
        // Escolher vencedor final
        const finalWinner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
        setWinner(finalWinner);
        setIsRaffling(false);
        
        // Adicionar à lista de já sorteados
        setRaffledParticipants(prev => new Set(prev).add(finalWinner.id));
        
        toast({
          title: "🎉 Temos um vencedor!",
          description: `Parabéns ${finalWinner.profiles?.full_name || finalWinner.profiles?.username}!`,
        });
      }
    }, 100);
  };

  const resetRaffle = () => {
    setWinner(null);
    setRaffledParticipants(new Set());
    toast({
      title: "Sorteio resetado",
      description: "Todos os participantes estão elegíveis novamente.",
    });
  };

  // Filtrar registrations baseado no termo de busca
  const filteredRegistrations = registrations?.filter(registration => {
    if (!searchTerm) return true;
    
    const displayName = registration.profiles?.full_name || 
                       registration.profiles?.username || 
                       'Nome não disponível';
    
    const phone = registration.profiles?.phone || '';
    
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           phone.includes(searchTerm);
  }) || [];

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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Erro ao carregar lista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Erro: {error.message}</p>
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
          <p className="text-muted-foreground">
            Nenhum participante inscrito ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  const attendedCount = registrations.filter((reg) => reg.attended).length;
  const totalCount = registrations.length;
  const filteredCount = filteredRegistrations.length;
  const eligibleForRaffle = registrations.filter(reg => !raffledParticipants.has(reg.id)).length; // ADICIONADO

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Lista de Presença
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {attendedCount}/{totalCount} presentes
            </Badge>
            <Button 
              size="sm" 
              onClick={() => setShowQrCode(!showQrCode)}
              className="flex items-center gap-2"
            >
              <QrCodeIcon className="w-4 h-4" />
              {showQrCode ? 'Ocultar QR Code' : 'Gerar QR Code'}
            </Button>
            {/* Botão do Sorteio - ADICIONADO */}
            <Button 
              size="sm" 
              onClick={() => setShowRaffle(!showRaffle)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Gift className="w-4 h-4" />
              {showRaffle ? 'Ocultar Sorteio' : 'Sorteio'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Seção de Sorteio - ADICIONADO */}
        {showRaffle && (
          <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                <Gift className="w-5 h-5" />
                Sorteio do Evento
                <Sparkles className="w-4 h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Participantes elegíveis: <strong>{eligibleForRaffle}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (Todos os participantes inscritos, exceto os já sorteados)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={performRaffle}
                    disabled={isRaffling || eligibleForRaffle === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isRaffling ? (
                      <>
                        <Shuffle className="w-4 h-4 animate-spin" />
                        Sorteando...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4" />
                        Sortear
                      </>
                    )}
                  </Button>
                  {raffledParticipants.size > 0 && (
                    <Button 
                      onClick={resetRaffle}
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-200"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Resultado do sorteio */}
              {winner && (
                <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="text-6xl">🎉</div>
                      <div className={`text-4xl font-bold ${isRaffling ? 'animate-pulse text-gray-600' : 'animate-bounce text-yellow-800'}`}>
                        {isRaffling ? 'Sorteando...' : (winner.profiles?.full_name || winner.profiles?.username || 'Participante')}
                      </div>
                      {!isRaffling && winner.profiles?.phone && (
                        <p className="text-lg text-gray-600 font-medium">
                          Tel: {winner.profiles.phone}
                        </p>
                      )}
                      {!isRaffling && (
                        <div className="text-6xl animate-bounce">🏆</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lista de já sorteados */}
              {raffledParticipants.size > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2 text-purple-700">
                    Já foram sorteados ({raffledParticipants.size}):
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {registrations?.filter(reg => raffledParticipants.has(reg.id)).map(reg => (
                      <Badge key={reg.id} variant="secondary" className="text-xs">
                        {reg.profiles?.full_name || reg.profiles?.username}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* QR Code para marcar presença */}
        {showQrCode && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCodeIcon className="w-5 h-5" />
                QR Code para Presença
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <QRCode 
                    value={qrCodeData} 
                    size={200}
                    level="M"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Os alunos devem escanear este QR Code usando o leitor na página do evento
                </p>
                
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Input 
                    value={qrCodeData} 
                    readOnly 
                    className="text-xs font-mono"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => copyToClipboard(qrCodeData)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copiar
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Como funciona:</strong></p>
                  <p>• O aluno acessa a página do evento na plataforma</p>
                  <p>• Clica no botão "Marcar Presença"</p>
                  <p>• Escaneia este QR Code com o leitor que aparece</p>
                  <p>• A presença é marcada automaticamente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campo de busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Indicador de resultados filtrados */}
        {searchTerm && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredCount} de {totalCount} participantes
            </p>
          </div>
        )}

        {/* Lista de participantes */}
        <div className="space-y-3">
          {filteredRegistrations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {searchTerm ? 'Nenhum participante encontrado com esse termo de busca.' : 'Nenhum participante inscrito ainda.'}
            </p>
          ) : (
            filteredRegistrations.map((registration) => {
              const displayName = registration.profiles?.full_name || 
                                 registration.profiles?.username || 
                                 'Nome não disponível';
              const wasRaffled = raffledParticipants.has(registration.id); // ADICIONADO
              
              return (
                <div 
                  key={registration.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    wasRaffled ? 'bg-yellow-50 border-yellow-200' : ''
                  }`} // MODIFICADO para destacar sorteados
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`attendance-${registration.id}`}
                      checked={registration.attended || false}
                      onCheckedChange={(checked) => 
                        handleAttendanceChange(registration.id, checked as boolean)
                      }
                      disabled={updatingIds.has(registration.id)}
                    />
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {displayName}
                        {wasRaffled && <Trophy className="w-4 h-4 text-yellow-600" />} {/* ADICIONADO */}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Inscrito em: {new Date(registration.registered_at || '').toLocaleDateString('pt-BR')}
                      </p>
                      {registration.profiles?.phone && (
                        <p className="text-sm text-muted-foreground">
                          Tel: {registration.profiles.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2"> {/* MODIFICADO para comportar múltiplos badges */}
                    {registration.attended && (
                      <Badge className="bg-green-500">
                        Presente
                      </Badge>
                    )}
                    {wasRaffled && ( // ADICIONADO
                      <Badge className="bg-yellow-500">
                        Sorteado
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceList;