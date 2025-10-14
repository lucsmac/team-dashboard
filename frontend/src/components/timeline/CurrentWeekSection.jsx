import { Zap, AlertTriangle, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TaskCard } from './TaskCard';
import { EmptyTaskPlaceholder } from './EmptyTaskPlaceholder';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const CurrentWeekSection = ({ data }) => {
  const { startDate, endDate, tasks = [], alerts = [] } = data || {};

  // Usar datas padrão se não fornecidas (semana atual)
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  const effectiveStartDate = startDate || sunday.toISOString();
  const effectiveEndDate = endDate || saturday.toISOString();

  const periodText = `${format(new Date(effectiveStartDate), 'd MMM', { locale: ptBR })} - ${format(new Date(effectiveEndDate), 'd MMM', { locale: ptBR })}`;

  const ongoingCount = tasks.filter(t => t.status === 'em-andamento').length;
  const highPriorityCount = tasks.filter(t => t.demand?.priority === 'alta').length;
  // Extract dev IDs from assignedDevs relationship objects
  // assignedDevs pode ser um array de { dev: Dev, devId: number } ou apenas IDs
  const allDevIds = tasks.flatMap(t => {
    if (!t.assignedDevs || t.assignedDevs.length === 0) return [];

    return t.assignedDevs.map(a => {
      // Se tiver o objeto dev, usa o ID dele
      if (a.dev && a.dev.id) return a.dev.id;
      // Se não, tenta pegar o devId ou o próprio valor (caso seja só um número)
      return a.devId || a;
    });
  }).filter(Boolean);
  const uniqueDevs = [...new Set(allDevIds)].length;

  // Separa tasks 4DX das demais
  const tasks4DX = tasks.filter(t => t.demand?.category === '4DX');
  const otherTasks = tasks.filter(t => t.demand?.category !== '4DX');

  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      const priorityOrder = { 'alta': 0, 'média': 1, 'baixa': 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.progress - b.progress;
    });
  };

  const sorted4DXTasks = sortTasks(tasks4DX);
  const sortedOtherTasks = sortTasks(otherTasks);

  return (
    <Card className="relative border-2 shadow-xl rounded-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-foreground" />

      <CardHeader className="pb-5 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-foreground rounded-lg">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <span className="text-foreground">
                Semana atual
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
        <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 bg-muted rounded-lg">
              <Zap className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{ongoingCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Em andamento</div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">{highPriorityCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Alta prioridade</div>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{uniqueDevs}</div>
              <div className="text-xs text-muted-foreground font-medium">Devs focados</div>
            </div>
          </div>
        </div>

        {alerts && alerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              Alertas da semana
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

        <div className="space-y-6">
          <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
            <span className="text-lg">🎯</span>
            Prioridades da semana
          </h4>

          {tasks.length === 0 ? (
            <EmptyTaskPlaceholder
              count={3}
              message="Nenhuma tarefa em andamento"
            />
          ) : (
            <div className="space-y-6">
              {/* Tasks 4DX - Seção destacada */}
              {sorted4DXTasks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                        4DX - Foco Estratégico
                      </span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                  </div>
                  <div className="space-y-4 pl-1 border-l-2 border-blue-500/30">
                    {sorted4DXTasks.map((task) => (
                      <div key={task.id} className="ml-3">
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks regulares */}
              {sortedOtherTasks.length > 0 && (
                <div className="space-y-3">
                  {sorted4DXTasks.length > 0 && (
                    <div className="flex items-center gap-2 pb-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-muted to-transparent"></div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">
                        Outras Demandas
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-l from-muted to-transparent"></div>
                    </div>
                  )}
                  <div className="space-y-4">
                    {sortedOtherTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-muted/30 p-5 rounded-lg border">
          <h4 className="text-sm font-bold flex items-center gap-2 text-foreground mb-4">
            <div className="p-1.5 bg-muted rounded-lg">
              <Users className="h-4 w-4 text-foreground" />
            </div>
            Resumo de alocação
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
