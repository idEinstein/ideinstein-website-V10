'use client';

import React from 'react';
import Image from 'next/image';
import { ResponsiveWrapper } from '../layout/ResponsiveWrapper';
import { 
  cardPadding, 
  cardTitle, 
  cardDescription, 
  cardIcon,
  responsiveSpacing,
  touchFriendlyHover
} from '@/lib/utils/responsive-utilities';
import { touchFriendlyCard, addTouchFeedback } from '@/lib/utils/touch-optimization';

export interface ResponsiveCardProps {
  children: React.ReactNode;
  variant?: 'service' | 'blog' | 'testimonial' | 'feature' | 'default';
  className?: string;
  onClick?: () => void;
  href?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  enableHover?: boolean;
  enableTouch?: boolean;
  preserveDesktop?: boolean;
  testId?: string;
}

/**
 * ResponsiveCard Component
 * 
 * Mobile-optimized card component with:
 * - Variant support for different card types
 * - Touch optimization with proper spacing and sizing
 * - Desktop layout preservation
 * - Responsive image handling
 */
export function ResponsiveCard({
  children,
  variant = 'default',
  className = '',
  onClick,
  href,
  title,
  description,
  icon,
  image,
  imageAlt,
  enableHover = true,
  enableTouch = true,
  preserveDesktop = true,
  testId = 'responsive-card'
}: ResponsiveCardProps) {
  
  // Variant-specific styling
  const getVariantClasses = (): string => {
    const variants = {
      service: `
        bg-white border border-gray-200 rounded-lg shadow-sm
        hover:shadow-md hover:border-blue-300
        ${cardPadding()}
      `,
      blog: `
        bg-white border border-gray-200 rounded-lg shadow-sm
        hover:shadow-lg hover:border-gray-300
        overflow-hidden
      `,
      testimonial: `
        bg-gray-50 border border-gray-200 rounded-lg
        ${cardPadding()}
        relative
      `,
      feature: `
        bg-gradient-to-br from-blue-50 to-indigo-50
        border border-blue-200 rounded-lg
        ${cardPadding()}
        hover:from-blue-100 hover:to-indigo-100
      `,
      default: `
        bg-white border border-gray-200 rounded-lg shadow-sm
        hover:shadow-md
        ${cardPadding()}
      `
    };
    
    return variants[variant];
  };

  // Touch optimization classes
  const touchClasses = enableTouch ? touchFriendlyCard() : '';
  
  // Hover classes with desktop preservation
  const hoverClasses = enableHover ? touchFriendlyHover('hover:shadow-md transition-shadow duration-200') : '';

  // Combine all classes
  const cardClasses = `
    ${getVariantClasses()}
    ${touchClasses}
    ${hoverClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Card content structure based on variant
  const renderCardContent = () => {
    switch (variant) {
      case 'service':
        return (
          <>
            {icon && (
              <div className={`${cardIcon()} text-blue-600 mb-4`}>
                {icon}
              </div>
            )}
            {title && (
              <h3 className={`${cardTitle()} font-semibold text-gray-900 mb-2`}>
                {title}
              </h3>
            )}
            {description && (
              <p className={`${cardDescription()} text-gray-600 mb-4`}>
                {description}
              </p>
            )}
            {children}
          </>
        );
        
      case 'blog':
        return (
          <>
            {image && (
              <div className="aspect-video w-full overflow-hidden relative">
                <Image 
                  src={image} 
                  alt={imageAlt || title || 'Blog post image'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className={cardPadding()}>
              {title && (
                <h3 className={`${cardTitle()} font-semibold text-gray-900 mb-2`}>
                  {title}
                </h3>
              )}
              {description && (
                <p className={`${cardDescription()} text-gray-600 mb-4`}>
                  {description}
                </p>
              )}
              {children}
            </div>
          </>
        );
        
      case 'testimonial':
        return (
          <>
            <div className="absolute top-4 left-4 text-blue-500 opacity-20">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>
            {children}
            {title && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className={`${cardTitle()} font-medium text-gray-900`}>
                  {title}
                </p>
                {description && (
                  <p className={`${cardDescription()} text-gray-500`}>
                    {description}
                  </p>
                )}
              </div>
            )}
          </>
        );
        
      case 'feature':
        return (
          <>
            {icon && (
              <div className={`${cardIcon()} text-blue-600 mb-4`}>
                {icon}
              </div>
            )}
            {title && (
              <h3 className={`${cardTitle()} font-semibold text-gray-900 mb-2`}>
                {title}
              </h3>
            )}
            {description && (
              <p className={`${cardDescription()} text-gray-600`}>
                {description}
              </p>
            )}
            {children}
          </>
        );
        
      default:
        return (
          <>
            {title && (
              <h3 className={`${cardTitle()} font-semibold text-gray-900 mb-2`}>
                {title}
              </h3>
            )}
            {description && (
              <p className={`${cardDescription()} text-gray-600 mb-4`}>
                {description}
              </p>
            )}
            {children}
          </>
        );
    }
  };

  // Render as link or button if href/onClick provided
  if (href) {
    return (
      <a
        href={href}
        className={cardClasses}
        data-testid={testId}
        data-variant={variant}
      >
        {renderCardContent()}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${cardClasses} text-left w-full`}
        data-testid={testId}
        data-variant={variant}
      >
        {renderCardContent()}
      </button>
    );
  }

  return (
    <div
      className={cardClasses}
      data-testid={testId}
      data-variant={variant}
    >
      {renderCardContent()}
    </div>
  );
}

// Card grid wrapper for multiple cards
export interface ResponsiveCardGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
}

export function ResponsiveCardGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 'gap-4', tablet: 'gap-6', desktop: 'gap-8' },
  className = ''
}: ResponsiveCardGridProps) {
  const gridClasses = `
    grid
    grid-cols-${columns.mobile || 1}
    sm:grid-cols-${columns.tablet || 2}
    lg:grid-cols-${columns.desktop || 3}
    ${gap.mobile || 'gap-4'}
    sm:${gap.tablet || 'gap-6'}
    lg:${gap.desktop || 'gap-8'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <ResponsiveWrapper
      className={gridClasses}
      mobileLayout="grid"
      desktopLayout="grid"
      touchOptimized={true}
    >
      {children}
    </ResponsiveWrapper>
  );
}

// Preset card configurations
export const ResponsiveCardPresets = {
  serviceCard: {
    variant: 'service' as const,
    enableHover: true,
    enableTouch: true
  },
  
  blogCard: {
    variant: 'blog' as const,
    enableHover: true,
    enableTouch: true
  },
  
  testimonialCard: {
    variant: 'testimonial' as const,
    enableHover: false,
    enableTouch: false
  },
  
  featureCard: {
    variant: 'feature' as const,
    enableHover: true,
    enableTouch: true
  }
};

export default ResponsiveCard;