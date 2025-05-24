
import EventCard from './EventCard';

const EventsSection = () => {
  const upcomingEvents = [
    {
      title: "Workshop: React Avançado",
      description: "Aprenda conceitos avançados de React incluindo hooks customizados, context API e performance optimization.",
      date: "15 de Junho, 2024 - 19:00",
      location: "Campus Universitário - Sala A101",
      type: "presencial" as const,
      spotsLeft: 12,
    },
    {
      title: "Meetup: Startup Stories",
      description: "Histórias inspiradoras de empreendedores locais que transformaram ideias em negócios de sucesso.",
      date: "22 de Junho, 2024 - 18:30",
      location: "Online via Discord",
      type: "online" as const,
    },
    {
      title: "Hackathon ORX Valley 2024",
      description: "48 horas de pura programação! Desenvolva soluções inovadoras com sua equipe e concorra a prêmios incríveis.",
      date: "29-30 de Junho, 2024",
      location: "Centro de Inovação Tech",
      type: "presencial" as const,
      spotsLeft: 5,
    },
  ];

  return (
    <section id="eventos" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Próximos Eventos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Participe dos nossos eventos e expanda sua rede de contatos enquanto aprende 
            com especialistas da área de tecnologia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
