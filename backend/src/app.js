import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { errorHandler } from './utils/errorHandler.js';
import { createTables } from './config/mysql.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // La URL de tu frontend (Vite)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create tables on startup
createTables().catch(console.error);

// Routes
app.use('/auth', authRoutes);
app.use('/api', searchRoutes);
app.use('/api', historyRoutes);

app.use(errorHandler);

export default app;
