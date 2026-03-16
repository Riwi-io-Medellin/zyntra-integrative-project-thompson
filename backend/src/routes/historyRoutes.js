import { Router } from 'express';
import { getHistory } from '../controllers/historyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/history', getHistory);

export default router;

