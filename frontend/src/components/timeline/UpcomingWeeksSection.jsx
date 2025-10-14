import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmptyTaskPlaceholder } from './EmptyTaskPlaceholder';
import { useDashboardData } from '@/hooks/useDashboardData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Seção das próximas semanas com preview de tarefas planejadas
 */
export const UpcomingWeeksSection = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { dashboardData } = useDashboardData();

  const { startDate, endDate, plannedTasks = [], notes } = data || {};

  // Usar datas padrão se não fornecidas (próxima semana)
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() - now.getDay() + 7);
  const nextSaturday = new Date(nextSunday);
  nextSaturday.setDate(nextSunday.getDate() + 6);

  const effectiveStartDate = startDate || nextSunday.toISOString();
  const effectiveEndDate = endDate || nextSaturday.toISOString();

  // Formata período
  const periodText = `${format(new Date(effectiveStartDate), 'd MMM', { locale: ptBR })} - ${format(new Date(effectiveEndDate), 'd MMM', { locale: ptBR })}`;

  // Contadores
  const totalTasks = plannedTasks.length;
  const highPriorityCount = plannedTasks.filter(t => t.priority === 'alta').length;

  // Primeiras 3 tarefas para preview
  const previewTasks = plannedTasks.slice(0, 3);

  // Busca info dos devs pelo ID
  const getDevInfo = (devId) => {
    return dashboardData.devs.find(d => d.id === devId);
  };

  // Iniciais do dev para avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const priorityLabels = {
    'alta': '🔴',
    'média': '🟡',
    'baixa': '🟢'
  };

  return (
    <Card className="relative border opacity-70 hover:opacity-100 transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden">
      {/* Accent top border - neutro */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-base font-bold flex items-center gap-2.5">
              <div className="p-1.5 bg-muted rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-foreground">Próxima Semana</span>
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-11">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-medium">{periodText}</span>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1 rounded-full font-medium">
            Planejada
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Estatísticas rápidas - neutro */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2.5 bg-muted rounded-lg">
              <Calendar className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{totalTasks}</div>
              <div className="text-xs text-muted-foreground font-medium">Tarefas</div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2.5 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-700" />
            </div>
            <div>
              <div className="text-xl font-bold text-red-700">{highPriorityCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Alta prioridade</div>
            </div>
          </div>
        </div>

        {/* Preview de tarefas */}
        {!isExpanded && (
          <>
            {previewTasks.length > 0 ? (
              <div className="space-y-2">
                {previewTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm bg-muted/20 p-3 rounded-lg border hover:border-foreground/20 transition-colors">
                    <span className="text-base">{priorityLabels[task.priority]}</span>
                    <span className="flex-1 font-medium text-foreground">
                      {task.title}
                      {task.demand?.title && (
                        <span className="font-normal text-muted-foreground ml-1">
                          ({task.demand.title})
                        </span>
                      )}
                    </span>
                    {task.assignedDevs && task.assignedDevs.length > 0 && (
                      <div className="flex -space-x-2">
                        {task.assignedDevs.slice(0, 2).map((assignment, devIdx) => {
                          // Extract dev from relationship object
                          const dev = assignment.dev || getDevInfo(assignment.devId);
                          if (!dev) return null;
                          return (
                            <Avatar key={devIdx} className="h-6 w-6 border-2 border-white ring-1 ring-border/50">
                              <AvatarFallback className={`text-[9px] font-semibold ${dev.color}`}>
                                {getInitials(dev.name)}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                        {task.assignedDevs.length > 2 && (
                          <Avatar className="h-6 w-6 border-2 border-white ring-1 ring-border/50">
                            <AvatarFallback className="text-[9px] bg-gradient-to-br from-gray-100 to-gray-200 font-semibold">
                              +{task.assignedDevs.length - 2}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {totalTasks > 3 && (
                  <p className="text-xs text-muted-foreground text-center font-medium pt-1">
                    +{totalTasks - 3} tarefa(s) planejada(s)
                  </p>
                )}
              </div>
            ) : (
              <EmptyTaskPlaceholder
                count={2}
                message="Nenhuma tarefa planejada"
                compact
              />
            )}
          </>
        )}

        {/* Conteúdo expandido */}
        {isExpanded && (
          <div className="space-y-4 pt-3 border-t">
            {/* Todas as tarefas */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <span className="text-lg">📋</span>
                Tarefas Planejadas
              </h4>
              {plannedTasks.length > 0 ? (
                <>
                  {plannedTasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm bg-muted/20 p-4 rounded-lg border">
                      <span className="text-base">{priorityLabels[task.priority]}</span>
                      <div className="flex-1 space-y-2">
                        <div className="font-semibold text-foreground">
                          {task.title}
                          {task.demand?.title && (
                            <span className="font-normal text-muted-foreground ml-1">
                              ({task.demand.title})
                            </span>
                          )}
                        </div>
                        {task.category && (
                          <Badge variant="outline" className="text-xs rounded-full font-medium">
                            {task.category}
                          </Badge>
                        )}
                      </div>
                      {task.assignedDevs && task.assignedDevs.length > 0 && (
                        <div className="flex -space-x-2">
                          {task.assignedDevs.slice(0, 3).map((assignment, devIdx) => {
                            // Extract dev from relationship object
                            const dev = assignment.dev || getDevInfo(assignment.devId);
                            if (!dev) return null;
                            return (
                              <Avatar key={devIdx} className="h-7 w-7 border-2 border-white ring-1 ring-border/50">
                                <AvatarFallback className={`text-xs font-semibold ${dev.color}`}>
                                  {getInitials(dev.name)}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <EmptyTaskPlaceholder
                  count={3}
                  message="Nenhuma tarefa planejada"
                  compact
                />
              )}
            </div>

            {/* Notas de preparação */}
            {notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  Preparação
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg border italic leading-relaxed">
                  "{notes}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botão expandir/colapsar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full hover:bg-muted/30 rounded-lg"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Ver detalhes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
