import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:3000';

serve(async (req: Request) => {
  try {
    const { quote, type } = await req.json();

    if (type === 'customer') {
      // Send confirmation email to customer
      await sendCustomerConfirmation(quote);
    } else if (type === 'admin') {
      // Send notification to admin
      await sendAdminNotification(quote);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-confirmation-email:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function sendCustomerConfirmation(quote: any) {
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
              ✉️ Email: <a href="mailto:bookings@chauffertop.com.au" style="color: #3b82f6; text-decoration: none; font-weight: 600;">bookings@chauffertop.com.au</a>
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
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ChauffeurTop <bookings@chauffertop.com.au>',
      to: [quote.email],
      subject: `✅ Booking Confirmed - ${new Date(quote.date).toLocaleDateString('en-AU')}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send customer confirmation email');
  }
}

async function sendAdminNotification(quote: any) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
        <h1 style="color: #1f2937; margin: 0 0 20px 0;">🎉 New Booking Confirmed!</h1>
        
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin: 0 0 15px 0; color: #1e40af;">Customer Details</h2>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Name:</strong> ${quote.name}</p>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Email:</strong> ${quote.email}</p>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Phone:</strong> ${quote.phone}</p>
        </div>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin: 0 0 15px 0; color: #166534;">Trip Details</h2>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Date:</strong> ${new Date(quote.date).toLocaleDateString('en-AU')}</p>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Time:</strong> ${quote.time}</p>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Pickup:</strong> ${quote.pickup_location}</p>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Dropoff:</strong> ${quote.dropoff_location}</p>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Vehicle:</strong> ${quote.vehicle_name}</p>
          <p style="margin: 5px 0; color: #1f2937;"><strong>Passengers:</strong> ${quote.passengers}</p>
          <p style="margin: 15px 0 0 0; color: #d97706; font-size: 20px;"><strong>Amount:</strong> $${quote.quoted_price.toFixed(2)}</p>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>Booking ID:</strong> ${quote.id}</p>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          <a href="${SITE_URL}/admin" style="color: #3b82f6; text-decoration: none;">View in Admin Panel →</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ChauffeurTop System <system@chauffertop.com.au>',
      to: ['admin@chauffertop.com.au'], // Replace with actual admin email
      subject: `🎉 New Booking: ${quote.name} - ${new Date(quote.date).toLocaleDateString('en-AU')}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send admin notification email');
  }
}
