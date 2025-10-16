import { useMemo } from 'react';
import { GanttTimelineHeader } from './GanttTimelineHeader';
import { GanttDemandRow } from './GanttDemandRow';
import { Calendar } from 'lucide-react';

/**
 * Visualização Gantt do roadmap
 * Cada linha é uma demanda que se estende ao longo do tempo
 */
export const RoadmapGanttView = ({ weeks, filteredWeeks }) => {
  const weeksToDisplay = filteredWeeks || weeks;
  const cellWidth = 200; // Largura de cada célula de semana

  // Coletar todas as demandas únicas e acumular TODAS as suas tasks de todas as semanas
  const allDemands = useMemo(() => {
    const demandsMap = new Map();

    weeksToDisplay.forEach(week => {
      week.demands.forEach(demand => {
        if (!demandsMap.has(demand.id)) {
          // Primeira vez que vemos esta demanda
          demandsMap.set(demand.id, {
            ...demand,
            tasks: [...(demand.tasks || [])]
          });
        } else {
          // Demanda já existe, acumular tasks desta semana
          const existing = demandsMap.get(demand.id);
          const existingTaskIds = new Set(existing.tasks.map(t => t.id));

          // Adicionar tasks que ainda não estão na lista
          demand.tasks?.forEach(task => {
            if (!existingTaskIds.has(task.id)) {
              existing.tasks.push(task);
            }
          });

          // Recalcular progresso com todas as tasks acumuladas
          const allTasks = existing.tasks;
          if (allTasks.length > 0) {
            const completed = allTasks.filter(t => t.status === 'concluida').length;
            existing.progress = completed / allTasks.length;
          }
        }
      });
    });

    return Array.from(demandsMap.values());
  }, [weeksToDisplay]);

  // Agrupar demandas por categoria
  const demandsByCategory = useMemo(() => {
    const grouped = {};

    allDemands.forEach(demand => {
      const category = demand.category || 'Outros';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(demand);
    });

    // Ordenar demandas dentro de cada categoria por prioridade
    const priorityOrder = { 'alta': 0, 'media': 1, 'baixa': 2 };

    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => {
        const priorityA = priorityOrder[a.priority] ?? 3;
        const priorityB = priorityOrder[b.priority] ?? 3;
        return priorityA - priorityB;
      });
    });

    return grouped;
  }, [allDemands]);

  if (weeksToDisplay.length === 0 || allDemands.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Nenhuma demanda encontrada</p>
        <p className="text-sm mt-2">Ajuste os filtros para ver as demandas</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Header com as semanas */}
      <GanttTimelineHeader weeks={weeksToDisplay} cellWidth={cellWidth} />

      {/* Corpo do Gantt com as demandas */}
      <div className="overflow-auto max-h-[calc(100vh-400px)]">
        {Object.entries(demandsByCategory).map(([category, demands]) => (
          <div key={category}>
            {/* Cabeçalho da categoria */}
            <div className="flex bg-muted/50 border-b-2 border-border sticky top-0 z-10">
              <div className="sticky left-0 bg-muted/50 border-r border-border" style={{ width: '300px' }}>
                <div className="px-4 py-2 font-bold text-sm">
                  {category} ({demands.length})
                </div>
              </div>
              <div className="flex-1" />
            </div>

            {/* Linhas das demandas */}
            {demands.map(demand => (
              <GanttDemandRow
                key={demand.id}
                demand={demand}
                weeks={weeksToDisplay}
                cellWidth={cellWidth}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 text-xs py-3 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded" />
          <span className="text-muted-foreground">Planejado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span>Em Andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-muted-foreground">Concluído</span>
        </div>
      </div>
    </div>
  );
};
