import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import UnifiedServicePage from '@/components/services/UnifiedServicePage';
import { servicesData } from '@/lib/services';
import type { Service } from '@/library/types';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    return {
      title: 'Service Not Found - IdEinstein',
      description: 'The requested service could not be found.',
    };
  }

  return {
    title: `${service.title} - Professional Engineering Services | IdEinstein`,
    description: service.description,
    keywords: [
      service.title,
      ...service.category,
      ...service.features.slice(0, 3),
      'IdEinstein',
      'engineering services',
      'Germany'
    ].join(', '),
    openGraph: {
      title: `${service.title} - IdEinstein`,
      description: service.description,
      type: 'website',
      url: `https://ideinstein.com/services/${service.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} - IdEinstein`,
      description: service.description,
    },
  };
}

// Generate static params for build optimization
export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicesData[slug];

  // Return 404 if service not found
  if (!service) {
    notFound();
  }

  return <UnifiedServicePage service={service} />;
}