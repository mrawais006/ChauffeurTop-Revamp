import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:3000';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received request for send-follow-up');

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      throw new Error('Server configuration error: Missing email API key');
    }

    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));

    const { lead, type, followUpType, customMessage, discount } = body;

    if (!lead || !lead.email) {
      console.error('Missing customer email in lead data');
      return new Response(
        JSON.stringify({ error: 'Customer email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate new confirmation token for discount follow-ups
    const confirmationToken = lead.confirmation_token;
    let updatedPrice = lead.quoted_price;

    if (followUpType === 'discount' && discount) {
      // Calculate new price with discount
      if (discount.type === 'percentage') {
        updatedPrice = lead.quoted_price * (1 - discount.value / 100);
      } else {
        updatedPrice = lead.quoted_price - discount.value;
      }
    }

    const confirmationUrl = confirmationToken
      ? `${SITE_URL}/api/confirm-booking?token=${confirmationToken}`
      : null;

    let emailHtml = '';
    let subject = '';

    // Build email based on follow-up type
    switch (followUpType) {
      case 'reminder':
        subject = `Reminder: Your ChauffeurTop Quote - $${lead.quoted_price.toFixed(2)}`;
        emailHtml = buildReminderEmail(lead, confirmationUrl);
        break;

      case 'discount':
        subject = `Special Offer: ${discount.value}${discount.type === 'percentage' ? '%' : '$'} Discount on Your ChauffeurTop Booking!`;
        emailHtml = buildDiscountEmail(lead, discount, updatedPrice, confirmationUrl);
        break;

      case 'personal':
        subject = `Message from ChauffeurTop regarding your booking`;
        emailHtml = buildPersonalEmail(lead, customMessage, confirmationUrl);
        break;

      default:
        throw new Error('Invalid follow-up type');
    }

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ChauffeurTop <notifications@chauffeurtop.com.au>', // Fixed sender
        to: [lead.email],
        subject: subject,
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
      JSON.stringify({
        success: true,
        messageId: result.id,
        newToken: followUpType === 'discount' ? confirmationToken : undefined,
        newPrice: followUpType === 'discount' ? updatedPrice : undefined
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-follow-up:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Common Styles for Consistency
const styles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); padding: 30px 20px; text-align: center; }
  .header h1 { color: #1A1F2C; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
  .content { padding: 40px 30px; }
  
  .details-container { border: 1px solid #C5A572; border-radius: 8px; padding: 25px; margin: 25px 0; background-color: #ffffff; }
  .details-title { color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 700; }
  .info-line { margin: 8px 0; color: #4b5563; font-size: 15px; }
  .info-label { font-weight: 600; color: #1f2937; }

  .price-box { background: linear-gradient(135deg, #111827 0%, #374151 100%); color: #C5A572; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); color: #1A1F2C !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; margin: 25px 0; text-align: center; display: block; box-shadow: 0 4px 6px rgba(197, 165, 114, 0.3); }
  .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  .link { color: #111827; text-decoration: none; font-weight: 600; }
`;

function buildReminderEmail(lead: any, confirmationUrl: string | null): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reminder: Your ChauffeurTop Quote</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ChauffeurTop Reminder</h1>
        </div>

        <div class="content">
          <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hi ${lead.name},</p>
          
          <p>We wanted to follow up on the quote we sent you for your upcoming trip on <strong>${new Date(lead.date).toLocaleDateString('en-AU')}</strong>.</p>
          
          <div class="price-box">
             <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; color: #9CA3AF;">Your Quote</div>
             <div style="font-size: 36px; font-weight: 700;">$${lead.quoted_price.toFixed(2)}</div>
          </div>

          <div class="details-container">
            <h3 class="details-title">Trip Details</h3>
            <p class="info-line"><span class="info-label">Pickup:</span> ${lead.pickup_location}</p>
            <p class="info-line"><span class="info-label">Dropoff:</span> ${lead.dropoff_location || 'As instructed'}</p>
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                <p class="info-line"><span class="info-label">Vehicle:</span> ${lead.vehicle_name || lead.vehicle_type}</p>
            </div>
          </div>

          ${confirmationUrl ? `
            <a href="${confirmationUrl}" class="cta-button">
              CONFIRM BOOKING NOW
            </a>
          ` : ''}

          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you have any questions or would like to make changes, please don't hesitate to contact us.
          </p>

          <div class="footer">
             <p>
              📞 <a href="tel:+61430240945" class="link">+61 430 240 945</a><br>
              ✉️ <a href="mailto:admin@chauffeurtop.com.au" class="link">admin@chauffeurtop.com.au</a>
            </p>
            <p>© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildDiscountEmail(lead: any, discount: any, newPrice: number, confirmationUrl: string | null): string {
  const discountText = discount.type === 'percentage'
    ? `${discount.value}%`
    : `$${discount.value.toFixed(2)}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Special Discount Offer!</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Special Offer!</h1>
          <p style="color: #1A1F2C; margin: 5px 0 0 0; font-weight: 500;">Exclusive Discount for You</p>
        </div>

        <div class="content">
          <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hi ${lead.name},</p>
          
          <p>We'd love to have you as our customer! We're offering you a special <strong>${discountText} discount</strong> on your booking.</p>

          <div class="price-box">
            <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; color: #9CA3AF;">Original Price</div>
            <div style="font-size: 20px; text-decoration: line-through; margin-bottom: 15px; color: #6B7280;">$${lead.quoted_price.toFixed(2)}</div>
            
            <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; color: #fff;">Your Discounted Price</div>
            <div style="font-size: 40px; font-weight: 700; color: #C5A572;">$${newPrice.toFixed(2)}</div>
            <div style="margin-top: 10px; color: #10B981; font-weight: 600; background: rgba(16, 185, 129, 0.1); display: inline-block; padding: 4px 12px; border-radius: 20px;">You save $${(lead.quoted_price - newPrice).toFixed(2)}!</div>
          </div>

          <div class="details-container">
             <h3 class="details-title">Trip Details</h3>
             <p class="info-line"><span class="info-label">Date:</span> ${new Date(lead.date).toLocaleDateString('en-AU')}</p>
             <p class="info-line"><span class="info-label">Pickup:</span> ${lead.pickup_location}</p>
             <p class="info-line"><span class="info-label">Dropoff:</span> ${lead.dropoff_location || 'As instructed'}</p>
          </div>

          ${confirmationUrl ? `
            <a href="${confirmationUrl}" class="cta-button">
              CLAIM THIS OFFER
            </a>
            <p style="color: #EF4444; text-align: center; font-weight: 600; margin: 10px 0;">
              ⏰ This offer is time-limited!
            </p>
          ` : ''}

           <div class="footer">
             <p>
              📞 <a href="tel:+61430240945" class="link">+61 430 240 945</a><br>
              ✉️ <a href="mailto:admin@chauffeurtop.com.au" class="link">admin@chauffeurtop.com.au</a>
            </p>
            <p>© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildPersonalEmail(lead: any, message: string, confirmationUrl: string | null): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Message from ChauffeurTop</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ChauffeurTop</h1>
        </div>

        <div class="content">
          <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hi ${lead.name},</p>
          
          <div style="background-color: #f3f4f6; padding: 25px; border-radius: 8px; margin: 20px 0; font-style: italic; border-left: 4px solid #111827; color: #4b5563;">
            "${message}"
          </div>

          <div class="details-container">
            <h3 class="details-title">Booking Details</h3>
            <p class="info-line"><span class="info-label">Date:</span> ${new Date(lead.date).toLocaleDateString('en-AU')}</p>
            <p class="info-line"><span class="info-label">Time:</span> ${lead.time}</p>
            <p class="info-line"><span class="info-label">Pickup:</span> ${lead.pickup_location}</p>
            <p class="info-line"><span class="info-label">Dropoff:</span> ${lead.dropoff_location || 'As instructed'}</p>
            ${lead.quoted_price ? `<p class="info-line" style="margin-top: 15px; font-size: 16px;"><span class="info-label">Price:</span> $${lead.quoted_price.toFixed(2)}</p>` : ''}
          </div>

          ${confirmationUrl ? `
            <a href="${confirmationUrl}" class="cta-button">
              CONFIRM BOOKING
            </a>
          ` : ''}

           <div class="footer">
             <p>
              📞 <a href="tel:+61430240945" class="link">+61 430 240 945</a><br>
              ✉️ <a href="mailto:admin@chauffeurtop.com.au" class="link">admin@chauffeurtop.com.au</a>
            </p>
            <p>© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
