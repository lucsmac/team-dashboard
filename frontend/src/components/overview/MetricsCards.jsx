import { Users, TrendingUp, AlertCircle, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';

/**
 * Cards de métricas principais do dashboard
 */
export const MetricsCards = () => {
  const {
    dashboardData,
    getActiveDemandsCount,
    getPlannedDemandsCount,
    getBlockersCount,
    getAchievementsCount
  } = useDashboardData();

  // Conta devs únicos alocados nas tasks da semana atual
  const currentWeekTasks = dashboardData.timeline?.currentWeek?.tasks || [];
  const focusedDevIds = new Set(
    currentWeekTasks.flatMap(task =>
      (task.assignedDevs || [])
        .map(assignment => assignment.dev?.id)
        .filter(Boolean)
    )
  );
  const activeDevs = focusedDevIds.size;
  const totalDevs = dashboardData.devs?.length || 0;
  const utilization = totalDevs > 0 ? Math.round((activeDevs / totalDevs) * 100) : 0;

  const metrics = [
    {
      title: 'Devs focados',
      value: `${activeDevs}/${totalDevs}`,
      subtitle: `${utilization}% utilização`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-muted/50'
    },
    {
      title: 'Demandas ativas',
      value: getActiveDemandsCount(),
      subtitle: `${getPlannedDemandsCount()} planejadas`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-muted/50'
    },
    {
      title: 'Entraves',
      value: getBlockersCount(),
      subtitle: 'requerem atenção',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-muted/50'
    },
    {
      title: 'Conquistas',
      value: getAchievementsCount(),
      subtitle: 'esta semana',
      icon: Award,
      color: 'text-foreground',
      bgColor: 'bg-muted/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
