import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * IdEinstein Standardized Button System
 * 
 * === USAGE GUIDELINES ===
 * 
 * FOR LIGHT BACKGROUNDS (white, light gray):
 * - primary: Main CTA buttons (blue background)
 * - secondary: Secondary actions (blue outline)
 * - accelerator: Startup services (gold gradient)
 * - accelerator-outline: Startup services outline (gold outline)
 * 
 * FOR DARK BACKGROUNDS (blue gradients, dark sections):
 * - primary-light: Main CTA buttons (white background, blue text)
 * - secondary-light: Secondary actions (white outline)
 * - accelerator: Startup services (gold gradient - works on any background)
 * 
 * FOR NAVIGATION/HEADER:
 * - header: Navigation buttons (white background, blue text)
 * 
 * FOR UTILITY ACTIONS:
 * - ghost: Subtle actions
 * - link: Text links
 * - destructive: Delete/remove actions
 * - success: Confirm/save actions
 * 
 * === COLOR SCHEME ===
 * - Primary: Blue (#1E40AF / blue-600)
 * - Accelerator: Gold gradient (yellow-500 to orange-500)
 * - Text: High contrast for accessibility
 * - Shadows: Enhanced for depth and premium feel
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // === PRIMARY BUTTONS (IdEinstein Brand Blue #1E40AF) ===
        // For light backgrounds - main CTA buttons
        primary: "bg-[#1E40AF] text-white hover:bg-[#1E3A8A] active:bg-[#1E3A8A] shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300",
        
        // For dark backgrounds - white button with brand blue text
        "primary-light": "bg-white text-[#1E40AF] hover:bg-blue-50 hover:text-[#1E3A8A] active:bg-blue-100 shadow-xl hover:shadow-2xl border-2 border-white/20 backdrop-blur-sm",
        
        // === SECONDARY BUTTONS (Outline Style) ===
        // For light backgrounds - brand blue outline
        secondary: "bg-transparent text-[#1E40AF] border-2 border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white active:bg-[#1E3A8A] shadow-md hover:shadow-lg",
        
        // For dark backgrounds - white outline  
        "secondary-light": "bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-gray-900 active:bg-gray-100 active:text-gray-900 shadow-lg hover:shadow-xl backdrop-blur-sm",
        
        // === STARTUP ACCELERATOR (Einstein Gold Gradient) ===
        // Special gold gradient button for startup services - premium gold gradient
        accelerator: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 active:from-yellow-700 active:to-orange-700 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-[1.02] font-semibold",
        
        // Gold outline version with gradient on hover
        "accelerator-outline": "bg-transparent text-yellow-600 border-2 border-yellow-500 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:text-white hover:border-transparent active:from-yellow-600 active:to-orange-600 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25",
        
        // === UTILITY BUTTONS ===
        // Subtle actions - using brand blue
        ghost: "text-[#1E40AF] hover:bg-blue-50 hover:text-[#1E3A8A] active:bg-blue-100",
        
        // Links - using brand blue
        link: "text-[#1E40AF] underline-offset-4 hover:underline hover:text-[#1E3A8A]",
        
        // Destructive actions
        destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg",
        
        // Success actions
        success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg",
        
        // Header specific (for navigation) - using brand blue
        header: "bg-white text-[#1E40AF] hover:bg-blue-50 hover:text-[#1E3A8A] active:bg-[#1E40AF] active:text-white shadow-md hover:shadow-lg font-medium rounded-lg",
        
        // === LEGACY/COMPATIBILITY VARIANTS ===
        // Default - maps to primary
        default: "bg-[#1E40AF] text-white hover:bg-[#1E3A8A] active:bg-[#1E3A8A] shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300",
        
        // Outline - maps to secondary
        outline: "bg-transparent text-[#1E40AF] border-2 border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white active:bg-[#1E3A8A] shadow-md hover:shadow-lg",
        
        // CTA variants
        cta: "bg-[#1E40AF] text-white hover:bg-[#1E3A8A] active:bg-[#1E3A8A] shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300",
        "cta-white": "bg-white text-[#1E40AF] hover:bg-blue-50 hover:text-[#1E3A8A] active:bg-blue-100 shadow-xl hover:shadow-2xl border-2 border-white/20 backdrop-blur-sm",
        
        // Header CTA
        "header-cta": "bg-[#1E40AF] text-white hover:bg-[#1E3A8A] active:bg-[#1E3A8A] shadow-lg hover:shadow-xl font-medium rounded-lg px-6",
        
        // Blue contrast
        "blue-contrast": "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl",
        
        // Floating buttons
        floating: "bg-[#1E40AF] text-white hover:bg-[#1E3A8A] active:bg-[#1E3A8A] shadow-xl hover:shadow-2xl rounded-full transform hover:scale-[1.05] transition-all duration-300",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-lg",
        hero: "h-14 px-10 text-lg font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
