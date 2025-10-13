import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';
import { X, Calendar } from 'lucide-react';

/**
 * Dialog para criar/editar timeline tasks
 */
export const TimelineTaskDialog = ({ isOpen, onClose, onSave, task, demandId }) => {
  const { dashboardData } = useDashboardData();
  const [formData, setFormData] = useState({
    title: '',
    weekType: 'current',
    weekStart: '',
    weekEnd: '',
    status: 'nao-iniciada',
    demandId: demandId || null,
    devIds: [],
    achievements: [],
    blockers: []
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newBlocker, setNewBlocker] = useState('');

  useEffect(() => {
    if (task) {
      // Edição: preencher com dados da task
      setFormData({
        title: task.title || '',
        weekType: task.weekType || 'current',
        weekStart: task.weekStart ? task.weekStart.split('T')[0] : '',
        weekEnd: task.weekEnd ? task.weekEnd.split('T')[0] : '',
        status: task.status || 'nao-iniciada',
        demandId: task.demandId || demandId || null,
        devIds: task.assignedDevs?.map(a => a.devId) || [],
        achievements: task.highlights?.filter(h => h.type === 'conquista').map(h => h.text) || [],
        blockers: task.highlights?.filter(h => h.type === 'entrave').map(h => ({ text: h.text, severity: h.severity || 'alta' })) || []
      });
    } else {
      // Criação: valores padrão
      const today = new Date();
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay());
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);

      setFormData({
        title: '',
        weekType: 'current',
        weekStart: sunday.toISOString().split('T')[0],
        weekEnd: saturday.toISOString().split('T')[0],
        status: 'nao-iniciada',
        demandId: demandId || null,
        devIds: [],
        achievements: [],
        blockers: []
      });
    }
  }, [task, demandId, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação
    if (!formData.title.trim()) {
      alert('Título é obrigatório');
      return;
    }
    if (!formData.weekStart || !formData.weekEnd) {
      alert('Datas da semana são obrigatórias');
      return;
    }

    // Formatar highlights para o backend
    const highlights = formData.achievements.map(text => ({ text }));
    const blockers = formData.blockers.map(b => ({ text: b.text, severity: b.severity }));

    onSave({
      ...formData,
      highlights,
      blockers
    });

    onClose();
  };

  const toggleDev = (devId) => {
    setFormData(prev => ({
      ...prev,
      devIds: prev.devIds.includes(devId)
        ? prev.devIds.filter(id => id !== devId)
        : [...prev.devIds, devId]
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addBlocker = () => {
    if (newBlocker.trim()) {
      setFormData(prev => ({
        ...prev,
        blockers: [...prev.blockers, { text: newBlocker.trim(), severity: 'alta' }]
      }));
      setNewBlocker('');
    }
  };

  const removeBlocker = (index) => {
    setFormData(prev => ({
      ...prev,
      blockers: prev.blockers.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Timeline Task' : 'Nova Timeline Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Atualize as informações da task' : 'Crie uma nova task para a timeline'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Implementar autenticação OAuth"
            />
          </div>

          {/* Tipo de semana e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekType">Tipo de Semana *</Label>
              <Select
                value={formData.weekType}
                onValueChange={(value) => setFormData({ ...formData, weekType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous">Semana Anterior</SelectItem>
                  <SelectItem value="current">Semana Atual</SelectItem>
                  <SelectItem value="upcoming">Próximas Semanas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao-iniciada">Não Iniciada</SelectItem>
                  <SelectItem value="em-andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekStart">
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                Início da Semana *
              </Label>
              <Input
                id="weekStart"
                type="date"
                value={formData.weekStart}
                onChange={(e) => setFormData({ ...formData, weekStart: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekEnd">
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                Fim da Semana *
              </Label>
              <Input
                id="weekEnd"
                type="date"
                value={formData.weekEnd}
                onChange={(e) => setFormData({ ...formData, weekEnd: e.target.value })}
              />
            </div>
          </div>

          {/* Devs Alocados */}
          <div className="space-y-2">
            <Label>Desenvolvedores Alocados</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
              {dashboardData.devs.map(dev => (
                <Badge
                  key={dev.id}
                  variant={formData.devIds.includes(dev.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleDev(dev.id)}
                >
                  {dev.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Conquistas */}
          <div className="space-y-2">
            <Label>Conquistas</Label>
            <div className="flex gap-2">
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Adicionar conquista..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              />
              <Button type="button" onClick={addAchievement} size="sm">
                Adicionar
              </Button>
            </div>
            {formData.achievements.length > 0 && (
              <div className="space-y-1 mt-2">
                {formData.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded">
                    <span className="flex-1">{achievement}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(idx)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Entraves */}
          <div className="space-y-2">
            <Label>Entraves / Blockers</Label>
            <div className="flex gap-2">
              <Input
                value={newBlocker}
                onChange={(e) => setNewBlocker(e.target.value)}
                placeholder="Adicionar entrave..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBlocker())}
              />
              <Button type="button" onClick={addBlocker} size="sm">
                Adicionar
              </Button>
            </div>
            {formData.blockers.length > 0 && (
              <div className="space-y-1 mt-2">
                {formData.blockers.map((blocker, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm bg-red-50 p-2 rounded">
                    <span className="flex-1">{blocker.text}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBlocker(idx)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {task ? 'Salvar Alterações' : 'Criar Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
