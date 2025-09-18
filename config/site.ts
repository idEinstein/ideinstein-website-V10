// config/site.ts
export const siteConfig = {
    name: 'IdEinstein',
    description: 'Where Ideas Take Shape',
    url: 'https://ideinstein.com',
    mainNav: [
      {
        title: 'Services',
        href: '/services',
        submenu: [
          { title: '3D Printing', href: '/services/3d-printing' },
          { title: 'CAD Design', href: '/services/cad-design' },
          { title: 'Prototyping', href: '/services/prototyping' }
        ]
      },
      { title: 'About', href: '/about' },
      { title: 'Blog', href: '/blog' },
      { title: 'Contact', href: '/contact' }
    ],
    links: {
      twitter: 'https://twitter.com/ideinstein',
      github: 'https://github.com/ideinstein',
      linkedin: 'https://linkedin.com/company/ideinstein'
    }
  } as const;