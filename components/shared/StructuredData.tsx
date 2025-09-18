// Server component for structured data - no client-side functionality needed
// import { CONTACT_INFO } from '@/lib/constants'; // Unused
import { headers } from 'next/headers';

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'service' | 'article';
  data?: unknown;
}

export default async function StructuredData({ type = 'organization', data }: StructuredDataProps) {
  // Get nonce from middleware headers for CSP compliance
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'IdEinstein',
          url: 'https://ideinstein.com',
          logo: 'https://ideinstein.com/logo.png',
          description: 'Professional engineering services including 3D printing, CAD modeling, FEA/CFD analysis, and manufacturing solutions.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Walter-Petri-Ring 49',
            addressLocality: 'Taunusstein',
            postalCode: '65232',
            addressCountry: 'Germany',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+49-151-4222-7760',
            contactType: 'customer service',
            email: 'info@ideinstein.com',
          },
          sameAs: [
            'https://linkedin.com/company/ideinstein',
            'https://twitter.com/ideinstein',
            'https://facebook.com/ideinstein',
            'https://instagram.com/ideinstein'
          ],
          foundingDate: '2020',
          numberOfEmployees: '10-50',
          industry: 'Engineering Services',
          serviceArea: {
            '@type': 'Place',
            name: 'Germany'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Engineering Services',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '3D Printing Services',
                  description: 'Professional 3D printing and rapid prototyping services'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'CAD Modeling',
                  description: 'Professional CAD modeling and design services'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'FEA & CFD Analysis',
                  description: 'Advanced structural and fluid dynamics analysis'
                }
              }
            ]
          }
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'IdEinstein',
          url: 'https://ideinstein.com',
          description: 'Professional engineering services including 3D printing, CAD modeling, and manufacturing solutions.',
          publisher: {
            '@type': 'Organization',
            name: 'IdEinstein'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://ideinstein.com/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        };

      case 'service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: (data as any)?.name || 'Engineering Services',
          description: (data as any)?.description || 'Professional engineering and manufacturing services',
          provider: {
            '@type': 'Organization',
            name: 'IdEinstein',
            url: 'https://ideinstein.com'
          },
          serviceType: (data as any)?.serviceType || 'Engineering Services',
          areaServed: {
            '@type': 'Place',
            name: 'Germany'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: (data as any)?.name || 'Engineering Services',
            itemListElement: (data as any)?.features?.map((feature: string) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: feature.split(':')[0],
                description: feature.split(':')[1]?.trim()
              }
            })) || []
          }
        };

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: (data as any)?.title,
          description: (data as any)?.description,
          image: (data as any)?.image,
          author: {
            '@type': 'Organization',
            name: 'IdEinstein'
          },
          publisher: {
            '@type': 'Organization',
            name: 'IdEinstein',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ideinstein.com/logo.png'
            }
          },
          datePublished: (data as any)?.publishedAt,
          dateModified: (data as any)?.updatedAt || (data as any)?.publishedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': (data as any)?.url
          }
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  // Ensure deterministic JSON output for consistent server/client rendering
  const jsonString = JSON.stringify(structuredData, null, 2);

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: jsonString,
      }}
    />
  );
}