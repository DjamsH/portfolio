/**
 * Génère les placeholders : logos clients (nom en capitales) et portrait.
 * N'écrase jamais un fichier existant : les vrais SVG et le vrai portrait sont conservés.
 *   node scripts/make-placeholders.mjs          crée ce qui manque
 *   node scripts/make-placeholders.mjs --force  régénère tout
 * Demande Node 23.6+ (import direct de src/content/site.ts).
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { clients } from '../src/content/site.ts';

const force = process.argv.includes('--force');
const root = process.cwd();
const clientsDir = join(root, 'public', 'logos', 'clients');
mkdirSync(clientsDir, { recursive: true });

const HEIGHT = 40;
const FONT = 26;
for (const client of clients) {
  const file = client.file;
  // Nom court pour le placeholder : sans la parenthèse ni le préfixe d'enseigne.
  const name = client.name.split(' (')[0].replace('Tapis ', '');
  const target = join(clientsDir, file);
  if (existsSync(target) && !force) continue;
  const label = name.toUpperCase();
  // Largeur fixée par textLength : le rendu ne dépend pas de la police disponible.
  const textWidth = Math.round(label.length * FONT * 0.74);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${textWidth} ${HEIGHT}" width="${textWidth}" height="${HEIGHT}" role="img" aria-label="${name}">
  <!-- Placeholder : à remplacer par le SVG officiel de ${name}. -->
  <text x="0" y="29" textLength="${textWidth}" lengthAdjust="spacing" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="${FONT}" font-weight="600" fill="#121212">${label}</text>
</svg>
`;
  writeFileSync(target, svg);
  console.log('logo   ', file);
}

const portrait = join(root, 'public', 'portrait.jpg');
if (!existsSync(portrait) || force) {
  const W = 960;
  const H = 1200;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#E4E2DA"/>
  <circle cx="480" cy="470" r="150" fill="#D3D1C8"/>
  <path d="M170 1200c0-250 140-420 310-420s310 170 310 420z" fill="#D3D1C8"/>
  <text x="480" y="1130" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="600" letter-spacing="6" fill="#5E5E58">PORTRAIT À FOURNIR</text>
</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(portrait);
  console.log('portrait', 'public/portrait.jpg');
}
