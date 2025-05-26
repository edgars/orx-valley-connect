
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  role: 'usuario' | 'administrador';
  status?: 'active' | 'blocked';
  bio?: string;
  location?: string;
  phone?: string;
  company?: string;
  position?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    }
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'usuario' | 'administrador' }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar role:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast({
        title: "Perfil atualizado!",
        description: `O usuário agora é ${data.role === 'administrador' ? 'administrador' : 'usuário'}.`,
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

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'blocked' }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast({
        title: "Status atualizado!",
        description: `O usuário está agora ${data.status === 'active' ? 'ativo' : 'bloqueado'}.`,
      });
    },
    onError: (error: any) => {
      console.error('Erro na mutação de status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  });
};

export const useIsAdmin = () => {
  const { data: user } = useCurrentUser();
  return user?.role === 'administrador';
};
