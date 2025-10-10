import { prisma } from '../server.js';

export const timelineController = {
  // GET /api/timeline - Listar todas as tarefas (organizadas por weekType)
  async getAll(req, res, next) {
    try {
      const tasks = await prisma.timelineTask.findMany({
        include: {
          demand: true // Incluir dados da demand relacionada
        },
        orderBy: { weekStart: 'desc' }
      });

      // Organizar por weekType
      const byWeekType = {
        current: tasks.filter(t => t.weekType === 'current'),
        previous: tasks.filter(t => t.weekType === 'previous'),
        upcoming: tasks.filter(t => t.weekType === 'upcoming')
      };

      res.json(byWeekType);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/timeline/:id - Buscar tarefa por ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await prisma.timelineTask.findUnique({
        where: { id },
        include: {
          demand: true // Incluir dados da demand relacionada
        }
      });

      if (!task) {
        return res.status(404).json({ error: 'Timeline task not found' });
      }

      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/timeline/week/:weekType - Buscar tarefas por tipo de semana
  async getByWeekType(req, res, next) {
    try {
      const { weekType } = req.params;
      const tasks = await prisma.timelineTask.findMany({
        where: { weekType },
        orderBy: { weekStart: 'desc' }
      });

      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/timeline - Criar nova tarefa
  async create(req, res, next) {
    try {
      const {
        weekType,
        weekStart,
        weekEnd,
        title,
        priority,
        status,
        progress,
        assignedDevs,
        deadline,
        deliveryStage,
        demandId,
        category,
        highlights,
        blockers
      } = req.body;

      if (!weekType || !weekStart || !weekEnd || !title) {
        return res.status(400).json({
          error: 'weekType, weekStart, weekEnd, and title are required'
        });
      }

      const task = await prisma.timelineTask.create({
        data: {
          weekType,
          weekStart: new Date(weekStart),
          weekEnd: new Date(weekEnd),
          title,
          priority,
          status,
          progress: progress || 0,
          assignedDevs: assignedDevs || [],
          deadline: deadline ? new Date(deadline) : null,
          deliveryStage,
          demandId,
          category,
          highlights: highlights || [],
          blockers: blockers || []
        },
        include: {
          demand: true
        }
      });

      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/timeline/:id - Atualizar tarefa
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        weekType,
        weekStart,
        weekEnd,
        title,
        priority,
        status,
        progress,
        assignedDevs,
        deadline,
        deliveryStage,
        demandId,
        category,
        highlights,
        blockers
      } = req.body;

      const updateData = {
        weekType,
        title,
        priority,
        status,
        progress,
        assignedDevs,
        deliveryStage,
        demandId,
        category,
        highlights,
        blockers
      };

      if (weekStart) updateData.weekStart = new Date(weekStart);
      if (weekEnd) updateData.weekEnd = new Date(weekEnd);
      if (deadline !== undefined) {
        updateData.deadline = deadline ? new Date(deadline) : null;
      }

      const task = await prisma.timelineTask.update({
        where: { id },
        data: updateData,
        include: {
          demand: true
        }
      });

      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/timeline/:id - Remover tarefa
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.timelineTask.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
