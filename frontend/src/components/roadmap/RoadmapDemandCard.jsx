import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, CheckCircle2, Clock, Calendar, User } from 'lucide-react';
import { PriorityIndicator } from '../common/StatusIndicator';
import { useDashboardData } from '@/hooks/useDashboardData';

/**
 * Card de demanda para o roadmap com expansão de tasks
 */
export const RoadmapDemandCard = ({ demand, compact = false }) => {
  const { dashboardData } = useDashboardData();
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    'concluido': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Concluído' },
    'em-andamento': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Em Andamento' },
    'planejado': { icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Planejado' }
  };

  const status = demand.computedStatus || demand.status || 'planejado';
  const StatusIcon = statusConfig[status]?.icon || Calendar;
  const tasks = demand.tasks || [];
  const progress = Math.round((demand.progress || 0) * 100);

  // Formatar datas das tasks
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <Card className={`${statusConfig[status]?.bg} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <PriorityIndicator priority={demand.priority} size="sm" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight line-clamp-2">{demand.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {demand.category}
                </Badge>
                <Badge variant="secondary" className={`text-xs ${statusConfig[status]?.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[status]?.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Progress bar */}
        {status !== 'planejado' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Desenvolvedores */}
        {demand.assignedDevs?.length > 0 && (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {demand.assignedDevs.slice(0, 3).map((devName, idx) => {
                const dev = dashboardData.devs.find(d => d.name === devName);
                return (
                  <Badge key={idx} variant="secondary" className={`text-xs ${dev?.color || ''}`}>
                    {devName}
                  </Badge>
                );
              })}
              {demand.assignedDevs.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{demand.assignedDevs.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tasks vinculadas */}
        {tasks.length > 0 && (
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full h-8 justify-between px-2 text-xs"
            >
              <span className="font-medium">
                {tasks.length} {tasks.length === 1 ? 'task vinculada' : 'tasks vinculadas'}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </Button>

            {isExpanded && (
              <div className="mt-2 space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="text-xs p-2 rounded bg-background/50 border space-y-1"
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(task.weekStart)} - {formatDate(task.weekEnd)}
                      </span>
                    </div>
                    {task.assignedDevs?.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {task.assignedDevs.map((assignment, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {assignment.dev?.name || 'Dev'}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {task.progress !== undefined && (
                      <Progress value={task.progress} className="h-1" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
