import express from 'express';
import { highlightsController } from '../controllers/highlightsController.js';

const router = express.Router();

router.get('/', highlightsController.getAll);
router.get('/week/:weekStart/:weekEnd', highlightsController.getByWeek);
router.get('/type/:type', highlightsController.getByType);
router.get('/:id', highlightsController.getById);
router.post('/', highlightsController.create);
router.put('/:id', highlightsController.update);
router.delete('/:id', highlightsController.delete);

export default router;
