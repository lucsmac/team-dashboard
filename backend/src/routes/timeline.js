import express from 'express';
import { timelineController } from '../controllers/timelineController.js';

const router = express.Router();

router.get('/', timelineController.getAll);
router.get('/week/:weekType', timelineController.getByWeekType);
router.get('/:id', timelineController.getById);
router.post('/', timelineController.create);
router.put('/:id', timelineController.update);
router.delete('/:id', timelineController.delete);

export default router;
