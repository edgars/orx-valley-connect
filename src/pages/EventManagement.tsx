
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEvents } from '@/hooks/useEvents';
import { useIsAdmin } from '@/hooks/useUsers';
import Header from '@/components/Header';
import CreateEventDialog from '@/components/CreateEventDialog';
import CertificateGenerator from '@/components/CertificateGenerator';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, Users, Plus, Award, Edit, Trash2 } from 'lucide-react';

const EventManagement = () => {
  const isAdmin = useIsAdmin();
  const { data: events, isLoading } = useEvents();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

        {/* Lista de Eventos */}
        <div className="grid gap-6">
          {filteredEvents && filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
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
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {event.status === 'finalizado' && (
                        <Button
                          size="sm"
                          className="bg-orx-gradient hover:opacity-90"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowCertificateDialog(true);
                          }}
                        >
                          <Award className="w-4 h-4 mr-1" />
                          Certificados
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  
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
            ))
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
      </div>

      <CreateEventDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
      />

      {selectedEvent && (
        <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerar Certificados - {selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <CertificateGenerator event={selectedEvent} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EventManagement;
