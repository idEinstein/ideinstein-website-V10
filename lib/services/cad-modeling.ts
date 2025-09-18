import type { Service } from "@/library/types";

export const cad_modeling: Service = {
    id: "cad-modeling",
    title: "CAD Modeling Services",
    description:
      "Professional CAD modeling and design services offering precise 3D models, technical documentation, and comprehensive design validation.",
    slug: "cad-modeling",
    icon: "Boxes",
    features: [
      "Parametric 3D modeling",
      "Technical drawings & documentation",
      "Complex assembly design",
      "Design optimization",
      "Reverse engineering",
      "File format conversion",
    ],
    category: ["Design"],
    details: {
      specifications: [
        {
          category: "CAD Capabilities",
          items: [
            {
              label: "Software",
              value:
                "SolidWorks, CATIA, Fusion 360, AutoCAD, Inventor, Rhino 3D",
            },
            {
              label: "File Formats",
              value: "STEP, IGES, STL, OBJ, SLDPRT, DWG, DXF, and more",
            },
            { label: "Accuracy", value: "Up to 0.001mm precision" },
            {
              label: "Turnaround Time",
              value: "1-10 business days (project dependent)",
            },
          ],
        },
      ],
      process: [
        {
          title: "Requirements Analysis",
          description:
            "We begin by thoroughly understanding your design requirements, intended use case, manufacturing constraints, and project goals.",
          timeline: "2-5 business days",
          keyPoints: [
            "Clarify design intent, functional requirements, and constraints",
            "Document design specifications and acceptance criteria",
            "Establish project timeline and deliverables",
          ],
          deliverables: [
            "Project Brief",
            "Design Requirements Document",
            "Project Timeline",
          ],
          tools: [
            "Requirements Documentation Software",
            "Video Conferencing",
            "Collaborative Design Platforms",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/cad-modeling/process/ED-1-requirements/step-hero.jpg",
            alt: "Requirements analysis and planning",
          },
        },
        {
          title: "Concept Development",
          description:
            "Our designers create initial concept sketches and basic 3D models to establish the fundamental geometry and design approach.",
          timeline: "1-2 weeks",
          keyPoints: [
            "Generate initial concept sketches and basic 3D models",
            "Review concepts with stakeholders",
            "Establish fundamental geometry and approach",
          ],
          deliverables: [
            "Concept Sketches",
            "Basic 3D Models",
            "Design Direction Document",
          ],
          tools: [
            "Sketching Software",
            "Basic CAD Tools",
            "Rendering Software",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/cad-modeling/process/ED-2-concept-sketching/step-hero.jpg",
            alt: "Concept development and sketching",
          },
        },
        {
          title: "Detailed 3D Modeling",
          description:
            "We create precise, parametric 3D models with proper feature hierarchy, design intent, and manufacturing considerations.",
          timeline: "2-4 weeks (complexity dependent)",
          keyPoints: [
            "Create parametric feature-based models",
            "Develop proper model tree organization",
            "Implement design for manufacturing principles",
          ],
          deliverables: [
            "Detailed 3D Models",
            "Assembly Files",
            "Part Libraries",
          ],
          tools: [
            "Advanced CAD Software",
            "Specialized Modeling Add-ins",
            "Material Libraries",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/cad-modeling/process/ED-3-3d-modeling/step-hero.jpg",
            alt: "Detailed 3D modeling process",
          },
        },
        {
          title: "Technical Documentation",
          description:
            "We produce comprehensive technical drawings with proper dimensioning, tolerancing, annotations, and manufacturing information.",
          timeline: "1-3 weeks",
          keyPoints: [
            "Produce engineering drawings with proper dimensioning and tolerancing",
            "Create assembly drawings and exploded views",
            "Generate bill of materials and parts lists",
          ],
          deliverables: [
            "2D Technical Drawings",
            "Assembly Drawings",
            "Bill of Materials",
            "Manufacturing Notes",
          ],
          tools: [
            "Technical Drawing Software",
            "GD&T Standards Libraries",
            "Documentation Templates",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/cad-modeling/process/ED-4-Technical documentation/step-hero.jpg",
            alt: "Technical documentation and drawings",
          },
        },
        {
          title: "Design Validation",
          description:
            "We perform comprehensive validation to ensure your design meets all requirements and manufacturing standards.",
          timeline: "1-2 weeks (scope dependent)",
          keyPoints: [
            "Perform interference checks and simulation analysis",
            "Validate against requirements",
            "Identify potential manufacturing issues",
          ],
          deliverables: [
            "Validation Report",
            "Design Improvement Recommendations",
            "Final Design Package",
          ],
          tools: [
            "Design Validation Software",
            "Simulation Tools",
            "Collaboration Platforms",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/cad-modeling/process/ED-5-Design Validation/step-hero.jpg",
            alt: "Design validation and testing",
          },
        },
        {
          title: "Post-Validation Iteration",
          description:
            "We implement necessary revisions based on validation findings and document all changes for traceability.",
          timeline: "3-5 business days",
          keyPoints: [
            "Implement design revisions based on validation findings",
            "Document design changes and justifications",
            "Update models and technical documentation",
          ],
          deliverables: [
            "Updated Models",
            "Change Documentation",
            "Revision History",
          ],
          tools: [
            "CAD Software",
            "Change Management Tools",
            "Documentation Systems",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/cad-modeling/process/ED-6-Post-Validation Iteration/step-hero.jpg",
            alt: "Post-validation iteration and updates",
          },
        },
        {
          title: "Design Handover",
          description:
            "We ensure a smooth transition of all design assets and knowledge to your team.",
          timeline: "1-2 business days",
          keyPoints: [
            "Prepare final deliverable package",
            "Document parametric model guidelines",
            "Create design intent documentation",
            "Conduct knowledge transfer session",
          ],
          deliverables: [
            "Final Design Package",
            "Design Guidelines",
            "Knowledge Transfer Documentation",
          ],
          tools: [
            "Knowledge Management Systems",
            "Documentation Tools",
            "Training Platforms",
          ],
          visualization: {
            type: "image",
            src: "/images/services/Engineering services/cad-modeling/process/ED-7-Design Handover/step-hero.jpg",
            alt: "Final design handover and documentation",
          },
        },
      ],
    },
  };
