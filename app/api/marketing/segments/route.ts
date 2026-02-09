import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Predefined segment definitions
const SEGMENT_DEFINITIONS = [
    {
        id: 'cancelled',
        name: 'Cancelled Bookings',
        description: 'Customers who cancelled their bookings',
        query: { segment: 'cancelled' },
    },
    {
        id: 'lost',
        name: 'Lost Leads',
        description: 'Quoted but never confirmed (7+ days old)',
        query: { segment: 'lost' },
    },
    {
        id: 'pending_old',
        name: 'Unresponded Requests',
        description: 'Pending requests older than 3 days',
        query: { segment: 'pending_old' },
    },
    {
        id: 'past_customers',
        name: 'Past Customers',
        description: 'Confirmed and completed bookings',
        query: { segment: 'past_customers' },
    },
    {
        id: 'high_value',
        name: 'High-Value Leads',
        description: 'Quoted price above $200',
        query: { segment: 'high_value' },
    },
    {
        id: 'airport',
        name: 'Airport Service Customers',
        description: 'Airport transfer bookings',
        query: { segment: 'airport' },
    },
    {
        id: 'corporate',
        name: 'Corporate Customers',
        description: 'Corporate service bookings',
        query: { segment: 'corporate' },
    },
    {
        id: 'all_leads',
        name: 'All Leads',
        description: 'Everyone in the quotes database',
        query: { segment: 'all_leads' },
    },
];

// GET: List available segments with counts
export async function GET() {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const segmentsWithCounts = await Promise.all(
            SEGMENT_DEFINITIONS.map(async (seg) => {
                const count = await getSegmentCount(seg.query.segment);
                return { ...seg, count };
            })
        );

        // Also get email subscribers count
        const { count: subscriberCount } = await supabaseAdmin
            .from('email_subscriptions')
            .select('id', { count: 'exact' })
            .eq('is_active', true);

        segmentsWithCounts.push({
            id: 'email_subscribers',
            name: 'Email Subscribers',
            description: 'Opted-in email subscribers from exit popup',
            query: { segment: 'email_subscribers' },
            count: subscriberCount || 0,
        });

        return NextResponse.json({ segments: segmentsWithCounts });
    } catch (error) {
        console.error('[Marketing Segments] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch segments' }, { status: 500 });
    }
}

// POST: Preview contacts in a segment
export async function POST(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { segment, limit = 50 } = body;

        let contacts: any[] = [];

        if (segment === 'email_subscribers') {
            const { data } = await supabaseAdmin
                .from('email_subscriptions')
                .select('id, email, source, subscribed_at')
                .eq('is_active', true)
                .order('subscribed_at', { ascending: false })
                .limit(limit);

            contacts = (data || []).map((sub: any) => ({
                id: sub.id,
                email: sub.email,
                name: null,
                source: sub.source,
                created_at: sub.subscribed_at,
            }));
        } else {
            let query = supabaseAdmin
                .from('quotes')
                .select('id, name, email, phone, status, quoted_price, service_type, created_at')
                .not('email', 'is', null)
                .order('created_at', { ascending: false })
                .limit(limit);

            query = applySegmentFilter(query, segment);

            const { data } = await query;
            contacts = data || [];
        }

        return NextResponse.json({ contacts, count: contacts.length });
    } catch (error) {
        console.error('[Marketing Segments] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch segment contacts' }, { status: 500 });
    }
}

function applySegmentFilter(query: any, segment: string) {
    switch (segment) {
        case 'cancelled':
            return query.eq('status', 'cancelled');
        case 'lost':
            return query.in('status', ['contacted', 'quoted'])
                .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
        case 'pending_old':
            return query.eq('status', 'pending')
                .lt('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString());
        case 'past_customers':
            return query.in('status', ['confirmed', 'completed']);
        case 'high_value':
            return query.gt('quoted_price', 200);
        case 'airport':
            return query.ilike('service_type', '%airport%');
        case 'corporate':
            return query.ilike('service_type', '%corporate%');
        case 'all_leads':
        default:
            return query;
    }
}

async function getSegmentCount(segment: string): Promise<number> {
    if (!supabaseAdmin) return 0;

    let query = supabaseAdmin
        .from('quotes')
        .select('id', { count: 'exact', head: true })
        .not('email', 'is', null);

    query = applySegmentFilter(query, segment);

    const { count } = await query;
    return count || 0;
}
