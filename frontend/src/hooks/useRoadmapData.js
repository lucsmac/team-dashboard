import { useMemo } from 'react';
import { useDashboardData } from './useDashboardData';

/**
 * Hook para processar dados da timeline em formato de roadmap
 * Agrupa timeline tasks por semana e vincula às demandas
 */
export const useRoadmapData = () => {
  const { dashboardData } = useDashboardData();

  const roadmapData = useMemo(() => {
    if (!dashboardData?.timeline) {
      return { weeks: [], allDemands: [] };
    }

    const { timeline, demands } = dashboardData;
    const weeks = [];

    // Função auxiliar para calcular progresso de uma demanda baseado em suas tasks
    const calculateDemandProgress = (demandId, tasks) => {
      const demandTasks = tasks.filter(t => t.demandId === demandId);
      if (demandTasks.length === 0) return 0;

      const completed = demandTasks.filter(t => t.status === 'concluida').length;
      return completed / demandTasks.length;
    };

    // Função auxiliar para determinar status da demanda
    const getDemandStatus = (demand, tasks) => {
      const demandTasks = tasks.filter(t => t.demandId === demand.id);

      if (demandTasks.length === 0) {
        return demand.status || 'planejado';
      }

      const hasInProgress = demandTasks.some(t => t.status === 'em-andamento');
      const allCompleted = demandTasks.every(t => t.status === 'concluida');

      if (allCompleted) return 'concluido';
      if (hasInProgress) return 'em-andamento';
      return 'planejado';
    };

    // Processar semana anterior (previousWeek)
    if (timeline.previousWeek?.startDate) {
      const tasks = timeline.previousWeek.tasks || [];
      const demandIds = [...new Set(tasks.map(t => t.demandId).filter(Boolean))];

      const weekDemands = demandIds.map(demandId => {
        // Buscar demanda em todas as categorias
        let demand = null;
        for (const category in demands) {
          demand = demands[category].find(d => d.id === demandId);
          if (demand) break;
        }

        if (!demand) return null;

        return {
          ...demand,
          tasks: tasks.filter(t => t.demandId === demandId),
          progress: calculateDemandProgress(demandId, tasks),
          computedStatus: getDemandStatus(demand, tasks)
        };
      }).filter(Boolean);

      weeks.push({
        startDate: timeline.previousWeek.startDate,
        endDate: timeline.previousWeek.endDate,
        isCurrent: false,
        isPast: true,
        demands: weekDemands,
        completionRate: timeline.previousWeek.completionRate || 0
      });
    }

    // Processar semana atual (currentWeek)
    if (timeline.currentWeek?.startDate) {
      const tasks = timeline.currentWeek.tasks || [];
      const demandIds = [...new Set(tasks.map(t => t.demandId).filter(Boolean))];

      const weekDemands = demandIds.map(demandId => {
        let demand = null;
        for (const category in demands) {
          demand = demands[category].find(d => d.id === demandId);
          if (demand) break;
        }

        if (!demand) return null;

        return {
          ...demand,
          tasks: tasks.filter(t => t.demandId === demandId),
          progress: calculateDemandProgress(demandId, tasks),
          computedStatus: getDemandStatus(demand, tasks)
        };
      }).filter(Boolean);

      weeks.push({
        startDate: timeline.currentWeek.startDate,
        endDate: timeline.currentWeek.endDate,
        isCurrent: true,
        isPast: false,
        demands: weekDemands,
        alerts: timeline.currentWeek.alerts || []
      });
    }

    // Processar próximas semanas (upcomingWeeks)
    if (timeline.upcomingWeeks?.length > 0) {
      timeline.upcomingWeeks.forEach(week => {
        const tasks = week.plannedTasks || [];
        const demandIds = [...new Set(tasks.map(t => t.demandId).filter(Boolean))];

        const weekDemands = demandIds.map(demandId => {
          let demand = null;
          for (const category in demands) {
            demand = demands[category].find(d => d.id === demandId);
            if (demand) break;
          }

          if (!demand) return null;

          return {
            ...demand,
            tasks: tasks.filter(t => t.demandId === demandId),
            progress: 0, // Futuro, sem progresso ainda
            computedStatus: 'planejado'
          };
        }).filter(Boolean);

        weeks.push({
          startDate: week.startDate,
          endDate: week.endDate,
          isCurrent: false,
          isPast: false,
          demands: weekDemands
        });
      });
    }

    // Coletar todas as demandas únicas e acumular TODAS as suas tasks
    const allDemands = [];
    const demandsMap = new Map();

    weeks.forEach(week => {
      week.demands.forEach(demand => {
        if (!demandsMap.has(demand.id)) {
          // Primeira vez que vemos esta demanda
          demandsMap.set(demand.id, {
            ...demand,
            tasks: [...(demand.tasks || [])]
          });
        } else {
          // Demanda já existe, acumular tasks
          const existing = demandsMap.get(demand.id);
          const existingTaskIds = new Set(existing.tasks.map(t => t.id));

          // Adicionar tasks que ainda não estão na lista
          demand.tasks?.forEach(task => {
            if (!existingTaskIds.has(task.id)) {
              existing.tasks.push(task);
            }
          });

          // Recalcular progresso com todas as tasks
          const allTasks = existing.tasks;
          if (allTasks.length > 0) {
            const completed = allTasks.filter(t => t.status === 'concluida').length;
            existing.progress = completed / allTasks.length;
          }
        }
      });
    });

    // Converter Map para array
    demandsMap.forEach(demand => allDemands.push(demand));

    return {
      weeks,
      allDemands,
      categories: Object.keys(demands),
      currentWeekIndex: weeks.findIndex(w => w.isCurrent)
    };
  }, [dashboardData]);

  return roadmapData;
};
