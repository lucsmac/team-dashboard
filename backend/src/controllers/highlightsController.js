import { prisma } from '../server.js';

export const highlightsController = {
  // GET /api/highlights - Listar todos os highlights (organizados por tipo)
  async getAll(req, res, next) {
    try {
      const highlights = await prisma.highlight.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // Organizar por tipo
      const byType = {
        blockers: highlights.filter(h => h.type === 'blockers'),
        achievements: highlights.filter(h => h.type === 'achievements'),
        important: highlights.filter(h => h.type === 'important')
      };

      res.json(byType);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/highlights/:id - Buscar highlight por ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const highlight = await prisma.highlight.findUnique({
        where: { id }
      });

      if (!highlight) {
        return res.status(404).json({ error: 'Highlight not found' });
      }

      res.json(highlight);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/highlights/type/:type - Buscar highlights por tipo
  async getByType(req, res, next) {
    try {
      const { type } = req.params;
      const highlights = await prisma.highlight.findMany({
        where: { type },
        orderBy: { createdAt: 'desc' }
      });

      res.json(highlights);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/highlights - Criar novo highlight
  async create(req, res, next) {
    try {
      const { type, text, severity } = req.body;

      if (!type || !text) {
        return res.status(400).json({ error: 'Type and text are required' });
      }

      if (!['blockers', 'achievements', 'important'].includes(type)) {
        return res.status(400).json({
          error: 'Type must be one of: blockers, achievements, important'
        });
      }

      const highlight = await prisma.highlight.create({
        data: { type, text, severity }
      });

      res.status(201).json(highlight);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/highlights/:id - Atualizar highlight
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { type, text, severity } = req.body;

      const highlight = await prisma.highlight.update({
        where: { id },
        data: { type, text, severity }
      });

      res.json(highlight);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/highlights/:id - Remover highlight
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.highlight.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
