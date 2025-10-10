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
import { Badge } from '@/components/ui/badge';
import {
  DELIVERY_STAGES,
  WEEK_TYPES,
  DELIVERY_STAGE_LABELS,
  WEEK_TYPE_LABELS
} from '@/utils/enums';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function TimelineTaskForm({ task, isOpen, onClose, onSave }) {
  const { dashboardData } = useDashboardData();
  const [formData, setFormData] = useState({
    title: '',
    weekType: '',
    weekStart: '',
    assignedDevs: [],
    progress: 0,
    deliveryStage: '',
    demandId: null,
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        weekType: task.weekType || '',
        weekStart: task.weekStart || '',
        assignedDevs: task.assignedDevs || [],
        progress: task.progress || 0,
        deliveryStage: task.deliveryStage || '',
        demandId: task.demandId || null,
        deadline: task.deadline || ''
      });
    } else {
      setFormData({
        title: '',
        weekType: WEEK_TYPES.CURRENT,
        weekStart: new Date().toISOString().split('T')[0],
        assignedDevs: [],
        progress: 0,
        deliveryStage: DELIVERY_STAGES.DEV,
        demandId: null,
        deadline: ''
      });
    }
    setError(null);
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert empty string to null for demandId
      const dataToSave = {
        ...formData,
        demandId: formData.demandId === '' ? null : formData.demandId,
        progress: parseInt(formData.progress, 10)
      };
      await onSave(dataToSave);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar timeline task');
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

  const devs = dashboardData?.devs || [];
  const demands = getAllDemands();

  function getAllDemands() {
    if (!dashboardData?.demands) return [];
    const allDemands = [];
    Object.entries(dashboardData.demands).forEach(([category, categoryDemands]) => {
      if (Array.isArray(categoryDemands)) {
        allDemands.push(...categoryDemands.map(d => ({ ...d, category })));
      }
    });
    return allDemands;
  }

  const selectedDemand = demands.find(d => d.id === formData.demandId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Editar Timeline Task' : 'Nova Timeline Task'}
          </DialogTitle>
          <DialogDescription>
            {task
              ? 'Atualize as informações da timeline task.'
              : 'Adicione uma nova task à timeline.'}
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
              <Label htmlFor="weekType">Tipo de Semana *</Label>
              <Select
                value={formData.weekType}
                onValueChange={(value) => handleChange('weekType', value)}
                required
              >
                <SelectTrigger id="weekType">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WEEK_TYPES).map(type => (
                    <SelectItem key={type} value={type}>
                      {WEEK_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekStart">Data de Início *</Label>
              <Input
                id="weekStart"
                type="date"
                value={formData.weekStart}
                onChange={(e) => handleChange('weekStart', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryStage">Etapa de Entrega *</Label>
              <Select
                value={formData.deliveryStage}
                onValueChange={(value) => handleChange('deliveryStage', value)}
                required
              >
                <SelectTrigger id="deliveryStage">
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DELIVERY_STAGES).map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {DELIVERY_STAGE_LABELS[stage]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progresso (%) *</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleChange('progress', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demandId">Demanda Vinculada (opcional)</Label>
            <Select
              value={formData.demandId || ''}
              onValueChange={(value) => handleChange('demandId', value)}
            >
              <SelectTrigger id="demandId">
                <SelectValue placeholder="Sem vínculo com demanda">
                  {selectedDemand ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedDemand.category}
                      </Badge>
                      <span>{selectedDemand.title}</span>
                    </div>
                  ) : (
                    'Sem vínculo com demanda'
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem vínculo com demanda</SelectItem>
                {demands.map(demand => (
                  <SelectItem key={demand.id} value={demand.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {demand.category}
                      </Badge>
                      <span className="truncate">{demand.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDemand && (
              <p className="text-xs text-gray-500">
                Status: {selectedDemand.status} | Etapa: {selectedDemand.stage}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Desenvolvedores Alocados *</Label>
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
            {formData.assignedDevs.length === 0 && (
              <p className="text-xs text-red-500">
                Selecione pelo menos um desenvolvedor
              </p>
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
            <Button
              type="submit"
              disabled={loading || formData.assignedDevs.length === 0}
            >
              {loading ? 'Salvando...' : (task ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
