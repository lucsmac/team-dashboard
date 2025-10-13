import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';

/**
 * Distribuição do time por projetos/tarefas
 * Usa dados da timeline para agrupar desenvolvedores por task
 */
export const TeamDistribution = () => {
  const { dashboardData } = useDashboardData();

  // Agrupa tasks por categoria e conta desenvolvedores únicos
  const taskDistribution = {};

  dashboardData.timeline?.currentWeek?.tasks?.forEach(task => {
    const key = task.title;
    if (!taskDistribution[key]) {
      taskDistribution[key] = {
        category: task.category,
        devs: new Set(),
        priority: task.priority
      };
    }
    task.assignedDevs?.forEach(devName => {
      taskDistribution[key].devs.add(devName);
    });
  });

  // Converte para array e ordena por quantidade de desenvolvedores
  const taskList = Object.entries(taskDistribution)
    .map(([taskName, data]) => ({
      name: taskName,
      category: data.category,
      count: data.devs.size,
      priority: data.priority
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 tasks

  const totalDevs = dashboardData.devs.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição do Time</CardTitle>
        <CardDescription>Alocação atual por task</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {taskList.map((task) => {
            const percentage = totalDevs > 0 ? Math.round((task.count / totalDevs) * 100) : 0;
            return (
              <div key={task.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.name}</p>
                    <p className="text-xs text-muted-foreground">{task.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{task.count} devs</Badge>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      task.priority === 'alta' ? 'bg-red-500' :
                      task.priority === 'media' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {taskList.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma task com desenvolvedores alocados
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
