/**
 * Standardized Font Size System for IdEinstein Website
 * 
 * Enforces consistent font sizes for headings, subheadings, and descriptions
 * across the entire website with proper responsive scaling.
 */

// Standard Font Size Categories
export type FontSizeCategory = 
  | 'hero-heading'        // Main hero headings
  | 'section-heading'     // Section headings (H2)
  | 'subsection-heading'  // Subsection headings (H3)
  | 'card-heading'        // Card titles (H4)
  | 'small-heading'       // Small headings (H5, H6)
  | 'large-description'   // Large body text
  | 'standard-description'// Standard body text
  | 'small-description'   // Small descriptions
  | 'caption'             // Captions and labels
  | 'cta-text';          // Call-to-action text

// Standardized Font Size Configuration
// Based on comprehensive analysis of existing homepage components
// Optimized for layout consistency and responsive behavior
export const standardFontSizes = {
  // HEADINGS - Optimized hierarchy with proper scaling ratios
  'hero-heading': {
    mobile: 'text-4xl',      // 36px - Most used large size
    tablet: 'text-5xl',     // 48px - Common desktop size
    desktop: 'text-6xl',    // 60px - Maximum for impact
    weight: 'font-bold',
    leading: 'leading-tight',
    usage: 'Main hero headings, primary page titles',
    semantic: 'h1',
    layoutNotes: 'Ensure adequate spacing above/below, test line wrapping'
  },
  
  'section-heading': {
    mobile: 'text-2xl',     // 24px - Balanced for mobile
    tablet: 'text-3xl',     // 30px - Good tablet size
    desktop: 'text-4xl',    // 36px - Most used heading size
    weight: 'font-bold',
    leading: 'leading-tight',
    usage: 'Section headings, major content blocks',
    semantic: 'h2',
    layoutNotes: 'Primary section dividers, maintain hierarchy'
  },
  
  'subsection-heading': {
    mobile: 'text-xl',      // 20px - Second most used size
    tablet: 'text-2xl',     // 24px - Good scaling
    desktop: 'text-3xl',    // 30px - Clear hierarchy
    weight: 'font-semibold',
    leading: 'leading-snug',
    usage: 'Subsection headings, feature titles',
    semantic: 'h3',
    layoutNotes: 'Feature titles, card section headers'
  },
  
  'card-heading': {
    mobile: 'text-lg',      // 18px - Third most used size
    tablet: 'text-xl',      // 20px - Comfortable reading
    desktop: 'text-2xl',    // 24px - Clear but not overwhelming
    weight: 'font-semibold',
    leading: 'leading-snug',
    usage: 'Card titles, component headings',
    semantic: 'h4',
    layoutNotes: 'Card titles, benefit headings, list items'
  },
  
  'small-heading': {
    mobile: 'text-base',    // 16px - Readable minimum
    tablet: 'text-lg',      // 18px - Comfortable scaling
    desktop: 'text-xl',     // 20px - Clear hierarchy
    weight: 'font-medium',
    leading: 'leading-normal',
    usage: 'Small headings, labels, metadata titles',
    semantic: 'h5, h6',
    layoutNotes: 'Form labels, sidebar headings, fine details'
  },
  
  // DESCRIPTIONS & BODY TEXT - Based on readability analysis
  'hero-description': {
    mobile: 'text-lg',      // 18px - Prominent but readable
    tablet: 'text-xl',      // 20px - Good for hero sections
    desktop: 'text-2xl',    // 24px - Impact without overwhelming
    weight: 'font-normal',
    leading: 'leading-relaxed',
    usage: 'Hero descriptions, key value propositions',
    semantic: 'p',
    layoutNotes: 'Hero subtitles, main value props, key messages'
  },
  
  'large-description': {
    mobile: 'text-base',    // 16px - Most used body size
    tablet: 'text-lg',      // 18px - Comfortable reading
    desktop: 'text-xl',     // 20px - Clear and readable
    weight: 'font-normal',
    leading: 'leading-relaxed',
    usage: 'Important body text, feature descriptions',
    semantic: 'p',
    layoutNotes: 'Feature descriptions, important content'
  },
  
  'standard-description': {
    mobile: 'text-sm',      // 14px - Most used size (30% of all text)
    tablet: 'text-base',    // 16px - Standard web size
    desktop: 'text-lg',     // 18px - Comfortable desktop reading
    weight: 'font-normal',
    leading: 'leading-relaxed',
    usage: 'Standard body text, descriptions, content',
    semantic: 'p',
    layoutNotes: 'Main content, descriptions, explanatory text'
  },
  
  'small-description': {
    mobile: 'text-xs',      // 12px - Minimum readable
    tablet: 'text-sm',      // 14px - Secondary information
    desktop: 'text-base',   // 16px - Still readable on desktop
    weight: 'font-normal',
    leading: 'leading-normal',
    usage: 'Secondary information, supporting text',
    semantic: 'p, span',
    layoutNotes: 'Card descriptions, secondary details'
  },
  
  'caption': {
    mobile: 'text-xs',      // 12px - Minimum for accessibility
    tablet: 'text-xs',      // 12px - Consistent small size
    desktop: 'text-sm',     // 14px - Slightly larger on desktop
    weight: 'font-normal',
    leading: 'leading-normal',
    usage: 'Captions, labels, metadata, fine print',
    semantic: 'span, small',
    layoutNotes: 'Image captions, form help text, timestamps'
  },
  
  'cta-text': {
    mobile: 'text-base',    // 16px - Touch-friendly minimum
    tablet: 'text-lg',      // 18px - Clear action text
    desktop: 'text-xl',     // 20px - Prominent but balanced
    weight: 'font-semibold',
    leading: 'leading-normal',
    usage: 'Call-to-action buttons and links',
    semantic: 'button, a',
    layoutNotes: 'Ensure 44px minimum touch target on mobile'
  }
} as const;

