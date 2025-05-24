
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EventsSection from '@/components/EventsSection';
import CommunitySection from '@/components/CommunitySection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <EventsSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
