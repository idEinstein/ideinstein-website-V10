import type { Service } from "@/library/types";

export const gdt_tolerance: Service = {
    id: "gdt-tolerance",
    title: "GD&T & Tolerance Analysis",
    description:
      "Expert geometric dimensioning and tolerancing services ensuring precise manufacturing specifications and comprehensive quality control.",
    slug: "gdt-tolerance",
    icon: "Target",
    features: [
      "GD&T specification development",
      "Tolerance stack-up analysis",
      "Manufacturing feasibility assessment",
      "Quality control planning",
      "Inspection procedures",
      "Training and documentation",
    ],
    category: ["Engineering"],
    details: {
      specifications: [
        {
          category: "GD&T Capabilities",
          items: [
            { label: "Standards", value: "ASME Y14.5, ISO 1101, ISO 5459" },
            {
              label: "Analysis Software",
              value: "3DCS, CETOL 6σ, SolidWorks Tolerance Analysis",
            },
            {
              label: "Industries",
              value: "Automotive, Aerospace, Medical, Precision Manufacturing",
            },
            {
              label: "Tolerance Types",
              value: "Geometric, Dimensional, Statistical Analysis",
            },
          ],
        },
      ],
      process: [
        {
          title: "Design Review",
          description:
            "We conduct comprehensive review of technical drawings and design specifications to assess current tolerancing practices and identify improvement opportunities.",
          timeline: "1-2 days",
          keyPoints: [
            "Review existing technical drawings and specifications",
            "Assess current tolerancing practices and standards",
            "Identify critical dimensions and geometric requirements",
          ],
          deliverables: [
            "Design Review Report",
            "GD&T Assessment",
            "Improvement Recommendations",
          ],
          tools: [
            "CAD Software",
            "Drawing Review Tools",
            "Functional Analysis Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/gdt-tolerance/process/GT-1-design-review/step-hero.jpg",
            alt: "Design review and assessment",
          },
        },
        {
          title: "Manufacturing Method Analysis",
          description:
            "Our experts analyze manufacturing processes and capabilities to ensure GD&T specifications are achievable and cost-effective.",
          timeline: "2-3 days",
          keyPoints: [
            "Analyze manufacturing processes and capabilities",
            "Assess process capability and control methods",
            "Evaluate tooling and fixture requirements",
          ],
          deliverables: [
            "Process Capability Report",
            "Manufacturing Assessment",
            "Tooling Requirements",
          ],
          tools: [
            "Manufacturing Analysis Software",
            "Process Capability Tools",
            "Tooling Database",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/gdt-tolerance/process/GT-2-manufacturing-method/step-hero.jpg",
            alt: "Manufacturing method analysis",
          },
        },
        {
          title: "GD&T Implementation",
          description:
            "We implement comprehensive GD&T standards on technical drawings with proper symbols, datums, and geometric controls.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Apply GD&T symbols and geometric controls",
            "Establish datum reference frames",
            "Optimize tolerance specifications for functionality",
          ],
          deliverables: [
            "GD&T Drawings",
            "Datum Schemes",
            "Tolerance Specifications",
          ],
          tools: [
            "GD&T Software",
            "CAD Systems",
            "Standards Reference Libraries",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/gdt-tolerance/process/GT-3-gdt-implementation/step-hero.jpg",
            alt: "GD&T implementation and specification",
          },
        },
        {
          title: "Tolerance Stack-up Analysis",
          description:
            "We perform detailed tolerance stack-up analysis using statistical methods to predict assembly variation and optimize tolerance allocation.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Conduct worst-case and statistical tolerance analysis",
            "Predict assembly variation and fit conditions",
            "Optimize tolerance allocation for cost and quality",
          ],
          deliverables: [
            "Stack-up Analysis Report",
            "Variation Predictions",
            "Tolerance Optimization",
          ],
          tools: [
            "Tolerance Analysis Software",
            "Statistical Analysis Tools",
            "Simulation Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/gdt-tolerance/process/GT-4-tolerance-stack-up/step-hero.jpg",
            alt: "Tolerance stack-up analysis",
          },
        },
        {
          title: "Measurement System Design",
          description:
            "We design comprehensive measurement and inspection systems to verify GD&T requirements with appropriate gauging and measurement strategies.",
          timeline: "2-3 days",
          keyPoints: [
            "Design measurement and inspection procedures",
            "Select appropriate gauging and measurement tools",
            "Develop inspection planning and documentation",
          ],
          deliverables: [
            "Measurement Plan",
            "Gauge Requirements",
            "Inspection Procedures",
          ],
          tools: ["MSA Software", "Gauge R&R Tools", "Calibration Systems"],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/gdt-tolerance/process/GT-5-measurement-system/step-hero.jpg",
            alt: "Measurement system design",
          },
        },
        {
          title: "Design Optimization",
          description:
            "We optimize designs for improved manufacturability, reduced cost, and enhanced quality through strategic tolerance refinement.",
          timeline: "2-4 days",
          keyPoints: [
            "Optimize tolerances for manufacturing efficiency",
            "Balance quality requirements with cost considerations",
            "Improve design robustness and reliability",
          ],
          deliverables: [
            "Optimized Design",
            "Cost-Benefit Analysis",
            "Quality Improvement Plan",
          ],
          tools: [
            "Optimization Software",
            "Cost Analysis Tools",
            "Manufacturing Database",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/gdt-tolerance/process/GT-6-design-optimization/step-hero.jpg",
            alt: "Design optimization and improvement",
          },
        },
        {
          title: "Process Control Implementation",
          description:
            "We establish comprehensive process control systems to maintain GD&T compliance throughout manufacturing operations.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Implement statistical process control systems",
            "Establish quality monitoring and control procedures",
            "Develop continuous improvement processes",
          ],
          deliverables: [
            "Process Control Plan",
            "SPC Implementation",
            "Quality Procedures",
          ],
          tools: [
            "SPC Software",
            "Quality Control Tools",
            "Process Monitoring Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/gdt-tolerance/process/GT-7-process-control/step-hero.jpg",
            alt: "Process control implementation",
          },
        },
      ],
    },
  };
