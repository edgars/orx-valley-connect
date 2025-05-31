import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MemberCertificates from '@/components/MemberCertificates';
import { Navigate } from 'react-router-dom';

const CertificateGeneratorPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gradient">Meus Certificados</h1>

        </div>

        <MemberCertificates />
        
      </div>
      <Footer />
    </div>
  );
};

export default CertificateGeneratorPage;