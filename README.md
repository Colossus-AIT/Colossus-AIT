# Colossus Tech Club

To update the website, start with the [content editing guide](src/content/README.md). It shows which file to open for each section and how to update text, links, and images.

To preview your changes locally, run `npm install` once, then run `npm run dev` and open the address printed in the terminal.

## Production preview and search metadata

Run `npm run build` and then `npm run preview` to check the production output. The build generates page HTML for Home, Events, Projects, and the custom 404, plus `sitemap.xml`, `robots.txt`, and `llms.txt`. Vercel serves the pages at clean URLs and redirects the retired Mock Hackathon page to Events.

Edit the club identity and canonical domain in [site.json](src/content/site.json), and edit individual page titles and descriptions in [site-seo.ts](src/lib/site-seo.ts). Each production build regenerates the search files from those sources. Keep the canonical domain set to the public production URL, including on previews.

New photos can use their original paths in the content files. To deliver smaller versions, add WebP files under `public/images/optimized` and list their URLs and pixel dimensions under the original path in [media.json](src/content/media.json). The lightbox uses the original gallery images.
