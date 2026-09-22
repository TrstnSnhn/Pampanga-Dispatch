import { copyFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const packageRoot = path.dirname(createRequire(import.meta.url).resolve('maplibre-gl/package.json'));
const destination = new URL('../public/maplibre/', import.meta.url);
await mkdir(destination, { recursive: true });
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
  await copyFile(path.join(packageRoot, 'dist', file), new URL(file, destination));
}
await copyFile(path.join(packageRoot, 'LICENSE.txt'), new URL('LICENSE.txt', destination));
