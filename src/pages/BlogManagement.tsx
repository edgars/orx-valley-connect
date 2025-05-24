
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BlogManagement = () => {
  const { user, profile } = useAuth();
  const { data: posts, isLoading } = useBlogPosts();

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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
          <Link to="/blog/criar">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {posts?.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="mb-2">{post.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status === 'published' ? 'Publicado' : post.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                      </Badge>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <div className="text-sm text-gray-500">
                  Criado em {format(new Date(post.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  {post.published_at && ` • Publicado em ${format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })}`}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!posts?.length && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhum post encontrado.</p>
            <Link to="/blog/criar">
              <Button>Criar primeiro post</Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogManagement;
