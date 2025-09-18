import type { Service } from "@/library/types";

export const research_development: Service = {
    id: "research-development",
    title: "Research & Development",
    description:
      "Transform innovative ideas into market-ready products with comprehensive validation and regulatory compliance.",
    slug: "research-development",
    icon: "Lightbulb",
    features: [
      "End-to-end product development",
      "Technical feasibility analysis",
      "Prototype development and testing",
      "Engineering optimization",
      "Manufacturing preparation",
      "Regulatory compliance assessment",
    ],
    category: ["Research & Development"],
    details: {
      specifications: [
        {
          category: "R&D Capabilities",
          items: [
            {
              label: "Development Cycle",
              value: "4-12 months (project dependent)",
            },
            {
              label: "Team Composition",
              value: "Engineers, Designers, Market Analysts",
            },
            {
              label: "Industries Served",
              value: "Consumer Products, Medical, Industrial, Electronics",
            },
            { label: "Success Rate", value: "87% of projects reach market" },
          ],
        },
      ],
      process: [
        {
          title: "Define Project Scope and Design Constraints",
          description:
            "We establish clear objectives, requirements, and limitations for your project, creating a solid foundation for the development process.",
          timeline: "2-4 weeks",
          keyPoints: [
            "Establish clear objectives and requirements",
            "Identify target market and user needs",
            "Document technical specifications",
            "Create detailed project timeline and budget",
          ],
          deliverables: [
            "Project Brief",
            "Requirements Document",
            "Project Timeline",
            "Budget Estimate",
          ],
          tools: [
            "Requirements Management Software",
            "Market Analysis Tools",
            "Project Planning Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-1-Scope and Constraints/step-hero.jpg",
            alt: "Project scope definition and constraint analysis",
          },
        },
        {
          title: "Research & Initial Concept Design",
          description:
            "Our team conducts thorough market analysis and generates multiple design concepts, evaluating each against your project constraints.",
          timeline: "2-4 weeks",
          keyPoints: [
            "Market analysis and competitive landscape evaluation",
            "Multiple design concept generation",
            "Feasibility evaluation against constraints",
            "Selection of promising concepts",
          ],
          deliverables: [
            "Market Analysis Report",
            "Concept Sketches",
            "Initial Design Brief",
          ],
          tools: [
            "Market Research Software",
            "CAD Design Tools",
            "Concept Visualization Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-2-Research & Initial Concept Design/step-hero.jpg",
            alt: "Research and concept design phase",
          },
        },
        {
          title: "Proof of Concept",
          description:
            "We develop functional prototypes to validate core technologies and gather user feedback on preliminary designs.",
          timeline: "3-6 weeks",
          keyPoints: [
            "Functional prototype development",
            "Critical component testing",
            "User feedback collection",
            "Concept refinement",
          ],
          deliverables: [
            "Functional Prototypes",
            "Testing Reports",
            "Refined Design Concepts",
          ],
          tools: [
            "Rapid Prototyping Equipment",
            "Testing Apparatus",
            "User Feedback Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-3-proof-of-concept/step-hero.jpg",
            alt: "Proof of concept development and testing",
          },
        },
        {
          title: "Engineering Analysis",
          description:
            "Our engineers perform detailed technical analysis to optimize designs for performance, cost, and manufacturability.",
          timeline: "2-4 weeks",
          keyPoints: [
            "Detailed technical analysis (FEA, CFD)",
            "Design optimization",
            "Failure mode identification",
            "Material and component specification",
          ],
          deliverables: [
            "Engineering Analysis Report",
            "Optimized Design Specifications",
            "Material Selection Report",
          ],
          tools: [
            "FEA Software",
            "CFD Analysis Tools",
            "FMEA Software",
            "Material Selection Databases",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-4-engineering-analysis/step-hero.jpg",
            alt: "Engineering analysis and simulation",
          },
        },
        {
          title: "Final Design & Full Prototype",
          description:
            "We create complete CAD models and produce high-fidelity functional prototypes for comprehensive testing and validation.",
          timeline: "4-8 weeks",
          keyPoints: [
            "Complete CAD modeling",
            "Technical documentation creation",
            "High-fidelity prototype production",
            "Comprehensive testing and validation",
          ],
          deliverables: [
            "Complete CAD Models",
            "Technical Documentation",
            "Functional Prototypes",
            "Validation Reports",
          ],
          tools: [
            "Advanced CAD Software",
            "Technical Documentation Tools",
            "Prototype Manufacturing Equipment",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-5-final-design-prototype/step-hero.jpg",
            alt: "Final design and prototype development",
          },
        },
        {
          title: "User Validation & Iteration",
          description:
            "We conduct structured usability testing with target users to validate the final design and make any necessary refinements before manufacturing.",
          timeline: "3-6 weeks",
          keyPoints: [
            "Structured usability testing with representative users",
            "Quantitative performance metrics collection",
            "Qualitative feedback analysis",
            "Final design refinements based on user input",
          ],
          deliverables: [
            "Usability Test Reports",
            "User Acceptance Metrics",
            "Final Design Refinements",
            "Validation Documentation",
          ],
          tools: [
            "Usability Testing Equipment",
            "User Experience Measurement Tools",
            "Feedback Analysis Software",
            "Rapid Iteration Prototyping Tools",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-6-user-validation/step-hero.jpg",
            alt: "User validation and testing phase",
          },
        },
        {
          title: "Regulatory & Compliance Assessment",
          description:
            "We identify and address all applicable regulatory requirements and standards to ensure your product meets legal and industry compliance needs.",
          timeline: "4-8 weeks",
          keyPoints: [
            "Regulatory pathway identification",
            "Standards compliance assessment",
            "Certification requirements planning",
            "Risk management documentation",
          ],
          deliverables: [
            "Regulatory Strategy Document",
            "Compliance Checklist",
            "Risk Management File",
            "Testing & Certification Plan",
          ],
          tools: [
            "Regulatory Database Systems",
            "Compliance Tracking Software",
            "Risk Assessment Tools",
            "Standards Reference Libraries",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-7-regulatory-compliance/step-hero.jpg",
            alt: "Regulatory compliance and certification",
          },
        },
        {
          title: "Manufacturing Plan",
          description:
            "We develop a detailed production strategy, including assembly instructions, quality control procedures, and supplier identification.",
          timeline: "2-4 weeks",
          keyPoints: [
            "Production strategy development",
            "Assembly instruction creation",
            "Quality control procedure establishment",
            "Supplier and partner identification",
          ],
          deliverables: [
            "Manufacturing Plan",
            "Assembly Instructions",
            "QC Procedures",
            "Supplier Recommendations",
          ],
          tools: [
            "Production Planning Software",
            "Quality Control Systems",
            "Supply Chain Management Tools",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-8-Manufacturing Plan/step-hero.jpg",
            alt: "Manufacturing planning and preparation",
          },
        },
        {
          title: "Marketing Renders & Launch Support",
          description:
            "We create photorealistic product visualizations and marketing materials to support your product launch strategy.",
          timeline: "1-3 weeks",
          keyPoints: [
            "Photorealistic product visualization",
            "Marketing material development",
            "Technical documentation for sales",
            "Product launch support",
          ],
          deliverables: [
            "Product Renders",
            "Marketing Materials",
            "Sales Documentation",
            "Launch Strategy Support",
          ],
          tools: [
            "3D Rendering Software",
            "Graphic Design Tools",
            "Marketing Material Templates",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/research-development/process/RD-9-Marketing & Launch Support/step-hero.jpg",
            alt: "Marketing renders and launch support",
          },
        },
      ],
    },
  };
