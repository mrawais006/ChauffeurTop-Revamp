import { supabase } from '@/lib/supabase';
import type { Quote, Contact } from '@/types/admin';

/**
 * Fetch all quotes from Supabase
 */
export async function fetchQuotes(): Promise<Quote[]> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[fetchQuotes] Error:', error);
      throw error;
    }

    // Add timezone fallback for older records
    const processedQuotes = (data || []).map(quote => {
      if (!quote.timezone) {
        quote.timezone = 'Australia/Melbourne';
      }
      if (!quote.melbourne_datetime && quote.date && quote.time) {
        const dateStr = new Date(quote.date).toISOString().split('T')[0];
        quote.melbourne_datetime = `${dateStr}T${quote.time}`;
      }
      return quote;
    });

    return processedQuotes;
  } catch (error) {
    console.error('[fetchQuotes] Failed:', error);
    throw error;
  }
}

/**
 * Fetch all contacts from Supabase
 */
export async function fetchContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[fetchContacts] Error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[fetchContacts] Failed:', error);
    throw error;
  }
}

/**
 * Update quote status
 */
export async function updateQuoteStatus(
  quoteId: string,
  status: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('quotes')
      .update({ status })
      .eq('id', quoteId);

    if (error) {
      console.error('[updateQuoteStatus] Error:', error);
      throw error;
    }
  } catch (error) {
    console.error('[updateQuoteStatus] Failed:', error);
    throw error;
  }
}

