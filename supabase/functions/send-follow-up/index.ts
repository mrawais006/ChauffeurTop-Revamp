import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
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
    const { lead, type, followUpType, customMessage, discount } = await req.json();

    if (!lead.email) {
      return new Response(
        JSON.stringify({ error: 'Customer email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate new confirmation token for discount follow-ups
    let confirmationToken = lead.confirmation_token;
    let updatedPrice = lead.quoted_price;

    if (followUpType === 'discount' && discount) {
      // Calculate new price with discount
      if (discount.type === 'percentage') {
        updatedPrice = lead.quoted_price * (1 - discount.value / 100);
      } else {
        updatedPrice = lead.quoted_price - discount.value;
      }

      // Generate new token for confirmation
      confirmationToken = crypto.randomUUID();

      // Note: The calling code should update the database with new token and price
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
        from: 'ChauffeurTop <bookings@chauffertop.com.au>',
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

function buildReminderEmail(lead: any, confirmationUrl: string | null): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reminder: Your ChauffeurTop Quote</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">ChauffeurTop</h1>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${lead.name},</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            We wanted to follow up on the quote we sent you for your upcoming trip on <strong>${new Date(lead.date).toLocaleDateString('en-AU')}</strong>.
          </p>

          <p style="color: #4b5563; line-height: 1.6;">
            Your quote is still available at <strong style="color: #d97706; font-size: 20px;">$${lead.quoted_price.toFixed(2)}</strong>
          </p>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>Pickup:</strong> ${lead.pickup_location}</p>
            <p style="margin: 10px 0 0 0; color: #1e40af;"><strong>Dropoff:</strong> ${lead.dropoff_location}</p>
          </div>

          ${confirmationUrl ? `
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                Confirm Booking Now
              </a>
            </div>
          ` : ''}

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you have any questions or would like to make changes, please don't hesitate to contact us.
          </p>

          <p style="color: #6b7280; font-size: 14px;">
            📞 <a href="tel:+61412345678" style="color: #3b82f6;">+61 412 345 678</a><br>
            ✉️ <a href="mailto:bookings@chauffertop.com.au" style="color: #3b82f6;">bookings@chauffertop.com.au</a>
          </p>
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
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Special Offer!</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 18px;">Exclusive Discount for You</p>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${lead.name},</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            We'd love to have you as our customer! We're offering you a special <strong style="color: #059669;">${discountText} discount</strong> on your booking.
          </p>

          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; border: 2px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 16px;">Original Price</p>
            <p style="margin: 5px 0; color: #92400e; font-size: 24px; text-decoration: line-through;">$${lead.quoted_price.toFixed(2)}</p>
            <p style="margin: 15px 0 5px 0; color: #059669; font-size: 18px; font-weight: bold;">Your Discounted Price</p>
            <p style="margin: 0; color: #059669; font-size: 36px; font-weight: bold;">$${newPrice.toFixed(2)}</p>
            <p style="margin: 10px 0 0 0; color: #059669; font-size: 16px;">You save $${(lead.quoted_price - newPrice).toFixed(2)}!</p>
          </div>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>Date:</strong> ${new Date(lead.date).toLocaleDateString('en-AU')}</p>
            <p style="margin: 10px 0; color: #1e40af;"><strong>Pickup:</strong> ${lead.pickup_location}</p>
            <p style="margin: 0; color: #1e40af;"><strong>Dropoff:</strong> ${lead.dropoff_location}</p>
          </div>

          ${confirmationUrl ? `
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 8px; font-weight: bold; font-size: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                Claim Your Discount Now!
              </a>
            </div>
            <p style="color: #dc2626; text-align: center; font-weight: 600; margin: 10px 0;">
              ⏰ This offer is time-limited!
            </p>
          ` : ''}

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Questions? Contact us anytime:<br>
            📞 <a href="tel:+61412345678" style="color: #3b82f6;">+61 412 345 678</a><br>
            ✉️ <a href="mailto:bookings@chauffertop.com.au" style="color: #3b82f6;">bookings@chauffertop.com.au</a>
          </p>
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
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">ChauffeurTop</h1>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${lead.name},</h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-left: 4px solid #3b82f6; border-radius: 4px; margin: 20px 0;">
            <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af;">Your Booking Details</h3>
            <p style="margin: 5px 0; color: #1e40af;"><strong>Date:</strong> ${new Date(lead.date).toLocaleDateString('en-AU')}</p>
            <p style="margin: 5px 0; color: #1e40af;"><strong>Time:</strong> ${lead.time}</p>
            <p style="margin: 5px 0; color: #1e40af;"><strong>Pickup:</strong> ${lead.pickup_location}</p>
            <p style="margin: 5px 0; color: #1e40af;"><strong>Dropoff:</strong> ${lead.dropoff_location}</p>
            ${lead.quoted_price ? `<p style="margin: 15px 0 0 0; color: #d97706; font-size: 20px; font-weight: bold;">Price: $${lead.quoted_price.toFixed(2)}</p>` : ''}
          </div>

          ${confirmationUrl ? `
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                Confirm Booking
              </a>
            </div>
          ` : ''}

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Feel free to reach out if you have any questions:<br>
            📞 <a href="tel:+61412345678" style="color: #3b82f6;">+61 412 345 678</a><br>
            ✉️ <a href="mailto:bookings@chauffertop.com.au" style="color: #3b82f6;">bookings@chauffertop.com.au</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
