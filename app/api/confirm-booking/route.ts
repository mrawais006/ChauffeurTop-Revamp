import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chauffeurtop.com.au';
const ADMIN_EMAIL = 'admin@chauffeurtop.com.au';

// Parse return trip data from destinations field
function parseReturnTrip(destinations: any): { isReturnTrip: boolean; returnData: any; destinationStr: string } {
    let isReturnTrip = false;
    let returnData: any = null;
    let destinationsList = destinations;

    if (destinations && typeof destinations === 'object' && !Array.isArray(destinations) && destinations.type === 'return_trip') {
        isReturnTrip = true;
        returnData = destinations.return;
        destinationsList = destinations.outbound?.destinations;
    } else if (Array.isArray(destinations)) {
        destinationsList = destinations;
    }

    const destinationStr = Array.isArray(destinationsList) ? destinationsList.join(', ') : (destinationsList || 'As instructed');
    return { isReturnTrip, returnData, destinationStr };
}

// Direct Resend API call for customer confirmation email
async function sendCustomerConfirmationDirect(quote: any): Promise<boolean> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.error('[Customer Confirmation] Missing RESEND_API_KEY');
        return false;
    }

    if (!quote.email) {
        console.error('[Customer Confirmation] No customer email address');
        return false;
    }

    const { isReturnTrip, returnData, destinationStr } = parseReturnTrip(quote.destinations);
    const formattedDate = new Date(quote.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Booking Confirmed</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #C5A572; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { color: #9CA3AF; margin: 6px 0 0 0; font-size: 13px; }
        .gold-bar { height: 3px; background: linear-gradient(90deg, transparent, #C5A572, transparent); }
        .content { padding: 40px 30px; }
        .details { border: 1px solid #C5A572; border-radius: 8px; padding: 25px; margin: 25px 0; }
        .details h2 { color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 700; }
        .info { margin: 8px 0; color: #4b5563; font-size: 15px; }
        .info strong { color: #1f2937; font-weight: 600; }
        .divider { margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; }
        .price { font-size: 20px; font-weight: 800; color: #C5A572; }
        .journey-box { background-color: #fdfbf7; border: 1px solid #e7e5e4; border-radius: 6px; padding: 16px; margin-top: 16px; }
        .journey-header { font-weight: 700; color: #1f2937; margin: 0 0 12px 0; font-size: 15px; }
        .journey-detail { margin: 4px 0; font-size: 14px; color: #4b5563; }
        .journey-label { font-weight: 600; color: #1f2937; min-width: 80px; display: inline-block; }
        .footer { background: #1A1F2C; padding: 30px; text-align: center; color: #9CA3AF; font-size: 12px; }
        .footer a { color: #C5A572; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed</h1>
          <p>Your chauffeur experience is secured</p>
        </div>
        <div class="gold-bar"></div>

        <div class="content">
          <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Dear ${quote.name},</p>

          <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
            Excellent choice — your booking is confirmed. Our team is now preparing to deliver a premium chauffeur experience for you.
          </p>

          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); border-radius: 8px; margin-bottom: 25px;">
            <p style="margin: 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">Booking Reference</p>
            <p style="margin: 6px 0 0 0; color: #C5A572; font-size: 24px; font-weight: 800; letter-spacing: 1px;">#${quote.id.substring(0, 8).toUpperCase()}</p>
          </div>

          <div class="details">
            <h2>Your Trip Details</h2>

            <div class="journey-box">
              <div class="journey-header">${isReturnTrip ? '🚗 Outbound Journey' : '🚗 Your Journey'}</div>
              <p class="journey-detail"><span class="journey-label">Date:</span> ${formattedDate}</p>
              <p class="journey-detail"><span class="journey-label">Time:</span> ${quote.time}</p>
              <p class="journey-detail"><span class="journey-label">Pickup:</span> ${quote.pickup_location}</p>
              <p class="journey-detail"><span class="journey-label">Destination:</span> ${destinationStr}</p>
            </div>

            ${isReturnTrip && returnData ? `
            <div class="journey-box">
              <div class="journey-header">🔄 Return Journey</div>
              <p class="journey-detail"><span class="journey-label">Date:</span> ${returnData.date ? new Date(returnData.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : formattedDate}</p>
              <p class="journey-detail"><span class="journey-label">Time:</span> ${returnData.time || 'TBC'}</p>
              <p class="journey-detail"><span class="journey-label">Pickup:</span> ${returnData.pickup || destinationStr}</p>
              <p class="journey-detail"><span class="journey-label">Destination:</span> ${returnData.destination || quote.pickup_location}</p>
            </div>
            ` : ''}

            <div class="divider">
               <p class="info"><strong>Vehicle:</strong> ${quote.vehicle_name || quote.vehicle_type}</p>
               <p class="info"><strong>Passengers:</strong> ${quote.passengers}</p>
            </div>

            <div class="divider" style="display: flex; justify-content: space-between; align-items: center;">
               <strong style="font-size: 16px;">Total Payable</strong>
               <span class="price">$${(quote.quoted_price || 0).toFixed(2)}</span>
            </div>
          </div>

          <!-- Your Experience Includes -->
          <div style="background: linear-gradient(135deg, #fdfbf7 0%, #fef9f0 100%); border: 1px solid #C5A572; border-radius: 8px; padding: 25px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; color: #1A1F2C;">Your Chauffeur Experience Includes</h3>
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✅</span><span>Luxury ${quote.vehicle_name || 'vehicle'} — premium leather interior</span></div>
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✅</span><span>Professional, suited chauffeur — background-checked and fully licensed</span></div>
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✅</span><span>Door-to-door service with complimentary wait time</span></div>
            <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✅</span><span>Fixed pricing — the quoted price is final, no hidden fees</span></div>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; font-weight: 700;">What Happens Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;">Our team will be in touch to finalise payment and any remaining details</li>
              <li style="margin-bottom: 8px;">We'll contact you 24 hours before your pickup to reconfirm</li>
              <li style="margin-bottom: 8px;">Your chauffeur will arrive 10 minutes before the scheduled time</li>
              <li style="margin-bottom: 8px;">You'll receive a reminder SMS on the day of your trip</li>
            </ul>
          </div>

          <!-- Referral -->
          <div style="text-align: center; padding: 18px; background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">Love ChauffeurTop? Share with a friend!</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #a16207;">They'll receive 10% off their first ride.</p>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Need to make changes?</p>
            <p style="margin: 0;"><a href="tel:+61430240945" style="color: #C5A572; text-decoration: none; font-weight: 600;">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au" style="color: #C5A572; text-decoration: none; font-weight: 600;">bookings@chauffeurtop.com.au</a></p>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
                to: [quote.email],
                reply_to: ['bookings@chauffeurtop.com.au'],
                subject: `✅ Booking Confirmed - ${new Date(quote.date).toLocaleDateString('en-AU')}`,
                html: emailHtml,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Customer Confirmation] Resend API error:', response.status, errorText);
            return false;
        }

        console.log('[Customer Confirmation] ✅ Email sent successfully to:', quote.email);
        return true;
    } catch (error) {
        console.error('[Customer Confirmation] Direct send failed:', error);
        return false;
    }
}

// Direct Resend API call for admin notification
async function sendAdminNotificationDirect(quote: any): Promise<boolean> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.error('[Admin Notification] Missing RESEND_API_KEY');
        return false;
    }

    const { isReturnTrip, returnData, destinationStr } = parseReturnTrip(quote.destinations);

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Booking Confirmed</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #1A1F2C; margin: 0; font-size: 22px; font-weight: 700; }
        .content { padding: 30px; }
        .ref { background: #1f2937; color: #C5A572; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block; margin-bottom: 20px; }
        .section { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0; }
        .section h3 { margin: 0 0 15px 0; font-size: 16px; color: #111827; }
        .info { margin: 8px 0; color: #4b5563; font-size: 14px; }
        .info strong { color: #1f2937; }
        .price { font-size: 24px; font-weight: 800; color: #C5A572; text-align: center; margin: 15px 0; }
        .cta { display: inline-block; background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); color: #1A1F2C; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 14px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isReturnTrip ? '🔔 Return Booking Confirmed!' : '🔔 Booking Confirmed!'}</h1>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <span class="ref">REF: #${quote.id.substring(0, 8).toUpperCase()}</span>
          </div>

          <div class="section" style="background: #fdfbf7;">
            <h3>👤 Customer Details</h3>
            <p class="info"><strong>Name:</strong> ${quote.name}</p>
            <p class="info"><strong>Email:</strong> <a href="mailto:${quote.email}">${quote.email}</a></p>
            <p class="info"><strong>Phone:</strong> <a href="tel:${quote.phone}">${quote.phone}</a></p>
          </div>

          <div class="section">
            <h3>🚗 ${isReturnTrip ? 'Outbound Trip' : 'Trip Information'}</h3>
            <p class="info"><strong>Date:</strong> ${new Date(quote.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p class="info"><strong>Time:</strong> ${quote.time}</p>
            <p class="info"><strong>Pickup:</strong> ${quote.pickup_location}</p>
            <p class="info"><strong>Dropoff:</strong> ${destinationStr}</p>
            <p class="info"><strong>Vehicle:</strong> ${quote.vehicle_name || quote.vehicle_type}</p>
            <p class="info"><strong>Passengers:</strong> ${quote.passengers}</p>
          </div>

          ${isReturnTrip && returnData ? `
          <div class="section" style="background: #f0f9ff;">
            <h3>🔄 Return Trip</h3>
            <p class="info"><strong>Date:</strong> ${returnData.date ? new Date(returnData.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Same day'}</p>
            <p class="info"><strong>Time:</strong> ${returnData.time || 'TBC'}</p>
            <p class="info"><strong>Pickup:</strong> ${returnData.pickup || destinationStr}</p>
            <p class="info"><strong>Dropoff:</strong> ${returnData.destination || quote.pickup_location}</p>
          </div>
          ` : ''}

          <div class="price">$${(quote.quoted_price || 0).toFixed(2)}</div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="${SITE_URL}/admin" class="cta">VIEW IN ADMIN PANEL</a>
          </div>
        </div>
        <div class="footer">
          <p>Automated Booking Confirmation Notification</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
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
                subject: `🔔 Booking Confirmed: ${quote.name} - ${new Date(quote.date).toLocaleDateString('en-AU')}`,
                html: emailHtml,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Admin Notification] Resend API error:', response.status, errorText);
            return false;
        }

        console.log('[Admin Notification] ✅ Email sent successfully via direct Resend API');
        return true;
    } catch (error) {
        console.error('[Admin Notification] Direct send failed:', error);
        return false;
    }
}

// ============================================================
// GET handler: SAFE for email scanners - only redirects to page
// Email scanners can hit this all day and nothing will be confirmed
// ============================================================
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(
            new URL('/confirm-booking/error?reason=missing_token', request.url)
        );
    }

    // Simply redirect to the confirmation page - NO state changes here
    // The page will show booking details and a "Confirm" button (POST)
    return NextResponse.redirect(
        new URL(`/confirm-booking/${token}`, request.url)
    );
}

// ============================================================
// POST handler: Actually confirms the booking
// Only triggered by explicit user action (button click on the page)
// Email scanners NEVER send POST requests
// ============================================================
export async function POST(request: NextRequest) {
    if (!supabaseAdmin) {
        console.error('[Confirm Booking] Internal Error: SUPABASE_SERVICE_ROLE_KEY is missing');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const supabase = supabaseAdmin;

    try {
        const body = await request.json();
        const token = body.token;

        if (!token) {
            return NextResponse.json(
                { error: 'Missing confirmation token' },
                { status: 400 }
            );
        }

        // Find the quote with this confirmation token
        const { data: quote, error: fetchError } = await supabase
            .from('quotes')
            .select('*')
            .eq('confirmation_token', token)
            .single();

        if (fetchError || !quote) {
            console.error('[Confirm Booking] Quote not found:', fetchError);
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Check if booking is already confirmed
        if (quote.status === 'confirmed' || quote.status === 'completed') {
            console.log('[Confirm Booking] Booking already confirmed:', quote.id);
            return NextResponse.json(
                { success: true, already_confirmed: true },
                { status: 200 }
            );
        }

        // Update quote status to confirmed
        const { error: updateError } = await supabase
            .from('quotes')
            .update({
                status: 'confirmed',
                quote_accepted_at: new Date().toISOString(),
            })
            .eq('id', quote.id);

        if (updateError) {
            console.error('[Confirm Booking] Update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to confirm booking' },
                { status: 500 }
            );
        }

        // Log the confirmation activity (fire-and-forget)
        Promise.resolve(supabase.from('quote_activities').insert({
            quote_id: quote.id,
            action_type: 'customer_confirmed',
            details: {
                confirmed_at: new Date().toISOString(),
                confirmed_price: quote.quoted_price,
                confirmation_method: 'email_link_post'
            }
        })).then(() => console.log('[Confirm Booking] Activity logged'))
          .catch(e => console.error('[Confirm Booking] Activity log error:', e));

        // Send customer and admin emails (awaited to prevent Vercel from killing the function)
        const [customerEmailSent, adminEmailSent] = await Promise.all([
            sendCustomerConfirmationDirect(quote).catch(e => {
                console.error('[Confirm Booking] Customer email error:', e);
                return false;
            }),
            sendAdminNotificationDirect(quote).catch(e => {
                console.error('[Confirm Booking] Admin email error:', e);
                return false;
            }),
        ]);

        // Fallback to edge functions if direct send failed
        if (!customerEmailSent) {
            console.log('[Confirm Booking] Trying Edge Function fallback for customer email...');
            await supabase.functions.invoke('send-confirmation-email', {
                body: { quote: quote, type: 'customer' }
            }).catch(e => console.error('[Confirm Booking] Customer email fallback error:', e));
        }
        if (!adminEmailSent) {
            console.log('[Confirm Booking] Trying Edge Function fallback for admin email...');
            await supabase.functions.invoke('send-confirmation-email', {
                body: { quote: quote, type: 'admin' }
            }).catch(e => console.error('[Confirm Booking] Admin email fallback error:', e));
        }

        // SMS Confirmation via Twilio (fire-and-forget)
        const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
        const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
        const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

        if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER && quote.phone) {
            const smsBody = `Booking Confirmed! ✅\nHi ${quote.name}, your ChauffeurTop booking for ${new Date(quote.date).toLocaleDateString('en-AU')} is confirmed. Our team will be in touch to arrange payment and final details. Ref: #${quote.id.substring(0, 8).toUpperCase()}`;

            const params = new URLSearchParams();
            params.append('To', quote.phone);
            params.append('From', TWILIO_PHONE_NUMBER);
            params.append('Body', smsBody);

            fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
                },
                body: params,
            }).then(res => {
                if (!res.ok) console.error('[Confirm Booking] Twilio SMS failed');
                else console.log('[Confirm Booking] Twilio SMS sent successfully');
            }).catch(e => console.error('[Confirm Booking] SMS error:', e));
        }

        console.log('[Confirm Booking] Success:', quote.id);

        // Handle Split Booking for Return Trips (fire-and-forget)
        const destinations = quote.destinations as any;
        
        if (destinations && typeof destinations === 'object' && !Array.isArray(destinations) && destinations.type === 'return_trip') {
            console.log('[Confirm Booking] Detected Return Trip. Splitting into two bookings (async)...');
            
            const outboundDetails = destinations.outbound;
            const returnDetails = destinations.return;

            if (outboundDetails && returnDetails) {
                supabase.from('quotes')
                    .update({
                        trip_leg: 'outbound',
                        pickup_location: outboundDetails.pickup,
                        dropoff_location: (outboundDetails.destinations && outboundDetails.destinations.length > 0) 
                            ? outboundDetails.destinations[outboundDetails.destinations.length - 1] 
                            : quote.dropoff_location,
                        destinations: outboundDetails.destinations || [],
                        date: outboundDetails.date,
                        time: outboundDetails.time,
                        melbourne_datetime: outboundDetails.cityDateTime
                    })
                    .eq('id', quote.id)
                    .then(({ error }) => {
                        if (error) console.error('[Confirm Booking] Error updating outbound leg:', error);
                        else console.log('[Confirm Booking] Updated original booking to outbound leg');
                    });

                const { id, created_at, updated_at, confirmation_token, ...baseQuoteData } = quote;
                supabase.from('quotes')
                    .insert({
                        ...baseQuoteData,
                        trip_leg: 'return',
                        status: 'confirmed',
                        pickup_location: returnDetails.pickup,
                        dropoff_location: returnDetails.destination,
                        destinations: [returnDetails.destination],
                        date: returnDetails.date,
                        time: returnDetails.time,
                        melbourne_datetime: returnDetails.cityDateTime,
                        related_booking_id: quote.id,
                        quote_accepted_at: new Date().toISOString(),
                        quoted_price: 0
                    })
                    .then(({ error }) => {
                        if (error) console.error('[Confirm Booking] Error creating return leg:', error);
                        else console.log('[Confirm Booking] Created return leg booking successfully');
                    });
            }
        }

        return NextResponse.json(
            { success: true, quote_id: quote.id },
            { status: 200 }
        );

    } catch (error) {
        console.error('[Confirm Booking] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
