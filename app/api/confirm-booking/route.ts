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
                confirmation_token: null // Clear token to prevent reuse
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

        console.log('[Confirm Booking] Success:', quote.id);

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
