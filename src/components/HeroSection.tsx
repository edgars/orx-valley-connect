
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStats } from '@/hooks/useStats';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats } = useStats();

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/50">
      <div className="container relative z-10 text-center py-20">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
              <span className="text-gradient animate-text-glow">ORX Valley</span>
              <br />
              <span className="text-foreground">Criando</span>
              <br />
              <span className="text-gradient">Talentos</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Comunidade de tecnologia no Oeste do Pará (Oriximiná). 
              Participe de eventos, workshops e conecte-se com outros profissionais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                size="lg" 
                className="bg-orx-gradient hover:opacity-90 text-white text-lg px-8 py-4 rounded-xl shadow-lg"
                onClick={() => document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Eventos
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-orx-gradient hover:opacity-90 text-white text-lg px-8 py-4 rounded-xl shadow-lg"
                  onClick={() => navigate('/auth')}
                >
                  Participar da Comunidade
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary text-lg px-8 py-4 rounded-xl"
                  onClick={() => document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Conhecer Eventos
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>{stats?.members || 0}+ Membros</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>{stats?.events || 0}+ Eventos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>{stats?.sponsors || 0}+ Empresas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
