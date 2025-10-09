import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DemandCard } from '../demands/DemandCard';
import { FolderOpen } from 'lucide-react';

/**
 * Aba de demandas organizada por categoria com accordion
 */
export const DemandsTab = () => {
  const { dashboardData } = useDashboardData();

  const totalDemands = Object.values(dashboardData.demands).flat().length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalDemands} {totalDemands === 1 ? 'demanda total' : 'demandas totais'}
        </p>
      </div>

      {Object.keys(dashboardData.demands).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhuma demanda cadastrada</p>
          <p className="text-sm mt-2">As demandas aparecerão aqui quando forem criadas</p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-2" defaultValue={Object.keys(dashboardData.demands)}>
          {Object.entries(dashboardData.demands).map(([category, demands]) => (
            <AccordionItem key={category} value={category} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg">{category}</span>
                  <Badge variant="secondary">
                    {demands.length} {demands.length === 1 ? 'demanda' : 'demandas'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 pb-2">
                  {demands.map((demand) => (
                    <DemandCard key={demand.id} demand={demand} category={category} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
