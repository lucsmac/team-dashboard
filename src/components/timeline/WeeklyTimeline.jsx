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
    <div className="space-y-6">
      {/* Título da seção */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">📅 Timeline Semanal</h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe o progresso do time ao longo das semanas
        </p>
      </div>

      {/* Timeline container com layout responsivo */}
      <div className="relative">
        {/* Layout Desktop: Horizontal com conectores */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6 relative">
            {/* Conectores visuais entre cards */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-blue-400 to-gray-200 -z-10" />
            <div className="absolute top-8 left-[16.66%] w-3 h-3 bg-green-400 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow" />
            <div className="absolute top-8 left-1/2 w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-lg z-10" />
            <div className="absolute top-8 left-[83.33%] w-3 h-3 bg-gray-400 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow" />

            {/* Semana Anterior */}
            <div className="pt-12">
              <PreviousWeekSection data={timeline.previousWeek} />
            </div>

            {/* Semana Atual - destaque */}
            <div className="pt-8">
              <CurrentWeekSection data={timeline.currentWeek} />
            </div>

            {/* Próximas Semanas */}
            {timeline.upcomingWeeks && timeline.upcomingWeeks.length > 0 && (
              <div className="pt-12">
                <UpcomingWeeksSection data={timeline.upcomingWeeks[0]} />
              </div>
            )}
          </div>
        </div>

        {/* Layout Mobile/Tablet: Vertical com conectores laterais */}
        <div className="lg:hidden space-y-6 relative">
          {/* Linha vertical conectora */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-200 via-blue-400 to-gray-200 -z-10" />

          {/* Dots nas seções */}
          <div className="absolute left-4 top-12 w-3 h-3 bg-green-400 rounded-full -translate-x-1/2 border-2 border-white shadow" />
          <div className="absolute left-4 top-[calc(33.33%+3rem)] w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2 border-2 border-white shadow-lg z-10" />
          <div className="absolute left-4 bottom-12 w-3 h-3 bg-gray-400 rounded-full -translate-x-1/2 border-2 border-white shadow" />

          {/* Semana Anterior */}
          <div className="pl-8">
            <PreviousWeekSection data={timeline.previousWeek} />
          </div>

          {/* Semana Atual - destaque */}
          <div className="pl-8">
            <CurrentWeekSection data={timeline.currentWeek} />
          </div>

          {/* Próximas Semanas */}
          {timeline.upcomingWeeks && timeline.upcomingWeeks.length > 0 && (
            <div className="pl-8">
              <UpcomingWeeksSection data={timeline.upcomingWeeks[0]} />
            </div>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full" />
          <span>Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full" />
          <span>Em Andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
          <span>Planejada</span>
        </div>
      </div>
    </div>
  );
};
