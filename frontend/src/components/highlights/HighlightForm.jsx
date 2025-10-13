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
import { Textarea } from '@/components/ui/textarea';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function HighlightForm({ highlight, highlightType, isOpen, onClose, onSave }) {
  const { dashboardData } = useDashboardData();
  const [formData, setFormData] = useState({
    text: '',
    severity: 'media', // Para blockers
    type: 'info', // Para important
    achievementDate: '', // Para achievements
    demandId: '', // Para achievements
    timelineTaskId: '' // Para associar a task da timeline
  });
  const [timelineTasks, setTimelineTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar timeline tasks quando o diálogo abre
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/timeline')
        .then(res => res.json())
        .then(data => {
          // API retorna objeto com current, previous, upcoming
          // Combinar todas as tasks em um único array
          const allTasks = [
            ...(data.current || []),
            ...(data.previous || []),
            ...(data.upcoming || [])
          ];
          setTimelineTasks(allTasks);
        })
        .catch(err => console.error('Erro ao buscar tasks:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (highlight) {
      setFormData({
        text: highlight.text || '',
        severity: highlight.severity || 'media',
        type: highlight.type || 'info',
        achievementDate: highlight.achievementDate
          ? new Date(highlight.achievementDate).toISOString().split('T')[0]
          : '',
        demandId: highlight.demandId || '',
        timelineTaskId: highlight.timelineTaskId || ''
      });
    } else {
      setFormData({
        text: '',
        severity: 'media',
        type: 'info',
        achievementDate: '',
        demandId: '',
        timelineTaskId: ''
      });
    }
    setError(null);
  }, [highlight, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
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

  const getTitle = () => {
    if (highlight) return 'Editar Item';

    switch(highlightType) {
      case 'blockers':
        return 'Novo Entrave';
      case 'achievements':
        return 'Nova Conquista';
      case 'important':
        return 'Nova Informação';
      default:
        return 'Novo Item';
    }
  };

  const getDescription = () => {
    if (highlight) return 'Atualize as informações do item.';

    switch(highlightType) {
      case 'blockers':
        return 'Adicione um novo entrave ou bloqueador ao dashboard.';
      case 'achievements':
        return 'Registre uma nova conquista ou achievement.';
      case 'important':
        return 'Adicione uma informação importante.';
      default:
        return 'Adicione um novo item.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="text">Texto *</Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder={
                highlightType === 'blockers'
                  ? 'Ex: Aguardando aprovação do cliente...'
                  : highlightType === 'achievements'
                  ? 'Ex: Deploy realizado com sucesso!'
                  : 'Ex: Reunião agendada para sexta-feira...'
              }
              rows={4}
              required
            />
          </div>

          {highlightType === 'blockers' && (
            <div className="space-y-2">
              <Label htmlFor="severity">Severidade *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => handleChange('severity', value)}
                required
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Selecione a severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {highlightType === 'important' && (
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
                required
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Informação</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {highlightType === 'achievements' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="achievementDate">Data da Conquista</Label>
                <Input
                  id="achievementDate"
                  type="date"
                  value={formData.achievementDate}
                  onChange={(e) => handleChange('achievementDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demandId">Demanda Relacionada</Label>
                <Select
                  value={formData.demandId || undefined}
                  onValueChange={(value) => handleChange('demandId', value)}
                >
                  <SelectTrigger id="demandId">
                    <SelectValue placeholder="Selecione uma demanda (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(dashboardData.demands).map(([category, demands]) =>
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
            </>
          )}

          {/* Task da Timeline (para todos os tipos) */}
          <div className="space-y-2">
            <Label htmlFor="timelineTaskId">Task da Timeline (opcional)</Label>
            <Select
              value={formData.timelineTaskId || undefined}
              onValueChange={(value) => handleChange('timelineTaskId', value)}
            >
              <SelectTrigger id="timelineTaskId">
                <SelectValue placeholder="Associar a uma task da timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelineTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title} ({new Date(task.weekStart).toLocaleDateString('pt-BR')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.timelineTaskId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleChange('timelineTaskId', '')}
                className="text-xs text-muted-foreground"
              >
                Limpar seleção
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Se não associar a uma task, será exibido na semana baseado na data de criação
            </p>
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
              {loading ? 'Salvando...' : (highlight ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
