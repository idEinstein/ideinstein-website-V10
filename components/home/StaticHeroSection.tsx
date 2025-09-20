"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { ArrowRight, Rocket, Building2, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UnifiedConsultationCard } from "@/components/shared/UnifiedConsultationCard";
import { useAudience } from "@/lib/contexts/AudienceContext";
import {
  startupBenefits,
  enterpriseBenefits,
} from "@/lib/data/audience-benefits";
import { getCategoryStyle } from "@/lib/utils/homepage-enhancement";

export default function StaticHeroSection() {
  const [showConsultation, setShowConsultation] = useState(false);
  const { selectAudience } = useAudience();

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
  }

  const handleStartupClick = () => {
    selectAudience("startup", "explicit");
    const element = document.getElementById("audience-segmentation");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEnterpriseClick = () => {
    selectAudience("enterprise", "explicit");
    const element = document.getElementById("audience-segmentation");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-24 pb-6 md:pt-28 md:pb-8 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20"
        />
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 blur-xl rounded-lg"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 blur-xl rounded-lg"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 mb-8 rounded-lg"
          >
            <Globe className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-white/90 text-sm font-medium">
              Production-Ready Results
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Production-Ready{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400">
              Designs, First Time
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/80 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-2"
          >
            Senior mechanical and product engineering for startups and
            enterprises—predictable timelines, controllable costs, and zero
            surprises from prototype to production.
          </motion.p>

          {/* Audience Selection CTAs */}
          <div className="mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-2xl font-bold text-white mb-4"
            >
              Choose Your Path
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto mb-4 md:mb-6 px-2">
              {/* Startup Path */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20 hover:bg-white/15 hover:shadow-xl hover:scale-105 cursor-pointer group text-left min-h-[220px] md:min-h-[240px] active:scale-[0.98] sm:active:scale-100 transition-all duration-300"
                onClick={handleStartupClick}
              >
                <div className="flex items-center mb-2 md:mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mr-2 md:mr-3 flex-shrink-0">
                    <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      For Startups
                    </h3>
                    <p className="text-green-200 text-xs md:text-sm">
                      Zero delays, predictable costs
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {startupBenefits.slice(0, 2).map((benefit) => {
                    const Icon = benefit.icon;
                    const categoryStyle = getCategoryStyle(benefit.category);

                    return (
                      <div
                        key={benefit.id}
                        className="flex items-center space-x-3"
                      >
                        <div
                          className={`w-6 h-6 rounded-lg ${categoryStyle.backgroundColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon
                            className={`w-3 h-3 ${categoryStyle.textColor}`}
                          />
                        </div>
                        <span className="text-white/90 text-sm">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: benefit.text.replace(
                                /(Zero delays|€2,000-€5,000|2-4 weeks|100%|€5,000-€25,000|1-2 weeks|Unlimited)/g,
                                '<span class="text-green-400 font-semibold">$1</span>'
                              ),
                            }}
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="primary-light"
                  size="lg"
                  className="w-full group-hover:shadow-xl transition-all duration-300"
                >
                  Choose Startup Path <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>

              {/* Enterprise Path */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20 hover:bg-white/15 hover:shadow-xl hover:scale-105 cursor-pointer group text-left min-h-[220px] md:min-h-[240px] active:scale-[0.98] sm:active:scale-100 transition-all duration-300"
                onClick={handleEnterpriseClick}
              >
                <div className="flex items-center mb-2 md:mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mr-2 md:mr-3 flex-shrink-0">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      For Enterprises
                    </h3>
                    <p className="text-purple-200 text-xs md:text-sm">
                      Scalable engineering solutions
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {enterpriseBenefits.slice(0, 2).map((benefit) => {
                    const Icon = benefit.icon;
                    const categoryStyle = getCategoryStyle(benefit.category);

                    return (
                      <div
                        key={benefit.id}
                        className="flex items-center space-x-3"
                      >
                        <div
                          className={`w-6 h-6 rounded-lg ${categoryStyle.backgroundColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon
                            className={`w-3 h-3 ${categoryStyle.textColor}`}
                          />
                        </div>
                        <span className="text-white/90 text-sm">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: benefit.text.replace(
                                /(Zero delays|€2,000-€5,000|2-4 weeks|100%|€5,000-€25,000|1-2 weeks|Unlimited)/g,
                                '<span class="text-green-400 font-semibold">$1</span>'
                              ),
                            }}
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="primary-light"
                  size="lg"
                  className="w-full group-hover:shadow-xl transition-all duration-300"
                >
                  Choose Enterprise Path <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Main CTA Button */}
          <div className="flex justify-center items-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Button
                size="hero"
                variant="accelerator"
                onClick={() => setShowConsultation(true)}
                className="hover:shadow-xl transition-all duration-300"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Schedule Free Consultation
              </Button>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center"
          >
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <span className="text-white/80 text-xs">
                🇩🇪 German Engineering
              </span>
              <span className="text-white/80 text-xs">
                🇮🇳 Indian Innovation
              </span>
              <span className="text-white/80 text-xs">🌍 Global Delivery</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Consultation Dialog */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Book Your Free Consultation</DialogTitle>
          <UnifiedConsultationCard onSuccess={handleConsultationSuccess} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
