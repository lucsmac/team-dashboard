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
      {/* Título da seção */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3">
          <span className="text-3xl">📅</span>
          Timeline Semanal
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Acompanhe o progresso do time ao longo das semanas
        </p>
      </div>

      {/* Timeline container com layout responsivo */}
      <div className="relative">
        {/* Layout Desktop: Horizontal com conectores */}
        <div className="hidden lg:block">
          <div className="grid gap-8 relative" style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}>
            {/* Conectores visuais entre cards - linha fina e vibrante */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-green-300 via-blue-500 to-gray-300 rounded-full shadow-sm" style={{ zIndex: 0 }} />

            {/* Dots posicionados corretamente sobre cada card */}
            {/* Dot esquerdo - Semana Anterior (1fr de 3.5fr total = 28.5%) */}
            <div className="absolute top-8 left-[14.3%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-white shadow-lg ring-2 ring-green-200" />
            </div>

            {/* Dot central - Semana Atual (meio do card central) */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-3 border-white shadow-xl ring-2 ring-blue-300 animate-pulse" />
            </div>

            {/* Dot direito - Próxima Semana (85.7%) */}
            <div className="absolute top-8 left-[85.7%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full border-3 border-white shadow-lg ring-2 ring-gray-200" />
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
          {/* Linha vertical conectora - fina e vibrante */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-300 via-blue-500 to-gray-300 rounded-full -z-10 shadow-sm" />

          {/* Dots nas seções com gradientes */}
          <div className="absolute left-4 top-14 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full -translate-x-1/2 border-3 border-white shadow-lg ring-2 ring-green-200" />
          <div className="absolute left-4 top-[calc(33.33%+4rem)] w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full -translate-x-1/2 border-3 border-white shadow-xl ring-2 ring-blue-300 animate-pulse z-10" />
          <div className="absolute left-4 bottom-14 w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full -translate-x-1/2 border-3 border-white shadow-lg ring-2 ring-gray-200" />

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

      {/* Legenda moderna */}
      <div className="flex items-center justify-center gap-8 text-sm pt-6 border-t border-border/50">
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur px-4 py-2.5 rounded-full border border-green-200/50 shadow-sm">
          <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full ring-2 ring-green-200" />
          <span className="font-medium text-foreground">Completada</span>
        </div>
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur px-4 py-2.5 rounded-full border border-blue-200/50 shadow-sm">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full ring-2 ring-blue-300 animate-pulse" />
          <span className="font-medium text-foreground">Em Andamento</span>
        </div>
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur px-4 py-2.5 rounded-full border border-gray-200/50 shadow-sm">
          <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full ring-2 ring-gray-200" />
          <span className="font-medium text-foreground">Planejada</span>
        </div>
      </div>
    </div>
  );
};
