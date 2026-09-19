import express from 'express';
import path from 'path';
import { existsSync } from 'fs';
import { createServer as createViteServer } from 'vite';
import { v1Router } from './src/server/api/v1/router.ts';
import { seedDatabase } from './src/server/fixtures/seed.ts';
import { db } from './src/server/db/store.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize in-memory database with synthetic fixture
  await seedDatabase();
  console.log('[RLH] Database seeded with synthetic fixture revenue-leak-fixture-v1');

  // Optional durable persistence: set RLH_STORE_FILE to a JSON file path and
  // all in-memory data (recoveries, payments, settings, audit logs...) will
  // survive server restarts instead of resetting to the fixture.
  const storeFile = process.env.RLH_STORE_FILE;
  if (storeFile) {
    const restored = db.initFilePersistence(storeFile);
    console.log(`[RLH] Persistence ${restored ? 'restored from' : 'initialized at'} ${storeFile}`);
  }

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Revenue Leak Hunter', timestamp: new Date().toISOString() });
  });

  // Serve documentation file
  app.get('/DOCUMENTATION.md', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'DOCUMENTATION.md'));
  });

  // Serve Word docx documentation file
  app.get('/Revenue-Leak-Hunter-Documentation.docx', (req, res) => {
    const filePath = path.join(process.cwd(), 'public', 'Revenue-Leak-Hunter-Documentation.docx');
    res.download(filePath, 'Revenue-Leak-Hunter-Documentation.docx');
  });

  // Mount API v1 router
  app.use('/api/v1', v1Router);

  // Vite middleware for development / static serving in production.
  // Production (serving dist/) is the default so `npm run start` and hosting
  // platforms (Render) Just Work; the Vite dev server is only used when the
  // app has not been built yet (i.e. plain `npm run dev`).
  const distIndex = path.join(process.cwd(), 'dist', 'index.html');
  if (process.env.NODE_ENV !== 'production' && !existsSync(distIndex)) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RLH] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[RLH] Failed to start server:', err);
  process.exit(1);
});
