import express from 'express';
import { devsController } from '../controllers/devsController.js';

const router = express.Router();

router.get('/', devsController.getAll);
router.get('/:id', devsController.getById);
router.post('/', devsController.create);
router.put('/:id', devsController.update);
router.delete('/:id', devsController.delete);

export default router;
