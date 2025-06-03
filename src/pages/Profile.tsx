import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { User, Mail, Phone, Building, MapPin, Github, Linkedin, Globe, Shield, Key, Eye, EyeOff, Upload, Link, X, Image } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    phone: '',
    company: '',
    position: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    avatar_url: ''
  });

  // Estados para upload de avatar
  const [avatarUploadMethod, setAvatarUploadMethod] = useState<"url" | "upload">("url");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Estados para a seção de senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Verifica se o usuário tem conta OAuth
  const isOAuthUser = user?.app_metadata?.providers?.includes('google') || 
                     user?.app_metadata?.providers?.includes('github');
  const hasEmailProvider = user?.app_metadata?.providers?.includes('email');

  // Função para fazer upload do avatar
  const uploadAvatarToSupabase = async (file: File): Promise<string> => {
    setIsUploadingAvatar(true);
    setAvatarUploadProgress(0);

    try {
      // Verificar se usuário está autenticado
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log('Usuário autenticado:', currentUser?.email);
      
      if (!currentUser) {
        throw new Error('Usuário não está autenticado');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${currentUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log('Tentando upload para:', filePath);

      // Upload do arquivo para o bucket 'orx'
      const { data, error } = await supabase.storage
        .from('orx')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro detalhado do upload:', error);
        throw error;
      }

      console.log('Upload realizado com sucesso:', data);

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from('orx')
        .getPublicUrl(filePath);

      setAvatarUploadProgress(100);
      return publicUrlData.publicUrl;

    } catch (error: any) {
      console.error('Erro no upload:', error);
      throw new Error(`Falha no upload do avatar: ${error.message}`);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Função para lidar com seleção de arquivo de avatar
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          variant: "destructive",
        });
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedAvatarFile(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover arquivo de avatar selecionado
  const handleRemoveAvatarFile = () => {
    setSelectedAvatarFile(null);
    setAvatarPreview(null);
    // Limpar input
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        company: profile.company || '',
        position: profile.position || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalAvatarUrl = formData.avatar_url;

    // Se estiver usando upload e há um arquivo selecionado
    if (avatarUploadMethod === "upload" && selectedAvatarFile) {
      try {
        finalAvatarUrl = await uploadAvatarToSupabase(selectedAvatarFile);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao fazer upload do avatar. Tente novamente.",
          variant: "destructive",
        });
        return;
      }
    }

    const updatedFormData = {
      ...formData,
      avatar_url: finalAvatarUrl
    };

    updateProfileMutation.mutate(updatedFormData);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Se o usuário já tem senha (não é só OAuth), precisa verificar a atual primeiro
      if (hasEmailProvider && passwordData.currentPassword) {
        // Verifica a senha atual
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user?.email || '',
          password: passwordData.currentPassword,
        });

        if (signInError) {
          throw new Error('Senha atual incorreta');
        }
      }

      // Atualiza a senha
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: isOAuthUser && !hasEmailProvider ? "Senha definida!" : "Senha atualizada!",
        description: isOAuthUser && !hasEmailProvider 
          ? "Agora você pode fazer login com email e senha também." 
          : "Sua senha foi atualizada com sucesso.",
      });

      // Limpa os campos
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const sendPasswordResetEmail = async () => {
    if (!user?.email) return;

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para definir/redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getUserInitials = () => {
    const name = formData.full_name || user.email?.split('@')[0] || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gradient">Meu Perfil</h1>
          
          <div className="space-y-6">
            {/* Formulário de perfil */}
            <div onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Seção de Avatar */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={avatarPreview || formData.avatar_url} />
                        <AvatarFallback className="bg-orx-gradient text-white text-lg">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <Label>Foto do Perfil</Label>
                        
                        {/* Seletor de método */}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={avatarUploadMethod === "url" ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setAvatarUploadMethod("url");
                              setSelectedAvatarFile(null);
                              setAvatarPreview(null);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Link className="w-4 h-4" />
                            URL
                          </Button>
                          <Button
                            type="button"
                            variant={avatarUploadMethod === "upload" ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setAvatarUploadMethod("upload");
                              setFormData(prev => ({ ...prev, avatar_url: "" }));
                            }}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Campo URL */}
                    {avatarUploadMethod === "url" && (
                      <div className="relative">
                        <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="avatar_url"
                          type="url"
                          value={formData.avatar_url}
                          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                          placeholder="https://exemplo.com/avatar.jpg"
                          className="pl-10"
                        />
                      </div>
                    )}

                    {/* Campo Upload */}
                    {avatarUploadMethod === "upload" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileSelect}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                            disabled={isUploadingAvatar}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            {selectedAvatarFile ? 'Trocar Imagem' : 'Selecionar Imagem'}
                          </Button>
                          
                          {selectedAvatarFile && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveAvatarFile}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {selectedAvatarFile && (
                          <div className="text-sm text-muted-foreground">
                            📁 {selectedAvatarFile.name}
                          </div>
                        )}

                        {/* Progress do upload */}
                        {isUploadingAvatar && (
                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${avatarUploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Fazendo upload... {avatarUploadProgress}%
                            </p>
                          </div>
                        )}

                        {/* Informações sobre upload */}
                        <p className="text-xs text-muted-foreground">
                          Máximo 5MB. Formatos: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre você..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Informações Profissionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Seu cargo atual"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contato e Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Localização</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Cidade, Estado"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Links Sociais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="github_url">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="github_url"
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        placeholder="https://github.com/username"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="linkedin_url"
                        type="url"
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="portfolio_url">Portfólio</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="portfolio_url"
                        type="url"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                        placeholder="https://meuportfolio.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-orx-gradient hover:opacity-90"
                  disabled={updateProfileMutation.isPending || isUploadingAvatar}
                >
                  {updateProfileMutation.isPending
                    ? 'Salvando...'
                    : isUploadingAvatar
                    ? 'Fazendo upload...'
                    : 'Salvar Perfil'}
                </Button>
              </div>
            </div>

            {/* Seção de Segurança da Conta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informações da conta */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Email da conta</Label>
                    <div className="text-sm text-muted-foreground break-all">{user?.email}</div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Métodos de login</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user?.app_metadata?.providers?.map((provider: string) => (
                        <span
                          key={provider}
                          className="px-2 py-1 bg-muted rounded-md text-xs font-medium capitalize"
                        >
                          {provider === 'email' ? 'Email/Senha' : provider}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Alerta para usuários OAuth */}
                {isOAuthUser && !hasEmailProvider && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                          Defina uma senha
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Sua conta foi criada com login social. Defina uma senha para ter mais opções de acesso.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Formulário de senha */}
                <div onSubmit={handlePasswordUpdate} className="space-y-4">
                  {/* Senha atual - só para usuários que já têm senha */}
                  {hasEmailProvider && !isOAuthUser && (
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                          placeholder="Digite sua senha atual"
                          className="pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      {isOAuthUser && !hasEmailProvider ? 'Definir Senha' : 'Nova Senha'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        placeholder="Digite sua nova senha"
                        minLength={6}
                        className="pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mínimo de 6 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        placeholder="Confirme sua nova senha"
                        minLength={6}
                        className="pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-center pt-4">
                    <Button 
                      onClick={handlePasswordUpdate}
                      size="lg" 
                      className="bg-orx-gradient hover:opacity-90 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg w-full sm:w-auto sm:max-w-sm transition-all duration-300 hover:shadow-xl order-1"
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processando...
                        </div>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Key className="w-4 h-4 mr-2 flex-shrink-0" />
                          {isOAuthUser && !hasEmailProvider ? 'Definir Senha' : 'Atualizar Senha'}
                        </span>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={sendPasswordResetEmail}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 order-2"
                      disabled={isUpdatingPassword}
                    >
                      <span className="flex items-center justify-center">
                        Enviar Link por Email
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;