import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import AppServerModule from './src/main.server';
import { NgExpressEngineDecorator, ngExpressEngine as engine } from '@spartacus/setup/ssr';
import { APP_BASE_HREF } from '@angular/common';

const ngExpressEngine = NgExpressEngineDecorator.get(engine);

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  server.set('trust proxy', 'loopback');

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y',
    setHeaders: (res, path) => {
      // Log static file requests
      console.log(`Serving static file: ${path}`);
    }
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    // Log dynamic requests being handled by Angular Universal
    console.log(`Handling dynamic request for: ${req.originalUrl}`);

    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run() {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();