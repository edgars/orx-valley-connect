
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-20 lg:py-32">
      <div className="absolute inset-0 bg-orx-gradient opacity-5"></div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in">
            Bem-vindo ao{' '}
            <span className="text-gradient">ORX Valley</span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A maior comunidade de estudantes e empreendedores de tecnologia. 
            Conecte-se, aprenda e cresça junto com outros profissionais apaixonados por tech.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="bg-orx-gradient hover:opacity-90 text-white px-8 py-3">
              Junte-se à Comunidade
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Explorar Eventos
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orx-gradient opacity-10 rounded-full blur-3xl animate-float"></div>
    </section>
  );
};

export default HeroSection;
