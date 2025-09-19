'use client'

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format, addDays } from "date-fns"
import { CalendarIcon, Clock, ChevronDown, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  consultationFormSchema,
  type ConsultationFormData,
  SERVICE_OPTIONS,
  BUDGET,
  TIMELINE,
  SCOPE,
} from "@/lib/validations/forms"
import { getTracking } from "@/lib/tracking"

// ---- helpers ----
const fallbackTimeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
]
function generateSubmissionId(): string {
  return `CONS-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

interface ConsultationFormProps {
  onSubmit?: (data: ConsultationFormData) => Promise<void>
  onSuccess?: () => void // Called after successful submission
  defaultService?: string
}

function ConsultationForm({ onSubmit, onSuccess, defaultService }: ConsultationFormProps) {
  const [slots, setSlots] = React.useState<string[]>([])
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)
  const [loadingSlots, setLoadingSlots] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [descriptionLength, setDescriptionLength] = React.useState(0)


  // Get UTM tracking data on component load
  const tracking = React.useMemo(() => getTracking('Consultation Booking'), [])

  // Map default service from env/route if provided
  const mappedService = defaultService && (SERVICE_OPTIONS as readonly any[])?.some((s: any) => (typeof s === 'string' ? s : (s.value || s.label)) === defaultService)
    ? defaultService
    : undefined

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
    mode: 'onTouched',
    defaultValues: {
      submission_id: generateSubmissionId(),
      name: "",
      email: "",
      phone: "",
      company: "",
      service: mappedService,
      description: "",
      date: undefined,
      time: "",
      budget: "",
      timeline: "",
      scope: "",
      consent: false,
      newsletter_opt_in: false,
      utm_source: tracking.utm_source || "",
      utm_medium: tracking.utm_medium || "",
      utm_campaign: tracking.utm_campaign || "",
      utm_term: tracking.utm_term || "",
      utm_content: tracking.utm_content || "",
    },
  })

  // ---- availability: load Zoho Bookings slots when date changes ----
  const selectedDate = form.watch('date')
  const [slotsError, setSlotsError] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    const d = selectedDate as Date | undefined
    if (!d) { 
      setSlots([])
      setTimeZone(undefined)
      setSlotsError(null)
      return 
    }
    
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    setLoadingSlots(true)
    setSlotsError(null)
    
    fetch(`/api/bookings/availability?date=${y}-${m}-${day}`)
      .then(r => r.json()) // Always parse JSON, don't reject on non-200 status
      .then(j => { 
        if (j.ok && Array.isArray(j.slots)) {
          setSlots(j.slots)
          setTimeZone(j.timeZone)
          
          // Show warning if using fallback slots
          if (j.source === 'fallback' && j.warning) {
            setSlotsError(`⚠️ ${j.warning}`)
          }
        } else {
          // Fallback to default slots if API response is invalid
          setSlots(fallbackTimeSlots)
          setTimeZone('Europe/Berlin')
          setSlotsError('⚠️ Using default time slots due to booking system connectivity')
        }
      })
      .catch((error) => { 
        console.warn('Slots loading failed, using fallback:', error)
        setSlots(fallbackTimeSlots)
        setTimeZone('Europe/Berlin')
        setSlotsError('⚠️ Using default time slots - booking system temporarily unavailable')
      })
      .finally(() => setLoadingSlots(false))
  }, [selectedDate])

  // ---- derived bits ----
  const errors = form.formState.errors
  const errorList = React.useMemo(() => Object.values(errors).map((e: any) => e?.message).filter(Boolean) as string[], [errors])

  // ---- submit ----
  const handleSubmit = async (data: ConsultationFormData) => {
    console.log('🚀 handleSubmit called with data:', data)
    console.log('🔍 Form validation state:', {
      isValid: form.formState.isValid,
      errors: form.formState.errors,
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting
    })
    
    if (onSubmit) { 
      console.log('📤 Using custom onSubmit handler')
      await onSubmit(data); 
      return 
    }
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    console.log('📋 Form data being submitted:', data)
    
    try {
      // Create FormData for file uploads (matching quotation form exactly)
      const formData = new FormData()
      
      // Add form fields - ALWAYS include all fields, even if empty (for proper Zoho mapping)
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Special handling for date field
          if (key === 'date' && value instanceof Date) {
            const dateStr = `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,"0")}-${String(value.getDate()).padStart(2,"0")}`
            formData.append(key, dateStr)
          } else {
            formData.append(key, value.toString())
          }
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
      
      // No files for consultation - keeping it simple for lead + booking focus
      
      console.log('Sending POST to /api/consultation...')
      const response = await fetch('/api/consultation', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit consultation request')
      }
      
      const result = await response.json()
      setSubmitStatus('success')
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      
      // Reset form
      form.reset({
        submission_id: generateSubmissionId(),
        name: '', email: '', phone: '', company: '', service: mappedService as any,
        description: '', date: undefined, time: '', budget: '', timeline: '', scope: '',
        consent: false, newsletter_opt_in: false,
        utm_source: tracking.utm_source || "",
        utm_medium: tracking.utm_medium || "",
        utm_campaign: tracking.utm_campaign || "",
        utm_term: tracking.utm_term || "",
        utm_content: tracking.utm_content || "",
      })

    } catch (err) {
      console.error('Consultation submission error:', err)
      setSubmitStatus('error')
    } finally { setIsSubmitting(false) }
  }

  // ---- date limits ----
  const today = new Date()
  // Create dates in local timezone to avoid timezone shift issues
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const maxDate = addDays(minDate, 30)

  // generic option normalizer (supports string[] or {value,label}[])
  const norm = (arr: readonly any[] = []) => arr.map((o: any) => ({ value: typeof o === 'string' ? o : (o.value ?? o.label), label: typeof o === 'string' ? o : (o.label ?? o.value) }))
  const serviceOpts = norm(SERVICE_OPTIONS as readonly any[])
  const budgetOpts = norm(BUDGET as readonly any[])
  const timelineOpts = norm(TIMELINE as readonly any[])
  const scopeOpts = norm(SCOPE as readonly any[])

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
          <FormField control={form.control} name="name" render={({ field }) => (
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
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">Email<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@company.com" aria-required {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">We'll send confirmations here.</p>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+91 99999 99999" {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">Include country code if outside India.</p>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="company" render={({ field }) => (
            <FormItem>
              <FormLabel>Company (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Service */}
        <FormField control={form.control} name="service" render={({ field }) => (
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
            <p className="text-xs text-muted-foreground">Select the service you want to book.</p>
            <FormMessage />
          </FormItem>
        )} />

        {/* Description with counter */}
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-1">
              <FormLabel>Project description</FormLabel>
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
        )} />

        {/* Advanced project details (budget/timeline/scope) - Always visible for professional use */}
        <div className="rounded-md border border-gray-200 p-6 bg-white shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Project Details</h3>
            <p className="text-xs text-muted-foreground">Help us route your request to the right specialist engineer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField control={form.control} name="budget" render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Select"/></SelectTrigger></FormControl>
                  <SelectContent className="bg-white border shadow-lg">{budgetOpts.map(b => (<SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>))}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="timeline" render={({ field }) => (
              <FormItem>
                <FormLabel>Timeline</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Select"/></SelectTrigger></FormControl>
                  <SelectContent className="bg-white border shadow-lg">{timelineOpts.map(t => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="scope" render={({ field }) => (
              <FormItem>
                <FormLabel>Scope</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Select"/></SelectTrigger></FormControl>
                  <SelectContent className="bg-white border shadow-lg">{scopeOpts.map(s => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Date & time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">Date<span className="text-red-500">*</span></FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <button type="button" className={cn('relative flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm', !field.value && 'text-muted-foreground')}>
                      <div className="flex items-center"><CalendarIcon className="mr-2 h-4 w-4" /><span>{field.value ? format(field.value,'PPP') : 'Pick a date'}</span></div>
                      <ChevronDown className="h-4 w-4 opacity-50"/>
                    </button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    selected={field.value as any}
                    onSelect={field.onChange}
                    disabled={(d)=>{
                      // Create date objects in local timezone to avoid timezone shift issues
                      const today = new Date()
                      const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                      const dateLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate())
                      
                      return dateLocal < todayLocal || 
                             dateLocal > maxDate || 
                             d.getDay() === 0 || 
                             d.getDay() === 6
                    }}
                    className="!rounded-md !border-0"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">We show only working days within 30 days.</p>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="time" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">Time<span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingSlots || !slots.length}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4"/>
                      <span className={cn(!field.value && 'text-muted-foreground')}>
                        {loadingSlots ? 'Loading…' : (field.value || (slots.length ? 'Pick a time' : 'No slots'))}
                      </span>
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border shadow-lg">
                  {(slots.length ? slots : fallbackTimeSlots).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
              {timeZone && <p className="text-xs text-muted-foreground">Times shown in <span className="font-medium">{timeZone}</span>.</p>}
              {slotsError && <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">{slotsError}</p>}
              <FormMessage />
            </FormItem>
          )} />
        </div>



        {/* Professional consent and subscription options */}
        <div className="space-y-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <FormField control={form.control} name="consent" render={({ field }) => (
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
          )} />
          <FormField control={form.control} name="newsletter_opt_in" render={({ field }) => (
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
          )} />
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
                <h3 className="text-sm font-semibold">Consultation Request Submitted Successfully!</h3>
                <p className="text-sm mt-1">We'll review your request and send booking confirmation details to your email shortly.</p>
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
              Scheduling Consultation...
            </div>
          ) : (
            'Schedule Expert Consultation'
          )}
        </Button>

        <p id="form-help" className="sr-only">All fields are validated. Times shown in your Zoho Bookings timezone. Files uploaded will be processed securely.</p>
      </form>
    </Form>
  )
}

// Named and default exports
export { ConsultationForm }
export default ConsultationForm
