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

  // Optional durable persistence: a local file (RLH_STORE_FILE) and/or Supabase
  // (SUPABASE_URL + SUPABASE_ANON_KEY). With none set, the app runs the classic
  // in-memory demo seeded fresh on each boot.
  const storeFile = process.env.RLH_STORE_FILE;
  if (storeFile) {
    const restored = db.initFilePersistence(storeFile);
    console.log(`[RLH] Persistence ${restored ? 'restored from' : 'initialized at'} ${storeFile}`);
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    await db.initSupabasePersistence(supabaseUrl, supabaseKey);
    console.log(`[RLH] Supabase persistence bound to ${supabaseUrl}`);
  }

  // TEMPORARY diagnostic — confirms at boot whether the Resend env vars are
  // actually visible to this process (never logs the key itself). Remove
  // once the contact-form email issue is confirmed fixed.
  console.log(
    `[RLH] DIAG: RESEND_API_KEY present=${Boolean(process.env.RESEND_API_KEY)} ` +
    `CONTACT_NOTIFICATION_EMAIL present=${Boolean(process.env.CONTACT_NOTIFICATION_EMAIL)}`
  );

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
