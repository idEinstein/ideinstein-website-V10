import { 
  Clock, 
  Coins, 
  Shield, 
  Settings, 
  Zap,
  Users,
  Target,
  Award,
  type LucideIcon 
} from 'lucide-react';

export interface ComparisonRow {
  feature: string;
  idEinstein: string;
  agency: string;
  freelancer: string;
  icon: LucideIcon;
  priority: 'high' | 'medium' | 'low';
}

export const competitiveComparison: ComparisonRow[] = [
  {
    feature: 'Decision Speed',
    idEinstein: 'Hours – Direct founder access',
    agency: 'Weeks – multiple approvals',
    freelancer: 'Hours–Days',
    icon: Clock,
    priority: 'high'
  },
  {
    feature: 'Flexibility',
    idEinstein: 'High – fully tailored workflow',
    agency: 'Low – standardized processes',
    freelancer: 'Medium',
    icon: Settings,
    priority: 'high'
  },
  {
    feature: 'Cost Efficiency',
    idEinstein: 'High – minimal overhead, competitive pricing',
    agency: 'Low – high overhead, premium rates',
    freelancer: 'High but variable',
    icon: Coins,
    priority: 'high'
  },
  {
    feature: 'Accountability',
    idEinstein: 'Single point of responsibility',
    agency: 'Diffused across multiple staff',
    freelancer: 'Individual',
    icon: Shield,
    priority: 'high'
  },
  {
    feature: 'Quality Control',
    idEinstein: 'Direct oversight by founder',
    agency: 'Variable, depends on team',
    freelancer: 'Varies',
    icon: Target,
    priority: 'medium'
  },
  {
    feature: 'Turnaround Time',
    idEinstein: 'Fastest – minimal bureaucracy',
    agency: 'Slow',
    freelancer: 'Medium–Fast',
    icon: Zap,
    priority: 'medium'
  },
  {
    feature: 'Customization',
    idEinstein: 'Fully tailored',
    agency: 'Standardized',
    freelancer: 'Moderate',
    icon: Users,
    priority: 'medium'
  },
  {
    feature: 'Industry Expertise',
    idEinstein: '26+ years mechanical engineering',
    agency: 'Generalized',
    freelancer: 'Varies per freelancer',
    icon: Award,
    priority: 'low'
  }
];

// Priority-based styling
export const priorityStyles = {
  high: 'font-semibold text-gray-900',
  medium: 'font-medium text-gray-800',
  low: 'font-normal text-gray-700'
} as const;

// Column styling for visual hierarchy
export const columnStyles = {
  idEinstein: 'bg-green-50 border-green-200 text-green-900',
  agency: 'bg-gray-50 text-gray-700',
  freelancer: 'bg-gray-50 text-gray-700'
} as const;