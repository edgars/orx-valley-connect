
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

export const useBlogPost = (identifier: string) => {
  return useQuery({
    queryKey: ['blog-post', identifier],
    queryFn: async () => {
      // Try to get by ID first, then by slug
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(full_name, avatar_url),
          tags:blog_post_tags(
            tag:blog_tags(id, name, color)
          )
        `);

      // Check if identifier is a UUID (ID) or slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
      
      if (isUUID) {
        query = query.eq('id', identifier);
      } else {
        query = query.eq('slug', identifier);
      }

      const { data, error } = await query.single();
      if (error) throw error;

      return {
        ...data,
        tags: data.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
      } as BlogPost;
    },
    enabled: !!identifier
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author_id'> & { tags?: { id: string; name: string; color: string; }[] }) => {
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

      // Fix: Extract only the ID from tag objects for database insertion
      if (tags && tags.length > 0) {
        const tagInserts = tags.map(tag => ({
          post_id: data.id,
          tag_id: tag.id // Extract the ID from the tag object
        }));

        const { error: tagsError } = await supabase
          .from('blog_post_tags')
          .insert(tagInserts);

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

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, tags, ...postData }: { id: string; tags?: { id: string; name: string; color: string; }[] } & Partial<BlogPost>) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...postData,
          updated_at: new Date().toISOString(),
          published_at: postData.status === 'published' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update tags if provided
      if (tags !== undefined) {
        // Delete existing tags
        await supabase
          .from('blog_post_tags')
          .delete()
          .eq('post_id', id);

        // Insert new tags
        if (tags.length > 0) {
          const tagInserts = tags.map(tag => ({
            post_id: id,
            tag_id: tag.id
          }));

          const { error: tagsError } = await supabase
            .from('blog_post_tags')
            .insert(tagInserts);

          if (tagsError) throw tagsError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post'] });
      toast({
        title: "Post atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar post",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useBlogPostsByAuthor = (authorId: string) => {
  return useQuery({
    queryKey: ['blog-posts-author', authorId],
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
        .eq('author_id', authorId)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      return data?.map(post => ({
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
      })) as BlogPost[];
    },
    enabled: !!authorId
  });
};
