
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useSponsors, useCreateSponsor, Sponsor, SponsorFormData } from '@/hooks/useSponsors';
import { Loader2, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SponsorManagementCard = () => {
  const { data: sponsors, isLoading } = useSponsors();
  const createSponsorMutation = useCreateSponsor();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<SponsorFormData>({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    tier: 'bronze',
    display_order: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.logo_url) {
      toast({
        title: "Erro",
        description: "Nome e URL do logo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSponsorMutation.mutateAsync(formData);
      setFormData({
        name: '',
        logo_url: '',
        website_url: '',
        description: '',
        tier: 'bronze',
        display_order: 0
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating sponsor:', error);
    }
  };

  const tierColors = {
    diamond: 'bg-blue-100 text-blue-800',
    platinum: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800',
    silver: 'bg-gray-100 text-gray-600',
    bronze: 'bg-orange-100 text-orange-800'
  };

  const tierLabels = {
    diamond: 'Diamante',
    platinum: 'Platina',
    gold: 'Ouro',
    silver: 'Prata',
    bronze: 'Bronze'
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Apoiadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestão de Apoiadores</CardTitle>
          <Button onClick={() => setIsCreating(!isCreating)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Apoiador
          </Button>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome da empresa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tier">Categoria</Label>
                  <Select value={formData.tier} onValueChange={(value: any) => setFormData({ ...formData, tier: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Prata</SelectItem>
                      <SelectItem value="gold">Ouro</SelectItem>
                      <SelectItem value="platinum">Platina</SelectItem>
                      <SelectItem value="diamond">Diamante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="logo_url">URL do Logo *</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://exemplo.com/logo.png"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Dimensões recomendadas: 200x100 a 800x400 pixels
                </p>
              </div>
              
              <div>
                <Label htmlFor="website_url">Site</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição da empresa"
                />
              </div>
              
              <div>
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createSponsorMutation.isPending}>
                  {createSponsorMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salvar
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors?.map((sponsor: Sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="h-8 w-auto object-contain"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{sponsor.name}</TableCell>
                    <TableCell>
                      <Badge className={tierColors[sponsor.tier as keyof typeof tierColors]}>
                        {tierLabels[sponsor.tier as keyof typeof tierLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sponsor.website_url && (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          Site
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell>{sponsor.display_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!sponsors || sponsors.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum apoiador cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorManagementCard;
