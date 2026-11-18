/**
 * Génère public/og.png (1200 × 630) dans le style du site, à partir de src/content/site.ts.
 * À relancer quand le titre de une change :  npm run og
 * Demande Node 23.6+ (import direct du fichier TypeScript) et Edge ou Chrome sur le poste.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import { hero, identity, strap } from '../src/content/site.ts';

const root = process.cwd();
const font = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(join(root, 'node_modules', pkg, 'files', file)).toString('base64')}`;

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const title = hero.titleLines
  .map((line) =>
    line.accent ? `<span class="line"><em>${escape(line.text)}</em></span>` : `<span class="line">${escape(line.text)}</span>`,
  )
  .join('');

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Instrument Serif'; font-weight: 400; src: url(${font('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2')}) format('woff2'); }
  @font-face { font-family: 'Instrument Serif'; font-weight: 400; font-style: italic; src: url(${font('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff2')}) format('woff2'); }
  @font-face { font-family: 'Inter'; font-weight: 100 900; src: url(${font('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2')}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; padding: 44px 56px 48px; background: #F6F5F1; color: #121212; display: flex; flex-direction: column; }
  .top { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 14px; border-bottom: 2px solid #121212; }
  .name { font: 400 34px/1 'Instrument Serif', serif; letter-spacing: -0.02em; }
  .label { font: 500 14px/1.4 'Inter', sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #5E5E58; }
  h1 { margin-top: auto; font: 400 108px/0.92 'Instrument Serif', serif; letter-spacing: -0.025em; }
  .line { display: block; }
  em { position: relative; display: inline-block; font-style: italic; color: #C2410C; }
  em::after { content: ''; position: absolute; left: 2px; right: 4px; bottom: 2px; height: 3px; background: #C2410C; }
  .bottom { margin-top: 30px; padding-top: 14px; border-top: 1px solid #121212; display: flex; justify-content: space-between; }
</style>
</head>
<body>
  <div class="top">
    <p class="name">${escape(identity.name)}</p>
    <p class="label">${escape(identity.role)}</p>
  </div>
  <h1>${title}</h1>
  <div class="bottom">
    <p class="label">${strap.slice(0, 4).map(escape).join(' · ')}</p>
    <p class="label">${escape(strap[strap.length - 1])}</p>
  </div>
</body>
</html>`;

const browser = await chromium.launch({ channel: process.env.OG_BROWSER ?? 'msedge' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(root, 'public', 'og.png') });
await browser.close();
console.log('public/og.png');
