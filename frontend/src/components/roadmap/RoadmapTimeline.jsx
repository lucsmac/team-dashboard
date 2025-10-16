import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RoadmapWeekColumn } from './RoadmapWeekColumn';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

/**
 * Componente principal da timeline do roadmap
 * Exibe semanas em scroll horizontal
 */
export const RoadmapTimeline = ({ weeks, filteredWeeks }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const weeksToDisplay = filteredWeeks || weeks;

  // Verificar se pode scroll
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [weeksToDisplay]);

  // Scroll para a semana atual na montagem
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentWeekIndex = weeksToDisplay.findIndex(w => w.isCurrent);
    if (currentWeekIndex !== -1) {
      // Scroll para centralizar a semana atual
      const weekWidth = 320 + 16; // largura do card + gap
      const scrollPosition = currentWeekIndex * weekWidth - (container.clientWidth / 2) + (weekWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
    }
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 336; // largura do card + gap
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  const scrollToCurrentWeek = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentWeekIndex = weeksToDisplay.findIndex(w => w.isCurrent);
    if (currentWeekIndex !== -1) {
      const weekWidth = 320 + 16;
      const scrollPosition = currentWeekIndex * weekWidth - (container.clientWidth / 2) + (weekWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
    }
  };

  if (weeksToDisplay.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Nenhuma semana encontrada</p>
        <p className="text-sm mt-2">Ajuste os filtros para ver as demandas</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Controles de navegação */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={scrollToCurrentWeek}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Semana Atual
        </Button>

        <div className="text-sm text-muted-foreground">
          {weeksToDisplay.length} {weeksToDisplay.length === 1 ? 'semana' : 'semanas'}
        </div>
      </div>

      {/* Timeline horizontal */}
      <div className="relative">
        {/* Linha do tempo (visual) */}
        <div className="absolute top-6 left-0 right-0 h-px bg-border z-0 hidden lg:block" />

        {/* Container com scroll */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(209 213 219) rgb(243 244 246)'
          }}
        >
          {weeksToDisplay.map((week, index) => (
            <div key={index} className="relative">
              {/* Marcador na linha do tempo */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
                <div
                  className={`rounded-full border-2 border-background shadow ${
                    week.isCurrent
                      ? 'w-4 h-4 bg-primary'
                      : week.isPast
                      ? 'w-3 h-3 bg-muted-foreground'
                      : 'w-3 h-3 bg-muted'
                  }`}
                />
              </div>

              {/* Coluna da semana */}
              <div className="pt-12">
                <RoadmapWeekColumn week={week} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 text-xs pt-4 mt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full" />
          <span className="text-muted-foreground">Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span className="font-medium">Em andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-muted rounded-full" />
          <span className="text-muted-foreground">Planejada</span>
        </div>
      </div>
    </div>
  );
};
