import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useUsers';
import Header from '@/components/Header';
import CreateEventDialog from '@/components/CreateEventDialog';
import EditEventDialog from '@/components/EditEventDialog';
import AttendanceList from '@/components/AttendanceList';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, Users, Plus, Edit, UserCheck, Clock, User, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EventManagement = () => {
  const isAdmin = useIsAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Hook para buscar TODOS os eventos (não apenas ativos)
  const { data: allEvents, isLoading } = useQuery({
    queryKey: ['all-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_time', { ascending: false }); // Ordenar por data decrescente
      
      if (error) throw error;
      return data;
    }
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mutation para excluir evento
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      // Primeiro, verificar se há inscrições
      const { data: registrations, error: checkError } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId);

      if (checkError) throw checkError;

      if (registrations && registrations.length > 0) {
        // Se há inscrições, deletar primeiro
        const { error: deleteRegistrationsError } = await supabase
          .from('event_registrations')
          .delete()
          .eq('event_id', eventId);

        if (deleteRegistrationsError) throw deleteRegistrationsError;
      }

      // Deletar o evento
      const { error: deleteEventError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (deleteEventError) throw deleteEventError;
    },
    onSuccess: () => {
      // Invalidar queries para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['all-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      toast({
        title: "Evento excluído!",
        description: "O evento foi excluído com sucesso.",
      });
      
      setShowDeleteDialog(false);
      setSelectedEvent(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredEvents = allEvents?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Separar eventos por status
  const activeEvents = filteredEvents?.filter(event => event.status === 'ativo') || [];
  const finishedEvents = filteredEvents?.filter(event => event.status === 'finalizado') || [];
  const cancelledEvents = filteredEvents?.filter(event => event.status === 'cancelado') || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'cancelado': return 'bg-red-500';
      case 'finalizado': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presencial': return 'bg-orange-500';
      case 'online': return 'bg-blue-500';
      case 'hibrido': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'presencial': return 'Presencial';
      case 'online': return 'Online';
      case 'hibrido': return 'Híbrido';
      default: return type;
    }
  };

  const renderEventCard = (event: any) => (
    <div
      key={event.id}
      className="bg-[#1a1a1a] rounded-xl overflow-hidden text-white relative group hover:scale-105 transition-transform duration-200 cursor-pointer"
      onClick={() => {
        setSelectedEvent(event);
        setShowEditDialog(true);
      }}
    >
      {/* Imagem de fundo */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image_url || "/orxvalley.white.svg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Badges sobrepostos */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Badge de status */}
          <Badge className={`${getStatusColor(event.status)} text-white text-xs font-medium px-2 py-1`}>
            {event.status}
          </Badge>
          
          {/* Badge do tipo */}
          <Badge className={`${getTypeColor(event.type)} text-white text-xs font-medium px-2 py-1`}>
            {getTypeName(event.type)}
          </Badge>
        </div>

        {/* Botões de ação sobrepostos */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-black/70 hover:bg-black/90 text-white"
            onClick={(e) => {
              e.stopPropagation(); // Previne o clique no card
              setSelectedEvent(event);
              setShowAttendanceDialog(true);
            }}
          >
            <UserCheck className="w-3 h-3" />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-red-600/70 hover:bg-red-700/90 text-white"
            onClick={(e) => {
              e.stopPropagation(); // Previne o clique no card
              setSelectedEvent(event);
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 line-clamp-2 leading-tight">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(event.date_time), "dd/MM/yyyy", { locale: ptBR })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(event.date_time), "HH:mm", { locale: ptBR })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {event.current_participants}
              {event.max_participants && `/${event.max_participants}`} participantes
            </span>
          </div>

          {event.workload && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Carga horária: {event.workload} horas</span>
            </div>
          )}
          
          {event.speaker && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="line-clamp-1">Palestrante: {event.speaker}</span>
            </div>
          )}
        </div>

        {/* Indicador visual de que o card é clicável */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderEventSection = (title: string, events: any[], emptyMessage: string) => {
    if (events.length === 0 && statusFilter === 'all' && !searchTerm) return null;

    return (
      <Card className="mb-8 bg-[#0a0a0a] border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="bg-gray-700 text-white">
              {events.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(renderEventCard)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{emptyMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-white mt-16">Gestão de Eventos</h1>
          <p className="text-gray-400">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container py-8">
        <div className="flex justify-between items-center mt-16 mb-6">
          <h1 className="text-3xl font-bold text-white">Gestão de Eventos</h1>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Evento
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6 bg-[#1a1a1a] border-gray-800">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#0a0a0a] border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-gray-700">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">Todos os Status</SelectItem>
                    <SelectItem value="ativo" className="text-white hover:bg-gray-700">Ativo</SelectItem>
                    <SelectItem value="finalizado" className="text-white hover:bg-gray-700">Finalizado</SelectItem>
                    <SelectItem value="cancelado" className="text-white hover:bg-gray-700">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        {statusFilter === 'all' && !searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-green-900/20 border-green-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{activeEvents.length}</div>
                  <p className="text-sm text-green-300">Eventos Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-900/20 border-blue-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{finishedEvents.length}</div>
                  <p className="text-sm text-blue-300">Eventos Finalizados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-900/20 border-red-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{cancelledEvents.length}</div>
                  <p className="text-sm text-red-300">Eventos Cancelados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Eventos Organizados por Status */}
        {filteredEvents && filteredEvents.length > 0 ? (
          statusFilter === 'all' && !searchTerm ? (
            // Exibir por seções quando não há filtros
            <div>
              {renderEventSection("🟢 Eventos Ativos", activeEvents, "Nenhum evento ativo no momento.")}
              {renderEventSection("🔵 Eventos Finalizados", finishedEvents, "Nenhum evento finalizado ainda.")}
              {renderEventSection("🔴 Eventos Cancelados", cancelledEvents, "Nenhum evento cancelado.")}
            </div>
          ) : (
            // Exibir lista única quando há filtros
            <Card className="bg-[#0a0a0a] border-gray-800">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(renderEventCard)}
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 text-lg">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nenhum evento encontrado com os filtros aplicados.' 
                  : 'Nenhum evento criado ainda.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Você tem certeza que deseja excluir o evento "{selectedEvent?.title}"?
              <br />
              <br />
              <span className="text-red-400 font-semibold">
                Esta ação não pode ser desfeita. Todas as inscrições serão permanentemente removidas.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteEventMutation.isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteEvent}
              disabled={deleteEventMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteEventMutation.isPending ? 'Excluindo...' : 'Excluir Evento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateEventDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
      />

      {selectedEvent && (
        <>
          <EditEventDialog
            open={showEditDialog}
            onClose={() => {
              setShowEditDialog(false);
              setSelectedEvent(null);
              document.body.style.overflow = 'auto'; 
            }}
            event={selectedEvent}
          />

          <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Lista de Presença - {selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <AttendanceList event={selectedEvent} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default EventManagement;