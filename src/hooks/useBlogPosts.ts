
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featured_image_url?: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
}

export const useBlogPosts = (status?: string) => {
  return useQuery({
    queryKey: ['blog-posts', status],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(full_name, avatar_url),
          tags:blog_post_tags(
            tag:blog_tags(id, name, color)
          )
        `)
        .order('published_at', { ascending: false, nullsFirst: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data?.map(post => ({
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
      })) as BlogPost[];
    }
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(full_name, avatar_url),
          tags:blog_post_tags(
            tag:blog_tags(id, name, color)
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return {
        ...data,
        tags: data.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
      } as BlogPost;
    },
    enabled: !!slug
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author_id'> & { tags?: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { tags, ...post } = postData;

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...post,
          author_id: user.id,
          published_at: post.status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      // Corrigindo a inserção de tags - passando apenas os IDs das tags
      if (tags && tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('blog_post_tags')
          .insert(
            tags.map(tagId => ({
              post_id: data.id,
              tag_id: tagId // Agora passando apenas o ID da tag como string
            }))
          );

        if (tagsError) throw tagsError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Post criado com sucesso!",
        description: "O post foi adicionado ao blog.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar post",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
