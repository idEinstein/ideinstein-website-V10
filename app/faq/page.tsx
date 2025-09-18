'use client'

import { motion } from 'framer-motion'
import FAQAccordion from '@/components/shared/FAQAccordion'

const faqItems = [
  {
    category: "Services",
    question: "What types of 3D printing services do you offer?",
    answer: "We offer a comprehensive range of 3D printing services including prototyping, functional parts, and end-use components. Our services cover FDM, SLA, and SLS technologies, allowing us to work with a variety of materials including plastics, resins, and nylon."
  },
  {
    category: "Services",
    question: "Do you provide CAD modeling services?",
    answer: "Yes, we offer full CAD modeling services. Our team can create detailed 3D models from scratch, convert 2D drawings to 3D models, or modify existing CAD files. We work with various CAD software including SolidWorks, AutoCAD, and Fusion 360."
  },
  {
    category: "Process",
    question: "How long does a typical project take?",
    answer: "Project timelines vary depending on complexity and scope. Simple prototypes might take 1-2 weeks, while complex engineering projects could take several months. We provide detailed timelines during the initial consultation and keep you updated throughout the process."
  },
  {
    category: "Process",
    question: "What is your design process?",
    answer: "Our design process follows these steps: 1) Initial consultation to understand requirements, 2) Concept development and preliminary design, 3) Design review and feedback, 4) Detailed design and analysis, 5) Prototyping if required, 6) Final review and delivery."
  },
  {
    category: "Technical",
    question: "What file formats do you accept?",
    answer: "We accept most common CAD formats including .STEP, .STL, .IGES, .SLDPRT (SolidWorks), .F3D (Fusion 360), and more. We can also work with 2D drawings in .DWG or .PDF format."
  },
  {
    category: "Technical",
    question: "Do you provide technical documentation?",
    answer: "Yes, we provide comprehensive technical documentation including detailed drawings, assembly instructions, material specifications, testing reports, and user manuals. All documentation follows industry standards and can be customized to your requirements."
  },
  {
    category: "Pricing",
    question: "How do you determine project costs?",
    answer: "Project costs are determined based on several factors including complexity, required materials, engineering time, manufacturing processes, and project timeline. We provide detailed quotes after the initial consultation."
  },
  {
    category: "Pricing",
    question: "Do you offer consulting services?",
    answer: "Yes, we offer engineering consulting services. This can include design reviews, material selection advice, manufacturing process optimization, and technical feasibility studies. Contact us for a free initial consultation."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-text/80 text-lg">
              Find answers to common questions about our services, processes, and capabilities.
            </p>
          </motion.div>

          <FAQAccordion items={faqItems} categorized />
        </div>
      </motion.div>
    </div>
  )
}
