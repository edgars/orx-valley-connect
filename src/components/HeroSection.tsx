
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/50 pt-16">
      <div className="container relative z-10 text-center py-20">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
              <span className="text-gradient animate-pulse">ORX Valley</span>
              <br />
              <span className="text-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>Conectando</span>
              <br />
              <span className="text-gradient animate-fade-in" style={{ animationDelay: '1s' }}>Talentos</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '1.5s' }}>
              A maior comunidade de tecnologia do Vale do Paraíba. 
              Participe de eventos, workshops e conecte-se com outros profissionais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '2s' }}>
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

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '2.5s' }}>
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
