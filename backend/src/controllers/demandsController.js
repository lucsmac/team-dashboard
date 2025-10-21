import { prisma } from '../server.js';

export const demandsController = {
  // GET /api/demands - Listar todas as demandas (organizadas por categoria)
  async getAll(req, res, next) {
    try {
      const demands = await prisma.demand.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // Organizar por categoria
      const byCategory = demands.reduce((acc, demand) => {
        if (!acc[demand.category]) {
          acc[demand.category] = [];
        }
        acc[demand.category].push(demand);
        return acc;
      }, {});

      res.json(byCategory);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/demands/:id - Buscar demanda por ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const demand = await prisma.demand.findUnique({
        where: { id },
        include: {
          timelineTasks: {
            orderBy: { weekStart: 'desc' }
          }
        }
      });

      if (!demand) {
        return res.status(404).json({ error: 'Demand not found' });
      }

      res.json(demand);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/demands/category/:category - Buscar demandas por categoria
  async getByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const demands = await prisma.demand.findMany({
        where: { category },
        orderBy: { createdAt: 'desc' }
      });

      res.json(demands);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/demands/recent-completed/:days - Buscar demandas concluídas nos últimos N dias
  async getRecentCompleted(req, res, next) {
    try {
      const days = parseInt(req.params.days) || 7;
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - days);

      const demands = await prisma.demand.findMany({
        where: {
          status: 'concluido',
          completedAt: {
            gte: sinceDate
          }
        },
        orderBy: { completedAt: 'desc' }
      });

      res.json(demands);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/demands - Criar nova demanda
  async create(req, res, next) {
    try {
      const { category, title, status, priority, stage, assignedDevs, value, details, links } = req.body;

      if (!category || !title || !status || !priority || !stage) {
        return res.status(400).json({
          error: 'Category, title, status, priority, and stage are required'
        });
      }

      const demand = await prisma.demand.create({
        data: {
          category,
          title,
          status,
          priority,
          stage,
          assignedDevs: assignedDevs || [],
          value,
          details,
          links: links || []
        }
      });

      res.status(201).json(demand);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/demands/:id - Atualizar demanda
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { category, title, status, priority, stage, assignedDevs, value, details, links } = req.body;

      // Buscar demanda atual para verificar mudança de status
      const currentDemand = await prisma.demand.findUnique({ where: { id } });

      if (!currentDemand) {
        return res.status(404).json({ error: 'Demand not found' });
      }

      // Preparar dados de atualização
      const updateData = { category, title, status, priority, stage, assignedDevs, value, details, links };

      // Se status mudou para 'concluido' e ainda não tem completedAt, definir a data atual
      if (status === 'concluido' && currentDemand.status !== 'concluido' && !currentDemand.completedAt) {
        updateData.completedAt = new Date();
      }

      // Se status mudou de 'concluido' para outro, limpar completedAt
      if (status !== 'concluido' && currentDemand.status === 'concluido') {
        updateData.completedAt = null;
      }

      const demand = await prisma.demand.update({
        where: { id },
        data: updateData
      });

      res.json(demand);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/demands/:id - Remover demanda
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.demand.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
