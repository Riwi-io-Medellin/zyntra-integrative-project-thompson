import { Router } from 'express';
import { searchProduct } from '../controllers/searchController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.post('/search', searchProduct);

export default router;

