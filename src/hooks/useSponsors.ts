
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

export interface SponsorFormData {
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  tier: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze';
  display_order: number;
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

const validateImageDimensions = (url: string): Promise<{ width: number; height: number; isValid: boolean }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isValid = img.width >= 200 && img.height >= 100 && img.width <= 800 && img.height <= 400;
      resolve({ width: img.width, height: img.height, isValid });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0, isValid: false });
    };
    img.src = url;
  });
};

export const useCreateSponsor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sponsorData: SponsorFormData) => {
      // Validate image dimensions
      const { width, height, isValid } = await validateImageDimensions(sponsorData.logo_url);
      
      if (!isValid) {
        throw new Error(`Logo deve ter dimensões entre 200x100 e 800x400 pixels. Dimensões atuais: ${width}x${height}px`);
      }

      const { data, error } = await supabase
        .from('sponsors')
        .insert({
          ...sponsorData,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: "Apoiador adicionado com sucesso!",
        description: "O logo foi validado e o apoiador foi cadastrado.",
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
