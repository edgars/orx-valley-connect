import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useUsers';
import Header from '@/components/Header';
import CreateEventDialog from '@/components/CreateEventDialog';
import EditEventDialog from '@/components/EditEventDialog';
import AttendanceList from '@/components/AttendanceList';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, Users, Plus, Award, Edit, UserCheck } from 'lucide-react';

const EventManagement = () => {
  const isAdmin = useIsAdmin();
  
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
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      case 'presencial': return 'bg-purple-500';
      case 'online': return 'bg-blue-500';
      case 'hibrido': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const renderEventCard = (event: any) => (
    <Card key={event.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={`${getStatusColor(event.status)} text-white`}>
                {event.status}
              </Badge>
              <Badge className={`${getTypeColor(event.type)} text-white`}>
                {event.type}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setSelectedEvent(event);
                setShowEditDialog(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedEvent(event);
                setShowAttendanceDialog(true);
              }}
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Presença
            </Button>
            
            
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(event.date_time), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>
              {event.current_participants}
              {event.max_participants && `/${event.max_participants}`} participantes
            </span>
          </div>
        </div>

        {event.image_url && (
          <div className="mt-4">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderEventSection = (title: string, events: any[], emptyMessage: string) => {
    if (events.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          {title}
          <Badge variant="secondary">{events.length}</Badge>
        </h2>
        <div className="grid gap-6">
          {events.map(renderEventCard)}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-gradient">Gestão de Eventos</h1>
          <p>Carregando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">Gestão de Eventos</h1>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-orx-gradient hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Evento
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        {statusFilter === 'all' && !searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{activeEvents.length}</div>
                  <p className="text-sm text-muted-foreground">Eventos Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{finishedEvents.length}</div>
                  <p className="text-sm text-muted-foreground">Eventos Finalizados</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{cancelledEvents.length}</div>
                  <p className="text-sm text-muted-foreground">Eventos Cancelados</p>
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
            <div className="grid gap-6">
              {filteredEvents.map(renderEventCard)}
            </div>
          )
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nenhum evento encontrado com os filtros aplicados.' 
                  : 'Nenhum evento criado ainda.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-4 bg-orx-gradient hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

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
            }}
            event={selectedEvent}
          />

          <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Lista de Presença - {selectedEvent.title}</DialogTitle>
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