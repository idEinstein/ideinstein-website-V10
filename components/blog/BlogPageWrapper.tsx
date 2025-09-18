'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UnifiedConsultationCard } from "@/components/shared/UnifiedConsultationCard";

interface BlogPageWrapperProps {
  children: React.ReactNode;
}

export default function BlogPageWrapper({ children }: BlogPageWrapperProps) {
  const [showConsultation, setShowConsultation] = useState(false);

  useEffect(() => {
    const handleOpenBlogConsultation = () => {
      setShowConsultation(true);
    };

    window.addEventListener('openBlogConsultation', handleOpenBlogConsultation);
    
    return () => {
      window.removeEventListener('openBlogConsultation', handleOpenBlogConsultation);
    };
  }, []);

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
  }

  return (
    <>
      {children}
      
      {/* Hero Button Consultation Modal */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Book a Consultation</DialogTitle>
          <UnifiedConsultationCard
            type="consultation"
            onSuccess={handleConsultationSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}