'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UnifiedConsultationCard } from "@/components/shared/UnifiedConsultationCard";
import { provenTouchFeedback } from '@/lib/utils/responsive-utilities';

export default function SimpleBlogCTA() {
  const [showConsultation, setShowConsultation] = useState(false);

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
  }

  return (
    <>
      {/* Simple CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Ideas into Reality?
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Get expert engineering guidance from 26+ years of global experience. 
            Book your free consultation today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="accelerator" 
              size="lg"
              className={`px-8 py-3 rounded-xl ${provenTouchFeedback()}`}
              onClick={() => setShowConsultation(true)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Free Consultation
            </Button>
            <Link href="/services/product-development-accelerator">
              <Button 
                variant="secondary-light" 
                size="lg"
                className={`px-8 py-3 rounded-xl ${provenTouchFeedback()}`}
              >
                View My Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white">✓ Free 30-min Session</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white">✓ 26+ Years Experience</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white">✓ Global Expertise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
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