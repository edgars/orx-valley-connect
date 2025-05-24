
import { useSponsors } from '@/hooks/useSponsors';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const SponsorsSection = () => {
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nossos Apoiadores</h2>
          <p className="text-xl text-gray-600">
            Agradecemos o apoio das empresas que tornam nossa comunidade possível
          </p>
        </div>

        {tierOrder.map(tier => {
          const tieredSponsors = sponsorsByTier[tier];
          if (!tieredSponsors?.length) return null;

          return (
            <div key={tier} className="mb-12">
              <div className="text-center mb-8">
                <span className={`inline-block px-6 py-2 rounded-full text-white font-semibold ${tierColors[tier as keyof typeof tierColors]}`}>
                  {tierLabels[tier as keyof typeof tierLabels]}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tieredSponsors.map((sponsor) => (
                  <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="mb-4">
                          <img
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            className="h-16 w-auto mx-auto object-contain"
                          />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{sponsor.name}</h3>
                        {sponsor.description && (
                          <p className="text-gray-600 text-sm mb-4">{sponsor.description}</p>
                        )}
                        {sponsor.website_url && (
                          <a
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Visitar site
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SponsorsSection;
