import express from 'express';
import {
  getAllIntegrations,
  getIntegrationById,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegrationConnection,
  getIntegrationMetrics
} from '../controllers/jiraIntegrationController.js';

const router = express.Router();

// CRUD de integrações
router.get('/', getAllIntegrations);
router.get('/:id', getIntegrationById);
router.post('/', createIntegration);
router.put('/:id', updateIntegration);
router.delete('/:id', deleteIntegration);

// Ações especiais
router.get('/:id/test', testIntegrationConnection);
router.get('/:id/metrics', getIntegrationMetrics);

export default router;
