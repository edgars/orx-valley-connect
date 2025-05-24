
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  tier: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze';
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useSponsors = () => {
  return useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Sponsor[];
    }
  });
};

export const useCreateSponsor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sponsorData: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sponsors')
        .insert(sponsorData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast({
        title: "Apoiador adicionado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar apoiador",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
