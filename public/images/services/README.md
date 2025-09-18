# Service Photography Organization

This directory contains organized photography and visual assets for all IdEinstein services and their processes.

## Directory Structure

```
services/
├── engineering/                      # Based on first category in service.category array
│   ├── research-development/        # Based on service.slug
│   │   ├── main/                   # Main service hero image
│   │   └── process/                # Process step images
│   │       ├── RD-1-requirements/
│   │       ├── RD-2-concept-development/
│   │       ├── RD-3-prototyping/
│   │       ├── RD-4-testing/
│   │       ├── RD-5-analysis/
│   │       ├── RD-6-refinement/
│   │       ├── RD-7-documentation/
│   │       ├── RD-8-manufacturing-plan/
│   │       └── RD-9-marketing-renders/
│   ├── machine-design/
│   │   ├── main/
│   │   └── process/
│   │       ├── MD-1-requirements-analysis/
│   │       ├── MD-2-safety-assessment/
│   │       ├── MD-3-conceptual-design/
│   │       ├── MD-4-detailed-mechanical-design/
│   │       ├── MD-5-control-system/
│   │       ├── MD-6-analysis-optimization/
│   │       ├── MD-7-maintenance-planning/
│   │       └── MD-8-operator-training/
│   ├── biw-design/
│   │   ├── main/
│   │   └── process/
│   │       ├── BD-1-process-planning/
│   │       ├── BD-2-cross-team-integration/
│   │       ├── BD-3-fixture-design/
│   │       ├── BD-4-welding-equipment/
│   │       ├── BD-5-manufacturing-simulation/
│   │       ├── BD-6-assembly-system/
│   │       ├── BD-7-enhanced-validation/
│   │       └── BD-8-documentation-training/
│   ├── finite-element-cfd/
│   │   ├── main/
│   │   └── process/
│   │       ├── FA-1-problem-definition/
│   │       ├── FA-2-pre-analysis/
│   │       ├── FA-3-model-preparation/
│   │       ├── FA-4-simulation-execution/
│   │       ├── FA-5-multi-condition/
│   │       ├── FA-6-results-analysis/
│   │       └── FA-7-report-generation/
│   └── gdt-tolerance/
│       ├── main/
│       └── process/
│           ├── GT-1-design-review/
│           ├── GT-2-manufacturing-method/
│           ├── GT-3-gdt-implementation/
│           ├── GT-4-tolerance-stack-up/
│           ├── GT-5-measurement-system/
│           ├── GT-6-design-optimization/
│           └── GT-7-process-control/
├── design/
│   ├── cad-modeling/
│   │   ├── main/
│   │   └── process/
│   │       ├── ED-1-requirements/
│   │       ├── ED-2-concept-sketching/
│   │       ├── ED-3-3d-modeling/
│   │       ├── ED-4-assembly-modeling/
│   │       ├── ED-5-technical-drawings/
│   │       ├── ED-6-review-revision/
│   │       └── ED-7-final-documentation/
│   └── technical-documentation/
│       ├── main/
│       └── process/
│           ├── TD-1-user-needs/
│           ├── TD-2-content-planning/
│           ├── TD-3-technical-writing/
│           ├── TD-4-3d-modeling/
│           ├── TD-5-rendering/
│           ├── TD-6-accessibility/
│           └── TD-7-user-testing/
└── manufacturing/
    ├── 3d-printing/
    │   ├── main/
    │   └── process/
    │       ├── TP-1-design-review/
    │       ├── TP-2-file-preparation/
    │       ├── TP-3-printer-selection/
    │       ├── TP-4-material-selection/
    │       ├── TP-5-printing-process/
    │       ├── TP-6-post-processing/
    │       └── TP-7-quality-control/
    └── supplier-sourcing/
        ├── main/
        └── process/
            ├── SS-1-requirements-definition/
            ├── SS-2-risk-assessment/
            ├── SS-3-supplier-identification/
            ├── SS-4-supplier-evaluation/
            ├── SS-5-supplier-selection/
            ├── SS-6-contract-negotiation/
            ├── SS-7-supplier-onboarding/
            └── SS-8-performance-monitoring/
```

## Service Prefixes and Steps

- RD: Research & Development (9 steps)
  * From project scope definition to marketing renders
- ED: Engineering Design (CAD Modeling) (7 steps)
  * From requirements to final documentation
- MD: Machine Design (8 steps)
  * From requirements analysis to operator training
- BD: BIW Design (8 steps)
  * From process planning to documentation & training
- FA: FEA & CFD Analysis (7 steps)
  * From problem definition to report generation
- GT: GD&T and Tolerance Analysis (7 steps)
  * From design review to process control
- TP: Three-dimensional Printing (7 steps)
  * From design review to quality control
- SS: Supplier Sourcing (8 steps)
  * From requirements definition to performance monitoring
- TD: Technical Documentation (7 steps)
  * From user needs to user testing

## Image Requirements

1. Main Service Images (`main/service-hero.jpg`):
   - Resolution: 1920x1080px minimum
   - Format: JPG
   - Purpose: Used in service page hero section and service cards
   - Example path: `engineering/research-development/main/service-hero.jpg`

2. Process Step Images (`process/[prefix]-[number]-[name]/step-hero.jpg`):
   - Resolution: 1280x720px minimum
   - Format: JPG for photos, PNG for diagrams
   - Size: Optimize for web (< 500KB)
   - Purpose: Used in the interactive process flow section
   - Example path: `engineering/research-development/process/RD-1-requirements/step-hero.jpg`

3. Additional Step Images:
   - Location: Same directory as step-hero.jpg
   - Naming: `detail-1.jpg`, `detail-2.jpg`, etc.
   - Purpose: Additional images showing different aspects of the process step

## Image Content Guidelines

1. Main Service Images Should:
   - Clearly represent the service category
   - Be professional and high-quality
   - Use consistent lighting and composition
   - Avoid busy backgrounds

2. Process Step Images Should Show:
   - The actual process being performed
   - Key tools or equipment used
   - Before/after comparisons where applicable
   - Results or outputs
   - Quality checkpoints
