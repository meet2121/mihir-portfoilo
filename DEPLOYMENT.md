# Static deployment

This Astro site produces a provider-neutral static build in `dist/`.

## Build settings

- Root directory: `site`
- Install command: `npm ci`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `SITE_URL` = the final public origin, without a trailing slash

The same settings work on Vercel, Netlify and Cloudflare Pages. No server, database, API key or provider adapter is required.

`SITE_URL` enables absolute canonical and social-sharing URLs. Until the final domain is known, it is intentionally unset so the build does not publish a placeholder domain.
