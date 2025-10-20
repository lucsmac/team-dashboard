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

      {/* Timeline semanal - NOVO */}
      <WeeklyTimeline />

      <Separator className="my-8" />

      {/* Grid com 3 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TeamDistribution />
        <UpcomingDeliveries />
        <AllocationOverview />
      </div>

      {/* Highlights recentes */}
      <RecentHighlights />
    </div>
  );
};
