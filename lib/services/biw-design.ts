import type { Service } from "@/library/types";

export const biw_design: Service = {
    id: "biw-design",
    title: "BIW Design",
    description:
      "Specialized Body-in-White (BIW) design services integrating advanced manufacturing simulation and comprehensive cross-team coordination.",
    slug: "biw-design",
    icon: "Car",
    features: [
      "Body-in-white structural design",
      "Manufacturing simulation",
      "Cross-team coordination",
      "Material optimization",
      "Crash safety analysis",
      "Production feasibility assessment",
    ],
    category: ["Engineering"],
    details: {
      specifications: [
        {
          category: "BIW Design Capabilities",
          items: [
            {
              label: "Vehicle Types",
              value: "Passenger Cars, Commercial Vehicles, Electric Vehicles",
            },
            {
              label: "Materials",
              value: "Steel, Aluminum, Carbon Fiber, Mixed Materials",
            },
            { label: "Analysis Tools", value: "CATIA, NX, LS-DYNA, Abaqus" },
            { label: "Standards", value: "IIHS, Euro NCAP, FMVSS Compliance" },
          ],
        },
      ],
      process: [
        {
          title: "Process Planning",
          description:
            "We develop comprehensive manufacturing process plans for BIW components and assemblies, optimizing production efficiency and quality.",
          timeline: "4-6 weeks",
          keyPoints: [
            "Develop manufacturing sequences and station layouts",
            "Conduct station balancing optimization",
            "Perform cycle time analysis and optimization",
          ],
          deliverables: [
            "Process Flow Charts",
            "Station Layouts",
            "Cycle Time Reports",
          ],
          tools: [
            "Process Planning Software",
            "Digital Manufacturing Tools",
            "Time Study Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/biw-design/process/BD-1-process-planning/step-hero.jpg",
            alt: "BIW process planning and optimization",
          },
        },
        {
          title: "Cross-Team Integration",
          description:
            "We ensure seamless coordination between all relevant engineering teams for integrated BIW development.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Coordinate with body, chassis, and powertrain design teams",
            "Resolve interface conflicts and integration issues",
            "Establish common reference systems and standards",
          ],
          deliverables: [
            "Integration Plan",
            "Interface Specifications",
            "Coordination Reports",
          ],
          tools: [
            "Collaboration Platforms",
            "Interface Management Tools",
            "Design Review Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/biw-design/process/BD-2-cross-team-integration/step-hero.jpg",
            alt: "Cross-team integration and coordination",
          },
        },
        {
          title: "Fixture Design",
          description:
            "Our engineers design precise fixtures and jigs for component handling, positioning, and assembly operations.",
          timeline: "6-12 weeks",
          keyPoints: [
            "Develop locating schemes and clamping mechanisms",
            "Design handling and positioning fixtures",
            "Perform tolerance stack-up analysis",
          ],
          deliverables: [
            "3D Fixture Models",
            "Technical Drawings",
            "Bill of Materials",
          ],
          tools: [
            "Advanced CAD Software",
            "FEA Tools",
            "Tolerance Analysis Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/biw-design/process/BD-3-fixture-design/step-hero.jpg",
            alt: "Fixture and jig design",
          },
        },
        {
          title: "Welding Equipment Design",
          description:
            "We design specialized welding equipment and processes for various joining operations in BIW production.",
          timeline: "5-10 weeks",
          keyPoints: [
            "Select and position welding guns and equipment",
            "Plan robot paths and welding sequences",
            "Integrate weld quality verification methods",
          ],
          deliverables: [
            "Welding Equipment Designs",
            "Robot Programs",
            "Process Parameters",
          ],
          tools: [
            "Welding Simulation Software",
            "Robot Programming Tools",
            "Process Validation Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/biw-design/process/BD-4-welding-equipment/step-hero.jpg",
            alt: "Welding equipment design",
          },
        },
        {
          title: "Manufacturing Simulation",
          description:
            "We conduct comprehensive simulation of the BIW manufacturing process to optimize production flow and identify potential issues.",
          timeline: "3-6 weeks",
          keyPoints: [
            "Simulate assembly sequence and production flow",
            "Verify access for tools and operators",
            "Analyze ergonomic factors and safety considerations",
          ],
          deliverables: [
            "Simulation Reports",
            "Process Optimization Recommendations",
            "Ergonomic Analysis Results",
          ],
          tools: [
            "Digital Manufacturing Software",
            "Ergonomics Analysis Tools",
            "Process Simulation Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/biw-design/process/BD-5-manufacturing-simulation/step-hero.jpg",
            alt: "Manufacturing simulation and optimization",
          },
        },
        {
          title: "Assembly System Design",
          description:
            "We design comprehensive assembly systems and production line layouts for efficient BIW manufacturing.",
          timeline: "6-10 weeks",
          keyPoints: [
            "Design assembly line layouts and material flow",
            "Integrate automation and manual operations",
            "Optimize production efficiency and quality",
          ],
          deliverables: [
            "Assembly System Design",
            "Production Line Layouts",
            "Automation Specifications",
          ],
          tools: [
            "Factory Simulation Software",
            "Automation Design Tools",
            "Material Flow Analysis Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/biw-design/process/BD-6-assembly-system/step-hero.jpg",
            alt: "Assembly system design",
          },
        },
        {
          title: "Enhanced Validation",
          description:
            "We perform comprehensive validation and testing of BIW designs and manufacturing processes.",
          timeline: "4-6 weeks",
          keyPoints: [
            "Conduct structural and dimensional validation",
            "Perform manufacturing process validation",
            "Execute quality and performance testing",
          ],
          deliverables: [
            "Validation Reports",
            "Test Results",
            "Quality Documentation",
          ],
          tools: [
            "Validation Software",
            "Testing Equipment",
            "Measurement Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/biw-design/process/BD-7-enhanced-validation/step-hero.jpg",
            alt: "Enhanced validation and testing",
          },
        },
        {
          title: "Documentation & Training",
          description:
            "We provide comprehensive documentation and training programs for BIW manufacturing processes and procedures.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Create detailed process documentation",
            "Develop operator training materials",
            "Establish quality control procedures",
          ],
          deliverables: [
            "Process Documentation",
            "Training Materials",
            "Quality Procedures",
          ],
          tools: [
            "Documentation Software",
            "Training Development Tools",
            "Knowledge Management Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/biw-design/process/BD-8-documentation-training/step-hero.jpg",
            alt: "Documentation and training",
          },
        },
      ],
    },
  };
