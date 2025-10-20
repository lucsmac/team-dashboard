import { MetricsCards } from '../overview/MetricsCards';
import { TeamDistribution } from '../overview/TeamDistribution';
import { UpcomingDeliveries } from '../overview/UpcomingDeliveries';
import { RecentHighlights } from '../overview/RecentHighlights';
import { AllocationOverview } from '../overview/AllocationOverview';
import { WeeklyTimeline } from '../timeline/WeeklyTimeline';
import { Separator } from '@/components/ui/separator';

/**
 * Página de visão geral / resumo executivo
 */
export const OverviewPage = () => {
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
