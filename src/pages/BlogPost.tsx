
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug!);

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

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
            <Link to="/blog">
              <Button>Voltar ao Blog</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>

          <article>
            {post.featured_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-6">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author?.full_name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.published_at && format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })}
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
