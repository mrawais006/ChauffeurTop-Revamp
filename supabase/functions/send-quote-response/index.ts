import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Remove unused import to prevent potential load errors
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:3000';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuoteData {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  pickup_location: string;
  dropoff_location: string;
  vehicle_name: string;
  passengers: number;
  quoted_price: number;
  confirmation_token: string;
  price_breakdown?: {
    base_price: number;
    return_base_price?: number;
    additional_items?: Array<{ description: string; amount: number }>;
    subtotal: number;
    discount?: {
      type: 'percentage' | 'fixed';
      value: number;
      amount: number;
      reason: string;
    };
    total: number;
    notes?: string;
    is_return_trip?: boolean;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received request for send-quote-response');

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      throw new Error('Server configuration error: Missing email API key');
    }

    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));

    const { quote, priceBreakdown, type } = body;
    const quoteData: QuoteData = quote;

    if (!quoteData) {
      throw new Error('Missing quote data in request body');
    }

    if (!quoteData.email) {
      console.error('Missing customer email in quote data');
      return new Response(
        JSON.stringify({ error: 'Customer email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Preparing to send email to ${quoteData.email}`);

    // Build confirmation URL
    const confirmationUrl = `${SITE_URL}/api/confirm-booking?token=${quoteData.confirmation_token}`;

    // ... (rest of the code is generated dynamically in next steps) 
    // Wait, I need to preserve the breakdown HTML generation logic or rewrite it.
    // Since replace_file_content replaces a block, I must be careful.
    
    // STOP. The logic below "Build price breakdown HTML" is complex. 
    // I should only replace the top part and let the rest be.
    
    // I will restart the ReplacementContent to only cover the top part.


    // Build price breakdown HTML
    let priceBreakdownHtml = '';
    if (priceBreakdown) {
      priceBreakdownHtml = `
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Price Breakdown</h3>
          
          ${priceBreakdown.is_return_trip ? `
            <div style="margin-bottom: 10px;">
              <span style="color: #6b7280;">Outbound Base Fare:</span>
              <span style="float: right; font-weight: 600;">$${priceBreakdown.base_price.toFixed(2)}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <span style="color: #6b7280;">Return Base Fare:</span>
              <span style="float: right; font-weight: 600;">$${priceBreakdown.return_base_price.toFixed(2)}</span>
            </div>
          ` : `
            <div style="margin-bottom: 10px;">
              <span style="color: #6b7280;">Base Fare:</span>
              <span style="float: right; font-weight: 600;">$${priceBreakdown.base_price.toFixed(2)}</span>
            </div>
          `}

          ${priceBreakdown.additional_items && priceBreakdown.additional_items.length > 0 ?
          priceBreakdown.additional_items.map((item: any) => `
              <div style="margin-bottom: 10px;">
                <span style="color: #6b7280;">${item.description}:</span>
                <span style="float: right; font-weight: 600;">$${item.amount.toFixed(2)}</span>
              </div>
            `).join('') : ''
        }

          ${priceBreakdown.discount ? `
            <div style="border-top: 1px solid #e5e7eb; margin: 15px 0; padding-top: 10px;">
              <div style="margin-bottom: 10px;">
                <span style="color: #6b7280;">Subtotal:</span>
                <span style="float: right; font-weight: 600;">$${priceBreakdown.subtotal.toFixed(2)}</span>
              </div>
              <div style="margin-bottom: 10px; color: #059669;">
                <span>Discount (${priceBreakdown.discount.reason}):</span>
                <span style="float: right; font-weight: 600;">-$${priceBreakdown.discount.amount.toFixed(2)}</span>
              </div>
            </div>
          ` : ''}

          <div style="border-top: 2px solid #d97706; margin-top: 15px; padding-top: 15px;">
            <div style="font-size: 20px; font-weight: bold; color: #92400e;">
              <span>Total:</span>
              <span style="float: right; color: #d97706;">$${quoteData.quoted_price.toFixed(2)}</span>
            </div>
          </div>

          ${priceBreakdown.notes ? `
            <div style="margin-top: 15px; padding: 10px; background-color: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Note:</strong> ${priceBreakdown.notes}</p>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your ChauffeurTop Quote</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ChauffeurTop</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Premium Chauffeur Services</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Your Quote is Ready!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Dear ${quoteData.name},
            </p>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for choosing ChauffeurTop! We're pleased to provide you with a quote for your upcoming journey.
            </p>

            <!-- Trip Details -->
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">Trip Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; width: 40%;">Date:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${new Date(quoteData.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Pickup Time:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quoteData.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Pickup Location:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quoteData.pickup_location}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Dropoff Location:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quoteData.dropoff_location}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Vehicle:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quoteData.vehicle_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Passengers:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quoteData.passengers}</td>
                </tr>
              </table>
            </div>

            ${priceBreakdownHtml}

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                Confirm Booking
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0;">
              By clicking the button above, you confirm your booking and agree to the quoted price.
            </p>

            <!-- Contact Info -->
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">Questions or Need Changes?</h3>
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                📞 Phone: <a href="tel:+61412345678" style="color: #3b82f6; text-decoration: none;">+61 412 345 678</a>
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                ✉️ Email: <a href="mailto:bookings@chauffertop.com.au" style="color: #3b82f6; text-decoration: none;">bookings@chauffertop.com.au</a>
              </p>
            </div>

            <p style="color: #4b5563; line-height: 1.6; margin: 20px 0 0 0;">
              We look forward to serving you!
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin: 5px 0 0 0; font-weight: 600;">
              The ChauffeurTop Team
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} ChauffeurTop. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ChauffeurTop <bookings@chauffertop.com.au>',
        to: [quoteData.email],
        subject: `Your ChauffeurTop Quote - $${quoteData.quoted_price.toFixed(2)}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const result = await emailResponse.json();

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-quote-response:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
