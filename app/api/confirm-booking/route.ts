import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
        // Customer email
        Promise.resolve(supabase.functions.invoke('send-confirmation-email', {
            body: { quote: quote, type: 'customer' }
        })).then(() => console.log('[Confirm Booking] Customer email sent'))
          .catch(e => console.error('[Confirm Booking] Customer email error:', e));

        // Admin email
        Promise.resolve(supabase.functions.invoke('send-confirmation-email', {
            body: { quote: quote, type: 'admin' }
        })).then(() => console.log('[Confirm Booking] Admin email sent'))
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
