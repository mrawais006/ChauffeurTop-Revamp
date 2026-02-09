import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: List all audiences
export async function GET() {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('marketing_audiences')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ audiences: data });
    } catch (error) {
        console.error('[Marketing Audiences] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch audiences' }, { status: 500 });
    }
}

// POST: Create a new audience
export async function POST(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { name, description, filter_criteria } = body;

        if (!name) {
            return NextResponse.json({ error: 'Audience name is required' }, { status: 400 });
        }

        // Create audience in Resend if API key is available
        let resendAudienceId = null;
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (RESEND_API_KEY) {
            try {
                const resendRes = await fetch('https://api.resend.com/audiences', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name }),
                });

                if (resendRes.ok) {
                    const resendData = await resendRes.json();
                    resendAudienceId = resendData.id;
                } else {
                    console.warn('[Marketing] Failed to create Resend audience, continuing without sync');
                }
            } catch (err) {
                console.warn('[Marketing] Resend API error:', err);
            }
        }

        // Get contact count based on filter criteria
        let contactCount = 0;
        if (filter_criteria) {
            const countResult = await getSegmentContacts(filter_criteria, true);
            contactCount = countResult.count;
        }

        const { data, error } = await supabaseAdmin
            .from('marketing_audiences')
            .insert({
                name,
                description,
                filter_criteria,
                resend_audience_id: resendAudienceId,
                contact_count: contactCount,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ audience: data });
    } catch (error) {
        console.error('[Marketing Audiences] Error:', error);
        return NextResponse.json({ error: 'Failed to create audience' }, { status: 500 });
    }
}

// PUT: Update an audience
export async function PUT(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { id, name, description, filter_criteria } = body;

        if (!id) {
            return NextResponse.json({ error: 'Audience ID is required' }, { status: 400 });
        }

        let contactCount = 0;
        if (filter_criteria) {
            const countResult = await getSegmentContacts(filter_criteria, true);
            contactCount = countResult.count;
        }

        const { data, error } = await supabaseAdmin
            .from('marketing_audiences')
            .update({
                name,
                description,
                filter_criteria,
                contact_count: contactCount,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ audience: data });
    } catch (error) {
        console.error('[Marketing Audiences] Error:', error);
        return NextResponse.json({ error: 'Failed to update audience' }, { status: 500 });
    }
}

// DELETE: Delete an audience
export async function DELETE(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Audience ID is required' }, { status: 400 });
        }

        // Get audience details for Resend cleanup
        const { data: audience } = await supabaseAdmin
            .from('marketing_audiences')
            .select('resend_audience_id')
            .eq('id', id)
            .single();

        // Delete from Resend if synced
        if (audience?.resend_audience_id) {
            const RESEND_API_KEY = process.env.RESEND_API_KEY;
            if (RESEND_API_KEY) {
                try {
                    await fetch(`https://api.resend.com/audiences/${audience.resend_audience_id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` },
                    });
                } catch (err) {
                    console.warn('[Marketing] Failed to delete Resend audience:', err);
                }
            }
        }

        const { error } = await supabaseAdmin
            .from('marketing_audiences')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Marketing Audiences] Error:', error);
        return NextResponse.json({ error: 'Failed to delete audience' }, { status: 500 });
    }
}

// Helper function to get segment contacts
async function getSegmentContacts(criteria: any, countOnly: boolean = false) {
    if (!supabaseAdmin) return { contacts: [], count: 0 };

    const { segment, customFilter } = criteria;

    let query = supabaseAdmin
        .from('quotes')
        .select(countOnly ? 'id' : 'id, name, email, phone, status, quoted_price, service_type, created_at', { count: 'exact' });

    // Apply segment filters
    switch (segment) {
        case 'cancelled':
            query = query.eq('status', 'cancelled');
            break;
        case 'lost':
            query = query.in('status', ['contacted', 'quoted'])
                .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
            break;
        case 'pending_old':
            query = query.eq('status', 'pending')
                .lt('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString());
            break;
        case 'past_customers':
            query = query.in('status', ['confirmed', 'completed']);
            break;
        case 'high_value':
            query = query.gt('quoted_price', 200);
            break;
        case 'airport':
            query = query.ilike('service_type', '%airport%');
            break;
        case 'corporate':
            query = query.ilike('service_type', '%corporate%');
            break;
        case 'all_leads':
            // No additional filter
            break;
        default:
            break;
    }

    // Apply custom filters if present
    if (customFilter) {
        if (customFilter.minPrice) {
            query = query.gte('quoted_price', customFilter.minPrice);
        }
        if (customFilter.maxPrice) {
            query = query.lte('quoted_price', customFilter.maxPrice);
        }
        if (customFilter.dateFrom) {
            query = query.gte('created_at', customFilter.dateFrom);
        }
        if (customFilter.dateTo) {
            query = query.lte('created_at', customFilter.dateTo);
        }
    }

    // Only include records with email
    query = query.not('email', 'is', null);

    const { data, count, error } = await query;

    if (error) {
        console.error('[Segment] Query error:', error);
        return { contacts: [], count: 0 };
    }

    return { contacts: data || [], count: count || (data?.length ?? 0) };
}

export { getSegmentContacts };
