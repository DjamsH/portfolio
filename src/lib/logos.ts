import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const clientsDir = join(process.cwd(), 'public', 'logos', 'clients');

/** Rapport largeur / hauteur d'un SVG, d'après son viewBox ou ses attributs. */
function svgRatio(svg: string): number | undefined {
  const viewBox = svg.match(
    /viewBox\s*=\s*["']\s*[\d.+-]+[\s,]+[\d.+-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/,
  );
  if (viewBox) return Number(viewBox[1]) / Number(viewBox[2]);
  const width = svg.match(/<svg[^>]*\swidth\s*=\s*["']([\d.]+)/);
  const height = svg.match(/<svg[^>]*\sheight\s*=\s*["']([\d.]+)/);
  if (width && height) return Number(width[1]) / Number(height[1]);
  return undefined;
}

/** Rapport largeur / hauteur d'un PNG ou d'un JPEG, lu dans l'en-tête du fichier. */
function rasterRatio(data: Buffer): number | undefined {
  // PNG : largeur et hauteur dans le bloc IHDR.
  if (data.length > 24 && data.readUInt32BE(0) === 0x89504e47) {
    return data.readUInt32BE(16) / data.readUInt32BE(20);
  }
  // JPEG : on parcourt les segments jusqu'au marqueur SOF.
  if (data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < data.length && data[offset] === 0xff) {
      const marker = data[offset + 1];
      const isFrame =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isFrame) return data.readUInt16BE(offset + 7) / data.readUInt16BE(offset + 5);
      offset += 2 + data.readUInt16BE(offset + 2);
    }
  }
  return undefined;
}

/**
 * Rapport largeur / hauteur d'un logo client, lu au build pour réserver sa place (CLS = 0).
 * Formats reconnus : SVG (recommandé), PNG, JPEG.
 */
export function clientLogoRatio(file: string): number {
  try {
    const data = readFileSync(join(clientsDir, file));
    const ratio = /\.svg$/i.test(file) ? svgRatio(data.toString('utf-8')) : rasterRatio(data);
    if (ratio && Number.isFinite(ratio) && ratio > 0) return ratio;
  } catch {
    // Fichier absent : on retombe sur un rapport neutre.
  }
  return 4;
}
