// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { fileURLToPath } from 'node:url';

// Original media lives one level up in /assets and is never modified.
// Astro reads it at build time and emits optimised AVIF/WebP derivatives.
const assetsDir = fileURLToPath(new URL('../assets', import.meta.url));

export default defineConfig({
  // Static output only: deployable unchanged to Vercel or Netlify.
  output: 'static',
  // Set SITE_URL in the hosting provider once the final domain is known.
  // Leaving it unset avoids publishing a fake canonical origin.
  site: process.env.SITE_URL || undefined,
  integrations: [preact()],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: {
    resolve: { alias: { '@assets': assetsDir } },
    server: { fs: { allow: ['..'] } },
  },
});
