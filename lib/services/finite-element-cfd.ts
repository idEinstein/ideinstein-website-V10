import type { Service } from "@/library/types";

export const finite_element_cfd: Service = {
    id: "finite-element-cfd",
    title: "FEA & CFD Analysis",
    description:
      "Advanced finite element analysis and computational fluid dynamics services for comprehensive engineering simulation and optimization.",
    slug: "finite-element-cfd",
    icon: "Calculator",
    features: [
      "Structural FEA analysis",
      "CFD flow simulation",
      "Thermal analysis",
      "Vibration and modal analysis",
      "Optimization studies",
      "Design validation",
    ],
    category: ["Analysis & Simulation"],
    details: {
      specifications: [
        {
          category: "Analysis Capabilities",
          items: [
            {
              label: "FEA Software",
              value: "Abaqus, ANSYS, SolidWorks Simulation, LS-DYNA",
            },
            {
              label: "CFD Software",
              value: "ANSYS Fluent, SolidWorks Flow Simulation, OpenFOAM",
            },
            {
              label: "Analysis Types",
              value: "Linear/Nonlinear, Static/Dynamic, Thermal, Fluid Flow",
            },
            {
              label: "Mesh Quality",
              value: "High-quality structured and unstructured meshes",
            },
          ],
        },
      ],
      process: [
        {
          title: "Problem Definition",
          description:
            "We begin by clearly defining the analysis objectives, scope, and expected outcomes to ensure focused and effective simulation studies.",
          timeline: "3-5 days",
          keyPoints: [
            "Define analysis objectives and scope",
            "Identify key performance parameters",
            "Establish success criteria and validation requirements",
          ],
          deliverables: [
            "Analysis Plan",
            "Problem Statement",
            "Success Criteria Document",
          ],
          tools: [
            "Requirements Documentation Software",
            "Engineering Consultation Tools",
            "Project Management Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/finite-element-cfd/process/FA-1-problem-definition/step-hero.jpg",
            alt: "Problem definition and analysis planning",
          },
        },
        {
          title: "Pre-Analysis",
          description:
            "Our engineers conduct thorough pre-analysis planning including method selection, approach validation, and resource planning.",
          timeline: "2-4 days",
          keyPoints: [
            "Select appropriate analysis methods and tools",
            "Validate analysis approach and assumptions",
            "Plan computational resources and timeline",
          ],
          deliverables: [
            "Analysis Strategy",
            "Method Validation",
            "Resource Plan",
          ],
          tools: [
            "CAD Software",
            "Model Simplification Tools",
            "Geometry Analysis Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/finite-element-cfd/process/FA-2-pre-analysis/step-hero.jpg",
            alt: "Pre-analysis planning and validation",
          },
        },
        {
          title: "Model Preparation",
          description:
            "We create detailed finite element meshes and CFD models with proper boundary conditions, material properties, and loading scenarios.",
          timeline: "1-3 weeks (meshing dependent)",
          keyPoints: [
            "Generate high-quality finite element meshes",
            "Define boundary conditions and material properties",
            "Set up loading scenarios and constraints",
          ],
          deliverables: [
            "Simulation Models",
            "Mesh Quality Reports",
            "Model Validation",
          ],
          tools: [
            "Meshing Software",
            "Material Libraries",
            "Boundary Condition Tools",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/finite-element-cfd/process/FA-3-model-preparation/step-hero.jpg",
            alt: "Model preparation and meshing",
          },
        },
        {
          title: "Simulation Execution",
          description:
            "We execute comprehensive FEA and CFD simulations using high-performance computing resources with continuous monitoring and quality control.",
          timeline: "2-10 days (solver dependent)",
          keyPoints: [
            "Execute simulations with optimal solver settings",
            "Monitor convergence and solution quality",
            "Manage computational resources efficiently",
          ],
          deliverables: [
            "Simulation Results",
            "Convergence Reports",
            "Quality Control Documentation",
          ],
          tools: [
            "FEA Software",
            "CFD Solvers",
            "High-Performance Computing Resources",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/finite-element-cfd/process/FA-4-simulation-execution/step-hero.jpg",
            alt: "Simulation execution and monitoring",
          },
        },
        {
          title: "Multi-Condition Analysis",
          description:
            "We conduct comprehensive analysis under various operating conditions, loading scenarios, and design variations to ensure robust design validation.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Analyze multiple loading and operating conditions",
            "Conduct parametric and sensitivity studies",
            "Evaluate design variations and alternatives",
          ],
          deliverables: [
            "Multi-Condition Results",
            "Sensitivity Analysis",
            "Design Comparison Studies",
          ],
          tools: [
            "Parametric Analysis Tools",
            "Load Case Generators",
            "Statistical Analysis Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/finite-element-cfd/process/FA-5-multi-condition-analysis/step-hero.jpg",
            alt: "Multi-condition analysis",
          },
        },
        {
          title: "Results Analysis",
          description:
            "Our experts perform detailed analysis and interpretation of simulation results, identifying critical insights and design recommendations.",
          timeline: "3-5 days",
          keyPoints: [
            "Analyze and interpret simulation results",
            "Identify critical stress concentrations and flow patterns",
            "Generate design improvement recommendations",
          ],
          deliverables: [
            "Results Analysis",
            "Critical Findings Report",
            "Design Recommendations",
          ],
          tools: [
            "Post-Processing Software",
            "Data Visualization Tools",
            "Analysis Automation Scripts",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/finite-element-cfd/process/FA-6-results-analysis/step-hero.jpg",
            alt: "Results analysis and interpretation",
          },
        },
        {
          title: "Report Generation",
          description:
            "We create comprehensive technical reports with detailed analysis results, visualizations, and actionable engineering recommendations.",
          timeline: "3-5 days",
          keyPoints: [
            "Generate comprehensive technical reports",
            "Create professional visualizations and animations",
            "Provide actionable engineering recommendations",
          ],
          deliverables: [
            "Technical Analysis Report",
            "Executive Summary",
            "Visualization Package",
          ],
          tools: [
            "Technical Writing Software",
            "Visualization Tools",
            "Report Templates",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/finite-element-cfd/process/FA-7-report-generation/step-hero.jpg",
            alt: "Report generation and documentation",
          },
        },
      ],
    },
  };
