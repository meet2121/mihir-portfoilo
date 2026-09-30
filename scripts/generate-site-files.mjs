import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const origin = process.env.SITE_URL?.trim().replace(/\/$/, '');
const output = join(process.cwd(), 'dist');
const routes = ['/', '/projects/accounting-ai/', '/projects/finsight-ai/', '/projects/ledger-flash/', '/projects/scrapeforge/'];

if (!origin) {
  // A valid sitemap requires an absolute public origin. Do not emit a fake one.
  await unlink(join(output, 'sitemap.xml')).catch(() => {});
  process.stdout.write('SITE_URL is unset; skipped sitemap.xml (set it for the public build).\n');
} else {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${origin}${route}</loc></url>`).join('\n')}
</urlset>
`;
  await writeFile(join(output, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, 'utf8');
  process.stdout.write(`Generated sitemap.xml for ${origin}.\n`);
}
