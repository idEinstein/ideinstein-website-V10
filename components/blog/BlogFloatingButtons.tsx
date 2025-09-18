'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
// import { MessageCircle } from 'lucide-react'; // Unused
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard';
import { useState } from 'react';

interface BlogFloatingButtonsProps {
  showBackButton?: boolean;
}

const BlogFloatingButtons = ({ showBackButton = false }: BlogFloatingButtonsProps) => {
  const [showQuotation, setShowQuotation] = useState(false);

  return (
    <>
      {/* Floating Back to Blog Button */}
      {showBackButton && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-8 left-8 z-50"
        >
          <Link href="/blog">
            <Button
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 bg-white hover:bg-white text-primary/80 hover:text-primary rounded-full px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </motion.div>
      )}



      {/* Quotation Dialog */}
      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Request a Quotation</DialogTitle>
          <UnifiedConsultationCard
            type="quotation"
            onSubmit={async (data) => {
              try {
                console.log('📝 Submitting quote request from blog:', data);
                
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
  );
};

export default BlogFloatingButtons;