import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreateEvent } from "@/hooks/useEvents";
import { Calendar, MapPin, Users, Globe, Clock, Mic } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateEventDialog = ({ open, onClose }: CreateEventDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_time: null as Date | null,
    location: "",
    type: "presencial" as "presencial" | "online" | "hibrido",
    max_participants: "",
    image_url: "",
    stream_url: "",
    workload: "",
    speaker: "",
  });

  const createEventMutation = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      ...formData,
      date_time: formData.date_time?.toISOString() || "",
      max_participants: formData.max_participants
        ? parseInt(formData.max_participants)
        : undefined,
      status: "ativo" as const,
    };

    try {
      await createEventMutation.mutateAsync(eventData);
      setFormData({
        title: "",
        description: "",
        date_time: null,
        location: "",
        type: "presencial",
        max_participants: "",
        image_url: "",
        stream_url: "",
        workload: "",
        speaker: "",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao criar evento:", error);
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value as "presencial" | "online" | "hibrido",
      stream_url: value === "presencial" ? "" : prev.stream_url,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Evento *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  placeholder="Nome do evento"
                />
              </div>

              <div>
                <Label htmlFor="date_time">Data e Hora *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <DatePicker
                    selected={formData.date_time}
                    onChange={(date: Date | null) =>
                      setFormData((prev) => ({ ...prev, date_time: date }))
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeCaption="Hora"
                    placeholderText="Selecione data e hora"
                    locale={ptBR}
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-input bg-background text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    wrapperClassName="w-full"
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    required
                    placeholder={
                      formData.type === "online"
                        ? "Plataforma (Zoom, Meet, etc.)"
                        : "Endereço do evento"
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="max_participants">
                  Máximo de Participantes
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        max_participants: e.target.value,
                      }))
                    }
                    placeholder="Deixe vazio para ilimitado"
                    className="pl-10"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="workload">Carga Horária (em horas) *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="workload"
                    type="number"
                    value={formData.workload}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        workload: e.target.value,
                      }))
                    }
                    placeholder="Ex: 4"
                    required
                    className="pl-10"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="speaker">Palestrante *</Label>
                <div className="relative">
                  <Mic className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="speaker"
                    value={formData.speaker}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        speaker: e.target.value,
                      }))
                    }
                    placeholder="Nome do palestrante"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {(formData.type === "online" || formData.type === "hibrido") && (
                <div>
                  <Label htmlFor="stream_url">URL de Transmissão *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="stream_url"
                      type="url"
                      value={formData.stream_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          stream_url: e.target.value,
                        }))
                      }
                      required
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image_url: e.target.value,
                    }))
                  }
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição e Programação *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Use Markdown para formatar o conteúdo. Você pode adicionar
                listas, links, formatação e mais.
              </p>
              <div className="border rounded-md overflow-hidden">
                <MDEditor
                  value={formData.description}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, description: val || "" }))
                  }
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  height={400}
                  data-color-mode="dark"
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
              disabled={createEventMutation.isPending}
              className="flex-1 bg-orx-gradient hover:opacity-90"
            >
              {createEventMutation.isPending ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;