import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getPriorityColor } from '@/utils/colorUtils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Card de tarefa na timeline com prioridade, progresso e devs
 */
export const TaskCard = ({ task }) => {
  const { dashboardData } = useDashboardData();

  // Calcula cor do progress bar baseado no progresso
  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Formata deadline relativo
  const getDeadlineText = (deadline) => {
    if (!deadline) return null;
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const isOverdue = deadlineDate < now;
      const distance = formatDistanceToNow(deadlineDate, {
        addSuffix: true,
        locale: ptBR
      });

      return {
        text: distance,
        isOverdue,
        isSoon: !isOverdue && deadlineDate - now < 24 * 60 * 60 * 1000 // menos de 24h
      };
    } catch (e) {
      return null;
    }
  };

  const deadlineInfo = getDeadlineText(task.deadline);

  // Busca info dos devs
  const devInfos = task.assignedDevs
    .map(devName => dashboardData.devs.find(d => d.name === devName))
    .filter(Boolean);

  // Iniciais do dev para avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const priorityColors = {
    'alta': 'bg-red-500',
    'média': 'bg-yellow-500',
    'baixa': 'bg-green-500'
  };

  const priorityLabels = {
    'alta': '🔴 Alta',
    'média': '🟡 Média',
    'baixa': '🟢 Baixa'
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: `var(--${task.priority === 'alta' ? 'destructive' : task.priority === 'média' ? 'warning' : 'success'})` }}>
      <CardContent className="p-4 space-y-3">
        {/* Header com título e prioridade */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm flex-1">{task.title}</h4>
          <Badge
            variant={task.priority === 'alta' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {priorityLabels[task.priority]}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span className="font-medium">{task.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getProgressColor(task.progress)}`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>

        {/* Devs alocados */}
        {devInfos.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {devInfos.slice(0, 3).map((dev) => (
                <Avatar key={dev.id} className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className={`text-xs ${dev.color}`}>
                    {getInitials(dev.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {devInfos.length > 3 && (
                <Avatar className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className="text-xs bg-muted">
                    +{devInfos.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {devInfos.length === 1 ? devInfos[0].name : `${devInfos.length} devs`}
            </span>
          </div>
        )}

        {/* Deadline */}
        {deadlineInfo && (
          <div className={`flex items-center gap-1 text-xs ${
            deadlineInfo.isOverdue
              ? 'text-red-600'
              : deadlineInfo.isSoon
                ? 'text-yellow-600'
                : 'text-muted-foreground'
          }`}>
            <Clock className="h-3 w-3" />
            <span>{deadlineInfo.text}</span>
            {deadlineInfo.isSoon && <span className="font-medium">(urgente!)</span>}
          </div>
        )}

        {/* Blockers */}
        {task.blockers && task.blockers.length > 0 && (
          <div className="flex items-start gap-1 text-xs text-red-600 bg-red-50 p-2 rounded">
            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{task.blockers[0]}</span>
          </div>
        )}

        {/* Highlights principais */}
        {task.highlights && task.highlights.length > 0 && (
          <div className="flex items-start gap-1 text-xs text-blue-600 bg-blue-50 p-2 rounded">
            <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{task.highlights[0]}</span>
          </div>
        )}

        {/* Badge de categoria */}
        <Badge variant="outline" className="text-xs">
          {task.category}
        </Badge>
      </CardContent>
    </Card>
  );
};
