
import HeroSection from '@/components/HeroSection';
import EventsSection from '@/components/EventsSection';
import CommunitySection from '@/components/CommunitySection';
import SponsorsSection from '@/components/SponsorsSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useActiveEvents } from '@/hooks/useEvents';

const Index = () => {
  console.log('Index page loaded');
  const { data: events, isLoading } = useActiveEvents();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <EventsSection events={events || []} isLoading={isLoading} />
      <CommunitySection />
      <SponsorsSection />
      <Footer />
    </div>
  );
};

export default Index;
