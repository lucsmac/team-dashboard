/**
 * Rotas para gerenciamento de alocações semanais de devs
 */
import express from 'express';
import {
  getAllocationsByWeek,
  getDevAllocationByWeek,
  getDevAllocationHistory,
  upsertAllocation,
  deleteAllocation,
  getCurrentWeekStats
} from '../controllers/devAllocationsController.js';

const router = express.Router();

// Rotas de estatísticas
router.get('/stats/current-week', getCurrentWeekStats);

// Rotas de consulta
router.get('/', getAllocationsByWeek);
router.get('/dev/:devId/week/:weekStart', getDevAllocationByWeek);
router.get('/dev/:devId/history', getDevAllocationHistory);

// Rotas de modificação
router.post('/', upsertAllocation);
router.delete('/:id', deleteAllocation);

export default router;
