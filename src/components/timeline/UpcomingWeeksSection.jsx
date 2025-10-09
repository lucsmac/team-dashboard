import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDashboardData } from '@/hooks/useDashboardData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Seção das próximas semanas com preview de tarefas planejadas
 */
export const UpcomingWeeksSection = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { dashboardData } = useDashboardData();

  const { startDate, endDate, plannedTasks, notes } = data;

  // Formata período
  const periodText = `${format(new Date(startDate), 'd MMM', { locale: ptBR })} - ${format(new Date(endDate), 'd MMM', { locale: ptBR })}`;

  // Contadores
  const totalTasks = plannedTasks.length;
  const highPriorityCount = plannedTasks.filter(t => t.priority === 'alta').length;

  // Primeiras 3 tarefas para preview
  const previewTasks = plannedTasks.slice(0, 3);

  // Busca info dos devs
  const getDevInfo = (devName) => {
    return dashboardData.devs.find(d => d.name === devName);
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
    <Card className="bg-gray-50/30 border-gray-200 opacity-70 hover:opacity-100 transition-opacity">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              Próxima Semana
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{periodText}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
            Planejada
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-2 rounded-lg border text-center">
            <div className="text-lg font-bold text-gray-600">{totalTasks}</div>
            <div className="text-xs text-muted-foreground">Tarefas</div>
          </div>
          <div className="bg-white p-2 rounded-lg border text-center">
            <div className="text-lg font-bold text-red-600">{highPriorityCount}</div>
            <div className="text-xs text-muted-foreground">Alta Prioridade</div>
          </div>
        </div>

        {/* Preview de tarefas */}
        {!isExpanded && previewTasks.length > 0 && (
          <div className="space-y-2">
            {previewTasks.map((task, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm bg-white p-2 rounded border">
                <span>{priorityLabels[task.priority]}</span>
                <span className="flex-1">{task.title}</span>
                {task.assignedDevs && task.assignedDevs.length > 0 && (
                  <div className="flex -space-x-1">
                    {task.assignedDevs.slice(0, 2).map((devName, devIdx) => {
                      const dev = getDevInfo(devName);
                      if (!dev) return null;
                      return (
                        <Avatar key={devIdx} className="h-5 w-5 border border-background">
                          <AvatarFallback className={`text-[8px] ${dev.color}`}>
                            {getInitials(dev.name)}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {task.assignedDevs.length > 2 && (
                      <Avatar className="h-5 w-5 border border-background">
                        <AvatarFallback className="text-[8px] bg-muted">
                          +{task.assignedDevs.length - 2}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}
              </div>
            ))}
            {totalTasks > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{totalTasks - 3} tarefa(s) planejada(s)
              </p>
            )}
          </div>
        )}

        {/* Conteúdo expandido */}
        {isExpanded && (
          <div className="space-y-3 pt-2 border-t">
            {/* Todas as tarefas */}
            {plannedTasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">📋 Tarefas Planejadas</h4>
                {plannedTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm bg-white p-3 rounded border">
                    <span>{priorityLabels[task.priority]}</span>
                    <div className="flex-1 space-y-1">
                      <div className="font-medium">{task.title}</div>
                      {task.category && (
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                      )}
                    </div>
                    {task.assignedDevs && task.assignedDevs.length > 0 && (
                      <div className="flex -space-x-1">
                        {task.assignedDevs.slice(0, 3).map((devName, devIdx) => {
                          const dev = getDevInfo(devName);
                          if (!dev) return null;
                          return (
                            <Avatar key={devIdx} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className={`text-xs ${dev.color}`}>
                                {getInitials(dev.name)}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Notas de preparação */}
            {notes && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium">📝 Preparação</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded italic">
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
          className="w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Ver detalhes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
