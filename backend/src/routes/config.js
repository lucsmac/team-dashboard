import express from 'express';
import { configController } from '../controllers/configController.js';

const router = express.Router();

router.get('/', configController.getAll);
router.get('/:key', configController.getByKey);
router.post('/', configController.upsert);
router.delete('/:key', configController.delete);

export default router;
