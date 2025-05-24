
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedSVG from './AnimatedSVG';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-muted/50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orx-gradient rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-orx-gradient rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orx-gradient rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        <div className="text-center lg:text-left space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-gradient">ORX Valley</span>
              <br />
              <span className="text-foreground">Conectando</span>
              <br />
              <span className="text-gradient">Talentos</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl">
              A maior comunidade de tecnologia do Vale do Paraíba. 
              Participe de eventos, workshops e conecte-se com outros profissionais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {user ? (
              <Button 
                size="lg" 
                className="bg-orx-gradient hover:opacity-90 text-white text-lg px-8 py-4 rounded-xl shadow-lg animate-pulse-glow"
                onClick={() => navigate('/#eventos')}
              >
                Ver Eventos
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-orx-gradient hover:opacity-90 text-white text-lg px-8 py-4 rounded-xl shadow-lg animate-pulse-glow"
                  onClick={() => navigate('/auth')}
                >
                  Participar da Comunidade
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary text-lg px-8 py-4 rounded-xl"
                  onClick={() => navigate('/#eventos')}
                >
                  Conhecer Eventos
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>500+ Membros</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>50+ Eventos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>20+ Empresas</span>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <AnimatedSVG />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
