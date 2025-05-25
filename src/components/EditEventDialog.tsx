
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateEvent, Event } from '@/hooks/useEvents';
import MDEditor from '@uiw/react-md-editor';

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event;
}

const EditEventDialog = ({ open, onClose, event }: EditEventDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'presencial' | 'online' | 'hibrido'>('presencial');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [status, setStatus] = useState<'ativo' | 'cancelado' | 'finalizado'>('ativo');

  const updateEventMutation = useUpdateEvent();

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDateTime(new Date(event.date_time).toISOString().slice(0, 16));
      setLocation(event.location);
      setType(event.type);
      setMaxParticipants(event.max_participants?.toString() || '');
      setImageUrl(event.image_url || '');
      setStreamUrl(event.stream_url || '');
      setStatus(event.status);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateEventMutation.mutateAsync({
        id: event.id,
        title,
        description,
        date_time: new Date(dateTime).toISOString(),
        location,
        type,
        max_participants: maxParticipants ? parseInt(maxParticipants) : undefined,
        image_url: imageUrl || undefined,
        stream_url: streamUrl || undefined,
        status
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(value: 'presencial' | 'online' | 'hibrido') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateTime">Data e Hora</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="Deixe em branco para ilimitado"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'ativo' | 'cancelado' | 'finalizado') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          {(type === 'online' || type === 'hibrido') && (
            <div>
              <Label htmlFor="streamUrl">URL da Transmissão</Label>
              <Input
                id="streamUrl"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">Descrição</Label>
            <MDEditor
              value={description}
              onChange={(val) => setDescription(val || '')}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              height={300}
              data-color-mode="light"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updateEventMutation.isPending}
              className="bg-orx-gradient hover:opacity-90"
            >
              {updateEventMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
