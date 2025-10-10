import express from 'express';
import { deliveriesController } from '../controllers/deliveriesController.js';

const router = express.Router();

router.get('/', deliveriesController.getAll);
router.get('/:id', deliveriesController.getById);
router.post('/', deliveriesController.create);
router.put('/:id', deliveriesController.update);
router.delete('/:id', deliveriesController.delete);

export default router;
