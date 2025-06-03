import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MDEditor from '@uiw/react-md-editor';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TagInput from '@/components/TagInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBlogPost } from '@/hooks/useBlogPosts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, Upload, Link, X, Image } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  excerpt: z.string().min(1, 'Resumo é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  featured_image_url: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
});

type FormData = z.infer<typeof formSchema>;

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { mutate: createPost, isPending } = useCreateBlogPost();
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Array<{ id: string; name: string; color: string }>>([]);

  // Estados para upload de imagem
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "upload">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      slug: '',
      featured_image_url: '',
      status: 'draft',
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Função para fazer upload da imagem
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error('Usuário não está autenticado');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { data, error } = await supabase.storage
        .from('orx')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('orx')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return publicUrlData.publicUrl;

    } catch (error: any) {
      throw new Error(`Falha no upload da imagem: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Função para lidar com seleção de arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover arquivo selecionado
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (!user || profile?.role !== 'administrador') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">Acesso Negado</h1>
            <p className="text-gray-300">Você não tem permissão para criar posts.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    let finalImageUrl = data.featured_image_url;

    // Se estiver usando upload e há um arquivo selecionado
    if (imageUploadMethod === "upload" && selectedFile) {
      try {
        finalImageUrl = await uploadImageToSupabase(selectedFile);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao fazer upload da imagem. Tente novamente.",
          variant: "destructive",
        });
        return;
      }
    }

    createPost({
      title: data.title,
      content,
      excerpt: data.excerpt,
      slug: data.slug,
      featured_image_url: finalImageUrl,
      status: data.status,
      tags: selectedTags
    }, {
      onSuccess: () => {
        navigate('/blog/gerenciar');
      }
    });
  };

  const watchTitle = form.watch('title');
  
  // Auto-generate slug when title changes
  if (watchTitle && !form.getValues('slug')) {
    form.setValue('slug', generateSlug(watchTitle));
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Criar Novo Post</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/blog/gerenciar')}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Título</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite o título do post..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (!form.getValues('slug')) {
                                form.setValue('slug', generateSlug(e.target.value));
                              }
                            }}
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Slug (URL)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="slug-do-post" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Resumo</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Breve resumo do post..."
                            rows={3}
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Seção de Imagem de Capa */}
                  <div className="space-y-4">
                    <FormLabel className="text-gray-300">Imagem de Capa</FormLabel>
                    
                    {/* Seletor de método */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={imageUploadMethod === "url" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setImageUploadMethod("url");
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Link className="w-4 h-4" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        variant={imageUploadMethod === "upload" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setImageUploadMethod("upload");
                          form.setValue('featured_image_url', '');
                        }}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                    </div>

                    {/* Campo URL */}
                    {imageUploadMethod === "url" && (
                      <FormField
                        control={form.control}
                        name="featured_image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  placeholder="https://exemplo.com/imagem.jpg"
                                  {...field}
                                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Campo Upload */}
                    {imageUploadMethod === "upload" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Upload className="w-4 h-4" />
                            {selectedFile ? 'Trocar Imagem' : 'Selecionar Imagem'}
                          </Button>
                          
                          {selectedFile && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveFile}
                              className="text-red-400 hover:text-red-300 border-red-600 hover:bg-red-900/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Preview da imagem */}
                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-md border border-gray-600"
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                              {selectedFile?.name}
                            </div>
                          </div>
                        )}

                        {/* Progress do upload */}
                        {isUploading && (
                          <div className="space-y-2">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-400">
                              Fazendo upload... {uploadProgress}%
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-gray-400">
                          Máximo 5MB. Formatos: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="draft" className="text-white hover:bg-gray-700">Rascunho</SelectItem>
                              <SelectItem value="published" className="text-white hover:bg-gray-700">Publicado</SelectItem>
                              <SelectItem value="archived" className="text-white hover:bg-gray-700">Arquivado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Tags</label>
                      <TagInput
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Conteúdo</CardTitle>
                </CardHeader>
                <CardContent>
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    preview="edit"
                    height={500}
                    data-color-mode="dark"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.setValue('status', 'draft');
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={isPending || isUploading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Rascunho
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue('status', 'published');
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={isPending || isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPending
                    ? 'Processando...'
                    : isUploading
                    ? 'Fazendo upload...'
                    : 'Publicar'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateBlogPost;