import { 
  Zap, 
  Euro, 
  RotateCcw, 
  CheckCircle, 
  Shield, 
  Clock, 
  FileText, 
  Building,
  Target,
  TrendingUp,
  type LucideIcon 
} from 'lucide-react';

export interface BenefitBullet {
  id: string;
  text: string;
  metric: string;
  icon: LucideIcon;
  category: 'time' | 'cost' | 'quality' | 'reliability';
}

// New interface for business-outcome focused benefits
export interface BusinessOutcomeBenefit {
  id: string;
  outcome: string; // Business result, not process
  financialImpact: string; // Specific cost/time savings
  reliability: string; // Success rate or guarantee
  category: 'manufacturing' | 'timeline' | 'cost' | 'quality';
  icon: LucideIcon;
  audience: 'startup' | 'enterprise' | 'both';
}

// Business-outcome focused startup benefits
export const startupOutcomes: BusinessOutcomeBenefit[] = [
  {
    id: 'zero-manufacturing-delays',
    outcome: 'Zero Manufacturing Delays',
    financialImpact: '€2,000-€5,000 saved per iteration',
    reliability: 'First-time manufacturing success',
    category: 'manufacturing',
    icon: CheckCircle,
    audience: 'startup'
  },
  {
    id: 'production-ready-first-time',
    outcome: 'Production-Ready Designs, First Time',
    financialImpact: '€1,500-€3,000 tooling cost avoidance',
    reliability: '100% supplier-ready documentation',
    category: 'cost',
    icon: Target,
    audience: 'startup'
  },
  {
    id: 'faster-market-entry',
    outcome: 'Faster Market Entry',
    financialImpact: '2-4 weeks faster launch',
    reliability: 'No manufacturing surprises',
    category: 'timeline',
    icon: TrendingUp,
    audience: 'startup'
  },
  {
    id: 'cost-predictability',
    outcome: 'Predictable Manufacturing Costs',
    financialImpact: '€500-€2,000 per project',
    reliability: 'Accurate cost estimates upfront',
    category: 'cost',
    icon: Euro,
    audience: 'startup'
  }
];

// Legacy format for backward compatibility
export const startupBenefits: BenefitBullet[] = [
  {
    id: 'zero-delays',
    text: 'Zero manufacturing delays with production-ready designs',
    metric: '0 delays',
    icon: CheckCircle,
    category: 'reliability'
  },
  {
    id: 'cost-savings',
    text: '€2,000-€5,000 saved per iteration avoiding tooling revisions',
    metric: '€2,000-€5,000',
    icon: Euro,
    category: 'cost'
  },
  {
    id: 'faster-launch',
    text: '2-4 weeks faster market entry with first-time-right designs',
    metric: '2-4 weeks',
    icon: TrendingUp,
    category: 'time'
  },
  {
    id: 'predictable-costs',
    text: 'Predictable manufacturing costs with accurate upfront estimates',
    metric: '100%',
    icon: Target,
    category: 'reliability'
  }
];

// Business-outcome focused enterprise benefits
export const enterpriseOutcomes: BusinessOutcomeBenefit[] = [
  {
    id: 'scalable-manufacturing-success',
    outcome: 'Scalable Manufacturing Success',
    financialImpact: '€10,000-€50,000 saved per product line',
    reliability: 'Multiple product line support',
    category: 'manufacturing',
    icon: Building,
    audience: 'enterprise'
  },
  {
    id: 'reduced-development-cycles',
    outcome: 'Reduced Development Cycles',
    financialImpact: '1-2 weeks saved per iteration',
    reliability: '50% fewer design revisions',
    category: 'timeline',
    icon: Clock,
    audience: 'enterprise'
  },
  {
    id: 'supplier-ready-handoff',
    outcome: 'Seamless Supplier Handoff',
    financialImpact: 'Zero communication delays',
    reliability: '100% supplier-ready documentation',
    category: 'quality',
    icon: FileText,
    audience: 'enterprise'
  },
  {
    id: 'risk-mitigation',
    outcome: 'Manufacturing Risk Mitigation',
    financialImpact: '€5,000-€25,000 risk avoidance',
    reliability: 'Early-stage issue identification',
    category: 'cost',
    icon: Shield,
    audience: 'enterprise'
  }
];

// Legacy format for backward compatibility
export const enterpriseBenefits: BenefitBullet[] = [
  {
    id: 'scalable-success',
    text: 'Scalable manufacturing success across multiple product lines',
    metric: 'Unlimited',
    icon: Building,
    category: 'reliability'
  },
  {
    id: 'time-saved',
    text: '1-2 weeks saved per iteration with fewer design revisions',
    metric: '1-2 weeks',
    icon: Clock,
    category: 'time'
  },
  {
    id: 'supplier-ready',
    text: 'Seamless supplier handoff with complete documentation',
    metric: '100%',
    icon: FileText,
    category: 'reliability'
  },
  {
    id: 'risk-mitigation',
    text: '€5,000-€25,000 risk avoidance through early issue identification',
    metric: '€5,000-€25,000',
    icon: Shield,
    category: 'cost'
  }
];

// Category color mapping for consistent styling
export const categoryColors = {
  time: 'text-blue-600',
  cost: 'text-green-600', 
  quality: 'text-purple-600',
  reliability: 'text-orange-600'
} as const;

// Business outcome category colors
export const businessOutcomeCategoryColors = {
  manufacturing: 'text-green-600',
  timeline: 'text-blue-600',
  cost: 'text-emerald-600',
  quality: 'text-purple-600'
} as const;