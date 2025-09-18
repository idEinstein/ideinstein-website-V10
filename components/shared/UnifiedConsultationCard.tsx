'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { ConsultationForm } from "./ConsultationForm"
import { QuotationForm } from "./QuotationForm"
import { DialogTitle } from "@/components/ui/dialog"
import type { ConsultationFormData, QuotationFormData, SERVICE_OPTIONS } from "@/lib/validations/forms"

interface UnifiedConsultationCardProps {
  onSubmit?: (data: ConsultationFormData | QuotationFormData) => Promise<void>
  onSuccess?: () => void // Called after successful submission
  className?: string
  defaultService?: string // Allow any string, will be mapped internally
  type?: 'consultation' | 'quotation'
}

export function UnifiedConsultationCard({
  onSubmit,
  onSuccess,
  className,
  defaultService,
  type = 'consultation'
}: UnifiedConsultationCardProps) {
  const isQuotation = type === 'quotation'

  return (
    <div className={cn("p-4 sm:p-6 max-w-full", className)}>
      <DialogTitle className="text-xl sm:text-2xl font-bold text-primary mb-2">
        {isQuotation ? 'Get a Quotation' : 'Book a Free Consultation'}
      </DialogTitle>
      <p className="text-text/80 mb-4 sm:mb-6 text-sm sm:text-base">
        {isQuotation
          ? 'Request a detailed quotation for your project needs'
          : 'Schedule a consultation with our experts to discuss your project requirements'}
      </p>

      {isQuotation ? (
        <QuotationForm
          defaultService={defaultService}
        />
      ) : (
        <ConsultationForm
          onSubmit={onSubmit}
          onSuccess={onSuccess}
          defaultService={defaultService}
        />
      )}
    </div>
  )
}
