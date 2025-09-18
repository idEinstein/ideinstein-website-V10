import { type LucideIcon } from 'lucide-react';

// Audience Benefits Types
export interface BenefitBullet {
  id: string;
  text: string;
  metric: string;
  icon: LucideIcon;
  category: 'time' | 'cost' | 'quality' | 'reliability';
}

// Business-outcome focused benefits
export interface BusinessOutcomeBenefit {
  id: string;
  outcome: string; // Business result, not process
  financialImpact: string; // Specific cost/time savings
  reliability: string; // Success rate or guarantee
  category: 'manufacturing' | 'timeline' | 'cost' | 'quality';
  icon: LucideIcon;
  audience: 'startup' | 'enterprise' | 'both';
}

export interface EnhancedAudienceCardProps {
  title: string;
  description: string;
  benefits: BenefitBullet[];
  ctaText: string;
  ctaAction: () => void;
  className?: string;
}

// Competitive Comparison Types
export interface ComparisonRow {
  feature: string;
  idEinstein: string;
  agency: string;
  freelancer: string;
  icon: LucideIcon;
  priority: 'high' | 'medium' | 'low';
}

export interface CompetitiveComparisonProps {
  showMobileOptimized?: boolean;
  highlightIdEinstein?: boolean;
  className?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  eventName: string;
  category: 'benefit_interaction' | 'comparison_view' | 'path_selection';
  properties?: Record<string, any>;
}

// Category and styling types
export type BenefitCategory = 'time' | 'cost' | 'quality' | 'reliability';
export type BusinessOutcomeCategory = 'manufacturing' | 'timeline' | 'cost' | 'quality';
export type Priority = 'high' | 'medium' | 'low';
export type ComparisonColumn = 'idEinstein' | 'agency' | 'freelancer';