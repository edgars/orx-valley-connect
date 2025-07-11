import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserEventRegistrations = () => {
  return useQuery({
    queryKey: ['user-event-registrations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            id,
            title,
            description,
            date_time,
            location,
            type,
            max_participants,
            current_participants,
            status,
            organizer_id,
            image_url,
            stream_url,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};

export const useEventRegistrations = (eventId: string) => {
  return useQuery({
    queryKey: ['event-registrations', eventId],
    queryFn: async () => {
      console.log('Fetching registrations for event:', eventId);
      
      // First get the registrations
      const { data: registrations, error: registrationsError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('registered_at', { ascending: true });

      if (registrationsError) {
        console.error('Error fetching event registrations:', registrationsError);
        throw registrationsError;
      }

      if (!registrations || registrations.length === 0) {
        console.log('No registrations found');
        return [];
      }

      // Then get the profile data for each registration
      const userIds = registrations.map(reg => reg.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, username')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine the data
      const combinedData = registrations.map(registration => {
        const profile = profiles?.find(p => p.id === registration.user_id);
        return {
          ...registration,
          profiles: profile || null
        };
      });

      console.log('Combined registrations data:', combinedData);
      return combinedData;
    },
    enabled: !!eventId
  });
};

export const useCheckEventRegistration = (eventId: string) => {
  return useQuery({
    queryKey: ['event-registration-check', eventId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!eventId
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ registrationId, attended }: { registrationId: string; attended: boolean }) => {
      const { data, error } = await supabase
        .from('event_registrations')
        .update({ attended })
        .eq('id', registrationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['user-event-registrations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar presença",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useEventRegistrationMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const registerForEvent = useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{ event_id: eventId, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-event-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event-registration-check'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
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

  const unregisterFromEvent = useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-event-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event-registration-check'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
      toast({
        title: "Inscrição cancelada!",
        description: "Sua inscrição foi cancelada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cancelar inscrição",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    registerForEvent,
    unregisterFromEvent,
    isLoading: registerForEvent.isPending || unregisterFromEvent.isPending
  };
};
