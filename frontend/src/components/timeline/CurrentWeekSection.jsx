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
    <Card className="relative border-2 shadow-xl rounded-xl overflow-hidden">
      {/* Accent top border - neutro */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-foreground" />

      <CardHeader className="pb-5 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-foreground rounded-lg">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <span className="text-foreground">
                Semana Atual
              </span>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground ml-14">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{periodText}</span>
            </div>
          </div>
          <Badge className="bg-foreground text-background px-4 py-1.5 rounded-full">
            Em Andamento
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estatísticas rápidas - neutro */}
        <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 bg-muted rounded-lg">
              <Zap className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{ongoingCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Em Andamento</div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">{highPriorityCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Alta Prioridade</div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{uniqueDevs}</div>
              <div className="text-xs text-muted-foreground font-medium">Devs Ativos</div>
            </div>
          </div>
        </div>

        {/* Alertas críticos - mantém cores de severidade */}
        {alerts && alerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              Alertas da Semana
            </h4>
            <div className="space-y-2">
              {alerts.map((alert, idx) => (
                <Alert
                  key={idx}
                  variant={alert.severity === 'alta' ? 'destructive' : 'default'}
                  className="py-3 rounded-lg border-l-4"
                >
                  <AlertDescription className="text-sm font-medium">
                    {alert.text}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Prioridades da semana */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
            <span className="text-lg">🎯</span>
            Prioridades da Semana
          </h4>
          {sortedTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 bg-secondary/30 rounded-xl">
              Nenhuma tarefa em andamento
            </p>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Resumo de alocação - neutro */}
        <div className="bg-muted/30 p-5 rounded-lg border">
          <h4 className="text-sm font-bold flex items-center gap-2 text-foreground mb-4">
            <div className="p-1.5 bg-muted rounded-lg">
              <Users className="h-4 w-4 text-foreground" />
            </div>
            Resumo de Alocação
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">Total de tarefas:</span>
              <span className="font-bold text-foreground text-base">{tasks.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">Devs alocados:</span>
              <span className="font-bold text-foreground text-base">{uniqueDevs}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
