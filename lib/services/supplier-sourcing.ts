import type { Service } from "@/library/types";

export const supplier_sourcing: Service = {
    id: "supplier-sourcing",
    title: "Supplier Sourcing",
    description:
      "Strategic supplier identification and development services connecting you with reliable manufacturing partners worldwide.",
    slug: "supplier-sourcing",
    icon: "Globe",
    features: [
      "Global supplier identification",
      "Supplier qualification and assessment",
      "Cost analysis and negotiation",
      "Quality system evaluation",
      "Supply chain optimization",
      "Ongoing supplier management",
    ],
    category: ["Manufacturing"],
    details: {
      specifications: [
        {
          category: "Sourcing Capabilities",
          items: [
            {
              label: "Geographic Coverage",
              value: "Global network with focus on Asia, Europe, North America",
            },
            {
              label: "Industries",
              value:
                "Manufacturing, Electronics, Automotive, Medical, Consumer Products",
            },
            {
              label: "Supplier Types",
              value:
                "OEMs, Contract Manufacturers, Component Suppliers, Raw Materials",
            },
            {
              label: "Assessment Criteria",
              value: "Quality, Cost, Delivery, Service, Financial Stability",
            },
          ],
        },
      ],
      process: [
        {
          title: "Requirements Definition",
          description:
            "We begin by clearly defining your sourcing requirements, specifications, and strategic objectives to ensure targeted and effective supplier identification.",
          timeline: "1-2 days",
          keyPoints: [
            "Define detailed sourcing requirements and specifications",
            "Establish procurement objectives and success criteria",
            "Document quality, delivery, and cost requirements",
          ],
          deliverables: [
            "Sourcing Requirements Document",
            "Procurement Strategy",
            "Success Criteria",
          ],
          tools: [
            "Requirements Management Software",
            "Specification Development Tools",
            "Cost Modeling Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Manufacturing solutions/supplier-sourcing/process/TP-1-requirements-definition/step-hero.jpg",
            alt: "Requirements definition and strategy",
          },
        },
        {
          title: "Risk Assessment",
          description:
            "Our experts conduct comprehensive supply chain risk analysis to identify potential risks and develop mitigation strategies.",
          timeline: "2-3 days",
          keyPoints: [
            "Analyze supply chain risks and vulnerabilities",
            "Assess geopolitical, financial, and operational risks",
            "Develop risk mitigation strategies and contingency plans",
          ],
          deliverables: [
            "Risk Assessment Report",
            "Risk Mitigation Plan",
            "Contingency Strategies",
          ],
          tools: [
            "Risk Assessment Software",
            "Geopolitical Analysis Tools",
            "Contingency Planning Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Manufacturing solutions/supplier-sourcing/process/TP-2-risk-assessment/step-hero.jpg",
            alt: "Supply chain risk assessment",
          },
        },
        {
          title: "Supplier Identification",
          description:
            "We conduct extensive market research and supplier discovery to identify qualified suppliers that meet your specific requirements.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Conduct comprehensive market research and analysis",
            "Identify potential suppliers through multiple channels",
            "Screen suppliers for basic qualification criteria",
          ],
          deliverables: [
            "Supplier Long List",
            "Market Analysis Report",
            "Initial Screening Results",
          ],
          tools: [
            "Supplier Database",
            "Screening Software",
            "Network Analysis Tools",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Manufacturing solutions/supplier-sourcing/process/TP-3-supplier-identification/step-hero.jpg",
            alt: "Supplier identification and screening",
          },
        },
        {
          title: "Supplier Evaluation",
          description:
            "We perform detailed supplier capability assessments including technical, financial, quality, and operational evaluations.",
          timeline: "2-4 weeks (includes site visits)",
          keyPoints: [
            "Conduct detailed supplier capability assessments",
            "Evaluate technical, financial, and operational capabilities",
            "Perform quality system and certification reviews",
          ],
          deliverables: [
            "Supplier Evaluation Reports",
            "Capability Assessments",
            "Qualification Matrix",
          ],
          tools: [
            "Audit Management Software",
            "Quality Assessment Tools",
            "Capacity Analysis Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Manufacturing solutions/supplier-sourcing/process/TP-4-supplier-evaluation/step-hero.jpg",
            alt: "Supplier evaluation and assessment",
          },
        },
        {
          title: "Supplier Selection",
          description:
            "We facilitate strategic supplier selection through comprehensive analysis, comparison, and decision-making processes.",
          timeline: "2-3 days",
          keyPoints: [
            "Compare suppliers using weighted decision criteria",
            "Conduct final supplier assessments and negotiations",
            "Make strategic supplier selection recommendations",
          ],
          deliverables: [
            "Supplier Selection Report",
            "Recommendation Summary",
            "Selection Justification",
          ],
          tools: [
            "Selection Matrix Software",
            "TCO Calculation Tools",
            "Strategic Analysis Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Manufacturing solutions/supplier-sourcing/process/TP-5-supplier-selection/step-hero.jpg",
            alt: "Supplier selection and decision making",
          },
        },
        {
          title: "Contract Negotiation",
          description:
            "Our procurement experts manage comprehensive contract negotiations to secure optimal terms, conditions, and pricing.",
          timeline: "1-3 weeks",
          keyPoints: [
            "Negotiate optimal pricing, terms, and conditions",
            "Establish service level agreements and KPIs",
            "Secure favorable contract terms and risk allocation",
          ],
          deliverables: [
            "Negotiated Contracts",
            "Terms and Conditions",
            "SLA Agreements",
          ],
          tools: [
            "Contract Management Software",
            "SLA Development Tools",
            "Legal Document Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Manufacturing solutions/supplier-sourcing/process/TP-6-contract-negotiation/step-hero.jpg",
            alt: "Contract negotiation and agreement",
          },
        },
        {
          title: "Supplier Onboarding",
          description:
            "We manage comprehensive supplier onboarding and integration processes to ensure smooth operational startup and relationship establishment.",
          timeline: "2-4 weeks",
          keyPoints: [
            "Manage supplier integration and system setup",
            "Establish communication and reporting procedures",
            "Implement quality and performance monitoring systems",
          ],
          deliverables: [
            "Onboarding Plan",
            "Integration Documentation",
            "Communication Procedures",
          ],
          tools: [
            "Onboarding Management Software",
            "Quality Control Systems",
            "Communication Platforms",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Manufacturing solutions/supplier-sourcing/process/TP-7-supplier-onboarding/step-hero.jpg",
            alt: "Supplier onboarding and integration",
          },
        },
        {
          title: "Performance Monitoring",
          description:
            "We establish ongoing supplier performance monitoring and management systems to ensure continuous improvement and relationship optimization.",
          timeline: "Ongoing",
          keyPoints: [
            "Implement performance monitoring and KPI tracking",
            "Conduct regular supplier performance reviews",
            "Manage continuous improvement and optimization",
          ],
          deliverables: [
            "Performance Monitoring System",
            "KPI Reports",
            "Improvement Plans",
          ],
          tools: [
            "Performance Monitoring Software",
            "KPI Dashboard Tools",
            "Improvement Tracking Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Manufacturing solutions/supplier-sourcing/process/TP-8-performance-monitoring/step-hero.jpg",
            alt: "Performance monitoring and management",
          },
        },
      ],
    },
  };