// Font Size Mapping for Semantic Elements
export const semanticFontSizeMapping = {
  h1: 'hero-heading',
  h2: 'section-heading',
  h3: 'subsection-heading',
  h4: 'card-heading',
  h5: 'small-heading',
  h6: 'small-heading',
  p: 'standard-description',
  span: 'small-description',
  button: 'cta-text',
  a: 'cta-text'
} as const;

/**
 * Get standardized font size classes for a category
 */
export function getStandardFontSize(
  category: FontSizeCategory,
  options: {
    includeWeight?: boolean;
    includeLeading?: boolean;
    className?: string;
  } = {}
): string {
  const {
    includeWeight = true,
    includeLeading = true,
    className = ''
  } = options;
  
  const config = standardFontSizes[category];
  
  const classes = [
    // Responsive sizes
    config.mobile,
    `md:${config.tablet}`,
    `lg:${config.desktop}`,
    
    // Weight and leading
    includeWeight ? config.weight : '',
    includeLeading ? config.leading : '',
    
    // Custom classes
    className
  ];
  
  return classes.filter(Boolean).join(' ');
}

/**
 * Get font size for semantic HTML element
 */
export function getSemanticFontSize(
  element: keyof typeof semanticFontSizeMapping,
  options?: {
    includeWeight?: boolean;
    includeLeading?: boolean;
    className?: string;
  }
): string {
  const category = semanticFontSizeMapping[element] as FontSizeCategory;
  return getStandardFontSize(category, options);
}

/**
 * Validate if a font size follows standards
 */
export function validateFontSize(className: string): {
  isStandard: boolean;
  recommendedCategory?: FontSizeCategory;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for non-standard font sizes
  const nonStandardSizes = [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 
    'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl'
  ];
  
  const hasNonStandardSize = nonStandardSizes.some(size => 
    className.includes(size) && !isPartOfStandardConfig(className)
  );
  
  if (hasNonStandardSize) {
    issues.push('Uses non-standard font size classes');
  }
  
  // Check for missing responsive classes
  if (className.includes('text-') && !className.includes('md:') && !className.includes('lg:')) {
    issues.push('Missing responsive font size classes');
  }
  
  return {
    isStandard: issues.length === 0,
    issues
  };
}

/**
 * Check if className is part of standard configuration
 */
function isPartOfStandardConfig(className: string): boolean {
  return Object.values(standardFontSizes).some(config => 
    className.includes(config.mobile) || 
    className.includes(config.tablet) || 
    className.includes(config.desktop)
  );
}

/**
 * Font size usage guidelines
 */
export const fontSizeGuidelines = {
  'hero-heading': {
    when: 'Main page titles, hero headings, primary CTAs',
    avoid: 'Overuse - should be used sparingly for maximum impact',
    example: 'Homepage hero title, service page main heading'
  },
  
  'section-heading': {
    when: 'Major section headings, content block titles',
    avoid: 'Using for subsections - use subsection-heading instead',
    example: 'Why Choose Us, Our Services, About sections'
  },
  
  'subsection-heading': {
    when: 'Feature titles, card headings, subsection titles',
    avoid: 'Using for main sections - too small for primary headings',
    example: 'Service feature titles, benefit headings'
  },
  
  'card-heading': {
    when: 'Card titles, component headings, list item titles',
    avoid: 'Using for main content - better for contained elements',
    example: 'Service card titles, testimonial names'
  },
  
  'small-heading': {
    when: 'Labels, small headings, metadata titles',
    avoid: 'Using for important content - too small for primary information',
    example: 'Form labels, sidebar headings'
  },
  
  'large-description': {
    when: 'Hero descriptions, important body text, key messages',
    avoid: 'Overuse - should highlight important content only',
    example: 'Hero subtitle, key value propositions'
  },
  
  'standard-description': {
    when: 'Regular body text, descriptions, content paragraphs',
    avoid: 'Using for headings - not prominent enough',
    example: 'Service descriptions, about text, blog content'
  },
  
  'small-description': {
    when: 'Secondary information, supporting text, details',
    avoid: 'Using for primary content - too small for main information',
    example: 'Card descriptions, feature details'
  },
  
  'caption': {
    when: 'Captions, labels, metadata, fine print',
    avoid: 'Using for readable content - too small for body text',
    example: 'Image captions, form help text, timestamps'
  },
  
  'cta-text': {
    when: 'Button text, call-to-action links, interactive elements',
    avoid: 'Using for regular text - should be action-oriented',
    example: 'Button labels, navigation links, action prompts'
  }
} as const;

/**
 * Development helpers for font size standardization
 */
export const fontSizeHelpers = {
  // List all available categories
  getCategories: () => Object.keys(standardFontSizes) as FontSizeCategory[],
  
  // Get usage guidelines for a category
  getGuidelines: (category: FontSizeCategory) => fontSizeGuidelines[category],
  
  // Generate CSS classes for all categories
  generateAllClasses: () => {
    const categories = Object.keys(standardFontSizes) as FontSizeCategory[];
    return categories.reduce((acc, category) => {
      acc[category] = getStandardFontSize(category);
      return acc;
    }, {} as Record<FontSizeCategory, string>);
  },
  
  // Validate component font sizes
  validateComponent: (componentContent: string) => {
    const fontSizeMatches = componentContent.match(/className.*["'][^"']*text-[^"']*["']/g) || [];
    return fontSizeMatches.map(match => ({
      match,
      validation: validateFontSize(match)
    }));
  }
} as const;