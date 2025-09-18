import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { campaigns } from "@/lib/zoho/client";
import { logger } from "@/library/logger";

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(), // Accept single name field from frontend
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  company: z.string().optional(),
  // Optional tracking fields
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const cid = crypto.randomUUID();
  logger.info("newsletter.subscription.start", { cid });
  
  try {
    const body = await req.json();
    const data = schema.parse(body);
    
    // Handle name splitting if single name field is provided
    let firstname = data.firstname;
    let lastname = data.lastname;
    
    if (data.name && !data.firstname && !data.lastname) {
      const nameParts = data.name.trim().split(/\s+/);
      firstname = nameParts[0] || undefined;
      lastname = nameParts.slice(1).join(' ') || undefined;
    }
    
    logger.info("newsletter.subscription.data", { cid, email: data.email, hasName: !!data.name });

    const listKey = process.env.CAMPAIGNS_LIST_KEY || process.env.ZOHO_CAMPAIGNS_LIST_KEY;
    
    if (!listKey) {
      logger.error("newsletter.config.missing", { cid, error: "CAMPAIGNS_LIST_KEY not configured" });
      return NextResponse.json({ 
        ok: false, 
        cid, 
        error: "Newsletter service not configured" 
      }, { status: 503 });
    }

    // Since Campaigns API may return success but not actually create subscribers,
    // let's always create a CRM lead for newsletter subscriptions to ensure tracking
    logger.info("newsletter.creating_crm_lead", { cid, email: data.email });
    
    try {
      const { zohoFetch } = await import("@/lib/zoho/client");
      
      const leadPayload = {
        Last_Name: lastname || data.email.split('@')[0] || 'Newsletter Subscriber',
        First_Name: firstname || undefined,
        Email: data.email,
        Company: data.company || 'Newsletter Subscriber',
        Lead_Source: 'Newsletter Subscription',
        Description: `Newsletter subscription from ${data.utm_source || 'website'}`,
        Consent_c: true,
        Newsletter_Opt_In_c: true,
        // UTM tracking - corrected field names
        UTM_Source_c: data.utm_source || null,
        UTM_Medium_c: data.utm_medium || null,
        UTM_Campaign_c: data.utm_campaign || null,
        UTM_Term_c: data.utm_term || null,
        UTM_Content_c: data.utm_content || null,
      };
      
      const leadRes = await zohoFetch<{
        data?: Array<{ details?: { id?: string }; status?: string; message?: string }>;
      }>("crm", "/Leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [leadPayload] }),
        cid,
      });
      
      if (leadRes.data?.[0]?.details?.id) {
        logger.info("newsletter.lead_created", { 
          cid, 
          leadId: leadRes.data[0].details.id,
          email: data.email 
        });
        
        // Now try Campaigns API as secondary action
        try {
          await campaigns.listSubscribe(listKey, {
            email: data.email,
            firstname: firstname,
            lastname: lastname,
            company: data.company,
          }, cid);
          
          logger.info("newsletter.campaigns_also_success", { cid, email: data.email });
        } catch (campaignError: any) {
          logger.warn("newsletter.campaigns_failed_but_lead_created", { 
            cid, 
            email: data.email,
            campaignError: campaignError?.message 
          });
        }
        
        return NextResponse.json({ 
          ok: true, 
          message: "Newsletter subscription successful",
          leadId: leadRes.data[0].details.id,
          cid 
        });
      } else {
        logger.error("newsletter.lead_creation_failed", { cid, leadRes });
        throw new Error("Failed to create CRM lead");
      }
    } catch (error: any) {
      logger.error("newsletter.crm_failed", { cid, error: error?.message });
      throw error;
    }
    
  } catch (err: any) {
    logger.error("newsletter.subscription.failed", { cid, error: err?.message });
    
    const status = err?.message?.includes("zoho:") ? 502 : 400;
    return NextResponse.json({ 
      ok: false, 
      cid, 
      error: err?.message || "Newsletter subscription failed" 
    }, { status });
  }
}