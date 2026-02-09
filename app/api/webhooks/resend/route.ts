import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST: Handle Resend webhook events
export async function POST(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { type, data } = body;

        console.log(`[Resend Webhook] Received event: ${type}`);

        // We track campaign-level stats by matching email IDs
        // For now, we'll use a simpler approach: increment counters based on event type
        switch (type) {
            case 'email.delivered':
                // Email was successfully delivered
                console.log(`[Resend Webhook] Email delivered to: ${data?.to}`);
                break;

            case 'email.opened':
                // Email was opened - increment open count for matching campaigns
                console.log(`[Resend Webhook] Email opened by: ${data?.to}`);
                if (data?.tags?.campaign_id) {
                    await supabaseAdmin.rpc('increment_campaign_opens', {
                        campaign_uuid: data.tags.campaign_id,
                    }).catch(() => {
                        // Fallback: direct update
                        supabaseAdmin
                            .from('marketing_campaigns')
                            .update({ open_count: supabaseAdmin.rpc('', {}) })
                            .eq('id', data.tags.campaign_id);
                    });
                }
                break;

            case 'email.clicked':
                // Link was clicked
                console.log(`[Resend Webhook] Link clicked by: ${data?.to}`);
                if (data?.tags?.campaign_id) {
                    await supabaseAdmin
                        .from('marketing_campaigns')
                        .select('click_count')
                        .eq('id', data.tags.campaign_id)
                        .single()
                        .then(({ data: campaign }) => {
                            if (campaign) {
                                supabaseAdmin
                                    .from('marketing_campaigns')
                                    .update({ click_count: (campaign.click_count || 0) + 1 })
                                    .eq('id', data.tags.campaign_id);
                            }
                        });
                }
                break;

            case 'email.bounced':
                // Email bounced - log for cleanup
                console.log(`[Resend Webhook] Email bounced: ${data?.to}`);
                break;

            case 'email.complained':
                // Spam complaint
                console.log(`[Resend Webhook] Spam complaint from: ${data?.to}`);
                break;

            default:
                console.log(`[Resend Webhook] Unhandled event type: ${type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[Resend Webhook] Error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
