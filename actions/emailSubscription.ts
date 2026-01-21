'use server';

import { supabaseAdmin } from '@/lib/supabase';

interface SubscriptionResult {
  success: boolean;
  error?: string;
  discountCode?: string;
}

// Generate a unique discount code
function generateDiscountCode(): string {
  const prefix = 'LUXURY';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomPart}`;
}

export async function subscribeEmail(
  email: string,
  source: string = 'exit_popup'
): Promise<SubscriptionResult> {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address' };
    }

    if (!supabaseAdmin) {
      console.error('SERVER ERROR: SUPABASE_SERVICE_ROLE_KEY is missing');
      return { success: false, error: 'Server configuration error' };
    }

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('email_subscriptions')
      .select('id, is_active, discount_code')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      if (existing.is_active) {
        // Already subscribed, return existing discount code
        return { 
          success: true, 
          discountCode: existing.discount_code || generateDiscountCode()
        };
      } else {
        // Reactivate subscription
        const discountCode = generateDiscountCode();
        await supabaseAdmin
          .from('email_subscriptions')
          .update({ 
            is_active: true, 
            discount_code: discountCode,
            unsubscribed_at: null 
          })
          .eq('id', existing.id);

        return { success: true, discountCode };
      }
    }

    // New subscription
    const discountCode = generateDiscountCode();
    const { error: insertError } = await supabaseAdmin
      .from('email_subscriptions')
      .insert({
        email: email.toLowerCase().trim(),
        source,
        discount_code: discountCode,
        is_active: true,
        metadata: {
          subscribed_from: typeof window !== 'undefined' ? window.location.href : 'server',
          user_agent: 'server-side'
        }
      });

    if (insertError) {
      console.error('Email subscription error:', insertError);
      return { success: false, error: 'Failed to subscribe. Please try again.' };
    }

    return { success: true, discountCode };
  } catch (error) {
    console.error('Email subscription error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getEmailSubscribers() {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Server configuration error', data: [] };
    }

    const { data, error } = await supabaseAdmin
      .from('email_subscriptions')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return { success: false, error: 'Failed to fetch subscribers', data: [] };
  }
}

export async function unsubscribeEmail(email: string): Promise<SubscriptionResult> {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Server configuration error' };
    }

    const { error } = await supabaseAdmin
      .from('email_subscriptions')
      .update({ 
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase().trim());

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, error: 'Failed to unsubscribe' };
  }
}
