import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Github, ArrowLeft } from "lucide-react";

const Auth = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao ORX Valley.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username: username,
            },
          },
        });
        if (error) throw error;

        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao ORX Valley. Você pode fazer login agora.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description:
          "Verifique sua caixa de entrada para definir/redefinir sua senha.",
      });

      // Volta para a tela de login após enviar o email
      setIsPasswordReset(false);
      setIsLogin(true);
    } catch (error: any) {
      // Se o erro for que o usuário não tem senha (conta OAuth)
      if (
        error.message.includes("For security purposes") ||
        error.message.includes("email not confirmed")
      ) {
        toast({
          title: "Conta criada com provedor social",
          description:
            "Sua conta foi criada com Google/GitHub. Entre normalmente ou crie uma nova conta com email/senha.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGithubAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setUsername("");
  };

  const getTitle = () => {
    if (isPasswordReset) return "Recuperar Senha";
    return isLogin ? "Entrar" : "Criar Conta";
  };

  const getDescription = () => {
    if (isPasswordReset) return "Digite seu email para receber as instruções";
    return isLogin
      ? "Acesse sua conta no ORX Valley"
      : "Junte-se à comunidade ORX Valley";
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-background to-muted/50 px-4 py-8">
      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <img
              src="public/orxvalley.white.svg"
              width="300"
              alt="orx-valley-logo"
              className="mx-auto block mb-8 h-20"
            />
            <h2 className="text-3xl font-bold">{getTitle()}</h2>
            <p className="mt-2 text-muted-foreground">{getDescription()}</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
            {/* Tela de recuperação de senha */}
            {isPasswordReset ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orx-gradient hover:opacity-90 text-white h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Enviar Email de Recuperação"
                  )}
                </Button>
              </form>
            ) : (
              /* Tela de login/cadastro original */
              <>
                <div className="space-y-4">
                  <Button
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar com Google
                  </Button>

                  <Button
                    onClick={handleGithubAuth}
                    variant="outline"
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Continuar com GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      ou
                    </span>
                  </div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome Completo</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required={!isLogin}
                          placeholder="Seu nome completo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Nome de Usuário</Label>
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required={!isLogin}
                          placeholder="Escolha um nome de usuário"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Sua senha"
                      minLength={6}
                    />
                  </div>

                  {/* Link para recuperar senha - só aparece no login */}
                  {isLogin && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPasswordReset(true);
                          resetForm();
                        }}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        disabled={isLoading}
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-orx-gradient hover:opacity-90 text-white h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : isLogin ? (
                      "Entrar"
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      resetForm();
                    }}
                    className="text-sm text-muted-foreground"
                    disabled={isLoading}
                  >
                    {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                    <span className="font-medium hover:text-[#7256D9] text-foreground">
                      {isLogin ? "Criar conta" : "Fazer login"}
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* Botão de voltar para recuperação de senha */}
            {isPasswordReset && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordReset(false);
                    resetForm();
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
