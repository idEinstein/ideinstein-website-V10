import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  phone: z.string().optional(),
});

// Quotation form validation schema
export const quotationFormSchema = z.object({
  projectType: z.string().min(1, 'Project type is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  contactInfo: contactFormSchema.pick({ name: true, email: true }),
});

// File upload validation schema
export const fileUploadSchema = z.object({
  filename: z.string().min(1),
  mimetype: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'application/pdf'].includes(type),
    'Invalid file type'
  ),
  size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type QuotationFormData = z.infer<typeof quotationFormSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;