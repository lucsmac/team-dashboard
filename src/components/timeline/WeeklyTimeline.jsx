import { PreviousWeekSection } from './PreviousWeekSection';
import { CurrentWeekSection } from './CurrentWeekSection';
import { UpcomingWeeksSection } from './UpcomingWeeksSection';
import { useDashboardData } from '@/hooks/useDashboardData';

/**
 * Timeline semanal com três seções: semana passada, atual e próxima
 * Layout responsivo: horizontal em desktop, vertical em mobile
 */
export const WeeklyTimeline = () => {
  const { dashboardData } = useDashboardData();
  const { timeline } = dashboardData;

  console.log('WeeklyTimeline - dashboardData:', dashboardData);
  console.log('WeeklyTimeline - timeline:', timeline);

  if (!timeline) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Dados de timeline não disponíveis
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Título da seção - neutro */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">📅</span>
          Timeline Semanal
        </h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe o progresso do time ao longo das semanas
        </p>
      </div>

      {/* Timeline container com layout responsivo */}
      <div className="relative">
        {/* Layout Desktop: Horizontal com conectores */}
        <div className="hidden lg:block">
          <div className="grid gap-8 relative" style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}>
            {/* Conectores visuais entre cards - linha neutra */}
            <div className="absolute top-8 left-0 right-0 h-px bg-border" style={{ zIndex: 0 }} />

            {/* Dots posicionados corretamente sobre cada card - neutros */}
            {/* Dot esquerdo - Semana Anterior */}
            <div className="absolute top-8 left-[14.3%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-3 h-3 bg-muted-foreground rounded-full border-2 border-background shadow" />
            </div>

            {/* Dot central - Semana Atual */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 bg-foreground rounded-full border-2 border-background shadow-md" />
            </div>

            {/* Dot direito - Próxima Semana */}
            <div className="absolute top-8 left-[85.7%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-3 h-3 bg-muted rounded-full border-2 border-background shadow" />
            </div>

            {/* Semana Anterior - menor */}
            <div className="pt-16">
              <PreviousWeekSection data={timeline.previousWeek} />
            </div>

            {/* Semana Atual - destaque e maior */}
            <div className="pt-16">
              <CurrentWeekSection data={timeline.currentWeek} />
            </div>

            {/* Próximas Semanas - menor */}
            {timeline.upcomingWeeks && timeline.upcomingWeeks.length > 0 && (
              <div className="pt-16">
                <UpcomingWeeksSection data={timeline.upcomingWeeks[0]} />
              </div>
            )}
          </div>
        </div>

        {/* Layout Mobile/Tablet: Vertical com conectores laterais */}
        <div className="lg:hidden space-y-8 relative pl-8">
          {/* Linha vertical conectora - neutra */}
          <div className="absolute left-4 top-8 bottom-8 w-px bg-border -z-10" />

          {/* Dots nas seções - neutros */}
          <div className="absolute left-4 top-14 w-3 h-3 bg-muted-foreground rounded-full -translate-x-1/2 border-2 border-background shadow" />
          <div className="absolute left-4 top-[calc(33.33%+4rem)] w-4 h-4 bg-foreground rounded-full -translate-x-1/2 border-2 border-background shadow-md z-10" />
          <div className="absolute left-4 bottom-14 w-3 h-3 bg-muted rounded-full -translate-x-1/2 border-2 border-background shadow" />

          {/* Semana Anterior */}
          <div>
            <PreviousWeekSection data={timeline.previousWeek} />
          </div>

          {/* Semana Atual - destaque */}
          <div>
            <CurrentWeekSection data={timeline.currentWeek} />
          </div>

          {/* Próximas Semanas */}
          {timeline.upcomingWeeks && timeline.upcomingWeeks.length > 0 && (
            <div>
              <UpcomingWeeksSection data={timeline.upcomingWeeks[0]} />
            </div>
          )}
        </div>
      </div>

      {/* Legenda neutra */}
      <div className="flex items-center justify-center gap-6 text-xs pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full" />
          <span className="text-muted-foreground">Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-foreground rounded-full" />
          <span className="text-foreground font-medium">Em Andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-muted rounded-full" />
          <span className="text-muted-foreground">Planejada</span>
        </div>
      </div>
    </div>
  );
};
