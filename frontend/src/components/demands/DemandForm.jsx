import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  DEMAND_CATEGORIES,
  DEMAND_STAGES,
  DEMAND_STATUS,
  PRIORITY_LEVELS,
  DEMAND_CATEGORY_LABELS,
  DEMAND_STAGE_LABELS,
  DEMAND_STATUS_LABELS,
  PRIORITY_LABELS
} from '@/utils/enums';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DemandForm({ demand, isOpen, onClose, onSave }) {
  const { dashboardData } = useDashboardData();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    stage: '',
    status: '',
    priority: '',
    assignedDevs: [],
    value: '',
    details: '',
    links: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkInput, setLinkInput] = useState('');

  useEffect(() => {
    if (demand) {
      setFormData({
        category: demand.category || '',
        title: demand.title || '',
        stage: demand.stage || '',
        status: demand.status || '',
        priority: demand.priority || '',
        assignedDevs: demand.assignedDevs || [],
        value: demand.value || '',
        details: demand.details || '',
        links: demand.links || []
      });
    } else {
      setFormData({
        category: '',
        title: '',
        stage: DEMAND_STAGES.PLANEJAMENTO,
        status: DEMAND_STATUS.ATIVA,
        priority: PRIORITY_LEVELS.MEDIA,
        assignedDevs: [],
        value: '',
        details: '',
        links: []
      });
    }
    setError(null);
    setLinkInput('');
  }, [demand, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar demanda');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDev = (devName) => {
    setFormData(prev => ({
      ...prev,
      assignedDevs: prev.assignedDevs.includes(devName)
        ? prev.assignedDevs.filter(d => d !== devName)
        : [...prev.assignedDevs, devName]
    }));
  };

  const addLink = () => {
    if (linkInput.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, linkInput.trim()]
      }));
      setLinkInput('');
    }
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const devs = dashboardData?.devs || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {demand ? 'Editar Demanda' : 'Nova Demanda'}
          </DialogTitle>
          <DialogDescription>
            {demand
              ? 'Atualize as informações da demanda.'
              : 'Adicione uma nova demanda ao dashboard.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Implementar autenticação"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DEMAND_CATEGORIES).map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {DEMAND_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Etapa *</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => handleChange('stage', value)}
                required
              >
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DEMAND_STAGES).map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {DEMAND_STAGE_LABELS[stage]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DEMAND_STATUS).map(status => (
                    <SelectItem key={status} value={status}>
                      {DEMAND_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
                required
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PRIORITY_LEVELS).map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {PRIORITY_LABELS[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Valor de Negócio</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => handleChange('value', e.target.value)}
              placeholder="Ex: Aumentar conversão em 20%"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Detalhes</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleChange('details', e.target.value)}
              placeholder="Descrição detalhada da demanda..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Desenvolvedores Alocados</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px]">
              {devs.length === 0 ? (
                <span className="text-sm text-gray-400">Nenhum desenvolvedor disponível</span>
              ) : (
                devs.map(dev => (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => toggleDev(dev.name)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.assignedDevs.includes(dev.name)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {dev.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="links">Links</Label>
            <div className="flex gap-2">
              <Input
                id="links"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                }}
              />
              <Button type="button" onClick={addLink} variant="outline">
                Adicionar
              </Button>
            </div>
            {formData.links.length > 0 && (
              <div className="space-y-1 mt-2">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-blue-600 hover:underline truncate"
                    >
                      {link}
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (demand ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
