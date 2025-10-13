import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TimelineTaskDialog } from './TimelineTaskDialog';
import { api } from '@/services/api';

/**
 * Componente para gerenciar timeline tasks de uma demanda
 */
export const TimelineTaskManager = ({ demandId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [demandId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await api.getTimeline();

      // Filtrar tasks desta demanda
      const demandTasks = Object.values(allTasks)
        .flat()
        .filter(task => task.demandId === demandId);

      setTasks(demandTasks);
    } catch (error) {
      console.error('Error loading timeline tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta task?')) {
      return;
    }

    try {
      await api.deleteTimelineTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Erro ao excluir task');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingTask) {
        // Atualizar task existente
        await api.updateTimelineTask(editingTask.id, formData);
      } else {
        // Criar nova task
        await api.createTimelineTask(formData);
      }

      await loadTasks();
      setIsDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Erro ao salvar task');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'nao-iniciada': { label: 'Não Iniciada', variant: 'secondary' },
      'em-andamento': { label: 'Em Andamento', variant: 'default' },
      'concluida': { label: 'Concluída', variant: 'outline' }
    };

    const config = statusConfig[status] || statusConfig['nao-iniciada'];
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  const getWeekTypeLabel = (weekType) => {
    const labels = {
      'previous': 'Semana Anterior',
      'current': 'Semana Atual',
      'upcoming': 'Próximas Semanas'
    };
    return labels[weekType] || weekType;
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        Carregando tasks...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Timeline Tasks ({tasks.length})
        </h4>
        <Button
          size="sm"
          onClick={handleCreate}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Nova Task
        </Button>
      </div>

      {/* Lista de tasks */}
      {tasks.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded">
          Nenhuma task criada para esta demanda
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 border rounded-lg bg-card hover:shadow-sm transition-shadow space-y-2"
            >
              {/* Header da task */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium truncate">{task.title}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(task.status)}
                    <Badge variant="outline" className="text-xs">
                      {getWeekTypeLabel(task.weekType)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(task)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Devs */}
              {task.assignedDevs && task.assignedDevs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.assignedDevs.map((assignment) => (
                    <Badge key={assignment.id} variant="secondary" className="text-xs">
                      {assignment.dev.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Conquistas e Entraves */}
              <div className="space-y-1">
                {task.highlights?.filter(h => h.type === 'conquista').slice(0, 2).map((h) => (
                  <div key={h.id} className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{h.text}</span>
                  </div>
                ))}
                {task.highlights?.filter(h => h.type === 'entrave').slice(0, 2).map((h) => (
                  <div key={h.id} className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-2 rounded">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog de criação/edição */}
      <TimelineTaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        task={editingTask}
        demandId={demandId}
      />
    </div>
  );
};
