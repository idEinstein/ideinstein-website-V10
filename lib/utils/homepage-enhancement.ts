import { type BenefitCategory, type BusinessOutcomeCategory, type Priority, type ComparisonColumn } from '@/lib/types/homepage-enhancement';

// Category color mapping for consistent styling
export const categoryColors: Record<BenefitCategory, string> = {
  time: 'text-blue-600',
  cost: 'text-green-600', 
  quality: 'text-purple-600',
  reliability: 'text-orange-600'
};

export const categoryBackgrounds: Record<BenefitCategory, string> = {
  time: 'bg-blue-50',
  cost: 'bg-green-50',
  quality: 'bg-purple-50', 
  reliability: 'bg-orange-50'
};

// Business outcome category styling
export const businessOutcomeCategoryColors: Record<BusinessOutcomeCategory, string> = {
  manufacturing: 'text-green-600',
  timeline: 'text-blue-600',
  cost: 'text-emerald-600',
  quality: 'text-purple-600'
};

export const businessOutcomeCategoryBackgrounds: Record<BusinessOutcomeCategory, string> = {
  manufacturing: 'bg-green-50',
  timeline: 'bg-blue-50',
  cost: 'bg-emerald-50',
  quality: 'bg-purple-50'
};

// Priority-based styling
export const priorityStyles: Record<Priority, string> = {
  high: 'font-semibold text-gray-900',
  medium: 'font-medium text-gray-800',
  low: 'font-normal text-gray-700'
};

// Column styling for visual hierarchy
export const columnStyles: Record<ComparisonColumn, string> = {
  idEinstein: 'bg-green-50 border-green-200 text-green-900',
  agency: 'bg-gray-50 text-gray-700',
  freelancer: 'bg-gray-50 text-gray-700'
};

// Utility function to get category-specific styling
export const getCategoryStyle = (category: BenefitCategory) => ({
  textColor: categoryColors[category],
  backgroundColor: categoryBackgrounds[category]
});

// Utility function to get business outcome category styling
export const getBusinessOutcomeCategoryStyle = (category: BusinessOutcomeCategory) => ({
  textColor: businessOutcomeCategoryColors[category],
  backgroundColor: businessOutcomeCategoryBackgrounds[category]
});

// Utility function to format metrics for display
export const formatMetric = (metric: string): string => {
  // Add any specific formatting logic here
  return metric;
};

// Utility function to track analytics events
export const trackBenefitInteraction = (benefitId: string, category: BenefitCategory) => {
  // Analytics tracking implementation will be added in later tasks
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'benefit_interaction', {
      event_category: 'homepage_enhancement',
      event_label: benefitId,
      custom_parameters: {
        benefit_id: benefitId,
        category: category
      }
    });
  }
};

export const trackComparisonView = (feature: string) => {
  // Analytics tracking implementation will be added in later tasks
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'comparison_view', {
      event_category: 'homepage_enhancement',
      event_label: feature,
      custom_parameters: {
        feature: feature
      }
    });
  }
};