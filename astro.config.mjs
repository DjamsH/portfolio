import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: remplacer par le domaine définitif (ou définir SITE_URL au déploiement).
const site = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
