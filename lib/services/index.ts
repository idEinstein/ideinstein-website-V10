import type { Service } from "@/library/types";

// Import all individual services
import { research_development } from "./research-development";
import { cad_modeling } from "./cad-modeling";
import { three_d_printing } from "./3d-printing";
import { machine_design } from "./machine-design";
import { biw_design } from "./biw-design";
import { finite_element_cfd } from "./finite-element-cfd";
import { gdt_tolerance } from "./gdt-tolerance";
import { technical_documentation } from "./technical-documentation";
import { supplier_sourcing } from "./supplier-sourcing";

// Export all services as a record
export const servicesData: Record<string, Service> = {
  "research-development": research_development,
  "cad-modeling": cad_modeling,
  "3d-printing": three_d_printing,
  "machine-design": machine_design,
  "biw-design": biw_design,
  "finite-element-cfd": finite_element_cfd,
  "gdt-tolerance": gdt_tolerance,
  "technical-documentation": technical_documentation,
  "supplier-sourcing": supplier_sourcing,
};

// Export individual services for direct access
export {
  research_development,
  cad_modeling,
  three_d_printing,
  machine_design,
  biw_design,
  finite_element_cfd,
  gdt_tolerance,
  technical_documentation,
  supplier_sourcing,
};
