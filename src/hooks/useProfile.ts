
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
      let targetId = userId;
      
      if (!targetId) {
        const { data: { user } } = await supabase.auth.getUser();
        targetId = user?.id;
      }
      
      if (!targetId) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId || true
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      console.log('Atualizando perfil com:', updates);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw error;
      }
      
      console.log('Perfil atualizado com sucesso:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro na mutação:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  });
};
