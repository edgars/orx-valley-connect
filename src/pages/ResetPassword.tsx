import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkResetSession = async () => {
      try {
        // Verifica os parâmetros da URL (tanto query string quanto fragmento)
        let urlParams: URLSearchParams;
        
        // Primeiro tenta pelos parâmetros de query string (?param=value)
        urlParams = new URLSearchParams(window.location.search);
        let accessToken = urlParams.get('access_token');
        let refreshToken = urlParams.get('refresh_token');
        let type = urlParams.get('type');

        // Se não encontrou nos parâmetros de query, verifica no fragmento (#param=value)
        if (!accessToken && window.location.hash) {
          const hashParams = window.location.hash.substring(1); // Remove o #
          urlParams = new URLSearchParams(hashParams);
          accessToken = urlParams.get('access_token');
          refreshToken = urlParams.get('refresh_token');
          type = urlParams.get('type');
        }

        // Verifica se é uma sessão de recuperação de senha
        if (accessToken && refreshToken && type === 'recovery') {
          // Configura a sessão com os tokens da URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Erro ao configurar sessão:', error);
            throw error;
          }

          setIsValidSession(true);
        } else {
          // Verifica se já existe uma sessão ativa de recuperação
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          // Verifica se a sessão é válida e se o usuário está no contexto de recuperação
          if (session?.user) {
            // Aqui você pode adicionar uma verificação adicional se necessário
            // Por exemplo, verificar se o usuário tem permissão para redefinir senha
            setIsValidSession(true);
          } else {
            throw new Error('Sessão inválida');
          }
        }
      } catch (error) {
        console.error('Erro na verificação de sessão:', error);
        toast({
          title: "Sessão inválida",
          description: "Link de recuperação inválido ou expirado. Redirecionando para login...",
          variant: "destructive",
        });
        
        // Aguarda um pouco antes de redirecionar para o usuário ver a mensagem
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkResetSession();
  }, [navigate, toast]);

  // Mostra loading enquanto verifica a sessão
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se a sessão não é válida, mostra loading (redirecionamento em andamento)
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verificando link de recuperação...</p>
        </div>
      </div>
    );
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Validação adicional para senha forte (opcional)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      toast({
        title: "Senha fraca",
        description: "A senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi redefinida com sucesso. Redirecionando...",
      });

      // Limpa os campos
      setPassword('');
      setConfirmPassword('');

      // Aguarda um pouco antes de redirecionar
      setTimeout(() => {
        navigate('/auth');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro inesperado ao atualizar senha.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src="/orxvalley.white.svg"
            width="300"
            alt="orx-valley-logo"
            className="mx-auto block mb-8 h-20"
          />
          <h2 className="text-3xl font-bold">
            Nova Senha
          </h2>
          <p className="mt-2 text-muted-foreground">
            Digite sua nova senha abaixo
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite sua nova senha"
                minLength={6}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 6 caracteres com pelo menos 1 maiúscula, 1 minúscula e 1 número
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirme sua nova senha"
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orx-gradient hover:opacity-90 text-white h-12"
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Atualizar Senha'
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center mx-auto"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;