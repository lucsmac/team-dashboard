import { prisma } from '../server.js';

export const timelineController = {
  // GET /api/timeline - Listar todas as tarefas (organizadas por weekType)
  async getAll(req, res, next) {
    try {
      const tasks = await prisma.timelineTask.findMany({
        include: {
          demand: true, // Demand com sua categoria
          assignedDevs: {
            include: {
              dev: true // Dados completos do dev
            }
          },
          highlights: true // Conquistas e entraves
        },
        orderBy: [
          { weekStart: 'desc' }
        ]
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
          demand: true,
          assignedDevs: {
            include: {
              dev: true
            }
          },
          highlights: true
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
        include: {
          demand: true,
          assignedDevs: {
            include: {
              dev: true
            }
          },
          highlights: true
        },
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
        status,
        demandId,
        devIds,         // Array de IDs de devs
        highlights,     // Array de { type: 'conquista', text: '...' }
        blockers        // Array de { text: '...', severity: 'alta' }
      } = req.body;

      if (!weekType || !weekStart || !weekEnd || !title) {
        return res.status(400).json({
          error: 'weekType, weekStart, weekEnd, and title are required'
        });
      }

      // Criar a timeline task
      const task = await prisma.timelineTask.create({
        data: {
          weekType,
          weekStart: new Date(weekStart),
          weekEnd: new Date(weekEnd),
          title,
          status: status || 'nao-iniciada',
          demandId: demandId || null
        }
      });

      // Associar devs se existirem
      if (devIds && devIds.length > 0) {
        await Promise.all(
          devIds.map(devId =>
            prisma.timelineTaskAssignment.create({
              data: {
                timelineTaskId: task.id,
                devId: devId
              }
            })
          )
        );
      }

      // Criar highlights (conquistas) se existirem
      if (highlights && highlights.length > 0) {
        await Promise.all(
          highlights.map(h =>
            prisma.highlight.create({
              data: {
                type: 'conquista',
                text: h.text,
                timelineTaskId: task.id
              }
            })
          )
        );
      }

      // Criar entraves (blockers) se existirem
      if (blockers && blockers.length > 0) {
        await Promise.all(
          blockers.map(b =>
            prisma.highlight.create({
              data: {
                type: 'entrave',
                text: b.text,
                severity: b.severity || 'alta',
                timelineTaskId: task.id
              }
            })
          )
        );
      }

      // Buscar a task completa com todas as relações
      const fullTask = await prisma.timelineTask.findUnique({
        where: { id: task.id },
        include: {
          demand: true,
          assignedDevs: {
            include: {
              dev: true
            }
          },
          highlights: true
        }
      });

      res.status(201).json(fullTask);
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
        status,
        demandId,
        devIds,         // Array de IDs de devs
        highlights,     // Array de { text: '...' }
        blockers        // Array de { text: '...', severity: 'alta' }
      } = req.body;

      // Atualizar a timeline task
      const updateData = {
        weekType,
        title,
        status,
        demandId
      };

      if (weekStart) updateData.weekStart = new Date(weekStart);
      if (weekEnd) updateData.weekEnd = new Date(weekEnd);

      const task = await prisma.timelineTask.update({
        where: { id },
        data: updateData
      });

      // Se devIds foi fornecido, atualizar associações
      if (devIds !== undefined) {
        // Remover associações antigas
        await prisma.timelineTaskAssignment.deleteMany({
          where: { timelineTaskId: id }
        });

        // Criar novas associações
        if (devIds.length > 0) {
          await Promise.all(
            devIds.map(devId =>
              prisma.timelineTaskAssignment.create({
                data: {
                  timelineTaskId: id,
                  devId: devId
                }
              })
            )
          );
        }
      }

      // Se highlights foi fornecido, atualizar
      if (highlights !== undefined) {
        // Remover conquistas antigas
        await prisma.highlight.deleteMany({
          where: {
            timelineTaskId: id,
            type: 'conquista'
          }
        });

        // Criar novas conquistas
        if (highlights.length > 0) {
          await Promise.all(
            highlights.map(h =>
              prisma.highlight.create({
                data: {
                  type: 'conquista',
                  text: h.text,
                  timelineTaskId: id
                }
              })
            )
          );
        }
      }

      // Se blockers foi fornecido, atualizar
      if (blockers !== undefined) {
        // Remover entraves antigos
        await prisma.highlight.deleteMany({
          where: {
            timelineTaskId: id,
            type: 'entrave'
          }
        });

        // Criar novos entraves
        if (blockers.length > 0) {
          await Promise.all(
            blockers.map(b =>
              prisma.highlight.create({
                data: {
                  type: 'entrave',
                  text: b.text,
                  severity: b.severity || 'alta',
                  timelineTaskId: id
                }
              })
            )
          );
        }
      }

      // Buscar a task completa com todas as relações
      const fullTask = await prisma.timelineTask.findUnique({
        where: { id },
        include: {
          demand: true,
          assignedDevs: {
            include: {
              dev: true
            }
          },
          highlights: true
        }
      });

      res.json(fullTask);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/timeline/:id - Remover tarefa
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      // Cascade delete vai remover automaticamente:
      // - TimelineTaskAssignment
      // - Highlight (com onDelete: Cascade)
      await prisma.timelineTask.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
