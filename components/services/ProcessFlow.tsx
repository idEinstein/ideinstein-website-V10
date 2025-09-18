"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  Wrench,
  CheckSquare,
  Lightbulb,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useMediaQuery from "@/hooks/useMediaQuery";
// import { cn } from "@/lib/utils"; // Unused import
import type { Service } from "@/library/types";

// Helper function to get correct process step image path
const getProcessStepImage = (step: any, stepIndex: number, category: string, serviceSlug?: string): string => {
  // Map service slugs to their actual directory structure
  const servicePathMap: Record<string, string> = {
    "research-development": "Engineering services/research-development",
    "cad-modeling": "Engineering services/cad-modeling",
    "3d-printing": "Manufacturing solutions/3d printing",
    "machine-design": "Engineering services/machine-design",
    "biw-design": "Engineering services/biw-design",
    "finite-element-cfd": "Engineering services/finite-element-cfd",
    "gdt-tolerance": "Engineering services/gdt-tolerance",
    "technical-documentation": "Manufacturing solutions/technical-documentation",
    "supplier-sourcing": "Manufacturing solutions/supplier-sourcing"
  };
  
  const servicePath = servicePathMap[serviceSlug || ""] || `engineering/${serviceSlug}`;
  const stepDir = getStepDirectoryName(step.title, stepIndex, category, serviceSlug);
  return `/images/services/${servicePath}/process/${stepDir}/step-hero.jpg`;
};

interface ProcessFlowProps {
  process: NonNullable<Service["details"]>["process"];
  category?: string;
  serviceSlug?: string;
}

const getStepPrefix = (category: string): string => {
  const prefixMap: Record<string, string> = {
    "Research & Development": "RD",
    Engineering: "ED",
    Design: "ED",
    "Machine Design": "MD",
    "BIW Design": "BD",
    "Analysis & Simulation": "FA",
    Manufacturing: "TP",
    Documentation: "TD",
    Consulting: "SS",
  };
  return prefixMap[category] || "ST"; // ST as fallback for "Step"
};

