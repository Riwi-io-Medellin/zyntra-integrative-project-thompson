import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import cookieParser from 'cookie-parser';

const router = Router();

router.use(cookieParser());
router.post('/login', login);
router.post('/register', register);

export default router;

