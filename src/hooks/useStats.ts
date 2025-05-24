
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      // Get members count
      const { count: membersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get events count
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Get sponsors count
      const { count: sponsorsCount } = await supabase
        .from('sponsors')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total participations count
      const { count: totalParticipations } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true });

      return {
        members: membersCount || 0,
        events: eventsCount || 0,
        sponsors: sponsorsCount || 0,
        totalParticipations: totalParticipations || 0
      };
    }
  });
};
