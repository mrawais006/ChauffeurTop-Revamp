import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chauffeurtop.com.au';
const ADMIN_EMAIL = 'admin@chauffeurtop.com.au';

// Direct Resend API call for admin notification (fallback if Edge Function fails)
async function sendAdminNotificationDirect(quote: any): Promise<boolean> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
        console.error('[Admin Notification] Missing RESEND_API_KEY');
        return false;
    }

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
          <h1>🔔 Booking Confirmed!</h1>
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
            <h3>🚗 Trip Information</h3>
            <p class="info"><strong>Date:</strong> ${new Date(quote.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p class="info"><strong>Time:</strong> ${quote.time}</p>
            <p class="info"><strong>Pickup:</strong> ${quote.pickup_location}</p>
            <p class="info"><strong>Dropoff:</strong> ${quote.dropoff_location || quote.destinations?.[0] || 'As discussed'}</p>
            <p class="info"><strong>Vehicle:</strong> ${quote.vehicle_name || quote.vehicle_type}</p>
            <p class="info"><strong>Passengers:</strong> ${quote.passengers}</p>
            <div class="price">$${(quote.quoted_price || 0).toFixed(2)}</div>
          </div>
          
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

export async function GET(request: NextRequest) {
    // Check if admin client is available (requires SUPABASE_SERVICE_ROLE_KEY)
    if (!supabaseAdmin) {
        console.error('[Confirm Booking] Internal Error: SUPABASE_SERVICE_ROLE_KEY is missing');
        return NextResponse.redirect(
            new URL('/confirm-booking/error?reason=server_configuration_error', request.url)
        );
    }

    const supabase = supabaseAdmin;

    try {
        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get('token');

        // Validate token parameter
        if (!token) {
            return NextResponse.redirect(
                new URL('/confirm-booking/error?reason=missing_token', request.url)
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
            return NextResponse.redirect(
                new URL('/confirm-booking/error?reason=invalid_token', request.url)
            );
        }

        // Check if booking is already confirmed
        if (quote.status === 'confirmed' || quote.status === 'completed') {
            console.log('[Confirm Booking] Booking already confirmed:', quote.id);
            return NextResponse.redirect(
                new URL(`/confirm-booking/${token}?already_confirmed=true`, request.url)
            );
        }

        // Update quote status to confirmed
        const { error: updateError } = await supabase
            .from('quotes')
            .update({
                status: 'confirmed',
                quote_accepted_at: new Date().toISOString(),
                // We keep the token so that if the user clicks the link again, 
                // we can identify the booking and show "Already Confirmed" instead of "Invalid Link"
                // confirmation_token: null 
            })
            .eq('id', quote.id);

        if (updateError) {
            console.error('[Confirm Booking] Update error:', updateError);
            return NextResponse.redirect(
                new URL('/confirm-booking/error?reason=update_failed', request.url)
            );
        }

        // Log the confirmation activity (fire-and-forget - non-blocking)
        Promise.resolve(supabase.from('quote_activities').insert({
            quote_id: quote.id,
            action_type: 'customer_confirmed',
            details: {
                confirmed_at: new Date().toISOString(),
                confirmed_price: quote.quoted_price,
                confirmation_method: 'email_link'
            }
        })).then(() => console.log('[Confirm Booking] Activity logged'))
          .catch(e => console.error('[Confirm Booking] Activity log error:', e));

        // Fire all notifications in parallel (non-blocking for fast confirmation)
        // Customer email via Edge Function
        Promise.resolve(supabase.functions.invoke('send-confirmation-email', {
            body: { quote: quote, type: 'customer' }
        })).then(() => console.log('[Confirm Booking] Customer email sent via Edge Function'))
          .catch(e => console.error('[Confirm Booking] Customer email error:', e));

        // Admin email - Use direct Resend API for reliability (bypasses Edge Function issues)
        sendAdminNotificationDirect(quote)
            .then(success => {
                if (!success) {
                    // Fallback to Edge Function if direct send fails
                    console.log('[Confirm Booking] Trying Edge Function fallback for admin email...');
                    return supabase.functions.invoke('send-confirmation-email', {
                        body: { quote: quote, type: 'admin' }
                    });
                }
            })
            .catch(e => console.error('[Confirm Booking] Admin email error:', e));

        // SMS Confirmation via Twilio (fire-and-forget)
        const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
        const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
        const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

        if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER && quote.phone) {
            const smsBody = `Booking Confirmed! ✅\nHi ${quote.name}, your ChauffeurTop booking for ${new Date(quote.date).toLocaleDateString('en-AU')} is confirmed. We will contact you 24hrs before pickup. Ref: #${quote.id.substring(0, 8).toUpperCase()}`;

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

        // Handle Split Booking for Return Trips (fire-and-forget - non-blocking)
        // We do this AFTER sending emails so the customer gets the full itinerary in their confirmation email
        const destinations = quote.destinations as any;
        
        if (destinations && typeof destinations === 'object' && !Array.isArray(destinations) && destinations.type === 'return_trip') {
            console.log('[Confirm Booking] Detected Return Trip. Splitting into two bookings (async)...');
            
            const outboundDetails = destinations.outbound;
            const returnDetails = destinations.return;

            if (outboundDetails && returnDetails) {
                // Fire-and-forget: Update outbound leg
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

                // Fire-and-forget: Create return leg
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

        // Redirect immediately to success page (all background tasks are fire-and-forget)
        return NextResponse.redirect(
            new URL(`/confirm-booking/${token}?success=true`, request.url)
        );

    } catch (error) {
        console.error('[Confirm Booking] Unexpected error:', error);
        return NextResponse.redirect(
            new URL('/confirm-booking/error?reason=server_error', request.url)
        );
    }
}
