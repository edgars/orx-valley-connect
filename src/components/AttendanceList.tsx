import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  useEventRegistrations,
  useUpdateAttendance,
} from "@/hooks/useEventRegistrations";
import { Event } from "@/hooks/useEvents";
import { UserCheck, Users, AlertCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);

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

  const filteredRegistrations =
    registrations?.filter((registration) => {
      if (!searchTerm) return true;

      const displayName =
        registration.profiles?.full_name ||
        registration.profiles?.username ||
        "Nome não disponível";

      const phone = registration.profiles?.phone || "";

      return (
        displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm)
      );
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
            <Button size="sm" onClick={() => setShowQrCode(!showQrCode)}>
              {showQrCode ? 'Ocultar QRCode' : 'Gerar QRCode'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showQrCode && (
          <div className="mb-6 flex justify-center">
            <QRCode value={`https://seusite.com/presenca?evento=${event.id}`} size={200} />
          </div>
        )}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchTerm && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredCount} de {totalCount} participantes
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filteredRegistrations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {searchTerm
                ? "Nenhum participante encontrado com esse termo de busca."
                : "Nenhum participante inscrito ainda."}
            </p>
          ) : (
            filteredRegistrations.map((registration) => {
              const displayName =
                registration.profiles?.full_name ||
                registration.profiles?.username ||
                "Nome não disponível";

              return (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`attendance-${registration.id}`}
                      checked={registration.attended || false}
                      onCheckedChange={(checked) =>
                        handleAttendanceChange(
                          registration.id,
                          checked as boolean
                        )
                      }
                      disabled={updatingIds.has(registration.id)}
                    />
                    <div>
                      <p className="font-medium">{displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        Inscrito em: {new Date(
                          registration.registered_at || ""
                        ).toLocaleDateString("pt-BR")}
                      </p>
                      {registration.profiles?.phone && (
                        <p className="text-sm text-muted-foreground">
                          Tel: {registration.profiles.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {registration.attended && (
                    <Badge className="bg-green-500">Presente</Badge>
                  )}
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
