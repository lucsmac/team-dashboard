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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useDashboard } from '@/context/DashboardContext';
import { WeeklyCompletionChart } from '../charts/WeeklyCompletionChart';
import { TasksByStatusChart } from '../charts/TasksByStatusChart';
import { TasksByCategoryChart } from '../charts/TasksByCategoryChart';
import { TasksByDeveloperChart } from '../charts/TasksByDeveloperChart';
import { useChartData } from '@/hooks/useChartData';
import { BarChart3 } from 'lucide-react';

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
    <div className="space-y-8">
      {/* ========== SEÇÃO 1: ATENÇÃO IMEDIATA ========== */}
      <section>
        <MetricsCards />
      </section>

      <section>
        <RecentHighlights />
      </section>

      <Separator className="my-8" />

      {/* ========== SEÇÃO 2: TIMELINE & ENTREGAS ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Timeline & Entregas</h2>
        <div className="space-y-6">
          <WeeklyTimeline />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingDeliveries />
            <RecentCompletedDemands />
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* ========== SEÇÃO 3: VISÃO DO TIME ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Visão do Time</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamDistribution />
          <AllocationOverview />
        </div>
      </section>

      <Separator className="my-8" />

      {/* ========== SEÇÃO 4: ANÁLISES E TENDÊNCIAS ========== */}
      <section>
        <Accordion type="single" collapsible defaultValue="charts">
          <AccordionItem value="charts" className="border-none">
            <AccordionTrigger className="text-2xl font-bold hover:no-underline pb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                <span>Análises e Tendências</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (4 gráficos)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              {/* Gráfico de linha de conclusão */}
              <WeeklyCompletionChart data={weeklyCompletionData} />

              {/* Grid com 2 gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TasksByStatusChart data={tasksByStatusData} />
                <TasksByCategoryChart data={tasksByCategoryData} />
              </div>

              {/* Gráfico de tarefas por desenvolvedor */}
              <TasksByDeveloperChart data={tasksByDeveloperData} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};
