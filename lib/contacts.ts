import { supabase } from '@/lib/supabase';
import type { Contact, ContactStatus } from '@/types/admin';

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
 * Update contact status
 */
export async function updateContactStatus(
  contactId: string,
  status: ContactStatus
): Promise<void> {
  try {
    console.log('[updateContactStatus] Attempting to update:', { contactId, status });
    
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', contactId)
      .select();

    console.log('[updateContactStatus] Response:', { data, error });

    if (error) {
      console.error('[updateContactStatus] Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No contact found with the given ID or update failed');
    }
  } catch (error: any) {
    console.error('[updateContactStatus] Failed:', {
      error,
      message: error?.message,
      contactId,
      status
    });
    throw error;
  }
}

/**
 * Calculate contact statistics
 */
export function calculateContactStats(contacts: Contact[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Count by time period
  const today = contacts.filter(c => new Date(c.created_at) >= todayStart).length;
  const week = contacts.filter(c => new Date(c.created_at) >= weekStart).length;
  const month = contacts.filter(c => new Date(c.created_at) >= monthStart).length;
  const allTime = contacts.length;

  // Count by status
  const newCount = contacts.filter(c => c.status === 'pending').length;
  const contactedCount = contacts.filter(c => c.status === 'contacted').length;
  const resolvedCount = contacts.filter(c => c.status === 'resolved').length;

  return {
    today,
    week,
    month,
    allTime,
    newCount,
    contactedCount,
    resolvedCount,
  };
}

