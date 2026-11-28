import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ mode: 'production', server: { middlewareMode: true, watch: null, hmr: false }, appType: 'custom' });
const escape = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

try {
  const { renderPage, getPageSeo, notFoundPage, sitePages, site, contact } = await server.ssrLoadModule('/src/entry-static.tsx');
  const template = await readFile('dist/index.html', 'utf8');
  for (const route of [...sitePages, notFoundPage]) {
    const { page, canonical, schema, meta } = getPageSeo(route.path);
    const tags = meta.map(([attribute, name, value]) => `<meta data-site-seo ${attribute}="${name}" content="${escape(value)}">`);
    if (canonical) tags.push(`<link data-site-seo rel="canonical" href="${escape(canonical)}">`);
    if (schema) tags.push(`<script data-site-seo type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`);
    const html = template
      .replace(/<title>[^<]*<\/title>/, () => `<title>${escape(page.title)}</title>\n    ${tags.join('\n    ')}`)
      .replace('<div id="root"></div>', () => `<div id="root">${renderPage(route.path)}</div>`);
    await writeFile(`dist/${route.file}`, html);
  }

  const urls = sitePages.map(({ path }) => new URL(path, site.origin).href);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
  await writeFile('dist/llms.txt', `# ${site.name}\n\n> ${site.summary}\n\n${site.activities}\n\n## Site pages\n\n${sitePages.map(page => `- [${page.name}](${new URL(page.path, site.origin).href}): ${page.description}`).join('\n')}\n- [Contact the club](${site.origin}/#contact): ${contact.email}\n`);
} finally {
  await server.close();
}
