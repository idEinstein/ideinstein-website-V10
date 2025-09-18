import type { Service } from "@/library/types";

export const machine_design: Service = {
    id: "machine-design",
    title: "Machine Design",
    description:
      "Expert mechanical design services integrating safety compliance, automation systems, and comprehensive documentation for optimal machine performance.",
    slug: "machine-design",
    icon: "Cog",
    features: [
      "Custom machine design",
      "Safety compliance integration",
      "Automation system design",
      "Performance optimization",
      "Manufacturing documentation",
      "Maintenance planning",
    ],
    category: ["Engineering"],
    details: {
      specifications: [
        {
          category: "Design Capabilities",
          items: [
            {
              label: "Machine Types",
              value: "Industrial, Manufacturing, Automation, Custom Equipment",
            },
            {
              label: "Safety Standards",
              value: "ISO 12100, CE Marking, OSHA Compliance",
            },
            {
              label: "Design Software",
              value: "SolidWorks, CATIA, Inventor, AutoCAD",
            },
            {
              label: "Project Duration",
              value: "6-20 weeks (complexity dependent)",
            },
          ],
        },
      ],
      process: [
        {
          title: "Requirements Analysis",
          description:
            "We begin by thoroughly understanding your machine specifications, operational requirements, and performance criteria.",
          timeline: "2-3 weeks",
          keyPoints: [
            "Define machine specifications and operational parameters",
            "Analyze performance requirements and constraints",
            "Establish safety and regulatory compliance needs",
          ],
          deliverables: [
            "Machine Requirements Document",
            "Performance Specifications",
            "Compliance Checklist",
          ],
          tools: [
            "Requirements Management Software",
            "Industry Standards Database",
            "Cost Analysis Tools",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/machine-design/process/MD-1-requirements-analysis/step-hero.jpg",
            alt: "Requirements analysis and planning",
          },
        },
        {
          title: "Safety Assessment",
          description:
            "Our engineers conduct comprehensive safety analysis and risk assessment to ensure machine compliance with all relevant safety standards.",
          timeline: "2-3 weeks (and ongoing)",
          keyPoints: [
            "Conduct comprehensive risk assessment",
            "Identify potential hazards and safety measures",
            "Ensure compliance with safety standards",
          ],
          deliverables: [
            "Safety Assessment Report",
            "Risk Analysis Documentation",
            "Safety Compliance Plan",
          ],
          tools: [
            "Risk Assessment Software",
            "Safety Standards Database",
            "Compliance Tracking Tools",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/machine-design/process/MD-2-safety-assessment/step-hero.jpg",
            alt: "Safety assessment and risk analysis",
          },
        },
        {
          title: "Conceptual Design",
          description:
            "We develop initial machine concepts and system architectures, evaluating different design approaches for optimal performance.",
          timeline: "3-5 weeks",
          keyPoints: [
            "Generate multiple design concepts",
            "Evaluate design alternatives",
            "Select optimal design approach",
          ],
          deliverables: [
            "Concept Designs",
            "Design Evaluation Report",
            "Selected Design Approach",
          ],
          tools: ["CAD Software", "Simulation Tools", "Design Libraries"],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/machine-design/process/MD-3-conceptual-design/step-hero.jpg",
            alt: "Conceptual design development",
          },
        },
        {
          title: "Detailed Mechanical Design",
          description:
            "Our team creates precise mechanical designs with detailed component specifications, assembly drawings, and manufacturing documentation.",
          timeline: "6-12 weeks",
          keyPoints: [
            "Create detailed mechanical components",
            "Develop assembly drawings and specifications",
            "Optimize for manufacturing and assembly",
          ],
          deliverables: [
            "Detailed 3D Models",
            "Assembly Drawings",
            "Manufacturing Specifications",
          ],
          tools: [
            "Advanced CAD Software",
            "PDM Systems",
            "Component Libraries",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/machine-design/process/MD-4-detailed-mechanical-design/step-hero.jpg",
            alt: "Detailed mechanical design",
          },
        },
        {
          title: "Control System Design",
          description:
            "We design and integrate advanced control systems, including PLC programming, HMI development, and automation sequences.",
          timeline: "4-8 weeks",
          keyPoints: [
            "Design control system architecture",
            "Develop PLC programming and logic",
            "Create HMI interfaces and operator controls",
          ],
          deliverables: [
            "Control System Design",
            "PLC Programs",
            "HMI Interfaces",
          ],
          tools: [
            "Control System Design Software",
            "PLC Programming Tools",
            "HMI Design Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/machine-design/process/MD-5-control-system/step-hero.jpg",
            alt: "Control system design and programming",
          },
        },
        {
          title: "Analysis & Optimization",
          description:
            "We perform comprehensive engineering analysis including stress analysis, thermal analysis, and performance optimization.",
          timeline: "3-5 weeks",
          keyPoints: [
            "Conduct structural and thermal analysis",
            "Optimize machine performance",
            "Validate design against requirements",
          ],
          deliverables: [
            "Analysis Reports",
            "Optimization Recommendations",
            "Performance Validation",
          ],
          tools: [
            "FEA Software",
            "Motion Analysis Tools",
            "Optimization Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/machine-design/process/MD-6-analysis-optimization/step-hero.jpg",
            alt: "Analysis and optimization",
          },
        },
        {
          title: "Maintenance Planning",
          description:
            "We develop comprehensive maintenance strategies including preventive maintenance schedules, spare parts planning, and service procedures.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Develop preventive maintenance schedules",
            "Create maintenance procedures and documentation",
            "Plan spare parts inventory and sourcing",
          ],
          deliverables: [
            "Maintenance Manual",
            "Service Schedules",
            "Spare Parts List",
          ],
          tools: [
            "Maintenance Planning Software",
            "Documentation Tools",
            "Parts Management Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/machine-design/process/MD-7-maintenance-planning/step-hero.jpg",
            alt: "Maintenance planning and documentation",
          },
        },
        {
          title: "Operator Training",
          description:
            "We provide comprehensive operator training programs including training materials, procedures, and hands-on instruction.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Develop operator training materials",
            "Create operating procedures and safety protocols",
            "Provide hands-on training and certification",
          ],
          deliverables: [
            "Training Materials",
            "Operating Procedures",
            "Training Certification",
          ],
          tools: [
            "Training Development Software",
            "Documentation Tools",
            "Learning Management Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/machine-design/process/MD-8-training/step-hero.jpg",
            alt: "Operator training and certification",
          },
        },
      ],
    },
  };
