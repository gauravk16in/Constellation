// Deterministic raster exports of the original editable vector mark.
// Supply SHARP_MODULE only if sharp is supplied by the workspace runtime.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = path.join(__dirname, '../assets/images');
const source = fs.readFileSync(path.join(root, 'constellation-mark.svg'), 'utf8');
const svg = (value) => Buffer.from(value);
async function render() {
  await sharp(svg(source)).resize(1024, 1024).png().toFile(path.join(root, 'icon.png'));
  await sharp(svg(source)).resize(48, 48).png().toFile(path.join(root, 'favicon.png'));
  const transparent = source.replace('<rect width="100" height="100" fill="#0B1736"/>', '');
  await sharp(svg(transparent)).resize(1024, 1024).png().toFile(path.join(root, 'android-icon-foreground.png'));
  await sharp(svg(transparent.replaceAll('#F5EAFE', '#FFFFFF').replaceAll('#F3C969', '#FFFFFF'))).resize(1024, 1024).png().toFile(path.join(root, 'android-icon-monochrome.png'));
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#0B1736' } }).png().toFile(path.join(root, 'android-icon-background.png'));
}
render().catch((error) => { console.error(error.message); process.exitCode = 1; });
