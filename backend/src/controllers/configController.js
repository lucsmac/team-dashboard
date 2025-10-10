import { prisma } from '../server.js';

export const configController = {
  // GET /api/config - Listar todas as configurações
  async getAll(req, res, next) {
    try {
      const configs = await prisma.config.findMany();

      // Converter para objeto chave-valor
      const configObj = configs.reduce((acc, config) => {
        acc[config.key] = config.value;
        return acc;
      }, {});

      res.json(configObj);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/config/:key - Buscar configuração por chave
  async getByKey(req, res, next) {
    try {
      const { key } = req.params;
      const config = await prisma.config.findUnique({
        where: { key }
      });

      if (!config) {
        return res.status(404).json({ error: 'Config not found' });
      }

      res.json(config);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/config - Criar ou atualizar configuração (upsert)
  async upsert(req, res, next) {
    try {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required' });
      }

      const config = await prisma.config.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });

      res.json(config);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/config/:key - Remover configuração
  async delete(req, res, next) {
    try {
      const { key } = req.params;

      await prisma.config.delete({
        where: { key }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
