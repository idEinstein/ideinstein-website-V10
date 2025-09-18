import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { crm } from '@/lib/zoho/client';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  company: z.string().max(100, 'Company name too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
  consent: z.boolean().optional(),
  newsletter_opt_in: z.boolean().optional(),
  // UTM tracking fields
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Log successful contact form submission
    console.log('📝 Contact form submitted:', {
      hasName: !!validatedData.name,
      hasEmail: !!validatedData.email,
      hasMessage: !!validatedData.message,
      hasCompany: !!validatedData.company
    });

    // Create contact/lead in Zoho CRM
    try {
      const nameParts = validatedData.name.split(' ');
      const firstName = nameParts[0] || 'Contact';
      const lastName = nameParts.slice(1).join(' ') || 'User';

      const contactData = {
        data: [{
          Last_Name: lastName,
          First_Name: firstName,
          Email: validatedData.email,
          Phone: validatedData.phone,
          Company: validatedData.company,
          Description: `Subject: ${validatedData.subject || 'General Inquiry'}\n\nMessage: ${validatedData.message}`,
          Lead_Source: 'Contact Form',
          Lead_Status: 'New',
          Industry: 'Engineering Services',
          // Custom fields with correct naming
          Consent_c: validatedData.consent || false,
          Newsletter_Opt_In_c: validatedData.newsletter_opt_in || false,
          // UTM tracking
          UTM_Source_c: validatedData.utm_source || null,
          UTM_Medium_c: validatedData.utm_medium || null,
          UTM_Campaign_c: validatedData.utm_campaign || null,
          UTM_Term_c: validatedData.utm_term || null,
          UTM_Content_c: validatedData.utm_content || null,
        }]
      };

      console.log('📤 Creating contact in Zoho CRM...');
      const crmData = await crm.upsertLead(contactData) as any;
      console.log('✅ Contact created in Zoho CRM:', crmData.data?.[0]?.details?.id);
    } catch (crmError) {
      console.error('❌ CRM integration error:', crmError);
      // Don't fail the entire request if CRM fails
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your message. We will get back to you soon.'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    console.error('Contact form processing failed:', error);

    return NextResponse.json(
      { 
        error: 'An error occurred processing your request'
      },
      { status: 500 }
    );
  }
}
