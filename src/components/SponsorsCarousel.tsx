
import { useSponsors } from '@/hooks/useSponsors';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ExternalLink } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

const SponsorsCarousel = () => {
  const { data: sponsors, isLoading } = useSponsors();

  if (isLoading || !sponsors?.length) {
    return null;
  }

  const sponsorsByTier = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.tier]) {
      acc[sponsor.tier] = [];
    }
    acc[sponsor.tier].push(sponsor);
    return acc;
  }, {} as Record<string, typeof sponsors>);

  const tierOrder = ['diamond', 'platinum', 'gold', 'silver', 'bronze'];
  const tierLabels = {
    diamond: 'Diamante',
    platinum: 'Platina',
    gold: 'Ouro',
    silver: 'Prata',
    bronze: 'Bronze'
  };

  const tierColors = {
    diamond: 'bg-gradient-to-r from-blue-400 to-purple-500',
    platinum: 'bg-gradient-to-r from-gray-300 to-gray-500',
    gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    silver: 'bg-gradient-to-r from-gray-400 to-gray-600',
    bronze: 'bg-gradient-to-r from-orange-400 to-orange-600'
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient">Nossos Apoiadores</h2>
          <p className="text-xl text-muted-foreground">
            Empresas e instituições que apoiam o crescimento da comunidade tech
          </p>
        </div>

        {tierOrder.map(tier => {
          const tieredSponsors = sponsorsByTier[tier];
          if (!tieredSponsors?.length) return null;

          return (
            <div key={tier} className="mb-16">
              <div className="text-center mb-8">
                <span className={`inline-block px-6 py-3 rounded-full text-white font-semibold text-lg ${tierColors[tier as keyof typeof tierColors]}`}>
                  {tierLabels[tier as keyof typeof tierLabels]}
                </span>
              </div>

              <Carousel
                className="w-full"
                plugins={[
                  Autoplay({
                    delay: 3000,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                  }),
                ]}
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {tieredSponsors.map((sponsor) => (
                    <CarouselItem key={sponsor.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/50 backdrop-blur-sm border-2 hover:border-primary/20">
                        <CardContent className="p-6 flex flex-col items-center text-center h-full">
                          <div className="mb-4 flex-shrink-0">
                            <img
                              src={sponsor.logo_url}
                              alt={sponsor.name}
                              className="h-20 w-auto mx-auto object-contain filter hover:grayscale-0 grayscale transition-all duration-300"
                            />
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-gradient">{sponsor.name}</h3>
                          {sponsor.description && (
                            <p className="text-muted-foreground text-sm mb-4 flex-grow">{sponsor.description}</p>
                          )}
                          {sponsor.website_url && (
                            <a
                              href={sponsor.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors mt-auto"
                            >
                              Visitar site
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SponsorsCarousel;
