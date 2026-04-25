import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = process.cwd();
const assetsDir = path.join(rootDir, 'assets');
const logoSvgPath = path.join(rootDir, 'public', 'logo.svg');
const fallbackLogoPath = path.join(rootDir, 'public', 'apple-icon.png');
const sourcePath = await fileExists(logoSvgPath) ? logoSvgPath : fallbackLogoPath;

const navy = '#0f172a';

await fs.mkdir(assetsDir, { recursive: true });

const iconLogo = await renderLogo(760);
const foregroundLogo = await renderLogo(780);
const splashLogo = await renderLogo(1100);

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 3,
    background: navy,
  },
})
  .composite([{ input: iconLogo, gravity: 'center' }])
  .png()
  .toFile(path.join(assetsDir, 'icon-only.png'));

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: '#00000000',
  },
})
  .composite([{ input: foregroundLogo, gravity: 'center' }])
  .png()
  .toFile(path.join(assetsDir, 'icon-foreground.png'));

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 3,
    background: navy,
  },
})
  .png()
  .toFile(path.join(assetsDir, 'icon-background.png'));

for (const fileName of ['splash.png', 'splash-dark.png']) {
  await sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 3,
      background: navy,
    },
  })
    .composite([{ input: splashLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(assetsDir, fileName));
}

console.log(`Generated mobile icon and splash sources from ${path.relative(rootDir, sourcePath)}`);

async function renderLogo(size) {
  return sharp(sourcePath, { density: 512 })
    .resize(size, size, {
      fit: 'contain',
      background: '#00000000',
    })
    .png()
    .toBuffer();
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
