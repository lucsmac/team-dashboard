import { prisma } from '../server.js';
import { enrichDevsWithWeekSummaries, generateWeekSummary } from '../utils/devUtils.js';

export const devsController = {
  // GET /api/devs - Listar todos os desenvolvedores
  async getAll(req, res, next) {
    try {
      const devs = await prisma.dev.findMany({
        orderBy: { id: 'asc' }
      });

      // Buscar todas as timeline tasks para enriquecer devs
      const timelineTasks = await prisma.timelineTask.findMany({
        select: {
          weekType: true,
          title: true,
          progress: true,
          assignedDevs: true
        }
      });

      // Enriquecer devs com resumos automáticos (se campos estiverem vazios)
      const enrichedDevs = enrichDevsWithWeekSummaries(devs, timelineTasks);

      res.json(enrichedDevs);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/devs/:id - Buscar desenvolvedor por ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const dev = await prisma.dev.findUnique({
        where: { id: parseInt(id) }
      });

      if (!dev) {
        return res.status(404).json({ error: 'Developer not found' });
      }

      // Buscar timeline tasks para enriquecer
      const timelineTasks = await prisma.timelineTask.findMany({
        where: {
          assignedDevs: { has: dev.name }
        },
        select: {
          weekType: true,
          title: true,
          progress: true,
          assignedDevs: true,
          deadline: true,
          deliveryStage: true,
          demand: {
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        }
      });

      // Enriquecer dev com resumos e tasks
      const enrichedDev = {
        ...dev,
        lastWeek: dev.lastWeek || generateWeekSummary(timelineTasks.filter(t => t.weekType === 'previous')),
        thisWeek: dev.thisWeek || generateWeekSummary(timelineTasks.filter(t => t.weekType === 'current')),
        nextWeek: dev.nextWeek || generateWeekSummary(timelineTasks.filter(t => t.weekType === 'upcoming')),
        tasks: {
          previous: timelineTasks.filter(t => t.weekType === 'previous'),
          current: timelineTasks.filter(t => t.weekType === 'current'),
          upcoming: timelineTasks.filter(t => t.weekType === 'upcoming')
        }
      };

      res.json(enrichedDev);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/devs - Criar novo desenvolvedor
  async create(req, res, next) {
    try {
      const { name, color, lastWeek, thisWeek, nextWeek } = req.body;

      if (!name || !color) {
        return res.status(400).json({ error: 'Name and color are required' });
      }

      const dev = await prisma.dev.create({
        data: { name, color, lastWeek, thisWeek, nextWeek }
      });

      res.status(201).json(dev);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/devs/:id - Atualizar desenvolvedor
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, color, lastWeek, thisWeek, nextWeek } = req.body;

      const dev = await prisma.dev.update({
        where: { id: parseInt(id) },
        data: { name, color, lastWeek, thisWeek, nextWeek }
      });

      res.json(dev);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/devs/:id - Remover desenvolvedor
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.dev.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
