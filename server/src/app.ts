import path from 'node:path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import apiRouter from './routes/apiRouter';

const app = express();

// CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  })
);

// Morgan - HTTP Requests Logger
if (process.env.NODE_ENV === 'production') app.use(morgan('combined'));
else app.use(morgan('dev'));

// Incoming Requests with JSON payload parser
app.use(express.json());

// Serving Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Mounting Routers on Routes
app.use('/api/v1', apiRouter);

// Serve index.html (React App) on Root & all the other routes except above express routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
