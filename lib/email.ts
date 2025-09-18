import nodemailer from 'nodemailer';
import type { SendMailOptions, SentMessageInfo } from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);
  }
  return transporter;
}

// Email templates
export const emailTemplates = {
  contactNotification: (data: unknown) => ({
    from: process.env.SMTP_FROM || 'noreply@ideinstein.com',
    to: 'info@ideinstein.com',
    subject: `New Contact Form Submission from ${(data as any).name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E40AF;">New Contact Form Submission</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${(data as any).name}</p>
          <p><strong>Email:</strong> ${(data as any).email}</p>
          ${(data as any).company ? `<p><strong>Company:</strong> ${(data as any).company}</p>` : ''}
          ${(data as any).phone ? `<p><strong>Phone:</strong> ${(data as any).phone}</p>` : ''}
          ${(data as any).subject ? `<p><strong>Subject:</strong> ${(data as any).subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1E40AF;">
            ${(data as any).message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          Submitted at: ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  }),

  consultationNotification: (data: unknown) => ({
    from: process.env.SMTP_FROM || 'noreply@ideinstein.com',
    to: 'info@ideinstein.com',
    subject: `New Consultation Request - ${(data as any).serviceType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E40AF;">New Consultation Request</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${(data as any).name}</p>
          <p><strong>Email:</strong> ${(data as any).email}</p>
          <p><strong>Company:</strong> ${(data as any).company}</p>
          ${(data as any).phone ? `<p><strong>Phone:</strong> ${(data as any).phone}</p>` : ''}
          <p><strong>Service Type:</strong> ${(data as any).serviceType}</p>
          <p><strong>Timeline:</strong> ${(data as any).timeline}</p>
          <p><strong>Budget:</strong> ${(data as any).budget}</p>
          ${(data as any).preferredContactMethod ? `<p><strong>Preferred Contact:</strong> ${(data as any).preferredContactMethod}</p>` : ''}
          <p><strong>Project Description:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1E40AF;">
            ${(data as any).projectDescription.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          Submitted at: ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  }),

  consultationConfirmation: (data: unknown) => ({
    from: process.env.SMTP_FROM || 'noreply@ideinstein.com',
    to: (data as any).email,
    subject: 'Consultation Request Received - IdEinstein',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #1E40AF;">IdEinstein</h1>
          <p style="color: #64748b;">Where Ideas Take Shape</p>
        </div>
        
        <h2 style="color: #1E40AF;">Thank you for your consultation request!</h2>
        
        <p>Dear ${(data as any).name},</p>
        
        <p>We have received your consultation request for <strong>${(data as any).serviceType}</strong> and our team will review it shortly.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1E40AF; margin-top: 0;">Request Summary:</h3>
          <p><strong>Service:</strong> ${(data as any).serviceType}</p>
          <p><strong>Timeline:</strong> ${(data as any).timeline}</p>
          <p><strong>Budget:</strong> ${(data as any).budget}</p>
        </div>
        
        <p>Our engineering experts will contact you within 24 hours to discuss your project requirements and schedule a consultation.</p>
        
        <p>If you have any urgent questions, please don't hesitate to contact us at:</p>
        <ul>
          <li>Email: info@ideinstein.com</li>
          <li>Phone: +49 (151) 4222-7760</li>
        </ul>
        
        <p>Best regards,<br>
        The IdEinstein Team</p>
        
        <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; color: #64748b; font-size: 14px;">
          <p>IdEinstein - Professional Engineering Services<br>
          Walter-Petri-Ring 49, 65232 Taunusstein, Germany</p>
        </div>
      </div>
    `,
  }),

  welcomeNewsletter: (data: unknown) => ({
    from: process.env.SMTP_FROM || 'noreply@ideinstein.com',
    to: (data as any).email,
    subject: 'Welcome to IdEinstein Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #1E40AF;">Welcome to IdEinstein!</h1>
          <p style="color: #64748b;">Where Ideas Take Shape</p>
        </div>
        
        <p>Dear ${(data as any).name || 'Subscriber'},</p>
        
        <p>Thank you for subscribing to the IdEinstein newsletter! You'll now receive:</p>
        
        <ul>
          <li>Latest engineering insights and industry trends</li>
          <li>Case studies from our successful projects</li>
          <li>Technical tips and best practices</li>
          <li>Updates on new services and capabilities</li>
          <li>Exclusive content for our community</li>
        </ul>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #1E40AF; margin-top: 0;">Ready to start your next project?</h3>
          <p>Our engineering experts are here to help transform your ideas into reality.</p>
          <a href="https://ideinstein.com/contact" style="background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get in Touch</a>
        </div>
        
        <p>Best regards,<br>
        The IdEinstein Team</p>
        
        <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; color: #64748b; font-size: 14px;">
          <p>You can <a href="https://ideinstein.com/unsubscribe?email=${(data as any).email}">unsubscribe</a> at any time.</p>
          <p>IdEinstein - Professional Engineering Services<br>
          Walter-Petri-Ring 49, 65232 Taunusstein, Germany</p>
        </div>
      </div>
    `,
  }),
};

// Send email function
export async function sendEmail(template: SendMailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if email is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email not configured, skipping send:', template.subject);
      return { success: false, error: 'Email not configured' };
    }

    const emailTransporter = getTransporter();
    const result: SentMessageInfo = await emailTransporter.sendMail(template);
    console.log('Email sent successfully:', template.subject, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Specific email functions
export const sendContactNotification = (data: unknown) => 
  sendEmail(emailTemplates.contactNotification(data) as SendMailOptions);

export const sendConsultationNotification = (data: unknown) => 
  sendEmail(emailTemplates.consultationNotification(data) as SendMailOptions);

export const sendConsultationConfirmation = (data: unknown) => 
  sendEmail(emailTemplates.consultationConfirmation(data) as SendMailOptions);

export const sendWelcomeEmail = (data: unknown) => 
  sendEmail(emailTemplates.welcomeNewsletter(data) as SendMailOptions);