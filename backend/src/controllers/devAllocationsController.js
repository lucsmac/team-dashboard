/**
 * Controller para gerenciar alocações semanais de devs
 */
import { prisma } from '../server.js';

/**
 * Listar todas as alocações de uma semana específica
 * GET /api/dev-allocations?weekStart=2025-10-14
 */
export const getAllocationsByWeek = async (req, res) => {
  try {
    const { weekStart } = req.query;

    if (!weekStart) {
      return res.status(400).json({ error: 'weekStart is required' });
    }

    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    // Buscar usando range em vez de igualdade exata (resolve problemas de timezone)
    const allocations = await prisma.devWeekAllocation.findMany({
      where: {
        weekStart: {
          gte: weekStartDate,
          lt: weekEndDate
        }
      },
      include: {
        dev: {
          select: {
            id: true,
            name: true,
            role: true,
            color: true
          }
        }
      },
      orderBy: [
        { dev: { name: 'asc' } },
        { allocationType: 'asc' }
      ]
    });

    res.json(allocations);
  } catch (error) {
    console.error('Error fetching allocations by week:', error);
    res.status(500).json({ error: 'Failed to fetch allocations' });
  }
};

/**
 * Listar alocações de um dev específico em uma semana
 * GET /api/dev-allocations/dev/:devId/week/:weekStart
 */
export const getDevAllocationByWeek = async (req, res) => {
  try {
    const { devId, weekStart } = req.params;
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    // Buscar usando range em vez de igualdade exata (resolve problemas de timezone)
    const allocations = await prisma.devWeekAllocation.findMany({
      where: {
        devId: parseInt(devId),
        weekStart: {
          gte: weekStartDate,
          lt: weekEndDate
        }
      },
      orderBy: {
        allocationType: 'asc'
      }
    });

    res.json(allocations);
  } catch (error) {
    console.error('Error fetching dev allocation:', error);
    res.status(500).json({ error: 'Failed to fetch dev allocation' });
  }
};

/**
 * Obter histórico de alocações de um dev (últimos 3 meses)
 * GET /api/dev-allocations/dev/:devId/history
 */
export const getDevAllocationHistory = async (req, res) => {
  try {
    const { devId } = req.params;
    const { months = 3 } = req.query;

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - parseInt(months));

    const allocations = await prisma.devWeekAllocation.findMany({
      where: {
        devId: parseInt(devId),
        weekStart: {
          gte: threeMonthsAgo
        }
      },
      orderBy: {
        weekStart: 'desc'
      }
    });

    res.json(allocations);
  } catch (error) {
    console.error('Error fetching dev allocation history:', error);
    res.status(500).json({ error: 'Failed to fetch allocation history' });
  }
};

/**
 * Criar ou atualizar alocação
 * POST /api/dev-allocations
 * Body: {
 *   devId: number,
 *   weekStart: string (ISO date),
 *   weekEnd: string (ISO date),
 *   allocationType: 'roadmap' | 'service-desk' | 'genius',
 *   allocationPercent: number (0-100),
 *   notes?: string
 * }
 */
export const upsertAllocation = async (req, res) => {
  try {
    const {
      devId,
      weekStart,
      weekEnd,
      allocationType,
      allocationPercent = 100,
      notes
    } = req.body;

    // Validações
    if (!devId || !weekStart || !weekEnd || !allocationType) {
      return res.status(400).json({
        error: 'devId, weekStart, weekEnd and allocationType are required'
      });
    }

    const validTypes = ['roadmap', 'service-desk', 'genius'];
    if (!validTypes.includes(allocationType)) {
      return res.status(400).json({
        error: `allocationType must be one of: ${validTypes.join(', ')}`
      });
    }

    if (allocationPercent < 0 || allocationPercent > 100) {
      return res.status(400).json({
        error: 'allocationPercent must be between 0 and 100'
      });
    }

    // Verificar se dev existe
    const dev = await prisma.dev.findUnique({
      where: { id: parseInt(devId) }
    });

    if (!dev) {
      return res.status(404).json({ error: 'Dev not found' });
    }

    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekEnd);

    // Verificar se a soma das alocações não ultrapassa 100%
    const existingAllocations = await prisma.devWeekAllocation.findMany({
      where: {
        devId: parseInt(devId),
        weekStart: weekStartDate,
        allocationType: {
          not: allocationType
        }
      }
    });

    const totalAllocated = existingAllocations.reduce(
      (sum, alloc) => sum + alloc.allocationPercent,
      0
    );

    if (totalAllocated + allocationPercent > 100) {
      return res.status(400).json({
        error: `Total allocation would exceed 100% (currently ${totalAllocated}% allocated)`
      });
    }

    // Upsert alocação
    const allocation = await prisma.devWeekAllocation.upsert({
      where: {
        devId_weekStart_allocationType: {
          devId: parseInt(devId),
          weekStart: weekStartDate,
          allocationType
        }
      },
      create: {
        devId: parseInt(devId),
        weekStart: weekStartDate,
        weekEnd: weekEndDate,
        allocationType,
        allocationPercent,
        notes
      },
      update: {
        weekEnd: weekEndDate,
        allocationPercent,
        notes
      },
      include: {
        dev: {
          select: {
            id: true,
            name: true,
            role: true,
            color: true
          }
        }
      }
    });

    res.json(allocation);
  } catch (error) {
    console.error('Error upserting allocation:', error);
    res.status(500).json({ error: 'Failed to create/update allocation' });
  }
};

/**
 * Deletar alocação
 * DELETE /api/dev-allocations/:id
 */
export const deleteAllocation = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.devWeekAllocation.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Allocation not found' });
    }
    console.error('Error deleting allocation:', error);
    res.status(500).json({ error: 'Failed to delete allocation' });
  }
};

/**
 * Obter estatísticas de alocação para a semana atual
 * GET /api/dev-allocations/stats/current-week
 */
export const getCurrentWeekStats = async (req, res) => {
  try {
    // Calcular início da semana atual (domingo)
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    // Calcular fim da semana para buscar com range
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);

    // Buscar usando range em vez de igualdade exata (resolve problemas de timezone)
    const allocations = await prisma.devWeekAllocation.findMany({
      where: {
        weekStart: {
          gte: currentWeekStart,
          lt: currentWeekEnd
        }
      },
      include: {
        dev: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Agrupar por tipo de alocação
    const statsByType = allocations.reduce((acc, alloc) => {
      if (!acc[alloc.allocationType]) {
        acc[alloc.allocationType] = {
          count: 0,
          devs: [],
          totalPercent: 0
        };
      }
      acc[alloc.allocationType].count += 1;
      acc[alloc.allocationType].devs.push(alloc.dev.name);
      acc[alloc.allocationType].totalPercent += alloc.allocationPercent;
      return acc;
    }, {});

    // Devs únicos
    const uniqueDevs = [...new Set(allocations.map(a => a.devId))];

    res.json({
      weekStart: currentWeekStart.toISOString(),
      totalAllocations: allocations.length,
      uniqueDevs: uniqueDevs.length,
      byType: statsByType
    });
  } catch (error) {
    console.error('Error fetching current week stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
