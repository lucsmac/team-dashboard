import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Lista de próximas entregas vindas da timeline
 */
export const UpcomingDeliveries = () => {
  const { dashboardData } = useDashboardData();

  // Pegar tasks planejadas das próximas semanas
  const upcomingTasks = dashboardData.timeline?.upcomingWeeks?.[0]?.plannedTasks || [];

  // Ordenar por prioridade e pegar as top 5
  const sortedTasks = [...upcomingTasks]
    .sort((a, b) => {
      const priorityOrder = { 'alta': 0, 'media': 1, 'baixa': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas entregas</CardTitle>
        <CardDescription>Tarefas planejadas para as próximas semanas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma tarefa planejada</p>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <div key={task.id} className="space-y-2 pb-3 border-b last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {task.title}
                        {task.demand?.title && (
                          <span className="font-normal text-muted-foreground ml-1">
                            ({task.demand.title})
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {task.demand?.category && (
                          <Badge variant="outline" className="text-xs">
                            {task.demand.category}
                          </Badge>
                        )}
                        {task.priority && (
                          <Badge
                            variant={task.priority === 'alta' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {task.priority === 'alta' ? '🔴 Alta' :
                              task.priority === 'media' ? '🟡 Média' : '🟢 Baixa'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Devs alocados */}
                {task.assignedDevs && task.assignedDevs.length > 0 && (
                  <div className="ml-6 text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="font-medium">Devs:</span>
                    <span>
                      {task.assignedDevs.map(a => a.dev?.name).filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {/* Data de início */}
                {task.weekStart && (
                  <div className="ml-6 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>Início: {format(new Date(task.weekStart), 'd MMM', { locale: ptBR })}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
