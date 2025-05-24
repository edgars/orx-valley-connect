
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProfileUpdate {
  full_name?: string;
  username?: string;
  bio?: string;
  location?: string;
  phone?: string;
  company?: string;
  position?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  avatar_url?: string;
}

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const targetId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!targetId) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId || !!supabase.auth.getUser()
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
