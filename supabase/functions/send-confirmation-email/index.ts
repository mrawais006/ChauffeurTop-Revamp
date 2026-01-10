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
      // Send confirmation email to customer
      await sendCustomerConfirmation(RESEND_API_KEY, quote);
    } else if (type === 'admin') {
      // Send notification to admin
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

async function sendCustomerConfirmation(apiKey: string, quote: any) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmed!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 10px;">✅</div>
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Booking Confirmed!</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">ChauffeurTop Premium Services</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Thank you, ${quote.name}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
            Your booking has been confirmed. We're excited to provide you with premium chauffeur service!
          </p>

          <!-- Booking Reference -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">Booking Reference</p>
            <p style="margin: 5px 0 0 0; color: #92400e; font-size: 24px; font-weight: bold; letter-spacing: 2px;">#${quote.id.substring(0, 8).toUpperCase()}</p>
          </div>

          <!-- Trip Details -->
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">Your Trip Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 35%;">Date:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${new Date(quote.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Pickup Time:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quote.time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Pickup Location:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quote.pickup_location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Dropoff Location:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quote.dropoff_location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Vehicle:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quote.vehicle_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Passengers:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${quote.passengers}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0 0 0; color: #6b7280; border-top: 1px solid #cbd5e1;">Total Amount:</td>
                <td style="padding: 12px 0 0 0; color: #d97706; font-weight: bold; font-size: 20px; border-top: 1px solid #cbd5e1;">$${quote.quoted_price.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- What's Next -->
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid #86efac;">
            <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 18px;">What Happens Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #166534;">
              <li style="margin-bottom: 10px;">We'll contact you 24 hours before your pickup to confirm details</li>
              <li style="margin-bottom: 10px;">Your chauffeur will arrive 10 minutes before scheduled time</li>
              <li style="margin-bottom: 10px;">Payment can be made after service via bank transfer or cash</li>
              <li>You'll receive a reminder SMS on the day of your booking</li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">Need to Make Changes?</h3>
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
              📞 Phone: <a href="tel:+61412345678" style="color: #3b82f6; text-decoration: none; font-weight: 600;">+61 412 345 678</a>
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              ✉️ Email: <a href="mailto:bookings@chauffeurtop.com.au" style="color: #3b82f6; text-decoration: none; font-weight: 600;">bookings@chauffeurtop.com.au</a>
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

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
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
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #1f2937; 
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
        }
        .header { 
          background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); 
          padding: 40px 30px; 
          text-align: center;
        }
        .header h1 { 
          color: #1A1F2C; 
          margin: 0; 
          font-size: 28px; 
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .content { 
          padding: 40px 30px; 
        }
        .section-box {
          background: #f9fafb;
          border-left: 4px solid #C5A572;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .section-box h3 {
          margin: 0 0 15px 0;
          color: #1f2937;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
          padding: 8px 0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          color: #6b7280;
          font-weight: 500;
        }
        .detail-value {
          color: #111827;
          font-weight: 600;
          text-align: right;
        }
        .price-tag {
          background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%);
          color: #1A1F2C;
          padding: 15px;
          text-align: center;
          font-weight: bold;
          font-size: 24px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .cta-button { 
          display: inline-block; 
          background: #111827;
          color: #C5A572 !important; 
          padding: 16px 32px; 
          text-decoration: none; 
          border-radius: 4px; 
          font-weight: 700;
          font-size: 16px;
          margin: 25px 0;
          text-align: center;
          display: block;
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 New Booking Confirmed</h1>
          <p style="margin: 10px 0 0 0; color: #1A1F2C; font-weight: 500;">
            Ref: #${quote.id.substring(0, 8).toUpperCase()}
          </p>
        </div>

        <div class="content">
          <!-- Customer Details -->
          <div class="section-box">
            <h3>👤 Customer Details</h3>
            <div class="detail-row">
              <span class="detail-label">Name</span>
              <span class="detail-value">${quote.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email</span>
              <span class="detail-value"><a href="mailto:${quote.email}" style="color: #111827; text-decoration: none;">${quote.email}</a></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone</span>
              <span class="detail-value"><a href="tel:${quote.phone}" style="color: #111827; text-decoration: none;">${quote.phone}</a></span>
            </div>
          </div>

          <!-- Trip Details -->
          <div class="section-box">
            <h3>🚗 Trip Information</h3>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${new Date(quote.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time</span>
              <span class="detail-value">${quote.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vehicle</span>
              <span class="detail-value">${quote.vehicle_name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Passengers</span>
              <span class="detail-value">${quote.passengers}</span>
            </div>
          </div>

          <!-- Locations -->
          <div class="section-box">
            <h3>📍 Route</h3>
            <div style="margin-bottom: 15px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Pickup</div>
              <div style="font-weight: 600; color: #111827;">${quote.pickup_location}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Dropoff</div>
              <div style="font-weight: 600; color: #111827;">${quote.dropoff_location || quote.destinations?.[0] || 'As discussed'}</div>
            </div>
          </div>

          <!-- Price -->
          <div class="price-tag">
            $${quote.quoted_price.toFixed(2)}
          </div>

          <!-- Action -->
          <a href="${SITE_URL}/admin" class="cta-button">
            VIEW IN ADMIN PANEL
          </a>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>This is an automated notification from ChauffeurTop.</p>
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
      from: 'ChauffeurTop Admin <notifications@chauffeurtop.com.au>',
      to: ['bookings@chauffeurtop.com.au'], // Updated to correct admin email
      subject: `New Booking: ${quote.name} - ${new Date(quote.date).toLocaleDateString('en-AU')}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send admin notification email');
  }
}
