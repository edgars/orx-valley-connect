import { useState } from 'react';
import { useSponsors } from '@/hooks/useSponsors';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, X } from 'lucide-react';

const SponsorsSection = () => {
  const { data: sponsors, isLoading } = useSponsors();
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  if (isLoading || !sponsors?.length) {
    return null;
  }

  const openModal = (sponsor) => {
    setSelectedSponsor(sponsor);
  };

  const closeModal = () => {
    setSelectedSponsor(null);
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Parceiros</h2>
            <p className="text-xl text-gray-300">
              Agradecemos imensamente o apoio das instituições e empresas que acreditam na nossa missão e contribuem ativamente para o fortalecimento da nossa comunidade.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sponsors.map((sponsor) => (
              <Card
                key={sponsor.id}
                className="bg-gray-800 border-none text-white hover:shadow-lg transition-all duration-300 cursor-pointer h-80 flex flex-col"
                onClick={() => sponsor.description && sponsor.description.length > 120 && openModal(sponsor)}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="text-center flex flex-col h-full">
                    <div className="mb-4">
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="h-16 w-auto mx-auto object-contain"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-3">{sponsor.name}</h3>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      {sponsor.description && (
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                          {truncateText(sponsor.description)}
                        </p>
                      )}
                      
                      <div className="space-y-3">
                        {sponsor.website_url && (
                          <a
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-200 text-sm transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visitar site
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        
                        {sponsor.description && sponsor.description.length > 120 && (
                          <div className="text-xs text-gray-400 opacity-70">
                            
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedSponsor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header do Modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedSponsor.logo_url}
                    alt={selectedSponsor.name}
                    className="h-12 w-auto object-contain"
                  />
                  <h2 className="text-2xl font-bold text-white">{selectedSponsor.name}</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Conteúdo do Modal */}
              <div className="space-y-4">
                {selectedSponsor.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Sobre o Parceiro</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedSponsor.description}
                    </p>
                  </div>
                )}
                
                {selectedSponsor.website_url && (
                  <div className="pt-4 border-t border-gray-700">
                    <a
                      href={selectedSponsor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Visitar site oficial
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SponsorsSection;