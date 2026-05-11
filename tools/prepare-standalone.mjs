import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const standaloneDir = join(root, '.next', 'standalone');

if (!existsSync(standaloneDir)) {
  process.exit(0);
}

const staticSource = join(root, '.next', 'static');
const staticTarget = join(standaloneDir, '.next', 'static');
const publicSource = join(root, 'public');
const publicTarget = join(standaloneDir, 'public');

mkdirSync(join(standaloneDir, '.next'), { recursive: true });

if (existsSync(staticSource)) {
  cpSync(staticSource, staticTarget, { recursive: true, force: true });
}

if (existsSync(publicSource)) {
  cpSync(publicSource, publicTarget, { recursive: true, force: true });
}

console.log('[prepare-standalone] Static assets copied into .next/standalone');
