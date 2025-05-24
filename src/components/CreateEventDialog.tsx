
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCreateEvent } from '@/hooks/useEvents';
import { Calendar, MapPin, Users, Globe } from 'lucide-react';

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateEventDialog = ({ open, onClose }: CreateEventDialogProps) => {
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

  const createEventMutation = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
      status: 'ativo' as const
    };

    try {
      await createEventMutation.mutateAsync(eventData);
      setFormData({
        title: '',
        description: '',
        date_time: '',
        location: '',
        type: 'presencial',
        max_participants: '',
        image_url: '',
        stream_url: ''
      });
      onClose();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value as 'presencial' | 'online' | 'hibrido',
      // Limpa a URL de transmissão se não for online ou híbrido
      stream_url: (value === 'presencial') ? '' : prev.stream_url
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título do Evento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Nome do evento"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Descreva o evento..."
                rows={3}
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
              <div className="md:col-span-2">
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

            <div className="md:col-span-2">
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
              disabled={createEventMutation.isPending}
              className="flex-1 bg-orx-gradient hover:opacity-90"
            >
              {createEventMutation.isPending ? 'Criando...' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
