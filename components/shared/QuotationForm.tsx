'use client'

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Info, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import { QuoteSchema, type QuoteValues, SERVICE_OPTIONS, BUDGET, TIMELINE, SCOPE } from "@/lib/validations/forms"
import { getTracking } from "@/lib/tracking"

// Generate unique submission ID
function generateSubmissionId(): string {
  return `QUOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface QuotationFormProps {
  defaultService?: string
}

export function QuotationForm({ defaultService }: QuotationFormProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [descriptionLength, setDescriptionLength] = React.useState(0)

  // Get UTM tracking data on component load
  const tracking = React.useMemo(() => getTracking('Quotation Request'), [])

  // Map custom service strings to valid SERVICE_OPTIONS or undefined
  const mappedService = defaultService && SERVICE_OPTIONS.includes(defaultService as any) 
    ? (defaultService as typeof SERVICE_OPTIONS[number])
    : undefined;

  const form = useForm<QuoteValues>({
    resolver: zodResolver(QuoteSchema),
    mode: 'onTouched',
    defaultValues: {
      submission_id: generateSubmissionId(),
      name: "",
      email: "",
      phone: "",
      company: "",
      service: mappedService,
      description: "",
      scope: "",
      budget: "",
      timeline: "",
      consent: false,
      newsletter_opt_in: false,
      utm_source: tracking.utm_source || "",
      utm_medium: tracking.utm_medium || "",
      utm_campaign: tracking.utm_campaign || "",
      utm_term: tracking.utm_term || "",
      utm_content: tracking.utm_content || "",
    },
  })

  // Derived error list for error summary
  const errors = form.formState.errors
  const errorList = React.useMemo(() => Object.values(errors).map((e: any) => e?.message).filter(Boolean) as string[], [errors])

  // Generic option normalizer (supports string[] or {value,label}[])
  const norm = (arr: readonly any[] = []) => arr.map((o: any) => ({ value: typeof o === 'string' ? o : (o.value ?? o.label), label: typeof o === 'string' ? o : (o.label ?? o.value) }))
  const serviceOpts = norm(SERVICE_OPTIONS as readonly any[])
  const budgetOpts = norm(BUDGET as readonly any[])
  const timelineOpts = norm(TIMELINE as readonly any[])
  const scopeOpts = norm(SCOPE as readonly any[])

  const handleSubmit = async (data: QuoteValues) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      // Create FormData for file uploads
      const formData = new FormData()
      
      // Add form fields - ALWAYS include all fields, even if empty (for proper Zoho mapping)
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        } else {
          // Send empty string for undefined/null values so backend knows field exists
          formData.append(key, '')
        }
      })
      
      // Add tracking data
      Object.entries(tracking).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })
      
      // Add files
      files.forEach((file, index) => {
        formData.append(`files`, file)
      })
      
      const response = await fetch('/api/quotes', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit quotation request')
      }
      
      const result = await response.json()
      setSubmitStatus('success')
      
      // Reset form
      form.reset({
        submission_id: generateSubmissionId(),
        name: "",
        email: "",
        phone: "",
        company: "",
        service: mappedService,
        description: "",
        scope: "",
        budget: "",
        timeline: "",
        consent: false,
        newsletter_opt_in: false,
        utm_source: tracking.utm_source || "",
        utm_medium: tracking.utm_medium || "",
        utm_campaign: tracking.utm_campaign || "",
        utm_term: tracking.utm_term || "",
        utm_content: tracking.utm_content || "",
      })
      setFiles([])
      setDescriptionLength(0)
      
    } catch (error) {
      console.error('Quote submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" role="form" aria-describedby="form-help">
        {/* Error summary */}
        {errorList.length > 0 && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <p className="font-medium mb-1">Please fix the following:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              {errorList.slice(0, 5).map((m, i) => (<li key={i}>{m as string}</li>))}
            </ul>
          </div>
        )}

        {/* Contact details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="flex items-center gap-1">Full name<span className="text-red-500">*</span></FormLabel>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <FormControl>
                  <Input placeholder="e.g. Alex Kumar" aria-required value={field.value as any} onChange={field.onChange} />
                </FormControl>
                <p className="text-xs text-muted-foreground">We'll use this to create your CRM lead.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">Email<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@company.com" aria-required {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">We'll send quotation confirmations here.</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+91 99999 99999" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">Include country code if outside India.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Service */}
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">Service<span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border shadow-lg max-h-72 overflow-auto">
                  {serviceOpts.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select the service you want to request a quote for.</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description with counter */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-1">
                <FormLabel>Project description<span className="text-red-500">*</span></FormLabel>
                <span className="ml-auto text-xs text-muted-foreground">{(field.value as string)?.length || 0}/1000</span>
              </div>
              <FormControl>
                <textarea
                  {...(field as any)}
                  onChange={(e) => { field.onChange(e); setDescriptionLength(e.target.value.length) }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-y min-h-[120px]"
                  maxLength={1000}
                  placeholder="Materials, tolerances, quantity, deadlines, references…"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Advanced project details - Always visible for professional quotations */}
        <div className="rounded-md border border-gray-200 p-6 bg-white shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Project Requirements</h3>
            <p className="text-xs text-muted-foreground">These details are essential for providing accurate quotations and ensuring proper project scoping.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget<span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Select"/></SelectTrigger></FormControl>
                    <SelectContent className="bg-white border shadow-lg">{budgetOpts.map(b => (<SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline<span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Select"/></SelectTrigger></FormControl>
                    <SelectContent className="bg-white border shadow-lg">{timelineOpts.map(t => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scope<span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Select"/></SelectTrigger></FormControl>
                    <SelectContent className="bg-white border shadow-lg">{scopeOpts.map(s => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* File Upload Section with professional description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <div>
              <label className="text-sm font-semibold text-gray-900">
                Technical Documentation & Files
              </label>
              <p className="text-xs text-muted-foreground">Upload specifications, drawings, and reference materials for accurate quotation</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Supported File Types:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800">
              <div>
                <strong>CAD Files:</strong> .step, .stp, .iges, .igs, .stl, .dwg, .dxf
              </div>
              <div>
                <strong>Documents:</strong> .pdf, .doc, .docx, .txt, .xls, .xlsx
              </div>
              <div>
                <strong>Images:</strong> .png, .jpg, .jpeg, .gif, .webp
              </div>
              <div>
                <strong>Archives:</strong> .zip, .rar
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              <strong>Limits:</strong> Up to 5 files, 100MB each (optimized for professional CAD files)
            </p>
          </div>
          
          <FileUpload
            value={files}
            onChange={setFiles}
            onFilesSelected={setFiles}
            maxFiles={5}
            maxSize={100 * 1024 * 1024} // 100MB for CAD files
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
              'application/pdf': ['.pdf'],
              'application/msword': ['.doc'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'text/plain': ['.txt'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/zip': ['.zip'],
              'application/x-zip-compressed': ['.zip'],
              'application/x-rar-compressed': ['.rar'],
              'model/step': ['.step', '.stp'],
              'application/x-step': ['.step', '.stp'],
              'model/iges': ['.iges', '.igs'],
              'application/vnd.ms-pki.stl': ['.stl'],
              'model/stl': ['.stl'],
              'application/acad': ['.dwg'],
              'image/vnd.dwg': ['.dwg'],
              'application/dxf': ['.dxf'],
            }}
          />
        </div>

        {/* Professional consent and subscription options */}
        <div className="space-y-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} aria-required className="mt-0.5" />
                </FormControl>
                <div className="space-y-1 leading-tight">
                  <FormLabel className="text-sm font-medium text-gray-900">
                    I acknowledge and agree to the processing of my personal data in accordance with the{' '}
                    <a href="/privacy" className="text-blue-600 underline hover:text-blue-800 transition-colors" target="_blank" rel="noreferrer">
                      Privacy Policy
                    </a>{' '}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newsletter_opt_in"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                </FormControl>
                <div className="space-y-1 leading-tight">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Yes, I would like to receive technical insights, industry updates, and service announcements
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">You can unsubscribe at any time. We respect your privacy.</p>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Hidden UTM Inputs */}
        <input type="hidden" {...form.register("utm_source")} />
        <input type="hidden" {...form.register("utm_medium")} />
        <input type="hidden" {...form.register("utm_campaign")} />
        <input type="hidden" {...form.register("utm_term")} />
        <input type="hidden" {...form.register("utm_content")} />

        {/* Status messages - inline with form */}
        {submitStatus === 'success' && (
          <div className="p-4 rounded-lg border border-green-200 bg-green-50 text-green-800">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Quotation Request Submitted Successfully!</h3>
                <p className="text-sm mt-1">Our engineering team will review your requirements and send a detailed quotation to your email within 24-48 hours.</p>
              </div>
            </div>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Submission Failed</h3>
                <p className="text-sm mt-1">Please check your details and try again, or contact us directly at info@ideinstein.com</p>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" disabled={isSubmitting || form.formState.isSubmitting}>
          {isSubmitting || form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Request...
            </div>
          ) : (
            'Request Professional Quotation'
          )}
        </Button>

        <p id="form-help" className="sr-only">All fields are validated. Files uploaded will be processed securely.</p>
      </form>
    </Form>
  )
}
