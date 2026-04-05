import dotenv from 'dotenv';
dotenv.config();

console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes.js';   // ⚠️ must add .js extension

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: NODE_ENV });
});

// API routes
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
});
