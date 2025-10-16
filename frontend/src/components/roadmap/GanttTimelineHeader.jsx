import { useMemo } from 'react';

/**
 * Cabeçalho da timeline Gantt mostrando as semanas
 */
export const GanttTimelineHeader = ({ weeks, cellWidth = 200 }) => {
  const formatWeekRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate().toString().padStart(2, '0');
    const endDay = end.getDate().toString().padStart(2, '0');
    const startMonth = start.toLocaleDateString('pt-BR', { month: 'short' });
    const endMonth = end.toLocaleDateString('pt-BR', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startDay}-${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  return (
    <div className="sticky top-0 z-20 bg-background border-b-2 border-border">
      <div className="flex">
        {/* Coluna fixa da esquerda para nomes das demandas */}
        <div className="sticky left-0 z-30 bg-background border-r-2 border-border" style={{ width: '300px' }}>
          <div className="h-12 flex items-center px-4 font-semibold text-sm">
            Demanda
          </div>
        </div>

        {/* Timeline de semanas */}
        <div className="flex flex-1 overflow-x-auto">
          {weeks.map((week, index) => (
            <div
              key={index}
              className={`flex-shrink-0 h-12 flex items-center justify-center border-r border-border px-2 text-xs font-medium ${
                week.isCurrent
                  ? 'bg-primary/10 text-primary font-bold'
                  : week.isPast
                  ? 'bg-muted/30 text-muted-foreground'
                  : 'text-foreground'
              }`}
              style={{ width: `${cellWidth}px` }}
            >
              <div className="text-center">
                <div className="font-semibold">
                  {formatWeekRange(week.startDate, week.endDate)}
                </div>
                {week.isCurrent && (
                  <div className="text-[10px] text-primary font-normal">Atual</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
