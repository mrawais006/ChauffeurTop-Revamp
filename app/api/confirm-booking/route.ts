import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

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

        // Log the confirmation activity
        await supabase.from('quote_activities').insert({
            quote_id: quote.id,
            action_type: 'customer_confirmed',
            details: {
                confirmed_at: new Date().toISOString(),
                confirmed_price: quote.quoted_price,
                confirmation_method: 'email_link'
            }
        });

        // Send confirmation email to customer
        try {
            await supabase.functions.invoke('send-confirmation-email', {
                body: {
                    quote: quote,
                    type: 'customer'
                }
            });
        } catch (emailError) {
            console.error('[Confirm Booking] Email error:', emailError);
            // Don't fail the confirmation if email fails
        }

        // Optionally notify admin of new confirmation
        try {
            await supabase.functions.invoke('send-confirmation-email', {
                body: {
                    quote: quote,
                    type: 'admin'
                }
            });
        } catch (emailError) {
            console.error('[Confirm Booking] Admin notification error:', emailError);
            // Don't fail the confirmation if email fails
        }

        // -----------------------------
        // Send SMS Confirmation via Twilio
        // -----------------------------
        try {
            const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
            const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
            const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

            if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER && quote.phone) {
                console.log('[Confirm Booking] Sending confirmation SMS to:', quote.phone);

                const smsBody = `Booking Confirmed! ✅\nHi ${quote.name}, your ChauffeurTop booking for ${new Date(quote.date).toLocaleDateString('en-AU')} is confirmed. We will contact you 24hrs before pickup. Ref: #${quote.id.substring(0, 8).toUpperCase()}`;

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
                            'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
                        },
                        body: params,
                    }
                );

                if (!twilioRes.ok) {
                    const twilioError = await twilioRes.text();
                    console.error('[Confirm Booking] Twilio SMS failed:', twilioError);
                } else {
                    console.log('[Confirm Booking] Twilio SMS sent successfully');
                }
            }
        } catch (smsError) {
            console.error('[Confirm Booking] Error sending SMS:', smsError);
            // Non-blocking error
        }

        console.log('[Confirm Booking] Success:', quote.id);

        // Handle Split Booking for Return Trips
        // We do this AFTER sending emails so the customer gets the full itinerary in their confirmation email
        try {
            const destinations = quote.destinations as any;
            
            // Check for Return Trip structure (based on BookingForm.tsx)
            if (destinations && typeof destinations === 'object' && !Array.isArray(destinations) && destinations.type === 'return_trip') {
                console.log('[Confirm Booking] Detected Return Trip. Splitting into two bookings...');
                
                const outboundDetails = destinations.outbound;
                const returnDetails = destinations.return;

                if (outboundDetails && returnDetails) {
                    // 1. Update the ORIGINAL booking to be the OUTBOUND leg
                    const { error: outboundError } = await supabase
                        .from('quotes')
                        .update({
                            trip_leg: 'outbound',
                            // Update locations to be specific to outbound leg
                            pickup_location: outboundDetails.pickup,
                            dropoff_location: (outboundDetails.destinations && outboundDetails.destinations.length > 0) 
                                ? outboundDetails.destinations[outboundDetails.destinations.length - 1] 
                                : quote.dropoff_location,
                            destinations: outboundDetails.destinations || [], // Simplify to array
                            date: outboundDetails.date,
                            time: outboundDetails.time,
                            melbourne_datetime: outboundDetails.cityDateTime
                        })
                        .eq('id', quote.id);

                    if (outboundError) {
                        console.error('[Confirm Booking] Error updating outbound leg:', outboundError);
                    } else {
                        console.log('[Confirm Booking] Updated original booking to outbound leg');
                    }

                    // 2. Create the NEW booking for the RETURN leg
                    // We must exclude 'id' to let Postgres generate a new UUID
                    // We also clear specific fields that should be distinct
                    const { id, created_at, updated_at, confirmation_token, ...baseQuoteData } = quote;

                    const { error: returnError } = await supabase
                        .from('quotes')
                        .insert({
                            ...baseQuoteData, // Copy customer info (name, email, phone, vehicle, etc.)
                            trip_leg: 'return',
                            status: 'confirmed',
                            // Return Leg Details
                            pickup_location: returnDetails.pickup,
                            dropoff_location: returnDetails.destination,
                            destinations: [returnDetails.destination], // Simple array for return
                            date: returnDetails.date,
                            time: returnDetails.time,
                            melbourne_datetime: returnDetails.cityDateTime,
                            // Link to original booking
                            related_booking_id: quote.id,
                            // Set timestamps
                            quote_accepted_at: new Date().toISOString(),
                            // Financials: Set return leg price to 0 to avoid double-counting revenue?
                            // User request: "divide them in two bookings".
                            // If we keep full price on both, it is wrong.
                            // If user paid Total, usually main booking holds the payment record.
                            quoted_price: 0 // Assume payment is attached to the primary booking
                        });

                    if (returnError) {
                        console.error('[Confirm Booking] Error creating return leg:', returnError);
                    } else {
                        console.log('[Confirm Booking] Created return leg booking successfully');
                    }
                }
            }
        } catch (splitError) {
            console.error('[Confirm Booking] Error in split booking logic:', splitError);
            // We catch error here so we don't block the redirect. 
            // The user is confirmed, even if split failed.
        }

        // Redirect to success page with token (token is now cleared from DB)
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
