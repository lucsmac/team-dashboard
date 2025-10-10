import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';

/**
 * Distribuição do time por projetos/tarefas
 */
export const TeamDistribution = () => {
  const { dashboardData } = useDashboardData();

  // Agrupa devs por projeto atual (thisWeek)
  const projectGroups = dashboardData.devs.reduce((acc, dev) => {
    const project = dev.thisWeek;
    if (!acc[project]) {
      acc[project] = [];
    }
    acc[project].push(dev);
    return {};
  }, {});

  // Conta ocorrências de cada projeto
  const projectCounts = dashboardData.devs.reduce((acc, dev) => {
    const project = dev.thisWeek;
    acc[project] = (acc[project] || 0) + 1;
    return acc;
  }, {});

  const projectList = Object.entries(projectCounts)
    .sort((a, b) => b[1] - a[1]) // Ordena por quantidade decrescente
    .slice(0, 5); // Top 5 projetos

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição do Time</CardTitle>
        <CardDescription>Alocação atual por projeto</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projectList.map(([project, count]) => {
            const percentage = Math.round((count / dashboardData.devs.length) * 100);
            return (
              <div key={project} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{count} devs</Badge>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {projectList.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma alocação registrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
