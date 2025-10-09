import { MetricsCards } from '../overview/MetricsCards';
import { TeamDistribution } from '../overview/TeamDistribution';
import { UpcomingDeliveries } from '../overview/UpcomingDeliveries';
import { RecentHighlights } from '../overview/RecentHighlights';
import { WeeklyTimeline } from '../timeline/WeeklyTimeline';
import { Separator } from '@/components/ui/separator';

/**
 * Aba de visão geral / resumo executivo
 */
export const OverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <MetricsCards />

      {/* Timeline semanal - NOVO */}
      <WeeklyTimeline />

      <Separator className="my-8" />

      {/* Grid com 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamDistribution />
        <UpcomingDeliveries />
      </div>

      {/* Highlights recentes */}
      <RecentHighlights />
    </div>
  );
};
