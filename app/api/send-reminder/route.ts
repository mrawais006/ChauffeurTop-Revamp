import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: Request) {
  try {
    const { booking, customMessage } = await request.json();

    if (!booking) {
      return NextResponse.json({ error: 'Booking data is required' }, { status: 400 });
    }

    const results = {
      emailSent: false,
      smsSent: false,
      errors: [] as string[],
    };

    // Format pickup time nicely
    let pickupTime = 'TBD';
    if (booking.melbourne_datetime) {
      pickupTime = new Date(booking.melbourne_datetime).toLocaleString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (booking.date && booking.time) {
      const date = new Date(booking.date).toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      pickupTime = `${date} at ${booking.time}`;
    }

    const defaultMessage = customMessage || `Hi ${booking.name},

This is a friendly reminder about your upcoming chauffeur service with ChauffeurTop.

📅 Pickup Details:
• Date & Time: ${pickupTime}
• Location: ${booking.pickup_location}
• Vehicle: ${booking.vehicle_name || booking.vehicle_type}

Our professional chauffeur will arrive 5-10 minutes before the scheduled pickup time. Please be ready at the pickup location.

If you need to make any changes or have questions, please contact us immediately:
📞 +61 430 240 945
✉️ bookings@chauffeurtop.com.au

We look forward to providing you with an exceptional experience!

Best regards,
ChauffeurTop Melbourne`;

    // Send Email via Resend
    if (RESEND_API_KEY && booking.email) {
      try {
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
              .content { padding: 24px; }
              .details { background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #C5A572; }
              .footer { background: #f9fafb; padding: 16px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Booking Reminder</h1>
              </div>
              <div class="content">
                <p>Dear ${booking.name},</p>
                <p>This is a friendly reminder about your upcoming chauffeur service with ChauffeurTop.</p>
                
                <div class="details">
                  <h3 style="margin-top: 0;">📅 Your Pickup Details</h3>
                  <p><strong>Date & Time:</strong> ${pickupTime}</p>
                  <p><strong>Pickup Location:</strong> ${booking.pickup_location}</p>
                  <p><strong>Vehicle:</strong> ${booking.vehicle_name || booking.vehicle_type}</p>
                  <p><strong>Passengers:</strong> ${booking.passengers}</p>
                </div>
                
                <p>Our professional chauffeur will arrive <strong>5-10 minutes before</strong> your scheduled pickup time. Please ensure you're ready at the pickup location.</p>
                
                <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0;"><strong>Need to make changes?</strong></p>
                  <p style="margin: 8px 0 0 0;">Contact us immediately:</p>
                  <p style="margin: 4px 0 0 0;">📞 <a href="tel:+61430240945" style="color: #C5A572;">+61 430 240 945</a></p>
                  <p style="margin: 4px 0 0 0;">✉️ <a href="mailto:bookings@chauffeurtop.com.au" style="color: #C5A572;">bookings@chauffeurtop.com.au</a></p>
                </div>
                
                <p>We look forward to providing you with an exceptional experience!</p>
                <p>Best regards,<br><strong>ChauffeurTop Melbourne</strong></p>
              </div>
              <div class="footer">
                <p>ChauffeurTop - Premium Chauffeur Services</p>
              </div>
            </div>
          </body>
          </html>
        `;

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
            reply_to: ['bookings@chauffeurtop.com.au'],
            to: [booking.email],
            subject: `⏰ Reminder: Your Booking on ${pickupTime}`,
            html: emailHtml,
          }),
        });

        if (emailResponse.ok) {
          results.emailSent = true;
          console.log('Reminder email sent to:', booking.email);
        } else {
          const errorText = await emailResponse.text();
          results.errors.push(`Email failed: ${errorText}`);
          console.error('Email send failed:', errorText);
        }
      } catch (emailError) {
        results.errors.push(`Email error: ${emailError}`);
        console.error('Email error:', emailError);
      }
    }

    // Send SMS via Twilio
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER && booking.phone) {
      try {
        const smsMessage = `Hi ${booking.name}! Reminder: Your ChauffeurTop booking is on ${pickupTime}. Pickup: ${booking.pickup_location}. Our driver will arrive 5-10 mins early. Questions? Call +61430240945`;

        const params = new URLSearchParams();
        params.append('To', booking.phone);
        params.append('From', TWILIO_PHONE_NUMBER);
        params.append('Body', smsMessage);

        const smsResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
            },
            body: params,
          }
        );

        if (smsResponse.ok) {
          results.smsSent = true;
          console.log('Reminder SMS sent to:', booking.phone);
        } else {
          const errorText = await smsResponse.text();
          results.errors.push(`SMS failed: ${errorText}`);
          console.error('SMS send failed:', errorText);
        }
      } catch (smsError) {
        results.errors.push(`SMS error: ${smsError}`);
        console.error('SMS error:', smsError);
      }
    }

    return NextResponse.json({
      success: results.emailSent || results.smsSent,
      ...results,
    });

  } catch (error) {
    console.error('Error in send-reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
