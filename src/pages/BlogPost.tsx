import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBlogPost, useBlogPostsByAuthor } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug!);
  const { data: authorPosts } = useBlogPostsByAuthor(post?.author_id || '');

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
            <Link to="/blog">
              <Button className="bg-blue-600 hover:bg-blue-700">Voltar ao Blog</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const estimatedReadTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>

          <article className="animate-fade-in">
            {post.featured_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-6 animate-scale-in">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Tags Section with Animation */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge
                      key={tag.id}
                      style={{ 
                        backgroundColor: tag.color + '20', 
                        color: tag.color, 
                        borderColor: tag.color + '60',
                        animationDelay: `${index * 100}ms`,
                        boxShadow: `0 0 10px ${tag.color}20`
                      }}
                      className="border-2 px-3 py-1 hover:scale-110 transition-all duration-300 cursor-pointer animate-fade-in hover:shadow-lg"
                    >
                      <div
                        className="w-2 h-2 rounded-full mr-2 animate-pulse"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4 text-white animate-fade-in" style={{ animationDelay: '200ms' }}>
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-400 mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.published_at && format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {estimatedReadTime} min de leitura
              </div>
            </div>

            {post.excerpt && (
              <div className="text-xl text-gray-300 mb-8 font-medium leading-relaxed animate-fade-in" style={{ animationDelay: '400ms' }}>
                {post.excerpt}
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-12 text-gray-300 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-white">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2 text-white">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-300">{children}</p>,
                  a: ({ children, href }) => <a href={href} className="text-blue-400 hover:text-blue-300 transition-colors">{children}</a>,
                  code: ({ children }) => <code className="bg-gray-800 px-1 py-0.5 rounded text-sm text-gray-300">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 text-gray-300">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-400">{children}</blockquote>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Author Info Block */}
            <Card className="mb-8 bg-gray-800 border-gray-700 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 hover:scale-110 transition-transform duration-300">
                    <AvatarImage src={post.author?.avatar_url} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {post.author?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-white">Sobre o autor</h3>
                    <p className="text-gray-300 mb-3">
                      <strong>{post.author?.full_name}</strong>
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      {authorPosts?.length || 0} {(authorPosts?.length || 0) === 1 ? 'post publicado' : 'posts publicados'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* More Posts by Author */}
            {authorPosts && authorPosts.length > 1 && (
              <div className="animate-fade-in" style={{ animationDelay: '700ms' }}>
                <h3 className="text-2xl font-bold mb-6 text-white">Mais posts de {post.author?.full_name}</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {authorPosts
                    .filter(p => p.id !== post.id)
                    .slice(0, 4)
                    .map((relatedPost, index) => (
                      <Card 
                        key={relatedPost.id} 
                        className="hover:shadow-xl transition-all duration-300 bg-gray-800 border-gray-700 hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${800 + index * 100}ms` }}
                      >
                        {relatedPost.featured_image_url && (
                          <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img
                              src={relatedPost.featured_image_url}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          {relatedPost.tags && relatedPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {relatedPost.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag.id}
                                  style={{ 
                                    backgroundColor: tag.color + '20', 
                                    color: tag.color, 
                                    borderColor: tag.color 
                                  }}
                                  className="border text-xs px-2 py-0.5"
                                >
                                  {tag.name}
                                </Badge>
                              ))}
                              {relatedPost.tags.length > 2 && (
                                <span className="text-xs text-gray-400">+{relatedPost.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                          <h4 className="font-semibold mb-2 line-clamp-2 text-white">
                            <Link
                              to={`/blog/${relatedPost.slug}`}
                              className="hover:text-blue-400 transition-colors"
                            >
                              {relatedPost.title}
                            </Link>
                          </h4>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {relatedPost.published_at && format(new Date(relatedPost.published_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
