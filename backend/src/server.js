import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/index.js';

// Import routes
import devsRouter from './routes/devs.js';
import demandsRouter from './routes/demands.js';
import deliveriesRouter from './routes/deliveries.js';
import highlightsRouter from './routes/highlights.js';
import timelineRouter from './routes/timeline.js';
import configRouter from './routes/config.js';
import dashboardRouter from './routes/dashboard.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/devs', devsRouter);
app.use('/api/demands', demandsRouter);
app.use('/api/deliveries', deliveriesRouter);
app.use('/api/highlights', highlightsRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/config', configRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
