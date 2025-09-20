// lib/validations/forms.ts
import { z } from "zod";

/** ---------- Shared picklists (keep labels in sync with Zoho CRM) ---------- */
export const SERVICE_OPTIONS = [
  "Startup Accelerator",
  "Research & Development",
  "CAD Modeling", 
  "Machine Design",
  "BIW Design",
  "FEA & CFD Analysis",
  "GD&T and Tolerance Analysis",
  "3D Printing Services",
  "Supplier Sourcing",
  "Technical Documentation",
];

export const TIMELINE = [
  { value: "urgent", label: "Urgent (1-2 weeks)" },
  { value: "short", label: "Short (3–4 weeks)" },
  { value: "medium", label: "Medium (1–2 months)" },
  { value: "long", label: "Long (3–6+ months)" },
] as const;

export const SCOPE = [
  { value: "concept", label: "Concept Development" },
  { value: "design", label: "Design & Engineering" },
  { value: "prototype", label: "Prototype" },
  { value: "support", label: "Manufacturing Support" },
  { value: "project", label: "Full Project" },
  { value: "consultation", label: "Consultation Only" },
] as const;

export const BUDGET = [
  "€0,000–€5,000",
  "€5,000–€15,000",
  "€15,000–€50,000",
  "€50,000–€100,000",
  "> €100,000",
  "To be discussed",
] as const;

/** ---------- Helpers ---------- */
/** Accepts a Date or an ISO string and returns a Date */
const dateCoerce = z.preprocess((v) => {
  if (typeof v === "string") {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d;
  }
  return v;
}, z.date({ required_error: "Pick a date" }));

/** ---------- Schemas ---------- */
export const ConsultationSchema = z.object({
  submission_id: z.string().min(1),                // Submission_ID__c
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Select a service"),
  description: z.string().min(10, "Please add a brief description"),
  date: dateCoerce,                                // Only accept Date objects
  time: z.string().min(1, "Pick a time"),
  consent: z.boolean().refine(val => val === true, "You must agree to the Privacy Policy"),
  newsletter_opt_in: z.coerce.boolean().optional(),

  // Extra attributes
  budget: z.string().optional(),                   // Budget_Range__c
  timeline: z.string().optional(),                 // Timeline__c
  scope: z.string().optional(),                    // Scope__c

  // UTM tracking
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),

  // System tracking
  referrer: z.string().optional(),
  page: z.string().optional(),
});

export const QuoteSchema = z.object({
  submission_id: z.string().min(1),                // Submission_ID__c
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),                    // Phone field
  company: z.string().optional(),
  service: z.string().min(1, "Select a service"),
  timeline: z.enum(TIMELINE.map((t) => t.value) as [string, ...string[]], {
    required_error: "Select a timeline",
  }),
  scope: z.enum(SCOPE.map((s) => s.value) as [string, ...string[]], {
    required_error: "Select scope",
  }),
  budget: z.enum([...BUDGET] as [string, ...string[]], {
    required_error: "Select a budget range",
  }),
  description: z.string().min(10, "Please add a brief description"),
  consent: z.coerce.boolean(),                     // Coerce string to boolean
  newsletter_opt_in: z.coerce.boolean().optional(),

  // UTM tracking
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),

  // System tracking
  referrer: z.string().optional(),
  page: z.string().optional(),
});

export const ContactSchema = z.object({
  submission_id: z.string().optional(),             // Optional for contact
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),                   // Subject field
  message: z.string().min(5, "Please enter a message"),
  consent: z.coerce.boolean(),                      // Coerce string to boolean

  // UTM tracking
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),

  // System tracking
  referrer: z.string().optional(),
  page: z.string().optional(),
});

export const NewsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
  submission_id: z.string().optional(),             // Optional for newsletter
  
  // UTM tracking
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),

  // System tracking
  referrer: z.string().optional(),
  page: z.string().optional(),
});

/** ---------- Types ---------- */
export type ConsultationValues = z.infer<typeof ConsultationSchema>;
export type QuoteValues = z.infer<typeof QuoteSchema>;
export type ContactValues = z.infer<typeof ContactSchema>;

/** ---------- Backward-compat aliases (so old imports don't break) ---------- */
export const consultationSchema = ConsultationSchema;
export const consultationFormSchema = ConsultationSchema;
export const quoteSchema = QuoteSchema;
export const quotationFormSchema = QuoteSchema;
export const contactSchema = ContactSchema;

// Type aliases for backward compatibility
export type ConsultationFormData = ConsultationValues;
export type QuotationFormData = QuoteValues;

/** Optional default export if some code expects it */
const forms = {
  ConsultationSchema,
  QuoteSchema,
  ContactSchema,
  consultationSchema,
  quoteSchema,
  contactSchema,
  SERVICE_OPTIONS,
  TIMELINE,
  SCOPE,
  BUDGET,
};
export default forms;
