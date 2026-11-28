import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

export function renderPage(path: string) {
  return renderToString(<StaticRouter location={path}><App /></StaticRouter>);
}

export { getPageSeo, notFoundPage, sitePages } from './lib/site-seo';
export { default as site } from './content/site.json';
export { default as contact } from './content/contact.json';
