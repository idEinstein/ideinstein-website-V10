import { z } from "zod";
import { zohoFetch } from "@/lib/zoho/client";
import { logger } from "@/library/logger";
import { NextRequest, NextResponse } from "next/server";

const BOOKING_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Function to convert 12-hour time format to 24-hour format
function convertTo24Hour(time: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
  const match = time.trim().match(timeRegex);
  
  if (!match) {
    // If no AM/PM found, assume it's already in 24-hour format
    return time;
  }
  
  const [, hours, minutes, period] = match;
  let hour24 = parseInt(hours, 10);
  
  if (period.toUpperCase() === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
}

// Function to create ISO datetime string for CRM
function formatCrmDateTime(date: string, time: string): string {
  const time24 = convertTo24Hour(time);
  return `${date}T${time24}:00`;
}

function formatBookingsDateTime(date: string, time: string) {
  const time24 = convertTo24Hour(time);
  const dt = new Date(`${date}T${time24}`);
  if (Number.isNaN(dt.getTime())) {
    throw new Error("invalid_booking_time");
  }
  const day = String(dt.getDate()).padStart(2, "0");
  const month = BOOKING_MONTHS[dt.getMonth()];
  const year = dt.getFullYear();
  const hours = String(dt.getHours()).padStart(2, "0");
  const minutes = String(dt.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}:00`;
}

const consultationSchema = z.object({
  submission_id: z.string().min(6),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  scope: z.string().optional(),
  description: z.string().min(10),
  date: z.string().min(4), // mandatory
  time: z.string().min(3), // mandatory
  consent: z.boolean(),
  newsletter_opt_in: z.boolean().optional(),

  // UTM fields (optional, hidden in form)
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const correlationId = crypto.randomUUID();
  logger.info("consultation.request.start", { correlationId });

  try {
    // Parse request data - simplified for consultation (no files)
    const contentType = req.headers.get('content-type') || '';
    let data: any = {};

    try {
      if (contentType.includes('multipart/form-data')) {
        console.log('📦 Processing multipart/form-data request');
        const formData = await req.formData();
        
        // Extract form fields only (no file handling for consultation)
        formData.forEach((value, key) => {
          if (typeof value === 'string') {
            data[key] = value;
          }
        });
        
        console.log('✅ Parsed FormData fields:', Object.keys(data));
        
      } else if (contentType.includes('application/json')) {
        console.log('📦 Processing JSON request');
        data = await req.json();
        console.log('✅ Parsed JSON fields:', Object.keys(data));
      } else {
        console.log('📦 Processing text/plain request');
        const body = await req.text();
        try {
          data = JSON.parse(body);
          console.log('✅ Parsed text as JSON, fields:', Object.keys(data));
        } catch {
          throw new Error('Invalid request format');
        }
      }
    } catch (error) {
      console.error('❌ Error parsing request:', error);
      throw new Error(`Failed to parse request body: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Apply boolean coercion for FormData strings (required for Zoho)
    if (data.consent !== undefined) {
      data.consent = String(data.consent).toLowerCase() === 'true';
    }
    if (data.newsletter_opt_in !== undefined) {
      data.newsletter_opt_in = String(data.newsletter_opt_in).toLowerCase() === 'true';
    }

    console.log('🔍 Final parsed data preview:', {
      ...data,
      // Truncate long fields for logging
      description: data.description?.substring(0, 100) + (data.description?.length > 100 ? '...' : '')
    });
    
    // Validate the parsed data
    const validatedData = consultationSchema.parse(data);

    logger.info("consultation.data.parsed", { correlationId, submissionId: validatedData.submission_id });

    // Check if this is a test request (used by test scripts)
    const isTestRequest = req.headers.get('x-test-request') === 'true';
    
    let leadId: string | null = null;
    let bookingId: string | null = null;
    const errors: string[] = [];
    
    if (isTestRequest) {
      // For test requests, skip actual Zoho API calls and return mock data
      console.log('Test request detected, skipping Zoho API calls');
      leadId = 'test-lead-id';
      bookingId = 'test-booking-id';
    } else {
      // 1. Create CRM Lead with custom + UTM fields
      try {
        logger.zoho.start("Creating CRM lead", { correlationId, email: validatedData.email });
        
        const leadPayload = {
          Last_Name: validatedData.name,
          Email: validatedData.email,
          Phone: validatedData.phone || null,
          Company: validatedData.company || "Individual",
          Lead_Source: "Website - Consultation Form",
          // Custom fields with exact API names from CRM
          Submission_ID_c: validatedData.submission_id,
          Service_Type_c: validatedData.service,
          Budget_Range_c: validatedData.budget || null,
          Timeline_c: validatedData.timeline || null,
          Scope_c: validatedData.scope || null,
          Description: validatedData.description,
          Consultation_Date_c: validatedData.date,
          Consultation_Time_c: formatCrmDateTime(validatedData.date, validatedData.time), // Convert to proper ISO datetime format
          Consent_c: validatedData.consent,
          Newsletter_Opt_In_c: validatedData.newsletter_opt_in || false, // Handled by Zoho Flow automation
          // UTM fields
          UTM_Source_c: validatedData.utm_source || null,
          UTM_Medium_c: validatedData.utm_medium || null,
          UTM_Campaign_c: validatedData.utm_campaign || null,
          UTM_Term_c: validatedData.utm_term || null,
          UTM_Content_c: validatedData.utm_content || null,
        };

        logger.info("consultation.lead.payload", { correlationId, payload: leadPayload });

        const leadRes = await zohoFetch<{
          data?: Array<{ details?: { id?: string }; status?: string; message?: string }>;
        }>("crm", "/Leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [leadPayload] }),
          cid: correlationId,
        });

        logger.info("consultation.lead.response", { correlationId, response: leadRes });

        if (leadRes.data?.[0]?.details?.id) {
          leadId = leadRes.data[0].details.id;
          logger.zoho.success("Lead created successfully", { correlationId, leadId });
        } else {
          const errorMsg = leadRes.data?.[0]?.message || "Unknown error creating lead";
          logger.zoho.error("Lead creation failed", { correlationId, error: errorMsg, response: leadRes });
          errors.push(`Lead creation failed: ${errorMsg}`);
        }
      } catch (leadError: any) {
        logger.zoho.error("Lead creation exception", { correlationId, error: leadError.message });
        errors.push(`Lead creation error: ${leadError.message}`);
      }

      // 2. Create Booking appointment
      const serviceId = process.env.BOOKINGS_SERVICE_ID;
      const staffId = process.env.BOOKINGS_STAFF_ID;
      const workspaceId = process.env.BOOKINGS_WORKSPACE_ID;
      const timezone = process.env.BOOKINGS_TIME_ZONE || "Europe/Berlin";

      if (!serviceId) {
        logger.zoho.warn("Booking creation skipped - missing BOOKINGS_SERVICE_ID", { correlationId });
        errors.push("Booking creation skipped: BOOKINGS_SERVICE_ID not configured");
      } else {
        try {
          logger.zoho.start("Creating booking appointment", { correlationId, serviceId, staffId, workspaceId });
          
          const formattedStart = formatBookingsDateTime(validatedData.date, validatedData.time);
          logger.info("consultation.booking.datetime", { correlationId, original: { date: validatedData.date, time: validatedData.time }, formatted: formattedStart });
          
          const bookingForm = new FormData();
          
          // Required fields
          bookingForm.set("service_id", serviceId);
          bookingForm.set("from_time", formattedStart);
          bookingForm.set("timezone", timezone);
          
          // Optional but recommended fields
          if (workspaceId) {
            bookingForm.set("workspace_id", workspaceId);
          }
          if (staffId) {
            bookingForm.set("staff_id", staffId);
          }
          
          // Customer details
          const customerDetails = {
            name: validatedData.name,
            email: validatedData.email,
            ...(validatedData.phone ? { phone_number: validatedData.phone.replace(/[^0-9]/g, '') } : {}),
          };
          bookingForm.set("customer_details", JSON.stringify(customerDetails));
          
          // Notes/description
          if (validatedData.description) {
            bookingForm.set("notes", validatedData.description.slice(0, 2000));
          }

          // Log FormData contents for debugging
          const formDataEntries: Record<string, any> = {};
          Array.from(bookingForm.entries()).forEach(([key, value]) => {
            formDataEntries[key] = value;
          });
          logger.info("consultation.booking.formdata", { correlationId, formData: formDataEntries });

          const bookingRes = await zohoFetch<{
            data?: { appointment_id?: string };
            response?: { returnvalue?: { booking_id?: string; appointment_id?: string; summary_url?: string } };
            status?: string;
            message?: string;
          }>("bookings", "/appointment", {
            method: "POST",
            body: bookingForm,
            cid: correlationId,
          });

          logger.info("consultation.booking.response", { correlationId, response: bookingRes });

          // Extract booking ID and summary URL from response
          bookingId = 
            bookingRes.data?.appointment_id ??
            bookingRes.response?.returnvalue?.booking_id ??
            bookingRes.response?.returnvalue?.appointment_id ??
            null;

          // Extract the summary URL for customer booking confirmation
          const summaryUrl = (bookingRes.response?.returnvalue as any)?.summary_url;

          if (bookingId) {
            logger.zoho.success("Booking created successfully", { correlationId, bookingId, summaryUrl });
            
            // Update the lead with booking details
            if (leadId) {
              try {
                await zohoFetch("crm", `/Leads/${leadId}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    data: [{ 
                      Booking_ID_c: bookingId,
                      ...(summaryUrl ? { Booking_Confirmation_Link_c: summaryUrl } : {})
                    }] 
                  }),
                  cid: correlationId,
                });
                logger.zoho.success("Lead updated with booking details", { correlationId, leadId, bookingId, summaryUrl });
              } catch (updateError: any) {
                logger.zoho.error("Failed to update lead with booking details", { correlationId, error: updateError.message });
                errors.push(`Lead update failed: ${updateError.message}`);
              }
            }
          } else {
            const errorMsg = bookingRes.message || "Unknown booking creation error";
            logger.zoho.error("Booking creation failed", { correlationId, error: errorMsg, response: bookingRes });
            errors.push(`Booking creation failed: ${errorMsg}`);
          }
        } catch (bookingErr: any) {
          logger.zoho.error("Booking creation exception", { correlationId, error: bookingErr.message });
          errors.push(`Booking creation error: ${bookingErr.message}`);
        }
      }
    }

    const result = {
      ok: true,
      leadId,
      bookingId,
      filesUploaded: 0, // Always 0 for consultation (no files)
      ...(errors.length > 0 && { errors }),
      correlationId,
    };

    logger.info("consultation.request.complete", { correlationId, result });
    
    return NextResponse.json(result);
  } catch (err: any) {
    logger.error("consultation.request.failed", { correlationId, error: err.message });
    return NextResponse.json({ 
      ok: false, 
      error: err.message,
      correlationId,
    }, { status: 500 });
  }
}