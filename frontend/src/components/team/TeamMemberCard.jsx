import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Code, Award, Edit2, Trash2, CheckCircle2, Clock, History, TrendingUp, XCircle } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DEV_ROLE_LABELS, SENIORITY_LABELS, DEV_ROLE_COLORS, SENIORITY_COLORS } from '@/utils/enums';
import { useMemo } from 'react';

/**
 * Card individual de desenvolvedor
 * Mostra as tasks da timeline associadas ao desenvolvedor
 */
export const TeamMemberCard = ({ dev, onEdit, onDelete }) => {
  const { dashboardData } = useDashboardData();

  // Busca tasks da semana atual onde o dev está alocado
  const currentTasks = dashboardData.timeline?.currentWeek?.tasks?.filter(
    task => task.assignedDevs?.includes(dev.name)
  ) || [];

  // Busca tasks da semana anterior onde o dev estava alocado
  const previousWeekTasks = useMemo(() => {
    // Para demonstração, vamos buscar do previousWeek se existir estrutura de tasks
    // Por enquanto retornamos array vazio, mas pode ser expandido quando houver histórico
    return [];
  }, [dashboardData.timeline]);

  // Calcula estatísticas dos últimos 30 dias (excluindo semana atual)
  const last30DaysStats = useMemo(() => {
    // TODO: Implementar quando houver histórico de tasks dos últimos 30 dias
    // Por enquanto retornamos valores de exemplo baseados no previousWeek
    const completed = dashboardData.timeline?.previousWeek?.completed || 0;
    const total = dashboardData.timeline?.previousWeek?.total || 0;
    const notCompleted = total - completed;

    return {
      completed,
      notCompleted,
      total
    };
  }, [dashboardData.timeline]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${dev.color}`}>
            {dev.name}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Semana atual
            </Badge>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(dev)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Tem certeza que deseja remover ${dev.name}?`)) {
                    onDelete(dev.id);
                  }
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="secondary"
            className={`text-xs ${DEV_ROLE_COLORS[dev.role] || 'bg-gray-100'}`}
          >
            <Code className="h-3 w-3 mr-1" />
            {DEV_ROLE_LABELS[dev.role] || dev.role}
          </Badge>
          <Badge
            variant="secondary"
            className={`text-xs ${SENIORITY_COLORS[dev.seniority] || 'bg-gray-100'}`}
          >
            <Award className="h-3 w-3 mr-1" />
            {SENIORITY_LABELS[dev.seniority] || dev.seniority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Tasks atuais */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border-l-2 border-blue-500">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-2 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Tasks atuais
          </p>
          <div className="space-y-2">
            {currentTasks.length > 0 ? (
              currentTasks.map(task => (
                <div key={task.id} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${task.priority === 'alta' ? 'border-red-500 text-red-600' :
                            task.priority === 'media' ? 'border-yellow-500 text-yellow-600' :
                              'border-green-500 text-green-600'
                          }`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">Sem tasks alocadas</p>
            )}
          </div>
        </div>

        {/* Tasks da semana passada */}
        {previousWeekTasks.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border-l-2 border-gray-400">
            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center gap-1">
              <History className="h-3 w-3" />
              Semana passada
            </p>
            <div className="space-y-1">
              {previousWeekTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-2">
                  {task.status === 'concluído' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 mt-0.5 text-orange-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{task.title}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs mt-1 ${task.status === 'concluído'
                          ? 'border-green-500 text-green-600'
                          : 'border-orange-500 text-orange-600'
                        }`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estatísticas dos últimos 30 dias */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Últimos 30 dias (exceto semana atual)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <p className="text-lg font-bold text-green-600">{last30DaysStats.completed}</p>
              </div>
              <p className="text-xs text-muted-foreground">Concluídas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <XCircle className="h-3.5 w-3.5 text-orange-500" />
                <p className="text-lg font-bold text-orange-500">{last30DaysStats.notCompleted}</p>
              </div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <p className="text-lg font-bold text-blue-600">{last30DaysStats.total}</p>
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
          {last30DaysStats.total > 0 && (
            <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Taxa de conclusão</span>
                <span className="font-semibold text-green-700 dark:text-green-300">
                  {Math.round((last30DaysStats.completed / last30DaysStats.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                <div
                  className="bg-green-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${(last30DaysStats.completed / last30DaysStats.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
