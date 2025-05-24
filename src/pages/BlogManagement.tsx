
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useBlogPosts, useDeleteBlogPost } from '@/hooks/useBlogPosts';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Eye, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BlogManagement = () => {
  const { user, profile } = useAuth();
  const { data: posts, isLoading } = useBlogPosts();
  const { mutate: deletePost } = useDeleteBlogPost();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!user || profile?.role !== 'administrador') {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p>Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDeletePost = (postId: string) => {
    deletePost(postId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Publicado</Badge>;
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'archived':
        return <Badge variant="outline">Arquivado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Blog</h1>
              <p className="text-gray-600 mt-2">Gerencie todos os posts do blog da comunidade</p>
            </div>
            <Link to="/blog/criar">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Post
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mt-6 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {filteredPosts?.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getStatusBadge(post.status)}
                      {post.tags?.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          style={{ borderColor: tag.color, color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="mb-2 text-xl">{post.title}</CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                  
                  {post.featured_image_url && (
                    <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    <p>Criado em {format(new Date(post.created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    {post.published_at && (
                      <p>Publicado em {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {post.status === 'published' && (
                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Link to={`/blog/editar/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o post "{post.title}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePost(post.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!filteredPosts?.length && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Nenhum post encontrado.' : 'Nenhum post criado ainda.'}
            </p>
            {!searchTerm && (
              <Link to="/blog/criar">
                <Button>Criar primeiro post</Button>
              </Link>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogManagement;
