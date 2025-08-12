import { Instagram, Linkedin, MessageCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-orx-dark text-white py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/orxvalley.white.svg"
                alt="ORX Valley Logo"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              O extraordinário nasce onde ninguém espera
            </p>
            <p className="text-gray-500 text-xs">
              Uma comunidade dedicada ao desenvolvimento pessoal e profissional através da educação e valores sólidos.
            </p>
          </div>
          
          {/* Links de navegação */}
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/#home" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/comunidade" className="hover:text-white transition-colors">Comunidade</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/manifesto" className="hover:text-white transition-colors">Manifesto</Link></li>
              <li><Link to="/meus-eventos" className="hover:text-white transition-colors">Eventos</Link></li>
              <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre</Link></li>
              {/* <li><Link to="/support" className="hover:text-white transition-colors">Suporte</Link></li> */}
            </ul>
          </div>
          
          {/* Redes sociais e contato */}
          <div>
            <h4 className="font-semibold mb-4">Conecte-se Conosco</h4>
            <div className="space-y-3">
              <a 
                href="https://discord.gg/adjkuGjRyG" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <MessageCircle className="w-5 h-5 group-hover:text-[#5865F2]" />
                <span>Discord</span>
              </a>
              
              <a 
                href="https://linkedin.com/company/orx-valley" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <Linkedin className="w-5 h-5 group-hover:text-[#0077B5]" />
                <span>LinkedIn</span>
              </a>
              
              <a 
                href="https://www.instagram.com/orx.valley" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <Instagram className="w-5 h-5 group-hover:text-[#E4405F]" />
                <span>Instagram</span>
              </a>

            {/*   <Link 
                to="/support"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <HelpCircle className="w-5 h-5 group-hover:text-[#10B981]" />
                <span>Central de Suporte</span>
              </Link> */}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Junte-se à nossa comunidade e faça parte dessa jornada de transformação.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 ORX Valley. Todos os direitos reservados.</p>
          <div className="mt-4 sm:mt-0 flex gap-4">
            <Link to="/privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link to="/support" className="hover:text-white transition-colors">
              Suporte
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;