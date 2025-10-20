import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MetricsCards } from '../overview/MetricsCards';
import { TeamDistribution } from '../overview/TeamDistribution';
import { UpcomingDeliveries } from '../overview/UpcomingDeliveries';
import { RecentHighlights } from '../overview/RecentHighlights';
import { AllocationOverview } from '../overview/AllocationOverview';
import { WeeklyTimeline } from '../timeline/WeeklyTimeline';
import { Separator } from '@/components/ui/separator';
import { useDashboard } from '@/context/DashboardContext';

/**
 * Página de visão geral / resumo executivo
 */
export const OverviewPage = () => {
  const location = useLocation();
  const { loadTimeline } = useDashboard();

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

      {/* Timeline semanal */}
      <WeeklyTimeline />

      <Separator className="my-8" />

      {/* Próximas entregas */}
      <UpcomingDeliveries />

      {/* Highlights recentes */}
      <RecentHighlights />
    </div>
  );
};
