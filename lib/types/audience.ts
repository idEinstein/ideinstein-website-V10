import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

// Audience types
export type AudienceType = 'startup' | 'enterprise' | null
export type SelectionMethod = 'explicit' | 'inferred' | null

// Content configuration types
export interface HeroContent {
  headline: string
  subheadline: string
  description: string
  primaryCTA: {
    text: string
    href: string
    icon?: LucideIcon
  }
  secondaryCTA: {
    text: string
    action: () => void
  }
}

export interface Challenge {
  icon: LucideIcon
  title: string
  problem: string
  solution: string
  color: string
  shadowColor: string
}

export interface Solution {
  title: string
  description: string
  features: string[]
  timeline?: string
  benefits?: string[]
}

export interface CTA {
  text: string
  href?: string
  action?: () => void
  variant: 'primary' | 'secondary' | 'outline'
  icon?: LucideIcon
}

export interface Advantage {
  icon: string
  title: string
  description: string
  highlight: string
}

export interface HubSpokeContent {
  title: string
  description: string
  hubDescription: string
  spokeDescription: string
  benefits: {
    icon: string
    title: string
    description: string
    highlight: string
  }[]
}

export interface ProcessStep {
  number: number
  title: string
  description: string
  duration: string
  icon: string
}

// Main content configuration interface
export interface ContentConfig {
  startup: {
    hero: HeroContent
    challenges: Challenge[]
    solutions: Solution[]
    ctas: CTA[]
  }
  enterprise: {
    hero: HeroContent
    challenges: Challenge[]
    solutions: Solution[]
    ctas: CTA[]
  }
  shared: {
    advantages: Advantage[]
    hubSpoke: HubSpokeContent
    process: ProcessStep[]
  }
}

// Component props interfaces
export interface DualAudienceHeroProps {
  onStartupClick: () => void
  onEnterpriseClick: () => void
  onConsultationClick: () => void
}

export interface AudienceSegmentationProps {
  onAudienceSelect: (audience: AudienceType) => void
  selectedAudience?: AudienceType
}

export interface ConditionalContentProps {
  selectedAudience?: AudienceType
  startupContent: ReactNode
  enterpriseContent: ReactNode
  defaultContent?: ReactNode
  className?: string
}

// Audience definition interface
export interface AudienceDefinition {
  type: AudienceType
  title: string
  definition: string
  characteristics: string[]
  benefits: string[]
  primaryCTA: string
  icon: string
  color: string
  borderColor: string
}