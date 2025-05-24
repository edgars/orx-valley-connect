
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export const useBlogTags = () => {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as BlogTag[];
    }
  });
};

export const useCreateBlogTag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tagData: Omit<BlogTag, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('blog_tags')
        .insert(tagData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
      toast({
        title: "Tag criada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar tag",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
