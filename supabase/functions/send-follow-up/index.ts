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
      ? `${SITE_URL}/confirm-booking/${confirmationToken}`
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
        from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
        reply_to: ['bookings@chauffeurtop.com.au'],
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

    // -----------------------------
    // Send SMS Notification via Twilio
    // -----------------------------
    try {
      const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
      const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
      const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

      if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER && lead.phone) {
        console.log('Sending follow-up SMS to:', lead.phone);

        let smsBody = '';
        const safeId = lead.id.substring(0, 8).toUpperCase();

        switch (followUpType) {
          case 'reminder':
            smsBody = `ChauffeurTop Reminder 🗓️\nHi ${lead.name}, friendly reminder about your quote #${safeId} ($${lead.quoted_price.toFixed(0)}).\nCheck your email to confirm.`;
            break;
          case 'discount':
             const discountStr = discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`;
             smsBody = `ChauffeurTop Exlusive 🎁\nHi ${lead.name}, special offer! Get ${discountStr} OFF your booking #${safeId}.\nNew Price: $${updatedPrice.toFixed(0)}.\nCheck your email to claim!`;
            break;
          case 'personal':
            smsBody = `Message from ChauffeurTop 💬\nre: Booking #${safeId}\nPlease check your email for an important update regarding your inquiry.`;
            break;
        }

        if (smsBody) {
            const params = new URLSearchParams();
            params.append('To', lead.phone);
            params.append('From', TWILIO_PHONE_NUMBER);
            params.append('Body', smsBody);

            const twilioRes = await fetch(
              `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
                },
                body: params,
              }
            );

            if (!twilioRes.ok) {
              const twilioError = await twilioRes.text();
              console.error('Twilio SMS failed:', twilioError);
            } else {
              console.log('Twilio SMS sent successfully');
            }
        }
      }
    } catch (smsError) {
      console.error('Error sending SMS:', smsError);
      // Non-blocking
    }
    console.log('Follow-up activity completed');

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
  .header { background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); padding: 30px 20px; text-align: center; }
  .header h1 { color: #C5A572; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
  .header p { color: #9CA3AF; margin: 6px 0 0 0; font-size: 13px; }
  .gold-bar { height: 3px; background: linear-gradient(90deg, transparent, #C5A572, transparent); }
  .content { padding: 40px 30px; }
  
  .details-container { border: 1px solid #C5A572; border-radius: 8px; padding: 25px; margin: 25px 0; background-color: #ffffff; }
  .details-title { color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 700; }
  .info-line { margin: 8px 0; color: #4b5563; font-size: 15px; }
  .info-label { font-weight: 600; color: #1f2937; }

  .price-box { background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); color: #C5A572; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); color: #1A1F2C !important; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; margin: 25px 0; text-align: center; display: block; box-shadow: 0 4px 12px rgba(197, 165, 114, 0.35); letter-spacing: 0.5px; }
  .footer { background: #1A1F2C; padding: 30px; text-align: center; color: #9CA3AF; font-size: 12px; }
  .footer a { color: #C5A572; text-decoration: none; }
  .link { color: #C5A572; text-decoration: none; font-weight: 600; }
`;

function buildReminderEmail(lead: any, confirmationUrl: string | null): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your ChauffeurTop Quote is Waiting</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Chauffeur is Waiting</h1>
          <p>ChauffeurTop Melbourne</p>
        </div>
        <div class="gold-bar"></div>

        <div class="content">
          <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hi ${lead.name},</p>
          
          <p style="color: #4b5563; line-height: 1.7;">We wanted to follow up on the quote we sent you for your trip on <strong>${new Date(lead.date).toLocaleDateString('en-AU')}</strong>. Your personalised quote is still available — confirm now to secure your booking.</p>
          
          <div class="price-box">
             <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 5px; color: #9CA3AF;">Your Quoted Price</div>
             <div style="font-size: 36px; font-weight: 700;">$${lead.quoted_price.toFixed(2)}</div>
             <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Fixed price — no surge, no hidden fees</div>
          </div>

          <div class="details-container">
            <h3 class="details-title">Trip Details</h3>
            <p class="info-line"><span class="info-label">Pickup:</span> ${lead.pickup_location}</p>
            <p class="info-line"><span class="info-label">Dropoff:</span> ${lead.dropoff_location || 'As instructed'}</p>
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                <p class="info-line"><span class="info-label">Vehicle:</span> ${lead.vehicle_name || lead.vehicle_type}</p>
            </div>
          </div>

          <!-- Value Reminder -->
          <div style="background: linear-gradient(135deg, #fdfbf7 0%, #fef9f0 100%); border: 1px solid #C5A572; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #1A1F2C;">Why choose ChauffeurTop?</p>
            <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.7;">Professional chauffeur. Luxury vehicle. Fixed pricing with no surprises. Premium service often at rates comparable to a standard taxi — without the cramped car or random driver.</p>
          </div>

          ${confirmationUrl ? `
            <a href="${confirmationUrl}" class="cta-button">
              Confirm & Secure Your Chauffeur
            </a>
          ` : ''}

          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 25px;">
            Questions? We're happy to help — just reply to this email or call us directly.
          </p>
        </div>
        <div class="footer">
           <p style="margin: 0 0 8px 0;">
            <a href="tel:+61430240945">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au">bookings@chauffeurtop.com.au</a>
          </p>
          <p style="margin: 0;">© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
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
      <title>Exclusive Offer for You</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Exclusive Offer for You</h1>
          <p>ChauffeurTop Melbourne</p>
        </div>
        <div class="gold-bar"></div>

        <div class="content">
          <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hi ${lead.name},</p>
          
          <p style="color: #4b5563; line-height: 1.7;">We'd love to welcome you as a ChauffeurTop client. Here's an exclusive <strong>${discountText} discount</strong> on your upcoming trip — luxury chauffeur service at an even better price.</p>

          <div class="price-box">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 5px; color: #9CA3AF;">Original Price</div>
            <div style="font-size: 20px; text-decoration: line-through; margin-bottom: 15px; color: #6B7280;">$${lead.quoted_price.toFixed(2)}</div>
            
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 5px; color: #fff;">Your Exclusive Price</div>
            <div style="font-size: 40px; font-weight: 700; color: #C5A572;">$${newPrice.toFixed(2)}</div>
            <div style="margin-top: 10px; color: #10B981; font-weight: 600; background: rgba(16, 185, 129, 0.15); display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 14px;">You save $${(lead.quoted_price - newPrice).toFixed(2)}</div>
          </div>

          <!-- What You Get -->
          <div style="background: linear-gradient(135deg, #fdfbf7 0%, #fef9f0 100%); border: 1px solid #C5A572; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #1A1F2C;">What's included at this price:</p>
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✅</span><span>Professional chauffeur — licensed and suited</span></div>
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✅</span><span>Luxury ${lead.vehicle_name || lead.vehicle_type || 'vehicle'}</span></div>
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✅</span><span>Door-to-door service, no hidden fees</span></div>
            <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✅</span><span>Fixed pricing — no surge, no surprises</span></div>
          </div>

          <div class="details-container">
             <h3 class="details-title">Trip Details</h3>
             <p class="info-line"><span class="info-label">Date:</span> ${new Date(lead.date).toLocaleDateString('en-AU')}</p>
             <p class="info-line"><span class="info-label">Pickup:</span> ${lead.pickup_location}</p>
             <p class="info-line"><span class="info-label">Dropoff:</span> ${lead.dropoff_location || 'As instructed'}</p>
          </div>

          ${confirmationUrl ? `
            <a href="${confirmationUrl}" class="cta-button">
              Claim This Offer Now
            </a>
            <p style="color: #EF4444; text-align: center; font-weight: 600; margin: 10px 0; font-size: 13px;">
              This offer is time-limited — don't miss out.
            </p>
          ` : ''}
        </div>
        <div class="footer">
           <p style="margin: 0 0 8px 0;">
            <a href="tel:+61430240945">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au">bookings@chauffeurtop.com.au</a>
          </p>
          <p style="margin: 0;">© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
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
          <p>Melbourne's Premium Chauffeur Service</p>
        </div>
        <div class="gold-bar"></div>

        <div class="content">
          <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hi ${lead.name},</p>
          
          <div style="background-color: #f9fafb; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C5A572; color: #4b5563; font-size: 15px; line-height: 1.7;">
            ${message}
          </div>

          <div class="details-container">
            <h3 class="details-title">Your Trip Details</h3>
            <p class="info-line"><span class="info-label">Date:</span> ${new Date(lead.date).toLocaleDateString('en-AU')}</p>
            <p class="info-line"><span class="info-label">Time:</span> ${lead.time}</p>
            <p class="info-line"><span class="info-label">Pickup:</span> ${lead.pickup_location}</p>
            <p class="info-line"><span class="info-label">Dropoff:</span> ${lead.dropoff_location || 'As instructed'}</p>
            ${lead.quoted_price ? `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
              <span class="info-label" style="font-size: 16px;">Quoted Price</span>
              <span style="font-size: 20px; font-weight: 800; color: #C5A572;">$${lead.quoted_price.toFixed(2)}</span>
            </div>` : ''}
          </div>

          ${confirmationUrl ? `
            <a href="${confirmationUrl}" class="cta-button">
              Confirm Your Booking
            </a>
          ` : ''}
        </div>
        <div class="footer">
           <p style="margin: 0 0 8px 0;">
            <a href="tel:+61430240945">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au">bookings@chauffeurtop.com.au</a>
          </p>
          <p style="margin: 0;">© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
