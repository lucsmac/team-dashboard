import { prisma } from '../server.js';
import { enrichDevsWithWeekSummaries } from '../utils/devUtils.js';
import { getWeekType } from '../utils/weekUtils.js';

export const dashboardController = {
  // GET /api/dashboard - Carregar dashboard completo (otimizado)
  async getAll(req, res, next) {
    try {
      // Buscar todos os dados em paralelo
      const [devs, demands, deliveries, highlights, timelineTasks, configs] = await Promise.all([
        prisma.dev.findMany({ orderBy: { id: 'asc' } }),
        prisma.demand.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.delivery.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.highlight.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            demand: true,
            timelineTask: true
          }
        }),
        prisma.timelineTask.findMany({
          orderBy: { weekStart: 'desc' },
          include: {
            demand: true,
            assignedDevs: {
              include: {
                dev: true
              }
            }
          }
        }),
        prisma.config.findMany()
      ]);

      // Calcular weekType para cada task e filtrar apenas as que estão nas 3 semanas exibidas
      const tasksWithWeekType = timelineTasks
        .map(task => ({
          ...task,
          weekType: getWeekType(task.weekStart, task.weekEnd)
        }))
        .filter(t => t.weekType !== null);

      // Enriquecer devs com resumos automáticos (usando tasks com weekType calculado)
      const enrichedDevs = enrichDevsWithWeekSummaries(devs, tasksWithWeekType);

      // Organizar demands por categoria
      const demandsByCategory = demands.reduce((acc, demand) => {
        if (!acc[demand.category]) {
          acc[demand.category] = [];
        }
        acc[demand.category].push(demand);
        return acc;
      }, {});

      // Organizar highlights por tipo
      const highlightsByType = {
        blockers: highlights.filter(h => h.type === 'blockers'),
        achievements: highlights.filter(h => h.type === 'achievements'),
        important: highlights.filter(h => h.type === 'important')
      };

      // Organizar timeline por weekType (já calculado acima)
      const timelineByWeek = {
        current: tasksWithWeekType.filter(t => t.weekType === 'current'),
        previous: tasksWithWeekType.filter(t => t.weekType === 'previous'),
        upcoming: tasksWithWeekType.filter(t => t.weekType === 'upcoming')
      };

      // Converter configs para objeto
      const configObj = configs.reduce((acc, config) => {
        acc[config.key] = config.value;
        return acc;
      }, {});

      // Montar estrutura completa do dashboard
      const dashboard = {
        devs: enrichedDevs,
        demands: demandsByCategory,
        deliveries,
        highlights: highlightsByType,
        timeline: {
          currentWeek: {
            tasks: timelineByWeek.current,
            ...configObj.currentWeek
          },
          previousWeek: configObj.previousWeek,
          upcomingWeeks: configObj.upcomingWeeks || []
        },
        week: configObj.week || 'Semana atual',
        priorities: configObj.priorities || [
          { level: 'alta', label: 'Alta', color: 'bg-red-500' },
          { level: 'média', label: 'Média', color: 'bg-yellow-500' },
          { level: 'baixa', label: 'Baixa', color: 'bg-green-500' }
        ]
      };

      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }
};
