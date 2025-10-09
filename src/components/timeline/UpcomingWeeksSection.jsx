import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock, AlertTriangle } from 'lucide-react';
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
    <Card className="relative bg-gradient-to-br from-gray-50/20 via-white to-slate-50/30 backdrop-blur-sm border border-gray-200/60 opacity-60 hover:opacity-100 transition-all duration-300 hover:shadow-lg rounded-2xl overflow-hidden hover:scale-[1] scale-[0.99]">
      {/* Accent gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-base font-bold flex items-center gap-2.5">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-foreground">Próxima Semana</span>
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-11">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-medium">{periodText}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300 px-3 py-1 rounded-full font-semibold">
            Planejada
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Estatísticas rápidas */}
        <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl shadow-sm">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{totalTasks}</div>
              <div className="text-xs text-muted-foreground font-medium">Tarefas</div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2.5 bg-gradient-to-br from-red-400 to-red-500 rounded-xl shadow-sm">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{highPriorityCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Alta Prioridade</div>
            </div>
          </div>
        </div>

        {/* Preview de tarefas */}
        {!isExpanded && previewTasks.length > 0 && (
          <div className="space-y-2">
            {previewTasks.map((task, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm bg-white/70 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <span className="text-base">{priorityLabels[task.priority]}</span>
                <span className="flex-1 font-medium text-foreground">{task.title}</span>
                {task.assignedDevs && task.assignedDevs.length > 0 && (
                  <div className="flex -space-x-2">
                    {task.assignedDevs.slice(0, 2).map((devName, devIdx) => {
                      const dev = getDevInfo(devName);
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
        )}

        {/* Conteúdo expandido */}
        {isExpanded && (
          <div className="space-y-4 pt-3 border-t border-gray-100">
            {/* Todas as tarefas */}
            {plannedTasks.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  Tarefas Planejadas
                </h4>
                {plannedTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm bg-white/70 p-4 rounded-xl border border-gray-200">
                    <span className="text-base">{priorityLabels[task.priority]}</span>
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold text-foreground">{task.title}</div>
                      {task.category && (
                        <Badge variant="outline" className="text-xs rounded-full font-medium">
                          {task.category}
                        </Badge>
                      )}
                    </div>
                    {task.assignedDevs && task.assignedDevs.length > 0 && (
                      <div className="flex -space-x-2">
                        {task.assignedDevs.slice(0, 3).map((devName, devIdx) => {
                          const dev = getDevInfo(devName);
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
              </div>
            )}

            {/* Notas de preparação */}
            {notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  Preparação
                </h4>
                <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-xl border italic leading-relaxed">
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
          className="w-full hover:bg-gray-50/50 rounded-xl"
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
