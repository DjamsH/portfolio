import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const clientsDir = join(process.cwd(), 'public', 'logos', 'clients');

/** Rapport largeur / hauteur d'un SVG client, lu au build pour réserver sa place (CLS = 0). */
export function clientLogoRatio(file: string): number {
  try {
    const svg = readFileSync(join(clientsDir, file), 'utf-8');
    const viewBox = svg.match(
      /viewBox\s*=\s*["']\s*[\d.+-]+[\s,]+[\d.+-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/,
    );
    if (viewBox) return Number(viewBox[1]) / Number(viewBox[2]);
    const width = svg.match(/<svg[^>]*\swidth\s*=\s*["']([\d.]+)/);
    const height = svg.match(/<svg[^>]*\sheight\s*=\s*["']([\d.]+)/);
    if (width && height) return Number(width[1]) / Number(height[1]);
  } catch {
    // Fichier absent : on retombe sur un rapport neutre.
  }
  return 4;
}
