// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  // Static output only: deployable unchanged to Vercel or Netlify.
  output: 'static',
  // Set SITE_URL in the hosting provider once the final domain is known.
  // Leaving it unset avoids publishing a fake canonical origin.
  site: process.env.SITE_URL || undefined,
  integrations: [preact()],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
