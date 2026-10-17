// Site configuration
export const SITE = {
  title: 'Laravel SEO Platform | Automated Search Visibility Tools',
  description: 'Take control of your site’s search visibility with a fully automated optimisation suite built specifically for Laravel.',
  url: 'https://laravelseo.com',
  author: 'laravel seo',
} as const;

export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/capabilities' },
  { name: 'Tools', href: '/tools' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Blog', href: '/blog' },
  { name: 'SEO Agent', href: '/agent' },
  { name: 'Contact', href: '/contact' },
] as const;

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/laravelseo',
  twitter: 'https://twitter.com/laravelseo',
  facebook: 'https://facebook.com/laravelseo',
} as const;

