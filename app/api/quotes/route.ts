import { NextRequest, NextResponse } from 'next/server';
import { QuoteSchema } from '@/lib/validations/forms';
import { applyRateLimit, getRateLimitConfig } from '@/lib/security/rate-limit';

/**
 * Enhanced FormData parsing function supporting multiple content types
 * Applies all successful patterns from consultation form
 */
async function readMultipartOrJson(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  let data: any = {};
  const files: File[] = [];

  try {
    if (contentType.includes('multipart/form-data')) {
      console.log('📦 Processing multipart/form-data request');
      const formData = await req.formData();
      
      // Extract files using multiple possible field names
      const possibleFileFields = ['files', 'file', 'attachment', 'attachments'];
      for (const fieldName of possibleFileFields) {
        const fileEntries = formData.getAll(fieldName);
        const validFiles = fileEntries.filter((entry): entry is File => 
          entry instanceof File && entry.size > 0
        );
        files.push(...validFiles);
      }
      
      console.log(`📎 Found ${files.length} files`);
      if (files.length > 0) {
        console.log('📋 File details:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
      }
      
      // Extract form fields (exclude file fields)
      const excludeFields = new Set(['files', 'file', 'attachment', 'attachments']);
      formData.forEach((value, key) => {
        if (!excludeFields.has(key) && typeof value === 'string') {
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

  return { data, files };
}

/**
 * Clean fields for Zoho CRM - remove truly empty values but keep meaningful empty strings
 */
function cleanZohoFields(leadFields: Record<string, any>): Record<string, any> {
  const cleaned = { ...leadFields };
  
  // Remove only truly empty/null values, keep empty strings for field presence
  Object.keys(cleaned).forEach(key => {
    const value = cleaned[key];
    if (value === null || value === undefined) {
      delete cleaned[key];
    }
    // Keep empty strings - they're valid for Zoho and indicate field presence
  });
  
  return cleaned;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('\n🚀 Quote Submission Request Started');
  
  try {
    // Apply rate limiting
    const { config } = getRateLimitConfig(request);
    const rateLimitResult = applyRateLimit(request, config);
    if (!rateLimitResult.allowed) {
      console.log('🚫 Rate limit exceeded');
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request data with enhanced multipart support
    const { data, files } = await readMultipartOrJson(request);
    
    // Validate the request data
    console.log('🔍 Validating quote data with QuoteSchema...');
    const validationResult = QuoteSchema.safeParse(data);
    
    if (!validationResult.success) {
      console.error('❌ Validation failed:', validationResult.error.flatten());
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten()
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    console.log('✅ Quote data validation successful');

    // Parse name into first and last name
    const nameParts = validatedData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Build comprehensive lead payload for Zoho CRM with proper custom field naming
    const leadFields = {
      // Basic contact info
      First_Name: firstName,
      Last_Name: lastName,
      Email: validatedData.email,
      Phone: validatedData.phone || '',
      Company: validatedData.company || 'Individual',
      
      // Lead classification
      Lead_Source: 'Quotation Request',
      Lead_Status: 'Quote Requested',
      Industry: 'Manufacturing',
      
      // Custom fields - using SINGLE underscore convention (_c) that works
      Submission_ID_c: validatedData.submission_id,
      Service_Type_c: validatedData.service,
      Budget_Range_c: validatedData.budget,
      Timeline_c: validatedData.timeline,
      Scope_c: validatedData.scope,
      Description: validatedData.description,
      Consent_c: validatedData.consent,
      Newsletter_Opt_In_c: validatedData.newsletter_opt_in || false,
      
      // UTM tracking fields
      UTM_Source_c: validatedData.utm_source,
      UTM_Medium_c: validatedData.utm_medium,
      UTM_Campaign_c: validatedData.utm_campaign,
      UTM_Term_c: validatedData.utm_term,
      UTM_Content_c: validatedData.utm_content,
      
      // System tracking
      Website_Referrer_c: validatedData.referrer,
      Page_Path_c: validatedData.page,
      
      // Metadata
      Submission_Date_c: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      Submission_Time_c: new Date().toLocaleTimeString('en-GB', { 
        hour12: false, 
        timeZone: process.env.TIMEZONE || 'Europe/Berlin' 
      }), // HH:MM:SS format
      
      // Set rating based on scope/budget for lead prioritization
      Rating: validatedData.scope === 'project' || 
              validatedData.budget?.includes('€50,000') || 
              validatedData.budget?.includes('€100,000') ? 'Hot' : 
              validatedData.scope === 'design' ? 'Warm' : 'Cold'
    };

    console.log('🔍 DEBUG: Original leadFields:', JSON.stringify(leadFields, null, 2));

    // Clean fields for Zoho (remove null/undefined but keep empty strings)
    const cleanedLeadFields = cleanZohoFields(leadFields);
    console.log('🔍 DEBUG: Cleaned leadFields for Zoho:', JSON.stringify(cleanedLeadFields, null, 2));

    // Initialize response data
    let leadResponse: any = null;
    let workdriveResult: any = null;

    // 1. Create lead in Zoho CRM
    try {
      console.log('📋 Creating lead in Zoho CRM...');
      
      // Dynamically import Zoho CRM client
      const { crm } = await import('@/lib/zoho/client');
      
      const crmData = {
        data: [cleanedLeadFields]
      };

      leadResponse = await crm.upsertLead(crmData);
      console.log('✅ Quote request lead created in CRM');
      console.log('🔍 DEBUG: Zoho CRM response:', JSON.stringify(leadResponse, null, 2));
      
    } catch (crmError) {
      console.error('⚠️ CRM integration failed:', crmError);
      // Don't fail the entire request for CRM issues
    }

    // 2. Upload files to WorkDrive (if any)
    if (files && files.length > 0) {
      try {
        console.log(`📁 Uploading ${files.length} files to WorkDrive...`);
        
        // Use Zoho client for WorkDrive integration
        const { workdrive } = await import('@/lib/zoho/client');
        
        // Create folder for this quotation
        const folderName = `${validatedData.submission_id} - ${validatedData.name} - Quote Request`.substring(0, 100);
        const parentFolderId = process.env.WORKDRIVE_PARENT_FOLDER_ID || process.env.WORKDRIVE_FOLDER_ID || '1';
        
        const folderResponse = await workdrive.createFolder(folderName, parentFolderId) as any;
        const folderId = folderResponse.data?.id;
        const folderLink = folderResponse.data?.attributes?.permalink;
        
        if (folderId && folderLink) {
          console.log('✅ WorkDrive folder created:', folderLink);
          
          // Upload files to the folder
          const uploadPromises = files.map(async (file) => {
            try {
              const uploadResponse = await workdrive.upload(folderId, file, file.name) as any;
              console.log(`✅ File uploaded: ${file.name}`);
              return {
                filename: file.name,
                fileId: uploadResponse.data?.id,
                link: uploadResponse.data?.attributes?.permalink
              };
            } catch (uploadError) {
              console.error(`❌ Failed to upload file: ${file.name}`, uploadError);
              return null;
            }
          });
          
          const uploadResults = await Promise.all(uploadPromises);
          const successfulUploads = uploadResults.filter(result => result !== null);
          
          workdriveResult = {
            folderId,
            folderLink,
            uploadedFiles: successfulUploads
          };
          
          // Update lead with WorkDrive folder link using direct zohoFetch
          if (leadResponse && successfulUploads.length > 0) {
            try {
              const { zohoFetch } = await import('@/lib/zoho/client');
              await zohoFetch('crm', `/Leads/${leadResponse.data[0].details.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  data: [{ WorkDrive_Folder_Link_c: folderLink }] 
                })
              });
              console.log('✅ Lead updated with WorkDrive folder link');
            } catch (updateError) {
              console.error('⚠️ Failed to update lead with WorkDrive link:', updateError);
            }
          }
          
          console.log(`✅ ${successfulUploads.length}/${files.length} files uploaded successfully`);
        } else {
          throw new Error('WorkDrive folder creation failed - no folder ID or link received');
        }
        
      } catch (workdriveError) {
        console.error('⚠️ WorkDrive integration failed (non-critical):', workdriveError);
        // Don't fail the entire request for WorkDrive issues
      }
    }

    // 3. Newsletter subscription is handled automatically by Zoho Flow
    // Flow monitors Newsletter_Opt_In_c field and adds contacts to Campaigns
    if (validatedData.newsletter_opt_in) {
      console.log('📧 Newsletter opt-in recorded in CRM - Zoho Flow will handle Campaigns subscription');
    }

    const processingTime = Date.now() - startTime;
    console.log(`✅ Quote submission completed in ${processingTime}ms`);

    // Return comprehensive success response
    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully! We will review your requirements and send you a detailed quotation within 48 hours.',
      data: {
        submissionId: validatedData.submission_id,
        submittedAt: new Date().toISOString(),
        service: validatedData.service,
        scope: validatedData.scope,
        timeline: validatedData.timeline,
        estimatedResponse: validatedData.scope === 'project' ? '24-48 hours' : 
                          validatedData.scope === 'design' ? '36-48 hours' : '48 hours',
        filesUploaded: files?.length || 0,
        processingTime: `${processingTime}ms`
      },
      integrations: {
        crm: leadResponse ? 'success' : 'failed',
        workdrive: workdriveResult ? 'success' : (files?.length > 0 ? 'failed' : 'skipped'),
        newsletter: validatedData.newsletter_opt_in ? 'success' : 'skipped'
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Quote submission failed after ${processingTime}ms:`, error);

    // Handle validation errors separately
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to submit quote request. Please try again or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    );
  }
}

// GET method for API documentation
export async function GET() {
  return NextResponse.json({
    endpoint: 'Enhanced Quote Request API',
    version: '2.0',
    methods: ['POST'],
    description: 'Submit quote requests with comprehensive Zoho integration',
    features: [
      'FormData and JSON support',
      'File uploads (up to 5 files)',
      'Zoho CRM lead creation',
      'WorkDrive file storage',
      'UTM tracking',
      'Newsletter subscription',
      'Rate limiting',
      'Comprehensive error handling'
    ],
    requiredFields: [
      'submission_id',
      'name', 
      'email', 
      'service', 
      'description',
      'consent'
    ],
    optionalFields: [
      'phone',
      'company', 
      'budget', 
      'timeline', 
      'scope',
      'newsletter_opt_in',
      'utm_source',
      'utm_medium', 
      'utm_campaign',
      'utm_term',
      'utm_content',
      'referrer',
      'page'
    ],
    fileUpload: {
      maxFiles: 5,
      maxSizePerFile: '100MB',
      supportedTypes: ['PDF', 'Images', 'CAD files (.dwg, .dxf, .step, .stp, .iges)', 'Documents']
    }
  });
}
