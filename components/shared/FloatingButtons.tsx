"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
// import { X } from "lucide-react" // Unused
import { UnifiedConsultationCard } from "./UnifiedConsultationCard"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function FloatingButtons() {
  const [showConsultation, setShowConsultation] = React.useState(false)
  const [showQuotation, setShowQuotation] = React.useState(false)

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 md:hidden z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="floating"
            size="icon-lg"
            onClick={() => setShowConsultation(true)}
            aria-label="Book a Free Consultation"
          >
            <Calendar className="h-6 w-6" />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="floating"
            size="icon-lg"
            onClick={() => setShowQuotation(true)}
            aria-label="Request a Quotation"
          >
            <FileText className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      {/* Mobile Modals */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="md:hidden max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Book a Free Consultation</DialogTitle>
          <DialogDescription className="sr-only">
            Schedule a free consultation with our experts to discuss your project
          </DialogDescription>
          <UnifiedConsultationCard
            type="consultation"
            onSubmit={async (data) => {
              console.log('Consultation data:', data)
              setShowConsultation(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="md:hidden max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Request a Quotation</DialogTitle>
          <DialogDescription className="sr-only">
            Fill out this form to request a detailed quotation for your project
          </DialogDescription>
          <UnifiedConsultationCard
            type="quotation"
            onSubmit={async (data) => {
              try {
                console.log('📝 Submitting quote request from mobile:', data);
                
                const response = await fetch('/api/quotes', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                  console.log('✅ Quote submitted successfully:', result);
                  alert(`Quote request submitted successfully! Reference: ${result.quoteReference}`);
                  setShowQuotation(false);
                } else {
                  console.error('❌ Quote submission failed:', result);
                  alert(`Failed to submit quote: ${result.error}`);
                }
              } catch (error) {
                console.error('❌ Quote submission error:', error);
                alert('Failed to submit quote request. Please try again.');
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
