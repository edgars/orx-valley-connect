
import HeroSection from '@/components/HeroSection';
import EventsSection from '@/components/EventsSection';
import CommunitySection from '@/components/CommunitySection';
import SponsorsSection from '@/components/SponsorsSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Index = () => {
  console.log('Index page loaded');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <EventsSection />
      <CommunitySection />
      <SponsorsSection />
      <Footer />
    </div>
  );
};

export default Index;
