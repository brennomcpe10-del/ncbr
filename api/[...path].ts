import express from 'express';
import { apiRouter } from '../server/routes/api.ts';

const app = express();

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Vercel already removes /api/[...path].ts from the function URL.
// Therefore the Express router must be mounted at the root here.
app.use('/', apiRouter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    server: 'NetCraftBR API',
    timestamp: new Date().toISOString()
  });
});

export default app;
