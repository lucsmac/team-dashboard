import { Zap, AlertTriangle, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TaskCard } from './TaskCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Seção da semana atual - DESTAQUE PRINCIPAL da timeline
 */
export const CurrentWeekSection = ({ data }) => {
  const { startDate, endDate, tasks, alerts } = data;

  // Formata período
  const periodText = `${format(new Date(startDate), 'd MMM', { locale: ptBR })} - ${format(new Date(endDate), 'd MMM', { locale: ptBR })}`;

  // Contadores
  const ongoingCount = tasks.filter(t => t.status === 'em-andamento').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'alta').length;
  const uniqueDevs = [...new Set(tasks.flatMap(t => t.assignedDevs))].length;

  // Ordena tasks por prioridade (alta primeiro) e depois por progresso (menor primeiro)
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { 'alta': 0, 'média': 1, 'baixa': 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.progress - b.progress; // Menor progresso primeiro (mais urgente)
  });

  return (
    <Card className="bg-blue-50/50 border-blue-500 border-2 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              SEMANA ATUAL
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{periodText}</span>
            </div>
          </div>
          <Badge className="bg-blue-600 text-white">
            Em Andamento
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-lg border text-center">
            <div className="text-2xl font-bold text-blue-600">{ongoingCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Em Andamento</div>
          </div>
          <div className="bg-white p-3 rounded-lg border text-center">
            <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Alta Prioridade</div>
          </div>
          <div className="bg-white p-3 rounded-lg border text-center">
            <div className="text-2xl font-bold text-green-600">{uniqueDevs}</div>
            <div className="text-xs text-muted-foreground mt-1">Devs Ativos</div>
          </div>
        </div>

        {/* Alertas críticos */}
        {alerts && alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Alertas da Semana
            </h4>
            {alerts.map((alert, idx) => (
              <Alert
                key={idx}
                variant={alert.severity === 'alta' ? 'destructive' : 'default'}
                className="py-2"
              >
                <AlertDescription className="text-sm">
                  {alert.text}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Prioridades da semana */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">🎯 Prioridades da Semana</h4>
          {sortedTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma tarefa em andamento
            </p>
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Resumo de alocação */}
        <div className="bg-white p-4 rounded-lg border space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Resumo de Alocação
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Total de tarefas:</span>
              <span className="font-medium ml-2">{tasks.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Devs alocados:</span>
              <span className="font-medium ml-2">{uniqueDevs}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
