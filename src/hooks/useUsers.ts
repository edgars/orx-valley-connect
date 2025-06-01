import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  email?: string;
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
        .update({ role })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Perfil atualizado!",
        description: "O perfil do usuário foi atualizado com sucesso.",
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

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'blocked' }) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .limit(1);

      if (error && error.code === '42703') {
        throw new Error('Funcionalidade de status não disponível no momento');
      }

      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      return updateData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast({
        title: "Status atualizado!",
        description: "O status do usuário foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error: registrationsError } = await supabase
        .from('event_registrations')
        .delete()
        .eq('user_id', userId);

      if (registrationsError) {
        console.warn('Erro ao deletar inscrições:', registrationsError);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;


      try {

        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.warn('Erro ao deletar usuário da autenticação:', authError);
        }
      } catch (error) {
        console.warn('Não foi possível deletar da autenticação:', error);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast({
        title: "Usuário excluído!",
        description: "O usuário foi removido do sistema com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro inesperado ao tentar excluir o usuário.",
        variant: "destructive",
      });
    }
  });
};

export const useIsAdmin = () => {
  const { data: user } = useCurrentUser();
  return user?.role === 'administrador';
};