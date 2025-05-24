
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useBlogTags } from '@/hooks/useBlogTags';
import { useMembers } from '@/hooks/useMembers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Calendar, Clock, ArrowRight, Filter, X } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const { data: posts, isLoading } = useBlogPosts('published');
  const { data: tags } = useBlogTags();
  const { data: members } = useMembers();

  const authors = members?.filter(member => 
    posts?.some(post => post.author_id === member.id)
  ) || [];

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAuthor = !selectedAuthor || post.author_id === selectedAuthor;
    
    const matchesTag = !selectedTag || post.tags?.some(tag => tag.id === selectedTag);
    
    let matchesDate = true;
    if (selectedDateRange && post.published_at) {
      const postDate = new Date(post.published_at);
      const now = new Date();
      
      switch (selectedDateRange) {
        case 'last-week':
          matchesDate = postDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last-month':
          matchesDate = postDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last-3-months':
          matchesDate = postDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }
    }
    
    return matchesSearch && matchesAuthor && matchesTag && matchesDate;
  }) || [];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAuthor('');
    setSelectedTag('');
    setSelectedDateRange('');
  };

  const hasActiveFilters = searchTerm || selectedAuthor || selectedTag || selectedDateRange;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center text-white">Carregando...</div>
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
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Artigos Recentes</h1>
              <p className="text-xl text-blue-100 mb-8">
                Aqui você encontra todos os artigos e tutoriais publicados no blog. Navegue pelos conteúdos
                sobre desenvolvimento web, programação, design e tecnologias emergentes.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Filters Section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Author Filter */}
              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filtrar por autor" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id} className="text-white hover:bg-gray-700">
                      {author.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filtrar por tag" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {tags?.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id} className="text-white hover:bg-gray-700">
                      <span className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filtrar por data" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="last-week" className="text-white hover:bg-gray-700">Última semana</SelectItem>
                  <SelectItem value="last-month" className="text-white hover:bg-gray-700">Último mês</SelectItem>
                  <SelectItem value="last-3-months" className="text-white hover:bg-gray-700">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar filtros
                </Button>
                <span className="text-gray-400 text-sm">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
                </span>
              </div>
            )}
          </div>

          {/* Featured Post */}
          {featuredPost && !hasActiveFilters && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-white">Post em Destaque</h2>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow bg-gray-800 border-gray-700">
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
                          style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
                          className="border"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 text-white">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {featuredPost.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    {/* Author and Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={featuredPost.author?.avatar_url} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {featuredPost.author?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">
                            {featuredPost.author?.full_name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
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
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
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
            <h2 className="text-2xl font-bold mb-8 text-white">
              {hasActiveFilters ? 'Resultados da Pesquisa' : 'Todos os Artigos'}
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(hasActiveFilters ? filteredPosts : recentPosts).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow bg-gray-800 border-gray-700 group">
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
                          style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
                          className="text-xs border"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold leading-tight text-white">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-blue-400 transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author?.avatar_url} />
                        <AvatarFallback className="text-xs bg-gray-700 text-white">
                          {post.author?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {post.author?.full_name}
                        </p>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
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
              <p className="text-gray-400 text-lg">
                {hasActiveFilters ? 'Nenhum artigo encontrado com os filtros selecionados.' : 'Nenhum artigo publicado ainda.'}
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
