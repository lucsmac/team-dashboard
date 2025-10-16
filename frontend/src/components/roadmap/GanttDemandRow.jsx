import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, Calendar } from 'lucide-react';
import { PriorityIndicator } from '../common/StatusIndicator';
import { useDashboardData } from '@/hooks/useDashboardData';

/**
 * Linha de uma demanda no Gantt chart
 */
export const GanttDemandRow = ({ demand, weeks, cellWidth = 200 }) => {
  const { dashboardData } = useDashboardData();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calcular em quais semanas a demanda aparece
  const getDemandWeekSpan = () => {
    const demandWeeks = [];

    weeks.forEach((week, weekIndex) => {
      const hasDemand = week.demands.some(d => d.id === demand.id);
      if (hasDemand) {
        demandWeeks.push(weekIndex);
      }
    });

    if (demandWeeks.length === 0) return null;

    const startWeek = Math.min(...demandWeeks);
    const endWeek = Math.max(...demandWeeks);

    return {
      startWeek,
      endWeek,
      span: endWeek - startWeek + 1,
      weekIndices: demandWeeks
    };
  };

  const weekSpan = getDemandWeekSpan();

  const statusConfig = {
    'concluido': { color: 'bg-green-500', textColor: 'text-white', label: 'Concluído' },
    'em-andamento': { color: 'bg-blue-500', textColor: 'text-white', label: 'Em Andamento' },
    'planejado': { color: 'bg-gray-400', textColor: 'text-white', label: 'Planejado' }
  };

  const status = demand.computedStatus || demand.status || 'planejado';
  const config = statusConfig[status] || statusConfig['planejado'];
  const progress = Math.round((demand.progress || 0) * 100);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <>
      <div className="flex border-b border-border hover:bg-muted/50 transition-colors">
        {/* Coluna fixa da esquerda - Nome da demanda */}
        <div className="sticky left-0 z-10 bg-background border-r border-border" style={{ width: '300px' }}>
          <div className="p-3 space-y-2">
            <div className="flex items-start gap-2">
              <PriorityIndicator priority={demand.priority} size="sm" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                  {demand.title}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {demand.category}
                  </Badge>
                </div>
              </div>
            </div>

            {demand.tasks && demand.tasks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 text-xs w-full justify-start px-2"
              >
                <ChevronDown
                  className={`h-3 w-3 mr-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
                {demand.tasks.length} {demand.tasks.length === 1 ? 'task' : 'tasks'}
              </Button>
            )}
          </div>
        </div>

        {/* Timeline - Barra da demanda */}
        <div className="flex flex-1 relative h-12">
          {/* Background das células */}
          {weeks.map((week, weekIndex) => (
            <div
              key={`bg-${weekIndex}`}
              className="flex-shrink-0 border-r border-border"
              style={{ width: `${cellWidth}px` }}
            >
              {/* Marcador da semana atual */}
              {week.isCurrent && (
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              )}
            </div>
          ))}

          {/* Barra da demanda (posicionada absolutamente) */}
          {weekSpan && (
            <div
              className="absolute top-2 bottom-2 flex items-center px-2"
              style={{
                left: `${weekSpan.startWeek * cellWidth + 4}px`,
                width: `${weekSpan.span * cellWidth - 8}px`
              }}
            >
              <div
                className={`h-8 rounded ${config.color} ${config.textColor} flex items-center justify-between px-3 shadow-sm relative overflow-hidden group cursor-pointer w-full`}
              >
                {/* Progress bar interno */}
                {status !== 'planejado' && (
                  <div
                    className="absolute inset-0 bg-white/20"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2 text-xs font-medium truncate">
                  <span className="truncate">{demand.title}</span>
                </div>

                <div className="relative z-10 text-xs font-bold whitespace-nowrap ml-2">
                  {status !== 'planejado' && `${progress}%`}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-popover text-popover-foreground p-2 rounded shadow-lg text-xs whitespace-nowrap border z-50">
                  <div className="font-semibold">{demand.title}</div>
                  <div className="text-muted-foreground mt-1">
                    {demand.category} • {config.label}
                  </div>
                  {demand.assignedDevs && demand.assignedDevs.length > 0 && (
                    <div className="mt-1 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {demand.assignedDevs.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tasks expandidas */}
      {isExpanded && demand.tasks && demand.tasks.length > 0 && (
        <div className="border-b border-border bg-muted/20">
          {demand.tasks.map((task) => (
            <div key={task.id} className="flex text-xs">
              {/* Informações da task */}
              <div className="sticky left-0 z-10 bg-muted/30 border-r border-border" style={{ width: '300px' }}>
                <div className="p-2 pl-8">
                  <div className="font-medium text-muted-foreground">{task.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.weekStart)} - {formatDate(task.weekEnd)}
                  </div>
                </div>
              </div>

              {/* Timeline da task (placeholder) */}
              <div className="flex flex-1">
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex-shrink-0 border-r border-border"
                    style={{ width: `${cellWidth}px` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
