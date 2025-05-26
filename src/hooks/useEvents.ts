
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: string;
  title: string;
  description: string;
  date_time: string;
  location: string;
  type: 'presencial' | 'online' | 'hibrido';
  max_participants?: number;
  current_participants: number;
  status: 'ativo' | 'cancelado' | 'finalizado';
  organizer_id: string;
  image_url?: string;
  stream_url?: string;
  allows_certificates?: boolean;
  created_at: string;
  updated_at: string;
}

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_time', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    }
  });
};

export const useAllEvents = () => {
  return useQuery({
    queryKey: ['all-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_time', { ascending: false });
      
      if (error) throw error;
      return data as Event[];
    }
  });
};

export const useActiveEvents = () => {
  return useQuery({
    queryKey: ['active-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'ativo')
        .order('date_time', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    }
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Event;
    },
    enabled: !!id
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_participants' | 'organizer_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          organizer_id: user.id,
          current_participants: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['all-events'] });
      queryClient.invalidateQueries({ queryKey: ['active-events'] });
      toast({
        title: "Evento criado com sucesso!",
        description: "O evento foi adicionado à lista de eventos.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar evento",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventData: Partial<Event> & { id: string }) => {
      const { id, ...updateData } = eventData;
      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['all-events'] });
      queryClient.invalidateQueries({ queryKey: ['active-events'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
      toast({
        title: "Evento atualizado com sucesso!",
        description: "As informações do evento foram atualizadas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar evento",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          attended: false
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['all-events'] });
      queryClient.invalidateQueries({ queryKey: ['active-events'] });
      toast({
        title: "Inscrição realizada!",
        description: "Você foi inscrito no evento com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na inscrição",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
