import { prisma } from '../server.js';

export const deliveriesController = {
  // GET /api/deliveries - Listar todas as entregas
  async getAll(req, res, next) {
    try {
      const deliveries = await prisma.delivery.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(deliveries);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/deliveries/:id - Buscar entrega por ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const delivery = await prisma.delivery.findUnique({
        where: { id }
      });

      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }

      res.json(delivery);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/deliveries - Criar nova entrega
  async create(req, res, next) {
    try {
      const { title, valueType, items } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const delivery = await prisma.delivery.create({
        data: {
          title,
          valueType,
          items: items || []
        }
      });

      res.status(201).json(delivery);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/deliveries/:id - Atualizar entrega
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, valueType, items } = req.body;

      const delivery = await prisma.delivery.update({
        where: { id },
        data: { title, valueType, items }
      });

      res.json(delivery);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/deliveries/:id - Remover entrega
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.delivery.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
