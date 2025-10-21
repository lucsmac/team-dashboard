import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MetricsCards } from '../overview/MetricsCards';
import { TeamDistribution } from '../overview/TeamDistribution';
import { UpcomingDeliveries } from '../overview/UpcomingDeliveries';
import { RecentHighlights } from '../overview/RecentHighlights';
import { AllocationOverview } from '../overview/AllocationOverview';
import { RecentCompletedDemands } from '../overview/RecentCompletedDemands';
import { WeeklyTimeline } from '../timeline/WeeklyTimeline';
import { Separator } from '@/components/ui/separator';
import { useDashboard } from '@/context/DashboardContext';
import { WeeklyCompletionChart } from '../charts/WeeklyCompletionChart';
import { TasksByStatusChart } from '../charts/TasksByStatusChart';
import { TasksByCategoryChart } from '../charts/TasksByCategoryChart';
import { TasksByDeveloperChart } from '../charts/TasksByDeveloperChart';
import { useChartData } from '@/hooks/useChartData';

/**
 * Página de visão geral / resumo executivo
 */
export const OverviewPage = () => {
  const location = useLocation();
  const { loadTimeline } = useDashboard();
  const {
    weeklyCompletionData,
    tasksByStatusData,
    tasksByCategoryData,
    tasksByDeveloperData
  } = useChartData();

  useEffect(() => {
    // Recarregar timeline quando entrar na aba overview
    if (location.pathname === '/overview' || location.pathname === '/') {
      loadTimeline();
    }
  }, [location.pathname, loadTimeline]);

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <MetricsCards />

      {/* Grid com Distribuição do Time e Alocações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamDistribution />
        <AllocationOverview />
      </div>

      <Separator className="my-8" />

      {/* Gráficos de análise */}
      <div className="space-y-6">
        {/* Gráfico de linha de conclusão */}
        <WeeklyCompletionChart data={weeklyCompletionData} />

        {/* Grid com 2 gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TasksByStatusChart data={tasksByStatusData} />
          <TasksByCategoryChart data={tasksByCategoryData} />
        </div>

        {/* Gráfico de tarefas por desenvolvedor */}
        <TasksByDeveloperChart data={tasksByDeveloperData} />
      </div>

      <Separator className="my-8" />

      {/* Timeline semanal */}
      <WeeklyTimeline />

      <Separator className="my-8" />

      {/* Demandas entregues nos últimos 7 dias */}
      <RecentCompletedDemands />

      {/* Próximas entregas */}
      <UpcomingDeliveries />

      {/* Highlights recentes */}
      <RecentHighlights />
    </div>
  );
};
