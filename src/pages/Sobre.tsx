import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Users, Target, Lightbulb, Heart, Star, ArrowRight, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
  const navigate = useNavigate();
  
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Protagonismo",
      description: "Cada jovem é responsável pelo próprio futuro e capaz de ser mais forte que as circunstâncias."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Meritocracia",
      description: "O sucesso vem do trabalho árduo, disciplina e responsabilidade individual."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Educação Transformadora",
      description: "A educação é a ponte que salva vidas, muda destinos e constrói futuros."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Valores Sólidos",
      description: "Honestidade, disciplina, lealdade e fé são as bases de uma vida digna e produtiva."
    }
  ];

  const principles = [
    "Você é capaz de ser mais forte do que as circunstâncias",
    "Ninguém te deve nada, mas tudo pode ser conquistado",
    "O fracasso não é vergonha, mas parte essencial da jornada",
    "Honestidade, disciplina, lealdade e fé são inegociáveis",
    "O verdadeiro privilégio é poder aprender e crescer"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      <Header />
      
      <main className="pt-20 sm:pt-24">
        <section id="sobre" className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient animate-text-glow">Comunidade</span>
                <br />
                <span className="text-foreground">ORX Valley</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground">
                Por uma Juventude Forte, Livre e Protagonista
              </p>
              <div className="w-24 h-1 bg-orx-gradient mx-auto rounded-full"></div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-xl border">
                <div className="space-y-6">
                  <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8">
                    Nossa <span className="text-gradient">Origem</span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    O ORX Valley nasce em <strong>Oriximiná</strong>, uma cidade distante dos grandes centros, 
                    mas rica em valores, potencial humano e instituições de ensino que são verdadeiros 
                    refúgios de transformação. Longe do eixo das capitais, mas carregando uma força singular: 
                    <em className="text-primary font-semibold"> A certeza de que a educação é a ponte que salva vidas, 
                    muda destinos e constrói futuros.</em>
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Aqui, acreditamos no poder transformador da educação, da família, da fé e dos valores. 
                    Sabemos que não é o endereço ou o apoio do Estado que determina o sucesso de alguém, 
                    mas sim sua disposição para aprender, crescer e lutar. Somos a prova de que grandes 
                    conquistas podem nascer longe dos holofotes, quando se tem propósito e vontade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
              Nossos <span className="text-gradient">Valores</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-primary mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
                Aqui Você Vai <span className="text-gradient">Ouvir</span>
              </h2>
              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <div key={index} className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border-l-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-3">
                      <Quote className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-lg text-foreground">{principle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
                Nossa <span className="text-gradient">Equipe</span>
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Por trás do ORX Valley está uma equipe extraordinária de profissionais que compartilham 
                    da mesma visão: <strong className="text-primary">transformar vidas através da educação 
                    e do desenvolvimento pessoal</strong>. Cada membro da nossa equipe é a prova viva de que 
                    o protagonismo e a dedicação podem superar qualquer obstáculo.
                  </p>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Unidos pela paixão em formar uma juventude forte e preparada para os desafios do futuro, 
                    nossa equipe multidisciplinar trabalha incansavelmente para criar experiências que 
                    <em className="text-primary font-semibold"> inspirem, eduquem e transformem</em>.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-primary mb-2">Desenvolvimento</h4>
                      <p className="text-sm text-muted-foreground">Desenvolvedores formados e programadores especializados</p>
                    </div>
                    <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-primary mb-2">Qualidade</h4>
                      <p className="text-sm text-muted-foreground">QAs dedicados à excelência em cada detalhe</p>
                    </div>
                    <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-primary mb-2">Criatividade</h4>
                      <p className="text-sm text-muted-foreground">Designers que dão vida às nossas ideias</p>
                    </div>
                    <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-primary mb-2">Estratégia</h4>
                      <p className="text-sm text-muted-foreground">Marketeiros, administradores e gestores visionários</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border">
                    <p className="text-lg font-semibold text-center text-primary mb-2">
                      "Cada membro da nossa equipe é protagonista da própria história"
                    </p>
                    <p className="text-center text-muted-foreground">
                      E juntos, construímos o futuro da próxima geração
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary via-primary/70 to-primary rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity  animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl p-4 shadow-2xl border-2 border-primary/20">
                      <div className="relative overflow-hidden rounded-xl">
                        <img 
                          src="/team-img.jpg"
                          alt="Equipe ORX Valley - Profissionais unidos pela transformação"
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                    
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inspiration */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                Inspirados por <span className="text-gradient">Grandes Pensadores</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Aprendemos com pensadores como <strong>Milton Friedman</strong>, <strong>Frederick Douglass</strong>, 
                <strong>Martin Luther King Jr.</strong>, <strong>Ayn Rand</strong> e <strong>Denis Rosenfield </strong> 
                que a verdadeira emancipação vem do autoconhecimento, do trabalho árduo e da responsabilidade individual.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 lg:p-12 border">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Nossa <span className="text-gradient">Missão</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Nossa missão é mostrar aos jovens que, independentemente de sua origem, é possível 
                  vencer sem recorrer ao vitimismo. Não buscamos formar seguidores de influenciadores 
                  do momento, mas <strong>líderes de si mesmos</strong>, profissionais competentes, 
                  empreendedores resilientes e cidadãos que deixem uma marca duradoura no mundo.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <Users className="w-8 h-8 text-primary mx-auto" />
                    <h3 className="font-semibold">Líderes</h3>
                    <p className="text-sm text-muted-foreground">Formamos líderes de si mesmos</p>
                  </div>
                  <div className="space-y-2">
                    <Target className="w-8 h-8 text-primary mx-auto" />
                    <h3 className="font-semibold">Profissionais</h3>
                    <p className="text-sm text-muted-foreground">Competentes pelo próprio esforço</p>
                  </div>
                  <div className="space-y-2">
                    <Star className="w-8 h-8 text-primary mx-auto" />
                    <h3 className="font-semibold">Cidadãos</h3>
                    <p className="text-sm text-muted-foreground">Que deixam marca no mundo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inspiration */}
{/*         <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                Inspirados por <span className="text-gradient">Grandes Pensadores</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Aprendemos com pensadores como <strong>Milton Friedman</strong>, <strong>Frederick Douglass</strong>, 
                <strong>Martin Luther King Jr.</strong>, <strong>Ayn Rand</strong> e <strong>Denis Rosenfield </strong> 
                que a verdadeira emancipação vem do autoconhecimento, do trabalho árduo e da responsabilidade individual.
              </p>
            </div>
          </div>
        </section> */}

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-xl border">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Bem-vindo ao <span className="text-gradient">ORX Valley</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Se você acredita que é possível ser protagonista da sua própria história, 
                  que o trabalho e a integridade valem mais que qualquer atalho, e que a 
                  liberdade se conquista com responsabilidade — o ORX Valley é o seu lugar.
                </p>
                <div className="space-y-4">
                  <p className="text-xl font-semibold text-primary">
                    O futuro começa com a sua escolha.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-orx-gradient hover:opacity-90 text-white text-lg px-8 py-4 rounded-xl shadow-lg"
                    onClick={() => navigate('/auth')}
                  >
                    Participar da Comunidade
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default AboutSection;