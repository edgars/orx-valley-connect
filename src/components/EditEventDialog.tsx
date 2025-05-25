
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUpdateEvent } from '@/hooks/useEvents';
import { Calendar, MapPin, Users, Globe } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { Event } from '@/hooks/useEvents';

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event;
}

const EditEventDialog = ({ open, onClose, event }: EditEventDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date_time: '',
    location: '',
    type: 'presencial' as 'presencial' | 'online' | 'hibrido',
    max_participants: '',
    image_url: '',
    stream_url: ''
  });

  const updateEventMutation = useUpdateEvent();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date_time: event.date_time.slice(0, 16), // Format for datetime-local input
        location: event.location,
        type: event.type,
        max_participants: event.max_participants?.toString() || '',
        image_url: event.image_url || '',
        stream_url: event.stream_url || ''
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
    };

    try {
      await updateEventMutation.mutateAsync({ id: event.id, ...eventData });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value as 'presencial' | 'online' | 'hibrido',
      stream_url: (value === 'presencial') ? '' : prev.stream_url
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Evento *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Nome do evento"
                />
              </div>

              <div>
                <Label htmlFor="date_time">Data e Hora *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date_time"
                    type="datetime-local"
                    value={formData.date_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_time: e.target.value }))}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Tipo de Evento *</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Local *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                    placeholder={formData.type === 'online' ? 'Plataforma (Zoom, Meet, etc.)' : 'Endereço do evento'}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="max_participants">Máximo de Participantes</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                    placeholder="Deixe vazio para ilimitado"
                    className="pl-10"
                    min="1"
                  />
                </div>
              </div>

              {(formData.type === 'online' || formData.type === 'hibrido') && (
                <div>
                  <Label htmlFor="stream_url">URL de Transmissão *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="stream_url"
                      type="url"
                      value={formData.stream_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, stream_url: e.target.value }))}
                      required={formData.type === 'online' || formData.type === 'hibrido'}
                      placeholder="https://zoom.us/j/... ou link da transmissão"
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição e Programação *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Use Markdown para formatar o conteúdo. Você pode adicionar listas, links, formatação e mais.
              </p>
              <div className="border rounded-md overflow-hidden">
                <MDEditor
                  value={formData.description}
                  onChange={(val) => setFormData(prev => ({ ...prev, description: val || '' }))}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  height={400}
                  data-color-mode="light"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateEventMutation.isPending}
              className="flex-1 bg-orx-gradient hover:opacity-90"
            >
              {updateEventMutation.isPending ? 'Atualizando...' : 'Atualizar Evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
