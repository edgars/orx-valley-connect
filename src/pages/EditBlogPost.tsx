import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useBlogPost, useUpdateBlogPost } from '@/hooks/useBlogPosts';
import { useAuth } from '@/contexts/AuthContext';
import { Save } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  excerpt: z.string().min(1, 'Resumo é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  featured_image_url: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
});

type FormData = z.infer<typeof formSchema>;

const EditBlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: post, isLoading } = useBlogPost(id!);
  const { mutate: updatePost, isPending } = useUpdateBlogPost();
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Array<{ id: string; name: string; color: string }>>([]);

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

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        excerpt: post.excerpt || '',
        slug: post.slug,
        featured_image_url: post.featured_image_url || '',
        status: post.status as 'draft' | 'published' | 'archived',
      });
      setContent(post.content);
      setSelectedTags(post.tags || []);
    }
  }, [post, form]);

  if (!user || profile?.role !== 'administrador') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">Acesso Negado</h1>
            <p className="text-gray-300">Você não tem permissão para editar posts.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Carregando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">Post não encontrado</h1>
            <Button 
              onClick={() => navigate('/blog/gerenciar')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Voltar ao Gerenciamento
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    updatePost({
      id: id!,
      ...data,
      content,
      tags: selectedTags
    }, {
      onSuccess: () => {
        navigate('/blog/gerenciar');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Editar Post</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/blog/gerenciar')}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
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

                  <FormField
                    control={form.control}
                    name="featured_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">URL da Imagem de Capa</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://exemplo.com/imagem.jpg" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
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
                  type="submit" 
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
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

export default EditBlogPost;
