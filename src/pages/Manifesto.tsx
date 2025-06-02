import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Manifesto = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      <Header />
      
      <main className="pt-20 sm:pt-24">
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Manifesto ORX Valley
                </h1>
                <p className="text-xl text-muted-foreground">
                  Por uma Juventude Forte, Livre e Protagonista
                </p>
                <div className="w-24 h-1 bg-orx-gradient rounded-full"></div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  O ORX Valley nasce em Oriximiná, uma cidade distante dos grandes centros, mas rica em valores, potencial humano e instituições de ensino que são verdadeiros refúgios de transformação. Longe do eixo das capitais, mas carregando uma força singular: A certeza de que a educação é a ponte que salva vidas, muda destinos e constrói futuros.
                </p>
                <p>
                  Aqui, acreditamos no poder transformador da educação, da família (independente do modelo), da fé e dos valores. Sabemos, por experiência própria, que não é o endereço ou o apoio do Estado que determina o sucesso de alguém, mas sim sua disposição para aprender, crescer e lutar. Somos a prova de que grandes conquistas podem nascer longe dos holofotes, quando se tem propósito e vontade.
                </p>
                <p>
                  Na ORX Valley, nossa missão é mostrar aos jovens que, independentemente de sua origem, é possível vencer sem recorrer ao vitimismo ou as fraquezas comuns. Aprendemos com pensadores como Milton Friedman, Frederick Douglass, Martin Luther King Jr., Ayn Rand e Denis Rosenfield que a verdadeira emancipação vem do autoconhecimento, do trabalho árduo e da responsabilidade individual.
                </p>
                <p>
                  Não buscamos formar seguidores de influenciadores do momento, mas líderes de si mesmos, profissionais que serão competentes(com seu esforço), empreendedores resilientes e cidadãos que deixem uma marca duradoura no mundo.
                </p>

                <h2>Aqui, você vai ouvir:</h2>
                <ul>
                  <li>Que você é capaz de ser mais forte do que as circunstâncias.</li>
                  <li>Que ninguém te deve nada, mas tudo pode ser conquistado.</li>
                  <li>Que o fracasso não é vergonha, mas parte essencial da jornada de quem constrói e realiza.</li>
                  <li>Que honestidade, disciplina, lealdade e fé são as bases inegociáveis de uma vida digna e produtiva.</li>
                  <li>Que o verdadeiro privilégio é poder aprender, crescer e trabalhar para ser melhor a cada dia.</li>
                </ul>

                <h2>Rejeitamos:</h2>
                <ul>
                  <li>O comodismo que paralisa.</li>
                  <li>O coitadismo que enfraquece.</li>
                  <li>A idolatria a modismos e influenciadores passageiros.</li>
                </ul>

                <h2>Assumimos:</h2>
                <ul>
                  <li>Que cada um é responsável pelo próprio futuro.</li>
                  <li>Que juntos, podemos criar um ambiente onde a meritocracia é celebrada, o esforço é reconhecido, e o sucesso é compartilhado.</li>
                </ul>

                <p>
                  O ORX Valley é mais do que uma comunidade: é um movimento. Cada jovem tocado e transformado por esse propósito será, amanhã, um multiplicador, levando adiante a chama do protagonismo, da honestidade e do trabalho. A educação salva vidas, e aqueles que hoje aprendem e se desenvolvem aqui, serão os líderes que inspirarão novas gerações a também superarem suas barreiras.
                </p>
                <p>
                  Se você acredita que é possível ser protagonista da sua própria história, que o trabalho e a integridade valem mais que qualquer atalho, e que a liberdade se conquista com responsabilidade — o ORX Valley é o seu lugar.
                </p>
                <p>
                  Venha construir conosco uma nova geração de vencedores — não pelos privilégios herdados, mas pelos valores conquistados. Não pelos atalhos fáceis, mas pela estrada longa do mérito e da superação.
                </p>
                <p>
                  Bem-vindo ao ORX Valley. O futuro começa com a sua escolha.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border mt-12">
                <div className="flex items-center space-x-6">
                  <a 
                    href="https://www.linkedin.com/in/jedgarsilva/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <img 
                      src="https://skls3.cloud.skalena.com.br/-WrJPqBYzwj" 
                      alt="Edgar Silva" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                    />
                  </a>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Edgar Silva</h3>
                    <p className="text-muted-foreground">Idealizador do projeto e membro da comunidade ORX Valley</p>
                    <a 
                      href="https://www.linkedin.com/in/jedgarsilva/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mt-2 inline-block"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default Manifesto; 