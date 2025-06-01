import { Instagram, Linkedin, MessageCircle } from 'lucide-react';

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
              <li><a href="/#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/comunidade" className="hover:text-white transition-colors">Comunidade</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/meus-eventos" className="hover:text-white transition-colors">Eventos</a></li>
              <li><a href="/sobre" className="hover:text-white transition-colors">Sobre</a></li>
            </ul>
          </div>
          
          {/* Redes sociais */}
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
            <a href="/privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </a>
            <a href="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;