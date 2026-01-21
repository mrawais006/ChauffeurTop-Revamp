import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// IMPORTANT: Admin receives at different email than FROM to avoid Resend suppression
const ADMIN_EMAIL = 'admin@chauffeurtop.com.au';

export async function POST(request: Request) {
  try {
    const { quote, type } = await request.json();

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    if (!quote) {
      return NextResponse.json({ error: 'Quote data is required' }, { status: 400 });
    }

    // Format date nicely
    const formattedDate = quote.date 
      ? new Date(quote.date).toLocaleDateString('en-AU', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'TBD';

    // Format destinations
    let destinationText = 'As instructed';
    if (Array.isArray(quote.destinations) && quote.destinations.length > 0) {
      destinationText = quote.destinations.join(' → ');
    } else if (quote.dropoff_location) {
      destinationText = quote.dropoff_location;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); padding: 24px; text-align: center; }
          .header h1 { color: #1A1F2C; margin: 0; font-size: 24px; }
          .badge { display: inline-block; background: #1f2937; color: #C5A572; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 8px; }
          .content { padding: 24px; }
          .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .card h3 { margin: 0 0 12px 0; color: #1f2937; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .info-row:last-child { border-bottom: none; }
          .label { color: #6b7280; font-size: 14px; }
          .value { color: #1f2937; font-weight: 600; font-size: 14px; }
          .cta { display: block; background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); color: #1A1F2C; text-decoration: none; padding: 14px 24px; border-radius: 6px; font-weight: 700; text-align: center; margin: 24px 0; }
          .footer { background: #f9fafb; padding: 16px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Quote Request</h1>
            <span class="badge">ACTION REQUIRED</span>
          </div>
          
          <div class="content">
            <div class="card">
              <h3>👤 Customer Details</h3>
              <div class="info-row">
                <span class="label">Name</span>
                <span class="value">${quote.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email</span>
                <span class="value">${quote.email || 'Not provided'}</span>
              </div>
              <div class="info-row">
                <span class="label">Phone</span>
                <span class="value">${quote.phone}</span>
              </div>
            </div>
            
            <div class="card">
              <h3>🚗 Trip Details</h3>
              <div class="info-row">
                <span class="label">Service Type</span>
                <span class="value">${quote.service_type || 'Standard'}</span>
              </div>
              <div class="info-row">
                <span class="label">Vehicle</span>
                <span class="value">${quote.vehicle_name || quote.vehicle_type}</span>
              </div>
              <div class="info-row">
                <span class="label">Passengers</span>
                <span class="value">${quote.passengers}</span>
              </div>
              <div class="info-row">
                <span class="label">Date</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="info-row">
                <span class="label">Time</span>
                <span class="value">${quote.time || 'TBD'}</span>
              </div>
            </div>
            
            <div class="card">
              <h3>📍 Locations</h3>
              <div class="info-row">
                <span class="label">Pickup</span>
                <span class="value">${quote.pickup_location}</span>
              </div>
              <div class="info-row">
                <span class="label">Destination</span>
                <span class="value">${destinationText}</span>
              </div>
            </div>

            ${quote.driver_instructions ? `
            <div class="card" style="background: #fef3c7; border-color: #fcd34d;">
              <h3>📝 Special Instructions</h3>
              <p style="margin: 0; color: #92400e;">${quote.driver_instructions}</p>
            </div>
            ` : ''}
            
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://chauffeurtop.com.au'}/admin" class="cta">
              View in Admin Dashboard →
            </a>
          </div>
          
          <div class="footer">
            <p>ChauffeurTop Admin Notification System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
        to: [ADMIN_EMAIL],
        reply_to: ['bookings@chauffeurtop.com.au'],
        subject: `🔔 New Quote: ${quote.name} - ${formattedDate}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', errorText);
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    console.log('Admin notification sent successfully for quote:', quote.id);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error sending admin notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
