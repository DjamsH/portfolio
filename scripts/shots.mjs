/**
 * Captures de vérification (Playwright, navigateur du poste).
 *
 *   npm run build && npm run preview        (dans un autre terminal)
 *   node scripts/shots.mjs                  toutes les sections, 1440 et 390 px
 *   node scripts/shots.mjs --only hero      une seule section
 *   node scripts/shots.mjs --reduce         avec prefers-reduced-motion (page entière)
 *
 * Options : --url http://localhost:4321/  --out shots  --widths 1440,390,768,1280
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const url = option('url', 'http://localhost:4321/');
const out = option('out', 'shots');
const only = option('only', '');
const reduce = args.includes('--reduce');
const widths = option('widths', '1440,390').split(',').map(Number);
const heights = { 1440: 900, 1280: 800, 768: 1024, 390: 844 };

// Section : sélecteur, puis fractions de sa hauteur où capturer.
const sections = [
  ['hero', 'header', [0]],
  ['chiffres', '#chiffres-title', [0]],
  ['clients', '#clients-title', [0]],
  ['cas-safran', '#cas-safran', [0, 0.45]],
  ['cas-oscaro', '#cas-oscaro', [0, 0.45]],
  ['cas-saint-maclou', '#cas-saint-maclou', [0, 0.45]],
  ['cas-auchan', '#cas-auchan', [0, 0.45]],
  ['parcours', '#parcours', [0, 0.35, 0.7, 1]],
  ['stack', '#stack', [0]],
  ['offre', '#offre', [0]],
  ['contact', '#contact', [0]],
];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: option('channel', 'msedge') });

for (const width of widths) {
  const height = heights[width] ?? 900;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? 'reduce' : 'no-preference',
    hasTouch: width < 800,
    isMobile: width < 800,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);

  if (reduce) {
    await page.screenshot({ path: join(out, `reduce-${width}.png`), fullPage: true });
  } else {
    for (const [name, selector, steps] of sections) {
      if (only && !name.startsWith(only)) continue;
      const box = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (!element) return null;
        const target = element.closest('section, article, header') ?? element;
        const rect = target.getBoundingClientRect();
        return { top: rect.top + window.scrollY, height: rect.height };
      }, selector);
      if (!box) continue;
      for (const [index, step] of steps.entries()) {
        // Scène épinglée : on avance dans la durée d'épinglage, pas dans la hauteur de la section.
        const pinned = name === 'parcours' && width >= 1024;
        const travel = pinned ? height * 2.2 : Math.max(0, box.height - height * 0.6);
        const y = Math.max(0, Math.round(box.top - (name === 'hero' ? 0 : 40) + travel * step));
        // Défilement progressif : laisse ScrollTrigger et Lenis suivre comme un vrai scroll.
        await page.evaluate(async (target) => {
          const start = window.scrollY;
          const frames = 24;
          for (let i = 1; i <= frames; i += 1) {
            window.scrollTo(0, start + ((target - start) * i) / frames);
            await new Promise((resolve) => requestAnimationFrame(resolve));
          }
        }, y);
        await page.waitForTimeout(1900);
        await page.screenshot({ path: join(out, `${name}-${width}-${index}.png`) });
      }
    }
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log(`${width}px  débordement horizontal: ${overflow}px  erreurs: ${errors.length}`);
  errors.slice(0, 5).forEach((error) => console.log('   ', error));
  await context.close();
}

await browser.close();
