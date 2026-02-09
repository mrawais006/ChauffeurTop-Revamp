import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: List all campaigns
export async function GET() {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('marketing_campaigns')
            .select('*, marketing_audiences(name)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ campaigns: data });
    } catch (error) {
        console.error('[Marketing Campaigns] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

// POST: Create and optionally send a campaign
export async function POST(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { audience_id, subject, template_type, html_content, action } = body;

        if (!subject || !template_type) {
            return NextResponse.json({ error: 'Subject and template type are required' }, { status: 400 });
        }

        // Create campaign record
        const { data: campaign, error: createError } = await supabaseAdmin
            .from('marketing_campaigns')
            .insert({
                audience_id,
                subject,
                template_type,
                html_content,
                status: action === 'send' ? 'sending' : 'draft',
            })
            .select()
            .single();

        if (createError) throw createError;

        // If action is 'send', send the campaign immediately
        if (action === 'send' && campaign) {
            await sendCampaign(campaign.id, audience_id, subject, html_content);
        }

        return NextResponse.json({ campaign });
    } catch (error) {
        console.error('[Marketing Campaigns] Error:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}

// PUT: Update a draft campaign or trigger send
export async function PUT(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { id, subject, html_content, action } = body;

        if (!id) {
            return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
        }

        // If action is 'send', send the campaign
        if (action === 'send') {
            const { data: campaign } = await supabaseAdmin
                .from('marketing_campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (!campaign) {
                return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
            }

            if (campaign.status !== 'draft') {
                return NextResponse.json({ error: 'Can only send draft campaigns' }, { status: 400 });
            }

            await supabaseAdmin
                .from('marketing_campaigns')
                .update({ status: 'sending' })
                .eq('id', id);

            await sendCampaign(id, campaign.audience_id, campaign.subject, campaign.html_content);

            const { data: updated } = await supabaseAdmin
                .from('marketing_campaigns')
                .select('*, marketing_audiences(name)')
                .eq('id', id)
                .single();

            return NextResponse.json({ campaign: updated });
        }

        // Otherwise, update draft
        const updates: Record<string, any> = {};
        if (subject) updates.subject = subject;
        if (html_content) updates.html_content = html_content;

        const { data, error } = await supabaseAdmin
            .from('marketing_campaigns')
            .update(updates)
            .eq('id', id)
            .select('*, marketing_audiences(name)')
            .single();

        if (error) throw error;

        return NextResponse.json({ campaign: data });
    } catch (error) {
        console.error('[Marketing Campaigns] Error:', error);
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }
}

// Send campaign emails
async function sendCampaign(campaignId: string, audienceId: string | null, subject: string, htmlContent: string) {
    if (!supabaseAdmin) return;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
        console.error('[Campaign] Missing RESEND_API_KEY');
        await supabaseAdmin.from('marketing_campaigns').update({ status: 'failed' }).eq('id', campaignId);
        return;
    }

    try {
        // Get audience contacts
        let emails: string[] = [];

        if (audienceId) {
            const { data: audience } = await supabaseAdmin
                .from('marketing_audiences')
                .select('filter_criteria, resend_audience_id')
                .eq('id', audienceId)
                .single();

            if (audience?.filter_criteria) {
                const segment = audience.filter_criteria.segment;

                if (segment === 'email_subscribers') {
                    const { data: subs } = await supabaseAdmin
                        .from('email_subscriptions')
                        .select('email')
                        .eq('is_active', true);
                    emails = (subs || []).map((s: any) => s.email).filter(Boolean);
                } else {
                    // Get emails from quotes table based on segment
                    let query = supabaseAdmin
                        .from('quotes')
                        .select('email')
                        .not('email', 'is', null);

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
                        default:
                            break;
                    }

                    const { data: contacts } = await query;
                    emails = (contacts || []).map((c: any) => c.email).filter(Boolean);
                }
            }
        }

        // Deduplicate emails
        const uniqueEmails = [...new Set(emails)];

        if (uniqueEmails.length === 0) {
            await supabaseAdmin
                .from('marketing_campaigns')
                .update({ status: 'failed', sent_count: 0 })
                .eq('id', campaignId);
            return;
        }

        // Send emails in batches (Resend supports batch sending up to 100 per request)
        let sentCount = 0;
        const batchSize = 50;

        for (let i = 0; i < uniqueEmails.length; i += batchSize) {
            const batch = uniqueEmails.slice(i, i + batchSize);

            // Send individual emails via Resend batch API
            const emailPayloads = batch.map(email => ({
                from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
                to: [email],
                subject,
                html: htmlContent,
            }));

            try {
                const res = await fetch('https://api.resend.com/emails/batch', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emailPayloads),
                });

                if (res.ok) {
                    sentCount += batch.length;
                } else {
                    const errorText = await res.text();
                    console.error(`[Campaign] Batch send error:`, errorText);
                }
            } catch (batchError) {
                console.error('[Campaign] Batch send failed:', batchError);
            }
        }

        // Update campaign status
        await supabaseAdmin
            .from('marketing_campaigns')
            .update({
                status: sentCount > 0 ? 'sent' : 'failed',
                sent_count: sentCount,
                sent_at: new Date().toISOString(),
            })
            .eq('id', campaignId);

        console.log(`[Campaign] Sent ${sentCount}/${uniqueEmails.length} emails for campaign ${campaignId}`);
    } catch (error) {
        console.error('[Campaign] Send error:', error);
        await supabaseAdmin
            .from('marketing_campaigns')
            .update({ status: 'failed' })
            .eq('id', campaignId);
    }
}
