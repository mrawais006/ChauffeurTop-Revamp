import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET handler: Returns quote details for a given token (no state changes)
// Used by the confirmation page to display booking details before POST confirmation
export async function GET(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json(
            { error: 'Missing token' },
            { status: 400 }
        );
    }

    const { data: quote, error } = await supabaseAdmin
        .from('quotes')
        .select('id, name, email, phone, status, pickup_location, dropoff_location, destinations, date, time, vehicle_name, vehicle_type, passengers, quoted_price')
        .eq('confirmation_token', token)
        .single();

    if (error || !quote) {
        return NextResponse.json(
            { error: 'Booking not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ quote }, { status: 200 });
}