// Map step titles to actual directory names for services with generated images
const getStepDirectoryName = (
  stepTitle: string,
  stepIndex: number,
  category: string,
  serviceSlug?: string
): string => {
  const prefix = getStepPrefix(category);

  // For R&D service, use the exact directory names that exist
  if (serviceSlug === "research-development") {
    const rdStepMap: Record<string, string> = {
      "Define Project Scope and Design Constraints": "RD-1-Scope and Constraints",
      "Research & Initial Concept Design": "RD-2-Research & Initial Concept Design",
      "Proof of Concept": "RD-3-proof-of-concept",
      "Engineering Analysis": "RD-4-engineering-analysis",
      "Final Design & Full Prototype": "RD-5-final-design-prototype",
      "User Validation & Iteration": "RD-6-user-validation",
      "Regulatory & Compliance Assessment": "RD-7-regulatory-compliance",
      "Manufacturing Plan": "RD-8-Manufacturing Plan",
      "Marketing Renders & Launch Support": "RD-9-Marketing & Launch Support",
    };

    const directoryName = rdStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For CAD Modeling service, use the exact directory names that exist
  if (serviceSlug === "cad-modeling") {
    const cadStepMap: Record<string, string> = {
      "Requirements Analysis": "ED-1-requirements",
      "Concept Development": "ED-2-concept-sketching",
      "Detailed 3D Modeling": "ED-3-3d-modeling",
      "Technical Documentation": "ED-4-Technical documentation",
      "Design Validation": "ED-5-Design Validation",
      "Post-Validation Iteration": "ED-6-Post-Validation Iteration",
      "Design Handover": "ED-7-Design Handover",
    };

    const directoryName = cadStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For Technical Documentation service, use the exact directory names that exist
  if (serviceSlug === "technical-documentation") {
    const docStepMap: Record<string, string> = {
      "User Needs Analysis": "TD-1-user-needs",
      "Content Planning": "TD-2-content-planning",
      "Technical Writing": "TD-3-technical-writing",
      "3D Modeling & Visualization": "TD-4-3d-modeling",
      "Rendering & Graphics": "TD-5-rendering",
      "Accessibility & Standards": "TD-6-accessibility",
      "User Testing & Validation": "TD-7-user-testing",
    };

    const directoryName = docStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For Machine Design service, use the exact directory names that exist
  if (category === "Engineering" && serviceSlug === "machine-design") {
    const machineStepMap: Record<string, string> = {
      "Requirements Analysis": "MD-1-requirements-analysis",
      "Safety Assessment": "MD-2-safety-assessment",
      "Conceptual Design": "MD-3-conceptual-design",
      "Detailed Mechanical Design": "MD-4-detailed-mechanical-design",
      "Control System Design": "MD-5-control-system",
      "Analysis & Optimization": "MD-6-analysis-optimization",
      "Maintenance Planning": "MD-7-maintenance-planning",
      "Operator Training": "MD-8-training",
    };

    const directoryName = machineStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For BIW Design service, use the exact directory names that exist
  if (category === "Engineering" && serviceSlug === "biw-design") {
    const biwStepMap: Record<string, string> = {
      "Process Planning": "BD-1-process-planning",
      "Cross-Team Integration": "BD-2-cross-team-integration",
      "Fixture Design": "BD-3-fixture-design",
      "Welding Equipment Design": "BD-4-welding-equipment",
      "Manufacturing Simulation": "BD-5-manufacturing-simulation",
      "Assembly System Design": "BD-6-assembly-system design",
      "Enhanced Validation": "BD-7-enhanced-validation",
      "Documentation & Training": "BD-8-documentation-training",
    };

    const directoryName = biwStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For FEA & CFD Analysis service, use the exact directory names that exist
  if (serviceSlug === "finite-element-cfd") {
    const feaStepMap: Record<string, string> = {
      "Problem Definition": "FA-1-problem-definition",
      "Pre-Analysis": "FA-2-pre-analysis",
      "Model Preparation": "FA-3-model-preparation",
      "Simulation Execution": "FA-4-simulation-execution",
      "Multi-Condition Analysis": "FA-5-multi-condition-analysis",
      "Results Analysis": "FA-6-results-analysis",
      "Report Generation": "FA-7-report-generation",
    };

    const directoryName = feaStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For GD&T and Tolerance Analysis service, use the exact directory names that exist
  if (serviceSlug === "gdt-tolerance") {
    const gdtStepMap: Record<string, string> = {
      "Design Review": "GT-1-design-review",
      "Manufacturing Method Analysis": "GT-2-manufacturing-method",
      "GD&T Implementation": "GT-3-gdt-implementation",
      "Tolerance Stack-up Analysis": "GT-4-tolerance-stack-up",
      "Measurement System Design": "GT-5-measurement-system",
      "Design Optimization": "GT-6-design-optimization",
      "Process Control Implementation": "GT-7-process-control",
    };

    const directoryName = gdtStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For 3D Printing service, use the exact directory names that exist
  if (serviceSlug === "3d-printing") {
    const printingStepMap: Record<string, string> = {
      "Design Review": "TP-1-design-review",
      "File Preparation & Orientation": "TP-2-file-preparation",
      "Printer Selection & Parameter Optimization": "TP-3-printer-selection",
      "Material Selection": "TP-4-material-selection",
      "Printing Process": "TP-5-printing-process",
      "Post-Processing": "TP-6-post-processing",
      "Dimensional Verification & Quality Control": "TP-7-quality-control",
    };
    const directoryName = printingStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For Supplier Sourcing service, use the exact directory names that exist
  if (serviceSlug === "supplier-sourcing") {
    const supplierStepMap: Record<string, string> = {
      "Requirements Definition": "TP-1-requirements-definition",
      "Risk Assessment": "TP-2-risk-assessment",
      "Supplier Identification": "TP-3-supplier-identification",
      "Supplier Evaluation": "TP-4-supplier-evaluation",
      "Supplier Selection": "TP-5-supplier-selection",
      "Contract Negotiation": "TP-6-contract-negotiation",
      "Supplier Onboarding": "TP-7-supplier-onboarding",
      "Performance Monitoring": "TP-8-performance-monitoring",
    };
    const directoryName = supplierStepMap[stepTitle];
    if (directoryName) {
      return directoryName;
    }
  }

  // For other services, use the original format
  return `${prefix}-${stepIndex + 1}-${stepTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
};

const ProcessFlow = ({
  process,
  category = "Manufacturing",
  serviceSlug = "research-development",
}: ProcessFlowProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [viewMode, setViewMode] = useState<"carousel" | "list">("carousel");
  const stepButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleNext = useCallback(() => {
    if (activeStep < (process?.length || 0) - 1) {
      setActiveStep(activeStep + 1);
    }
  }, [activeStep, process?.length]);

  const handlePrev = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStep, handleNext, handlePrev]);

  // Focus management
  useEffect(() => {
    if (stepButtonRefs.current[activeStep]) {
      stepButtonRefs.current[activeStep]?.focus();
    }
  }, [activeStep]);

  if (!process || process.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
      <div className="container mx-auto px-4">
        <div
          className={`flex ${isMobile ? "flex-col space-y-4" : "justify-between items-center"} mb-12`}
        >
          <h2 className="text-3xl font-bold text-primary">Our Process</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "carousel" ? "default" : "outline"}
              onClick={() => setViewMode("carousel")}
              className="text-sm"
              aria-pressed={viewMode === "carousel"}
            >
              Interactive View
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="text-sm"
              aria-pressed={viewMode === "list"}
            >
              Full Process View
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "carousel" ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
              className="relative"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-primary"
                    initial={{
                      width: `${(activeStep / (process.length - 1)) * 100}%`,
                    }}
                    animate={{
                      width: `${(activeStep / (process.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                  />
                </div>

                {/* Step Indicators */}
                <div
                  className="flex justify-between mt-2"
                  role="tablist"
                  aria-label="Process steps"
                >
                  {process.map((step, index) => (
                    <button
                      key={index}
                      type="button"
                      ref={(el) => {
                        stepButtonRefs.current[index] = el;
                      }}
                      role="tab"
                      id={`step-tab-${index}`}
                      aria-selected={activeStep === index}
                      aria-controls={`step-panel-${index}`}
                      onClick={() => setActiveStep(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        index === activeStep
                          ? "bg-primary text-white"
                          : index < activeStep
                            ? "bg-primary/20 text-primary"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Step */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
                  role="tabpanel"
                  id={`step-panel-${activeStep}`}
                  aria-labelledby={`step-tab-${activeStep}`}
                >
                  {/* Step Visualization */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                    <div className="relative flex-1 bg-gradient-to-br from-primary/5 to-primary/10">
                      <Image
                        src={getProcessStepImage(process[activeStep], activeStep, category, serviceSlug)}
                        alt={`${process[activeStep].title} visualization`}
                        fill
                        className="object-cover"
                      />
                      {/* Fallback content */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-[.error]:opacity-100">
                        <div className="flex flex-col items-center justify-center text-center p-6">
                          <div className="w-20 h-20 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <Info className="w-10 h-10 text-primary" />
                          </div>
                          <h4 className="text-xl font-medium text-primary mb-2">
                            {process[activeStep].title}
                          </h4>
                          <p className="text-sm text-text/70 max-w-sm">
                            Step {activeStep + 1} of our {category} process
                          </p>
                          <p className="text-sm text-text/70 mt-4 max-w-sm">
                            {process[activeStep].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step Details */}
                  <div className="flex flex-col h-full">
                    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mr-4">
                          {activeStep + 1}
                        </div>
                        <h3 className="text-2xl font-bold text-primary">
                          {process[activeStep].title}
                        </h3>
                      </div>

                      <p className="text-text/80 mb-6">
                        {process[activeStep].description}
                      </p>

                      {process[activeStep].timeline && (
                        <div className="flex items-center mb-4 text-sm text-text/70">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          <span>
                            Typical timeline: {process[activeStep].timeline}
                          </span>
                        </div>
                      )}

                      {process[activeStep].keyPoints &&
                        (process[activeStep]?.keyPoints?.length ?? 0) > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <Lightbulb className="w-4 h-4 mr-2 text-primary" />
                              <h4 className="font-semibold">Key Points</h4>
                            </div>
                            <ul className="space-y-1 pl-6">
                              {process[activeStep]?.keyPoints?.map(
                                (point, index) => (
                                  <li
                                    key={index}
                                    className="text-sm flex items-start"
                                  >
                                    <ArrowRight className="w-3 h-3 text-primary mt-1 mr-2 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {process[activeStep].tools &&
                        (process[activeStep]?.tools?.length ?? 0) > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <Wrench className="w-4 h-4 mr-2 text-primary" />
                              <h4 className="font-semibold">
                                Tools & Technologies
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {process[activeStep]?.tools?.map((tool, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {process[activeStep].deliverables &&
                        (process[activeStep]?.deliverables?.length ?? 0) > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <CheckSquare className="w-4 h-4 mr-2 text-primary" />
                              <h4 className="font-semibold">Deliverables</h4>
                            </div>
                            <ul className="space-y-1 pl-6">
                              {process[activeStep]?.deliverables?.map(
                                (deliverable, index) => (
                                  <li
                                    key={index}
                                    className="text-sm flex items-start"
                                  >
                                    <ArrowRight className="w-3 h-3 text-primary mt-1 mr-2 flex-shrink-0" />
                                    <span>{deliverable}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  className="flex items-center"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Step
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={activeStep === process.length - 1}
                  variant="primary"
                  className="flex items-center"
                  aria-label="Next step"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
              className="space-y-8"
            >
              {process.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 h-full min-h-[300px]">
                      {/* Step Visualization */}
                      <div className="relative h-[250px] lg:h-full bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                        <Image
                          src={getProcessStepImage(step, index, category, serviceSlug)}
                          alt={`${step.title} visualization`}
                          fill
                          className="object-cover"
                        />
                        {/* Fallback content */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-[.error]:opacity-100">
                          <div className="flex flex-col items-center justify-center text-center p-6">
                            <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                              <Info className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="text-lg font-medium text-primary mb-2">
                              {step.title}
                            </h4>
                            <p className="text-sm text-text/70 max-w-sm">
                              Step {index + 1} of our {category} process
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step Details */}
                      <div
                        className={`p-6 ${step.visualization || step.image ? "lg:col-span-2" : "lg:col-span-3"} flex flex-col h-full`}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mr-4">
                            {index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-primary">
                            {step.title}
                          </h3>
                        </div>

                        <p className="text-text/80 mb-6">{step.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {step.timeline && (
                            <div className="flex items-center text-sm text-text/70">
                              <Clock className="w-4 h-4 mr-2 text-primary" />
                              <span>Typical timeline: {step.timeline}</span>
                            </div>
                          )}

                          {step.tools && step.tools.length > 0 && (
                            <div>
                              <div className="flex items-center mb-2">
                                <Wrench className="w-4 h-4 mr-2 text-primary" />
                                <h4 className="font-semibold text-sm">
                                  Tools & Technologies
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {step.tools.map((tool, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          {step.keyPoints && step.keyPoints.length > 0 && (
                            <div>
                              <div className="flex items-center mb-2">
                                <Lightbulb className="w-4 h-4 mr-2 text-primary" />
                                <h4 className="font-semibold text-sm">
                                  Key Points
                                </h4>
                              </div>
                              <ul className="space-y-1 pl-4">
                                {step.keyPoints.map((point, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm flex items-start"
                                  >
                                    <ArrowRight className="w-3 h-3 text-primary mt-1 mr-2 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {step.deliverables &&
                            step.deliverables.length > 0 && (
                              <div>
                                <div className="flex items-center mb-2">
                                  <CheckSquare className="w-4 h-4 mr-2 text-primary" />
                                  <h4 className="font-semibold text-sm">
                                    Deliverables
                                  </h4>
                                </div>
                                <ul className="space-y-1 pl-4">
                                  {step.deliverables.map((deliverable, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm flex items-start"
                                    >
                                      <ArrowRight className="w-3 h-3 text-primary mt-1 mr-2 flex-shrink-0" />
                                      <span>{deliverable}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessFlow;
