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
    <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header com título e prioridade */}
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold text-base flex-1 group-hover:text-primary transition-colors">{task.title}</h4>
          <Badge
            variant={task.priority === 'alta' ? 'destructive' : 'secondary'}
            className="text-xs rounded-full px-3 py-1 font-medium"
          >
            {priorityLabels[task.priority]}
          </Badge>
        </div>

        {/* Progress bar - tons pastéis sem gradiente */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">Progresso</span>
            <span className="font-semibold text-foreground">{task.progress}%</span>
          </div>
          <div className="relative w-full bg-secondary/30 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                task.progress >= 70
                  ? 'bg-green-300'
                  : task.progress >= 40
                    ? 'bg-yellow-300'
                    : 'bg-red-300'
              }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>

        {/* Devs alocados */}
        {devInfos.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {devInfos.slice(0, 3).map((dev) => (
                <Avatar key={dev.id} className="h-8 w-8 border-2 border-white ring-1 ring-border/50 transition-transform hover:scale-110 hover:z-10">
                  <AvatarFallback className={`text-xs font-semibold ${dev.color}`}>
                    {getInitials(dev.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {devInfos.length > 3 && (
                <Avatar className="h-8 w-8 border-2 border-white ring-1 ring-border/50">
                  <AvatarFallback className="text-xs bg-gray-100 font-semibold">
                    +{devInfos.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {devInfos.length === 1 ? devInfos[0].name : `${devInfos.length} devs`}
            </span>
          </div>
        )}

        {/* Deadline */}
        {deadlineInfo && (
          <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg ${
            deadlineInfo.isOverdue
              ? 'text-red-700 bg-red-50 border border-red-200'
              : deadlineInfo.isSoon
                ? 'text-amber-700 bg-amber-50 border border-amber-200'
                : 'text-muted-foreground bg-secondary/50'
          }`}>
            <Clock className="h-3.5 w-3.5" />
            <span>{deadlineInfo.text}</span>
            {deadlineInfo.isSoon && <span className="font-semibold">(urgente!)</span>}
          </div>
        )}

        {/* Blockers - pastel sem gradiente */}
        {task.blockers && task.blockers.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="font-medium">{task.blockers[0]}</span>
          </div>
        )}

        {/* Highlights principais - pastel sem gradiente */}
        {task.highlights && task.highlights.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="font-medium">{task.highlights[0]}</span>
          </div>
        )}

        {/* Badge de categoria */}
        <Badge variant="outline" className="text-xs rounded-full font-medium">
          {task.category}
        </Badge>
      </CardContent>
    </Card>
  );
};
