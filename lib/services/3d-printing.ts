import type { Service } from "@/library/types";

export const three_d_printing: Service = {
  id: "3d-printing",
  title: "3D Printing Services",
  description:
    "Advanced 3D printing services delivering high-precision prototypes and production parts with rapid turnaround and comprehensive quality control.",
  slug: "3d-printing",
  icon: "Printer",
  features: [
    "Rapid prototyping",
    "Multiple material options",
    "High precision output",
    "Quick turnaround time",
    "Quality control testing",
    "Post-processing services",
  ],
  category: ["Manufacturing"],
  details: {
    specifications: [
      {
        category: "Printer Specifications",
        items: [
          { label: "Build Volume", value: "300 x 300 x 300mm" },
          { label: "Layer Resolution", value: "0.05-0.3mm" },
          { label: "Printing Speed", value: "Up to 150mm/s" },
          {
            label: "Materials",
            value: "PLA, ABS, PETG, TPU, and engineering plastics",
          },
        ],
      },
    ],
    process: [
      {
        title: "Design Review",
        description:
          "Our engineers conduct a comprehensive review of your 3D models to ensure optimal printability and identify potential issues before production begins.",
        timeline: "1-2 business days",
        keyPoints: [
          "Analyze geometry for printability",
          "Validate wall thickness",
          "Plan support structures",
        ],
        deliverables: [
          "Printability Report",
          "Design Recommendations",
          "Production Plan",
        ],
        tools: ["CAD Software", "Mesh Analysis Tools", "Simulation Software"],
        visualization: {
          type: "image",
          src: "/images/services/Manufacturing solutions/3d printing/process/TP-1-design-review/step-hero.jpg",
          alt: "Design review and optimization for 3D printing",
        },
      },
      {
        title: "File Preparation & Orientation",
        description:
          "We prepare and optimize your 3D model files for the printing process, ensuring the best possible print quality and success rate.",
        timeline: "1 business day",
        keyPoints: [
          "Repair mesh errors",
          "Optimize part orientation",
          "Configure slicing parameters",
          "Apply appropriate resolution settings",
        ],
        deliverables: [
          "Optimized Print Files",
          "Orientation Analysis",
          "Slicing Configuration",
        ],
        tools: [
          "Mesh Repair Software",
          "Slicing Software",
          "File Optimization Tools",
        ],
        visualization: {
          type: "image",
          src: "/images/services/Manufacturing solutions/3d printing/process/TP-2-file-preparation/step-hero.jpg",
          alt: "3D file preparation and slicing",
        },
      },
      {
        title: "Printer Selection & Parameter Optimization",
        description:
          "We select the most suitable printer and optimize all printing parameters for your specific requirements.",
        timeline: "1 business day",
        keyPoints: [
          "Choose optimal printer for requirements",
          "Configure material-specific settings",
          "Set temperature and speed parameters",
          "Optimize infill patterns and density",
        ],
        deliverables: [
          "Printer Selection Report",
          "Parameter Configuration",
          "Print Strategy Document",
        ],
        tools: [
          "Printer Management Software",
          "Parameter Optimization Tools",
          "Print Simulation Software",
        ],
        visualization: {
          type: "image",
          src: "/images/services/Manufacturing solutions/3d printing/process/TP-3-printer-selection/step-hero.jpg",
          alt: "3D printer selection and configuration",
        },
      },
      {
        title: "Material Selection",
        description:
          "We help you select the optimal material based on your specific requirements for functionality, durability, appearance, and cost-effectiveness.",
        timeline: "1 business day",
        keyPoints: [
          "Analyze material properties",
          "Make application-specific recommendations",
          "Assess cost-benefit factors",
        ],
        deliverables: [
          "Material Recommendation Report",
          "Property Analysis",
          "Cost Comparison",
        ],
        tools: [
          "Material Testing Equipment",
          "Property Comparison Tools",
          "Cost Analysis Software",
        ],
        visualization: {
          type: "image",
          src: "/images/services/Manufacturing solutions/3d printing/process/TP-4-material-selection/step-hero.jpg",
          alt: "Material selection and analysis",
        },
      },
      {
        title: "Printing Process",
        description:
          "Using state-of-the-art 3D printers, we transform your digital designs into physical objects with precision and attention to detail.",
        timeline: "1-5 business days (per part)",
        keyPoints: [
          "Calibrate printer",
          "Monitor printing progress",
          "Provide status updates",
        ],
        deliverables: [
          "Progress Reports",
          "Print Status Updates",
          "Quality Monitoring Data",
        ],
        tools: [
          "Professional 3D Printers",
          "Monitoring Software",
          "Quality Control Systems",
        ],
        visualization: {
          type: "image",
          src: "/images/services/Manufacturing solutions/3d printing/process/TP-5-printing-process/step-hero.jpg",
          alt: "3D printing process execution",
        },
      },
      {
        title: "Post-Processing",
        description:
          "We refine your printed parts through various finishing techniques to achieve the desired surface quality, appearance, and mechanical properties.",
        timeline: "1-4 business days (technique dependent)",
        keyPoints: [
          "Remove support structures",
          "Apply appropriate finishing techniques",
          "Perform heat treatment if required",
          "Execute painting or coating if requested",
        ],
        deliverables: [
          "Finished Components",
          "Post-Processing Report",
          "Surface Quality Analysis",
        ],
        tools: [
          "Post-Processing Equipment",
          "Finishing Tools",
          "Surface Treatment Systems",
        ],
        visualization: {
          type: "image",
          src: "/images/services/Manufacturing solutions/3d printing/process/TP-6-post-processing/step-hero.jpg",
          alt: "Post-processing and finishing",
        },
      },
      {
        title: "Dimensional Verification & Quality Control",
        description:
          "Every printed part undergoes comprehensive inspection and testing to ensure it meets all specifications and quality standards.",
        timeline: "1-2 business days",
        keyPoints: [
          "Perform dimensional measurements",
          "Verify tolerances",
          "Conduct functional testing",
          "Document quality results",
        ],
        deliverables: [
          "Quality Inspection Report",
          "Dimensional Analysis",
          "Test Results Documentation",
        ],
        tools: [
          "CMM Equipment",
          "Inspection Tools",
          "Quality Documentation Software",
        ],
        visualization: {
          type: "image",
          src: "/images/services/Manufacturing solutions/3d printing/process/TP-7-quality-control/step-hero.jpg",
          alt: "Quality control and verification",
        },
      },
    ],
  },
};
