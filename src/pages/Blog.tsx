
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: posts, isLoading } = useBlogPosts('published');

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">Carregando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  const estimateReadTime = (content: string) => {
    return Math.ceil(content.split(' ').length / 200);
  };

  const featuredPost = filteredPosts[0];
  const recentPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Artigos Recentes</h1>
              <p className="text-xl text-blue-100 mb-8">
                Aqui você encontra todos os artigos e tutoriais publicados no blog. Navegue pelos conteúdos
                sobre desenvolvimento web, programação, design e tecnologias emergentes.
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Featured Post */}
          {featuredPost && !searchTerm && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">Post em Destaque</h2>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow bg-white">
                <div className="md:flex">
                  {featuredPost.featured_image_url && (
                    <div className="md:w-1/2">
                      <img
                        src={featuredPost.featured_image_url}
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`${featuredPost.featured_image_url ? 'md:w-1/2' : 'w-full'} p-8`}>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredPost.tags?.map((tag) => (
                        <Badge
                          key={tag.id}
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {featuredPost.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    {/* Author and Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={featuredPost.author?.avatar_url} />
                          <AvatarFallback>
                            {featuredPost.author?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {featuredPost.author?.full_name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {featuredPost.published_at && format(new Date(featuredPost.published_at), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {estimateReadTime(featuredPost.content)} min
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ler mais
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* Posts Grid */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-gray-900">
              {searchTerm ? 'Resultados da Pesquisa' : 'Todos os Artigos'}
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(searchTerm ? filteredPosts : recentPosts).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow bg-white group">
                  {post.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags?.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold leading-tight">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {post.author?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.author?.full_name}
                        </p>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.published_at && format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {estimateReadTime(post.content)} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'Nenhum artigo encontrado.' : 'Nenhum artigo publicado ainda.'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
