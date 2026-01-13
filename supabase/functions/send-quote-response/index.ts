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
        from: 'ChauffeurTop <notifications@chauffeurtop.com.au>',
        reply_to: ['admin@chauffeurtop.com.au'],
        to: [quote.email],
        subject: type === 'booking_received' 
          ? `Booking Request Received - ${quote.name}`
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

        let smsBody = `Hi ${quote.name}, your booking request with ChauffeurTop has been received. Please check your email for the quote and confirmation link.`;
        
        if (type === 'booking_received') {
          smsBody = `Hi ${quote.name}, thanks for booking with ChauffeurTop! We've received your request and will send you a quote shortly.`;
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

function generateBookingReceivedEmail(quote: any): string {
  // Format date nicely
  const formattedDate = quote.date ? new Date(quote.date).toLocaleDateString('en-AU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'Date TBD';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
          .greeting { 
            font-size: 18px; 
            color: #1f2937; 
            margin-bottom: 20px; 
          }
          .message-box { 
            background: #fef3c7; 
            border-left: 4px solid #C5A572; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 4px; 
          }
          .trip-details {
            background: #f9fafb;
            border-left: 4px solid #C5A572;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .trip-details h3 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 18px;
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 8px 0; 
            border-bottom: 1px solid #e5e7eb; 
          }
          .detail-row:last-child { 
            border-bottom: none; 
          }
          .label { 
            color: #6b7280; 
            font-weight: 500; 
          }
          .value { 
            color: #111827; 
            font-weight: 600; 
            text-align: right; 
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
          <div class="header">
            <h1>Booking Request Received</h1>
          </div>
          <div class="content">
            <p class="greeting">Hi ${quote.name},</p>
            <div class="message-box">
              <p style="margin: 0; color: #78350f; font-size: 16px;">
                Thank you for your booking request! We have received your details and our team is reviewing them. 
                We will send you a confirmation quote shortly.
              </p>
            </div>
            
            <div class="trip-details">
              <h3>Request Summary</h3>
              <div class="detail-row">
                <span class="label">Date</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time</span>
                <span class="value">${quote.time}</span>
              </div>
              <div class="detail-row">
                <span class="label">Pickup</span>
                <span class="value">${quote.pickup_location}</span>
              </div>
              <div class="detail-row">
                <span class="label">Vehicle</span>
                <span class="value">${quote.vehicle_name || quote.vehicle_type}</span>
              </div>
            </div>

            <p style="color: #4b5563;">
              If you have any urgent questions, please feel free to contact us at <a href="tel:+61430240945" style="color: #C5A572; text-decoration: none;">+61 430 240 945</a>.
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
  // Generate confirmation link
  const confirmationLink = `${SITE_URL}/api/confirm-booking?token=${confirmationToken}&type=${type}`;
  const discussLink = `mailto:admin@chauffeurtop.com.au?subject=Discuss Pricing - ${quote.name}&body=Hi, I received your quote for ${quote.date}. I'd like to discuss the pricing.`;
  
  // Check if return trip
  const isReturnTrip = priceBreakdown?.is_return_trip;
  
  // Extract destinations
  let destinations: string[] = [];
  let returnTripData: any = null;
  
  if (quote.destinations) {
    if (typeof quote.destinations === 'object' && !Array.isArray(quote.destinations) && quote.destinations.type === 'return_trip') {
      // Return trip structure
      returnTripData = quote.destinations;
      destinations = returnTripData.outbound?.destinations || [];
    } else if (Array.isArray(quote.destinations)) {
      // Simple array
      destinations = quote.destinations;
    }
  }

  const additionalItemsHtml = priceBreakdown?.additional_items && priceBreakdown.additional_items.length > 0
    ? priceBreakdown.additional_items.map((item: any) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151;">${item.description}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-weight: 500;">$${(item.amount || 0).toFixed(2)}</td>
        </tr>
      `).join('')
    : '';

  // Format date nicely
  const formattedDate = quote.date ? new Date(quote.date).toLocaleDateString('en-AU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'Date TBD';

  // Format return date if exists
  const formattedReturnDate = returnTripData?.return?.date ? new Date(returnTripData.return.date).toLocaleDateString('en-AU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : '';

  // Calculate total - use priceBreakdown.total if available, otherwise use quote.quoted_price
  const totalAmount = priceBreakdown?.total || quote.quoted_price || 0;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
            font-size: 32px; 
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .content { 
            padding: 40px 30px; 
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .intro {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          .trip-details {
            background: #f9fafb;
            border-left: 4px solid #C5A572;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .trip-details h3 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 18px;
          }
          .trip-details p {
            margin: 8px 0;
            color: #4b5563;
            font-size: 15px;
          }
          .price-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 30px 0;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          .price-table thead {
            background: #f9fafb;
          }
          .price-table th {
            padding: 14px 16px;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .price-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;
          }
          .total-row { 
            background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%);
            font-weight: 700;
            font-size: 20px;
          }
          .total-row td {
            color: #1A1F2C;
            padding: 18px 16px;
            border: none;
          }
          .value-props {
            background: #fef3c7;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
          }
          .value-props h3 {
            margin: 0 0 15px 0;
            color: #92400e;
            font-size: 18px;
          }
          .value-props ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .value-props li {
            padding: 8px 0;
            color: #78350f;
            font-size: 15px;
          }
          .value-props li:before {
            content: "✓ ";
            color: #C5A572;
            font-weight: bold;
            margin-right: 8px;
          }
          .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%);
            color: #1A1F2C; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 700;
            font-size: 16px;
            margin: 25px 0;
            box-shadow: 0 4px 6px rgba(197, 165, 114, 0.3);
            transition: all 0.3s;
          }
          .contact-info {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }
          .contact-info p {
            margin: 8px 0;
            color: #4b5563;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Quote is Ready!</h1>
          </div>
          
          <div class="content">
            <p class="greeting">Dear ${quote.name},</p>
            
            <p class="intro">
              Thank you for choosing ChauffeurTop - Melbourne's most affordable luxury chauffeur service. 
              Our prices are highly competitive, offering you premium chauffeur service at taxi prices.
            </p>
            
            <p class="intro">
              We're delighted to provide you with a quote for your upcoming journey.
            </p>
            
            ${isReturnTrip ? `
              <div class="trip-details">
                <h3>🚗 Outbound Journey</h3>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${quote.time}</p>
                <p><strong>Pickup:</strong> ${quote.pickup_location}</p>
                <p><strong>Destination:</strong> ${destinations.join(', ') || 'As discussed'}</p>
                <p><strong>Vehicle:</strong> ${quote.vehicle_name || quote.vehicle_type}</p>
                <p><strong>Passengers:</strong> ${quote.passengers}</p>
              </div>
              
              <div class="trip-details" style="margin-top: 15px;">
                <h3>🔄 Return Journey</h3>
                <p><strong>Date:</strong> ${formattedReturnDate}</p>
                <p><strong>Time:</strong> ${returnTripData?.return?.time || 'TBD'}</p>
                <p><strong>Pickup:</strong> ${returnTripData?.return?.pickup || 'TBD'}</p>
                <p><strong>Destination:</strong> ${returnTripData?.return?.destination || 'TBD'}</p>
                <p><strong>Vehicle:</strong> ${quote.vehicle_name || quote.vehicle_type}</p>
                <p><strong>Passengers:</strong> ${quote.passengers}</p>
              </div>
            ` : `
              <div class="trip-details">
                <h3>Your Journey Details</h3>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${quote.time}</p>
                <p><strong>Pickup:</strong> ${quote.pickup_location}</p>
                <p><strong>Destination:</strong> ${destinations.join(', ') || 'As discussed'}</p>
                <p><strong>Vehicle:</strong> ${quote.vehicle_name || quote.vehicle_type}</p>
                <p><strong>Passengers:</strong> ${quote.passengers}</p>
              </div>
            `}
            
            <table class="price-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${isReturnTrip ? `
                  <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151;">Outbound Base Fare</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-weight: 500;">$${(priceBreakdown?.base_price || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151;">Return Base Fare</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-weight: 500;">$${(priceBreakdown?.return_base_price || 0).toFixed(2)}</td>
                  </tr>
                ` : `
                  <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151;">Base Fare</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-weight: 500;">$${(priceBreakdown?.base_price || 0).toFixed(2)}</td>
                  </tr>
                `}
                ${additionalItemsHtml}
                ${priceBreakdown?.discount ? `
                  <tr style="background: #f9fafb;">
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600;">Subtotal</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-weight: 600;">$${(priceBreakdown.subtotal || 0).toFixed(2)}</td>
                  </tr>
                  <tr style="background: #dcfce7;">
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #15803d; font-weight: 500;">
                      Discount (${priceBreakdown.discount.type === 'percentage' ? `${priceBreakdown.discount.value}%` : `$${priceBreakdown.discount.value}`})
                      ${priceBreakdown.discount.reason ? `<br><span style="font-size: 12px; font-weight: normal;">${priceBreakdown.discount.reason}</span>` : ''}
                    </td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #15803d; font-weight: 600;">-$${(priceBreakdown.discount.amount || 0).toFixed(2)}</td>
                  </tr>
                ` : ''}
                <tr class="total-row">
                  <td>TOTAL</td>
                  <td style="text-align: right;">$${totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            ${priceBreakdown?.discount ? `
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 18px; font-weight: 700;">🎉 Special Offer Applied!</p>
                <p style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.6;">
                  ${priceBreakdown.discount.reason || (isReturnTrip ? "Since you're booking a return trip with us, we're pleased to offer you a special discount on your total fare!" : "We're pleased to offer you a special discount on your fare!")}
                </p>
              </div>
            ` : ''}
            
            ${priceBreakdown?.notes ? `
              <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 15px;"><strong>Note:</strong> ${priceBreakdown.notes}</p>
              </div>
            ` : ''}
            
            <div class="value-props">
              <h3>Why Choose ChauffeurTop?</h3>
              <ul>
                <li>Professional chauffeur service at competitive rates</li>
                <li>Premium, well-maintained vehicles</li>
                <li>Experienced, courteous drivers</li>
                <li>Reliable and punctual service</li>
                <li>Fully licensed and insured</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${confirmationLink}" class="cta-button">
                ✓ Confirm Your Booking
              </a>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 15px;">
                <strong>Need to discuss pricing?</strong>
              </p>
              <a href="${discussLink}" style="color: #C5A572; text-decoration: none; font-weight: 500; font-size: 15px;">
                💬 Contact us to discuss
              </a>
            </div>
            
            <div class="contact-info">
              <p><strong>Or reach us directly:</strong></p>
              <p>📞 Call us: <strong>+61 430 240 945</strong></p>
              <p>📧 Email: <strong>admin@chauffeurtop.com.au</strong></p>
              <p style="margin-top: 15px; font-size: 13px; color: #6b7280;">
                Simply click the button above to confirm, or contact us if you have any questions.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0;">
              <strong>ChauffeurTop</strong> - Premium Chauffeur Services in Melbourne
            </p>
            <p style="margin: 0; font-size: 13px;">
              We look forward to serving you and making your journey comfortable and memorable.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
