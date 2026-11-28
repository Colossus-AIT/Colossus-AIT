import site from '@/content/site.json';
import contact from '@/content/contact.json';
import navigation from '@/content/navigation.json';
import mockHackathon from '@/content/mock-hackathon-2026.json';

export const sitePages = [
  {
    path: '/',
    file: 'index.html',
    name: 'Home',
    title: 'Colossus Tech Club | Akshaya Institute of Technology, Tumakuru',
    description: 'Explore Colossus Tech Club at Akshaya Institute of Technology in Tumakuru, including student projects, coding workshops, technical events and hackathons.',
  },
  {
    path: '/events',
    file: 'events.html',
    name: 'Events',
    title: 'Technical Events and Hackathons | Colossus Tech Club',
    description: 'Explore technical events organised by Colossus Tech Club at AIT, Tumakuru, including Mock Hackathon 2026, the Full Stack Workshop and the club inauguration.',
  },
  {
    path: '/projects',
    file: 'projects.html',
    name: 'Department Projects',
    title: 'ISE Department Projects | Colossus Tech Club',
    description: 'Browse the Colossus Tech Club department project showcase for Information Science and Engineering at Akshaya Institute of Technology, Tumakuru.',
  },
];

export const notFoundPage = {
  path: '/404',
  file: '404.html',
  name: 'Page not found',
  title: 'Page Not Found | Colossus Tech Club',
  description: 'Find Colossus Tech Club events, projects and contact information from the homepage.',
};

export function getPageSeo(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const page = sitePages.find(entry => entry.path === path || `/${entry.file}` === path)
    ?? (path === mockHackathon.path ? sitePages[1] : notFoundPage);
  const canonical = page === notFoundPage ? null : new URL(page.path, site.origin).href;
  const orgId = `${site.origin}/#club`;
  const websiteId = `${site.origin}/#website`;
  const institutionId = `${site.origin}/#institution`;
  const departmentId = `${site.origin}/#department`;
  const schema = canonical ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollegeOrUniversity',
        '@id': institutionId,
        name: site.institution,
        address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'IN' },
      },
      {
        '@type': 'Organization',
        '@id': departmentId,
        name: site.department,
        url: site.departmentUrl,
        parentOrganization: { '@id': institutionId },
      },
      {
        '@type': 'Organization',
        '@id': orgId,
        name: site.name,
        alternateName: 'Colossus AIT',
        url: `${site.origin}/`,
        logo: new URL(navigation.darkLogo, site.origin).href,
        description: site.summary,
        email: contact.email,
        sameAs: contact.socials.map(profile => profile.href),
        parentOrganization: { '@id': departmentId },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: site.name,
        url: `${site.origin}/`,
        publisher: { '@id': orgId },
        inLanguage: 'en-IN',
      },
      {
        '@type': page.path === '/' ? 'WebPage' : 'CollectionPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: page.title,
        description: page.description,
        about: { '@id': orgId },
        isPartOf: { '@id': websiteId },
        inLanguage: 'en-IN',
      },
    ],
  } : null;

  const image = new URL(site.shareImage, site.origin).href;
  const meta: Array<[string, string, string]> = [
    ['name', 'description', page.description],
    ['name', 'robots', canonical ? 'index, follow, max-image-preview:large' : 'noindex, follow'],
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', site.name],
    ['property', 'og:locale', 'en_IN'],
    ['property', 'og:title', page.title],
    ['property', 'og:description', page.description],
    ['property', 'og:image', image],
    ['property', 'og:image:alt', site.shareImageAlt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', page.title],
    ['name', 'twitter:description', page.description],
    ['name', 'twitter:image', image],
    ['name', 'twitter:image:alt', site.shareImageAlt],
  ];
  if (canonical) meta.push(['property', 'og:url', canonical]);

  return { page, canonical, meta, schema };
}
