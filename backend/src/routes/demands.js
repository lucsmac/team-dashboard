import express from 'express';
import { demandsController } from '../controllers/demandsController.js';

const router = express.Router();

router.get('/', demandsController.getAll);
router.get('/recent-completed/:days', demandsController.getRecentCompleted);
router.get('/category/:category', demandsController.getByCategory);
router.get('/:id', demandsController.getById);
router.post('/', demandsController.create);
router.put('/:id', demandsController.update);
router.delete('/:id', demandsController.delete);

export default router;
