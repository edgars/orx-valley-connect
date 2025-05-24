
import MemberCard from './MemberCard';

const CommunitySection = () => {
  const featuredMembers = [
    {
      name: "Ana Silva",
      bio: "Desenvolvedora Full Stack apaixonada por React e Node.js. Organizadora de eventos tech e mentora de novos desenvolvedores.",
      location: "São Paulo, SP",
      interests: ["React", "Node.js", "TypeScript", "Mentoria"],
      github: "https://github.com/anasilva",
      linkedin: "https://linkedin.com/in/anasilva",
    },
    {
      name: "Carlos Oliveira",
      bio: "Empreendedor serial e fundador de 3 startups. Especialista em growth hacking e estratégias de produto.",
      location: "Rio de Janeiro, RJ",
      interests: ["Startups", "Growth", "Product", "Marketing"],
      linkedin: "https://linkedin.com/in/carlosoliveira",
    },
    {
      name: "Marina Santos",
      bio: "UX Designer com foco em produtos digitais. Defensora do design centrado no usuário e acessibilidade.",
      location: "Belo Horizonte, MG",
      interests: ["UX/UI", "Design Systems", "Acessibilidade", "Figma"],
      linkedin: "https://linkedin.com/in/marinasantos",
    },
  ];

  return (
    <section id="comunidade" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nossa Comunidade</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conheça alguns dos membros que fazem parte da ORX Valley e contribuem 
            para o crescimento do ecossistema tech brasileiro.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredMembers.map((member, index) => (
            <MemberCard key={index} {...member} />
          ))}
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-4 p-6 bg-orx-gradient rounded-2xl text-white">
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm opacity-90">Membros Ativos</p>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm opacity-90">Eventos Realizados</p>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <p className="text-2xl font-bold">20+</p>
              <p className="text-sm opacity-90">Startups Nascidas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
