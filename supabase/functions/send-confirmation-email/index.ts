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
    console.log('Received request for send-confirmation-email');

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      throw new Error('Server configuration error: Missing email API key');
    }

    const { quote, type } = await req.json();
    console.log(`Processing ${type} email for quote ${quote?.id}`);

    if (type === 'customer') {
      await sendCustomerConfirmation(RESEND_API_KEY, quote);
    } else if (type === 'admin') {
      await sendAdminNotification(RESEND_API_KEY, quote);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-confirmation-email:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Common Styles
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
  .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); color: #1A1F2C; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; margin: 20px 0; text-align: center; }
`;

async function sendCustomerConfirmation(apiKey: string, quote: any) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmed!</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Booking Confirmed! ✅</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Dear ${quote.name},</p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
            Your booking has been successfully confirmed. We are excited to provide you with our premium chauffeur service!
          </p>

          <div style="text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 25px; border: 1px solid #C5A572;">
            <p style="margin: 0; color: #92400e; font-size: 13px; text-transform: uppercase;">Booking Reference</p>
            <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 24px; font-weight: 800; letter-spacing: 1px;">#${quote.id.substring(0, 8).toUpperCase()}</p>
          </div>

          <!-- Trip Details -->
          <div class="details-container">
            <h2 class="details-title">Your Trip Details</h2>
            
            <p class="info-line"><span class="info-label">Date:</span> ${new Date(quote.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p class="info-line"><span class="info-label">Time:</span> ${quote.time}</p>
            <p class="info-line"><span class="info-label">Pickup:</span> ${quote.pickup_location}</p>
            <p class="info-line"><span class="info-label">Destination:</span> ${quote.destinations?.[0] || quote.dropoff_location || 'As instructed'}</p>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
               <p class="info-line"><span class="info-label">Vehicle:</span> ${quote.vehicle_name}</p>
               <p class="info-line"><span class="info-label">Passengers:</span> ${quote.passengers}</p>
            </div>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
               <span class="info-label" style="font-size: 16px;">Total Paid</span>
               <span style="font-size: 20px; font-weight: 800; color: #C5A572;">$${quote.quoted_price.toFixed(2)}</span>
            </div>
          </div>

          <!-- What's Next -->
          <div style="background-color: #fdfbf7; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e7e5e4;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; font-weight: 700;">What Happens Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;">We'll contact you 24 hours before your pickup to confirm details</li>
              <li style="margin-bottom: 8px;">Your chauffeur will arrive 10 minutes before scheduled time</li>
              <li style="margin-bottom: 8px;">You'll receive a reminder SMS on the day</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">Need to make changes?</p>
            <p><strong><a href="tel:+61430240945" style="color: #C5A572; text-decoration: none;">+61 430 240 945</a></strong></p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>© ${new Date().getFullYear()} ChauffeurTop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
      reply_to: ['bookings@chauffeurtop.com.au'],
      to: [quote.email],
      subject: `✅ Booking Confirmed - ${new Date(quote.date).toLocaleDateString('en-AU')}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send customer confirmation email');
  }
}

async function sendAdminNotification(apiKey: string, quote: any) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Booking Confirmation</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>New Booking Confirmed 🔔</h1>
        </div>

        <div class="content">
          <div style="text-align: center; margin-bottom: 25px;">
             <span style="background: #1f2937; color: #C5A572; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 14px;">REF: #${quote.id.substring(0, 8).toUpperCase()}</span>
          </div>

          <!-- Customer Details -->
          <div class="details-container" style="background: #fdfbf7;">
            <h3 class="details-title" style="font-size: 18px;">👤 Customer Details</h3>
            <p class="info-line"><span class="info-label">Name:</span> ${quote.name}</p>
            <p class="info-line"><span class="info-label">Email:</span> <a href="mailto:${quote.email}" style="color: #1f2937;">${quote.email}</a></p>
            <p class="info-line"><span class="info-label">Phone:</span> <a href="tel:${quote.phone}" style="color: #1f2937;">${quote.phone}</a></p>
          </div>

          <!-- Trip Details -->
          <div class="details-container">
            <h3 class="details-title" style="font-size: 18px;">🚗 Trip Information</h3>
            <p class="info-line"><span class="info-label">Date:</span> ${new Date(quote.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p class="info-line"><span class="info-label">Time:</span> ${quote.time}</p>
            
            <div style="background-color: #fdfbf7; border: 1px solid #e5e5e5; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p class="info-line"><span class="info-label">Pickup:</span> ${quote.pickup_location}</p>
                <p class="info-line"><span class="info-label">Dropoff:</span> ${quote.dropoff_location || quote.destinations?.[0] || 'As discussed'}</p>
            </div>

            <p class="info-line"><span class="info-label">Vehicle:</span> ${quote.vehicle_name}</p>
            <p class="info-line"><span class="info-label">Passengers:</span> ${quote.passengers}</p>
            
             <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
               <span class="info-label" style="display: block; font-size: 12px; text-transform: uppercase;">Quoted Price</span>
               <span style="font-size: 24px; font-weight: 800; color: #C5A572;">$${quote.quoted_price.toFixed(2)}</span>
            </div>
          </div>

          <!-- Action -->
          <div style="text-align: center;">
            <a href="${SITE_URL}/admin" class="cta-button">
              VIEW IN ADMIN PANEL
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Automated Notification Service</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
      // IMPORTANT: Admin receives at different email than FROM to avoid Resend suppression
      to: ['admin@chauffeurtop.com.au'],
      reply_to: ['bookings@chauffeurtop.com.au'],
      subject: `New Booking: ${quote.name} - ${new Date(quote.date).toLocaleDateString('en-AU')}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send admin notification email');
  }
}
