import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SITE_URL = Deno.env.get('SITE_URL') || 'https://chauffeurtop.com.au';

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
    console.log('Received request for send-quote-response');

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      throw new Error('Server configuration error: Missing email API key');
    }

    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));

    const { quote, priceBreakdown, type } = body;

    if (!quote) {
      throw new Error('Missing quote data in request body');
    }

    if (!quote.email) {
      console.error('Missing customer email in quote data');
      return new Response(
        JSON.stringify({ error: 'Customer email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Preparing to send email to ${quote.email}`);

    // Confirmation token should already be in quote object from frontend
    const confirmationToken = quote.confirmation_token;
    
    if (!confirmationToken) {
      console.error('No confirmation token provided');
      throw new Error('Confirmation token missing');
    }

    // Generate email based on type
    let emailHtml: string;
    if (type === 'booking_received') {
      emailHtml = generateBookingReceivedEmail(quote);
    } else {
      emailHtml = generateQuoteResponseEmail(quote, priceBreakdown, type, confirmationToken);
    }

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
        reply_to: ['bookings@chauffeurtop.com.au'],
        to: [quote.email],
        subject: type === 'booking_received' 
          ? `Quote Request Received - ChauffeurTop`
          : `Your Quote from ChauffeurTop - $${(priceBreakdown?.total || quote.quoted_price || 0).toFixed(2)}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Resend API error:', errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    console.log('Quote email sent successfully to:', quote.email);

    // --- Twilio SMS Integration ---
    try {
      const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
      const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
      const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

      if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER && quote.phone) {
        console.log('Sending SMS via Twilio to:', quote.phone);

        let smsBody = `Hi ${quote.name}, your personalised quote from ChauffeurTop is ready! Please check your email to review the details and confirm your booking.`;
        
        if (type === 'booking_received') {
          smsBody = `Hi ${quote.name}, thanks for choosing ChauffeurTop! We've received your quote request and will send you a personalised quote shortly.`;
        }
        
        // Transform headers for x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('To', quote.phone);
        params.append('From', TWILIO_PHONE_NUMBER);
        params.append('Body', smsBody);

        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${btoa(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN)}`,
            },
            body: params,
          }
        );

        if (!twilioRes.ok) {
          const twilioError = await twilioRes.text();
          console.error('Twilio API Error:', twilioError);
          // We don't throw here to avoid failing the main request if just SMS fails
        } else {
          console.log('SMS sent successfully via Twilio');
        }
      } else {
        console.log('Skipping SMS: Missing credentials or phone number');
      }
    } catch (smsError) {
      console.error('Error sending SMS:', smsError);
    }
    // -----------------------------

    return new Response(JSON.stringify({ 
      success: true,
      emailSent: true,
      smsSent: true // Optimistic
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-quote-response:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Common Styles for Sleek Design
const styles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); padding: 30px 20px; text-align: center; }
  .header h1 { color: #1A1F2C; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
  .content { padding: 40px 30px; }
  .greeting { font-size: 16px; color: #1f2937; margin-bottom: 20px; }
  .intro { font-size: 15px; color: #4b5563; margin-bottom: 25px; line-height: 1.6; }
  
  /* The Main Box */
  .details-container { border: 1px solid #C5A572; border-radius: 8px; padding: 25px; margin: 25px 0; background-color: #ffffff; }
  .details-title { color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 700; }
  
  .info-line { margin: 8px 0; color: #4b5563; font-size: 15px; }
  .info-label { font-weight: 600; color: #1f2937; }
  
  /* Inner Boxes */
  .journey-box { background-color: #fdfbf7; border: 1px solid #e7e5e4; border-radius: 6px; padding: 20px; margin-top: 20px; }
  .journey-header { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0; font-size: 16px; }
  .journey-detail { margin: 6px 0; font-size: 14px; color: #4b5563; }
  .journey-label { font-weight: 600; color: #1f2937; min-width: 80px; display: inline-block; }
  
  .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); color: #1A1F2C; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; margin: 20px 0; text-align: center; box-shadow: 0 4px 6px rgba(197, 165, 114, 0.3); }
`;

function generateBookingReceivedEmail(quote: any): string {
  const formattedDate = new Date(quote.date).toLocaleDateString('en-AU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Parse destinations logic for return trip to display correctly
  let isReturnTrip = false;
  let returnData: any = null;
  let destinationsList = quote.destinations;

  if (quote.destinations && typeof quote.destinations === 'object' && !Array.isArray(quote.destinations) && quote.destinations.type === 'return_trip') {
    isReturnTrip = true;
    returnData = quote.destinations.return;
    destinationsList = quote.destinations.outbound.destinations;
  } else if (Array.isArray(quote.destinations)) {
    destinationsList = quote.destinations;
  }

  const destinationStr = Array.isArray(destinationsList) ? destinationsList.join(', ') : (destinationsList || 'As Instructed');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quote Request Received - ChauffeurTop</h1>
          </div>
          <div class="content">
            <p class="greeting">Dear ${quote.name},</p>
            <p class="intro">
              Thank you for choosing ChauffeurTop. We have received your quote request and our team is reviewing your details. You will receive a personalised quote from us shortly.
            </p>
            
            <div class="details-container">
              <h2 class="details-title">Your Request Details:</h2>
              
              <p class="info-line"><span class="info-label">Date:</span> ${formattedDate}</p>
              <p class="info-line"><span class="info-label">Time:</span> ${quote.time} Melbourne local time (AEST/AEDT)</p>
              <p class="info-line"><span class="info-label">Pickup:</span> ${quote.pickup_location}</p>
              
              <!-- Outbound Journey Box -->
              <div class="journey-box">
                <div class="journey-header">
                  <span>🚗</span> Outbound Journey
                </div>
                <div class="journey-detail"><span class="journey-label">Destination:</span> ${destinationStr}</div>
                <div class="journey-detail"><span class="journey-label">Date:</span> ${formattedDate}</div>
                <div class="journey-detail"><span class="journey-label">Time:</span> ${quote.time}</div>
              </div>

              ${isReturnTrip && returnData ? `
              <!-- Return Journey Box -->
              <div class="journey-box">
                <div class="journey-header">
                  <span>🔄</span> Return Journey
                </div>
                <div class="journey-detail"><span class="journey-label">Pickup:</span> ${returnData.pickup}</div>
                <div class="journey-detail"><span class="journey-label">Destination:</span> ${returnData.destination}</div>
                <div class="journey-detail"><span class="journey-label">Date:</span> ${new Date(returnData.date).toLocaleDateString('en-AU')}</div>
                <div class="journey-detail"><span class="journey-label">Time:</span> ${returnData.time}</div>
              </div>
              ` : ''}

              <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                  <p class="info-line"><span class="info-label">Vehicle:</span> ${quote.vehicle_name || quote.vehicle_type}</p>
                  <p class="info-line"><span class="info-label">Passengers:</span> ${quote.passengers}</p>
                  <p class="info-line"><span class="info-label">Service Area:</span> ${quote.city || 'Melbourne'}</p>
              </div>
              
            </div>

            <p style="text-align: center; color: #6b7280; font-size: 14px;">
              We will review your request and send you a personalised quote with a confirmation link shortly.
            </p>

          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateQuoteResponseEmail(quote: any, priceBreakdown: any, type: string, confirmationToken: string): string {
  // Link to the confirmation PAGE (not API) - prevents email scanner auto-confirmation
  const confirmationLink = `${SITE_URL}/confirm-booking/${confirmationToken}`;
  const formattedDate = new Date(quote.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const totalAmount = priceBreakdown?.total || quote.quoted_price || 0;

   // Parse destinations logic
  let isReturnTrip = false;
  let returnData: any = null;
  let destinationsList = quote.destinations;

  if (quote.destinations && typeof quote.destinations === 'object' && !Array.isArray(quote.destinations) && quote.destinations.type === 'return_trip') {
    isReturnTrip = true;
    returnData = quote.destinations.return;
    destinationsList = quote.destinations.outbound.destinations;
  } else if (Array.isArray(quote.destinations)) {
    destinationsList = quote.destinations;
  }
  const destinationStr = Array.isArray(destinationsList) ? destinationsList.join(', ') : (destinationsList || 'As Instructed');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Quote is Ready!</h1>
          </div>
          <div class="content">
            <p class="greeting">Dear ${quote.name},</p>
            <p class="intro">
              Thank you for choosing ChauffeurTop. We have prepared your personalised quote below. If you're happy with the price, simply click the button to confirm your booking.
            </p>

             <div class="details-container">
              <h2 class="details-title">Your Quote Details:</h2>
              
              <div style="text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
                <span style="font-size: 14px; color: #92400e; text-transform: uppercase; font-weight: bold;">Quoted Price</span>
                <div style="font-size: 32px; font-weight: 800; color: #b45309;">$${totalAmount.toFixed(2)}</div>
              </div>

              <p class="info-line"><span class="info-label">Date:</span> ${formattedDate}</p>
              <p class="info-line"><span class="info-label">Time:</span> ${quote.time}</p>
              
               <!-- Outbound Journey Box -->
              <div class="journey-box">
                <div class="journey-header"><span>🚗</span> Outbound Journey</div>
                <div class="journey-detail"><span class="journey-label">Pickup:</span> ${quote.pickup_location}</div>
                <div class="journey-detail"><span class="journey-label">Destination:</span> ${destinationStr}</div>
              </div>

              ${isReturnTrip && returnData ? `
              <!-- Return Journey Box -->
              <div class="journey-box">
                <div class="journey-header"><span>🔄</span> Return Journey</div>
                <div class="journey-detail"><span class="journey-label">Pickup:</span> ${returnData.pickup}</div>
                <div class="journey-detail"><span class="journey-label">Destination:</span> ${returnData.destination}</div>
                <div class="journey-detail"><span class="journey-label">Date:</span> ${new Date(returnData.date).toLocaleDateString('en-AU')}</div>
                <div class="journey-detail"><span class="journey-label">Time:</span> ${returnData.time}</div>
              </div>
              ` : ''}
              
              <div style="margin-top: 20px;">
                 <p class="info-line"><span class="info-label">Vehicle:</span> ${quote.vehicle_name || quote.vehicle_type}</p>
                 <p class="info-line"><span class="info-label">Passengers:</span> ${quote.passengers}</p>
              </div>

            </div>

            <div style="text-align: center;">
              <a href="${confirmationLink}" class="cta-button">✓ Confirm Booking Now</a>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 20px;">
               Need to discuss? <a href="mailto:bookings@chauffeurtop.com.au" style="color: #C5A572;">Contact Us</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
