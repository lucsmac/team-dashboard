import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function TimelineTaskForm({ task, isOpen, onClose, onSave }) {
  const { dashboardData } = useDashboardData();
  const [formData, setFormData] = useState({
    weekStart: '',
    weekEnd: '',
    title: '',
    status: 'nao-iniciada',
    devIds: [],
    demandId: '',
    highlights: [],
    blockers: []
  });
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [currentBlocker, setCurrentBlocker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      // Modo edição - preencher com dados da task
      setFormData({
        weekStart: task.weekStart ? new Date(task.weekStart).toISOString().split('T')[0] : '',
        weekEnd: task.weekEnd ? new Date(task.weekEnd).toISOString().split('T')[0] : '',
        title: task.title || '',
        status: task.status || 'nao-iniciada',
        devIds: task.assignedDevs?.map(a => a.dev.id) || [],
        demandId: task.demandId || '',
        highlights: task.highlights?.filter(h => h.type === 'achievements').map(h => ({ text: h.text })) || [],
        blockers: task.highlights?.filter(h => h.type === 'blockers').map(h => ({ text: h.text, severity: h.severity })) || []
      });
    } else {
      // Modo criação - calcular semana atual (domingo a sábado)
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = domingo, 6 = sábado

      // Calcular domingo da semana atual
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - dayOfWeek);

      // Calcular sábado da semana atual
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);

      setFormData({
        weekStart: sunday.toISOString().split('T')[0],
        weekEnd: saturday.toISOString().split('T')[0],
        title: '',
        status: 'nao-iniciada',
        devIds: [],
        demandId: '',
        highlights: [],
        blockers: []
      });
    }
    setError(null);
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar dados para enviar
      const payload = {
        weekStart: formData.weekStart,
        weekEnd: formData.weekEnd,
        title: formData.title,
        status: formData.status,
        demandId: formData.demandId || null,
        devIds: formData.devIds,
        highlights: formData.highlights,
        blockers: formData.blockers
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHighlight = () => {
    if (currentHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, { text: currentHighlight.trim() }]
      }));
      setCurrentHighlight('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addBlocker = () => {
    if (currentBlocker.trim()) {
      setFormData(prev => ({
        ...prev,
        blockers: [...prev.blockers, { text: currentBlocker.trim(), severity: 'alta' }]
      }));
      setCurrentBlocker('');
    }
  };

  const removeBlocker = (index) => {
    setFormData(prev => ({
      ...prev,
      blockers: prev.blockers.filter((_, i) => i !== index)
    }));
  };

  const toggleDev = (devId) => {
    setFormData(prev => ({
      ...prev,
      devIds: prev.devIds.includes(devId)
        ? prev.devIds.filter(id => id !== devId)
        : [...prev.devIds, devId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Task da Timeline' : 'Nova Task da Timeline'}</DialogTitle>
          <DialogDescription>
            {task ? 'Atualize as informações da task.' : 'Crie uma nova task definindo as datas de início e fim.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Datas da semana */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekStart">Data de Início *</Label>
              <Input
                id="weekStart"
                type="date"
                value={formData.weekStart}
                onChange={(e) => handleChange('weekStart', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Início da semana de trabalho
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekEnd">Data de Fim *</Label>
              <Input
                id="weekEnd"
                type="date"
                value={formData.weekEnd}
                onChange={(e) => handleChange('weekEnd', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Fim da semana de trabalho
              </p>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Implementar autenticação OAuth"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
              required
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nao-iniciada">Não Iniciada</SelectItem>
                <SelectItem value="em-andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Demanda Relacionada (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="demandId">Demanda Relacionada (opcional)</Label>
            <Select
              value={formData.demandId || undefined}
              onValueChange={(value) => handleChange('demandId', value)}
            >
              <SelectTrigger id="demandId">
                <SelectValue placeholder="Selecione uma demanda" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dashboardData?.demands || {}).map(([category, demands]) =>
                  demands.map((demand) => (
                    <SelectItem key={demand.id} value={demand.id}>
                      [{category}] {demand.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {formData.demandId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleChange('demandId', '')}
                className="text-xs text-muted-foreground"
              >
                Limpar seleção
              </Button>
            )}
          </div>

          {/* Devs Alocados */}
          <div className="space-y-2">
            <Label>Devs Alocados *</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/20">
              {dashboardData?.devs?.map((dev) => (
                <Badge
                  key={dev.id}
                  variant={formData.devIds.includes(dev.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleDev(dev.id)}
                >
                  {dev.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Conquistas/Highlights */}
          <div className="space-y-2">
            <Label>Conquistas</Label>
            <div className="flex gap-2">
              <Input
                value={currentHighlight}
                onChange={(e) => setCurrentHighlight(e.target.value)}
                placeholder="Adicionar conquista..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              />
              <Button type="button" onClick={addHighlight} variant="outline">
                Adicionar
              </Button>
            </div>
            {formData.highlights.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                    <span className="flex-1 text-sm">{highlight.text}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Entraves/Blockers */}
          <div className="space-y-2">
            <Label>Entraves</Label>
            <div className="flex gap-2">
              <Input
                value={currentBlocker}
                onChange={(e) => setCurrentBlocker(e.target.value)}
                placeholder="Adicionar entrave..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBlocker())}
              />
              <Button type="button" onClick={addBlocker} variant="outline">
                Adicionar
              </Button>
            </div>
            {formData.blockers.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.blockers.map((blocker, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                    <span className="flex-1 text-sm">{blocker.text}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBlocker(index)}
                    >
                      <X className="h-4 w-4" />
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
            <Button type="submit" disabled={loading || !formData.title || formData.devIds.length === 0}>
              {loading ? 'Salvando...' : (task ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
