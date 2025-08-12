import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle,
  Send,
  User,
  Mail,
  FileText,
  Phone,
  MessageSquare
} from 'lucide-react';

// Types
type SupportUrgency = 'baixa' | 'normal' | 'alta';

interface SupportFormData {
  name: string;
  email: string;
  phone: string;
  urgency: SupportUrgency;
  subject: string;
  message: string;
}

interface User {
  full_name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
}

const Support: React.FC = () => {
  const { user } = useAuth() as AuthContextType;
  const [formData, setFormData] = useState<SupportFormData>({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    urgency: 'normal',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const handleInputChange = (field: keyof SupportFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Chamar API de suporte
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        console.log('✅ Mensagem enviada:', result.whatsappSent ? 'WhatsApp OK' : 'WhatsApp falhou');
        
        // Reset form após 3 segundos
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            name: user?.full_name || '',
            email: user?.email || '',
            phone: '',
            urgency: 'normal',
            subject: '',
            message: ''
          });
        }, 3000);
      } else {
        throw new Error(result.message || 'Erro ao enviar mensagem');
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Mensagem Enviada com Sucesso!</h2>
                <p className="text-muted-foreground mb-4">
                  Recebemos sua mensagem e nossa equipe retornará em breve.
                </p>
                <p className="text-sm text-muted-foreground">
                  Você receberá uma resposta por email ou telefone conforme informado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gradient">Fale Conosco</h1>
            <p className="text-muted-foreground text-lg">
              Estamos aqui para ajudar! Envie sua mensagem e retornaremos em breve.
            </p>
            {!user && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Dica:</strong> Faça seu cadastro para acompanhar suas mensagens e ter acesso completo à plataforma.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Formulário Principal */}
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dados de Contato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Seus Dados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10"
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone (opcional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgência</Label>
                      <Select 
                        value={formData.urgency} 
                        onValueChange={(value: SupportUrgency) => handleInputChange('urgency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa - Posso aguardar</SelectItem>
                          <SelectItem value="normal">Normal - Preciso de resposta</SelectItem>
                          <SelectItem value="alta">Alta - É urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Divisor visual */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Sua Mensagem</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Resumo do que você quer falar"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Conte-nos sua dúvida, sugestão, problema ou qualquer coisa que queira compartilhar..."
                        className="min-h-[140px]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dica útil */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                    💡 Para uma resposta mais rápida e precisa:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Seja específico sobre sua dúvida ou problema</li>
                    <li>• Se for um erro, conte o que estava fazendo quando aconteceu</li>
                    <li>• Se tiver sugestões, explique como isso te ajudaria</li>
                  </ul>
                </div>

                {/* Botão de Envio */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Responderemos em até 24 horas úteis
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="min-w-[140px]" size="lg">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Outras Formas de Contato */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Outras Formas de Entrar em Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <Mail className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                  <h3 className="font-semibold mb-2">Email Direto</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    contato@orxvalley.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Resposta em até 24h
                  </p>
                </div>
                <div className="p-4">
                  <MessageSquare className="h-8 w-8 mx-auto mb-3 text-green-500" />
                  <h3 className="font-semibold mb-2">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    (11) 9999-9999
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Segunda a Sexta, 9h às 18h
                  </p>
                </div>
                <div className="p-4">
                  <FileText className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                  <h3 className="font-semibold mb-2">Central de Ajuda</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Perguntas Frequentes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Respostas instantâneas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;