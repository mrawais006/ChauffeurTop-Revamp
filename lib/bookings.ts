import type { Quote } from '@/types/admin';

// Check if a booking is within the next 24 hours
export function isWithinNext24Hours(
  dateStr: string,
  timeStr: string,
  melbourneDatetime?: string | null
): boolean {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  let pickupDate: Date;
  
  if (melbourneDatetime) {
    pickupDate = new Date(melbourneDatetime);
  } else {
    // Parse date and time
    const [hours, minutes] = timeStr.split(':').map(Number);
    pickupDate = new Date(dateStr);
    pickupDate.setHours(hours || 0, minutes || 0, 0, 0);
  }
  
  return pickupDate >= now && pickupDate <= in24Hours;
}

// Helper to safely get pickup datetime for sorting
export function getPickupTime(quote: Quote): number {
  try {
    if (quote.melbourne_datetime) {
      const d = new Date(quote.melbourne_datetime);
      if (!isNaN(d.getTime())) return d.getTime();
    }
    if (quote.date && quote.time) {
      const d = new Date(`${quote.date}T${quote.time}`);
      if (!isNaN(d.getTime())) return d.getTime();
    }
  } catch {}
  return Infinity; // Put invalid dates at the end
}

// Filter quotes by status groups
export const QUOTE_STATUSES = ['pending', 'contacted', 'quoted'];
export const BOOKING_STATUSES = ['confirmed', 'completed', 'cancelled'];

// Get upcoming bookings (confirmed + within 24 hours)
export function getUpcomingBookings(quotes: Quote[]): Quote[] {
  return quotes
    .filter(q => 
      q.status === 'confirmed' && 
      isWithinNext24Hours(q.date || '', q.time || '', q.melbourne_datetime)
    )
    .sort((a, b) => getPickupTime(a) - getPickupTime(b));
}

// Get quotes (pending/contacted/quoted only)
export function getQuotes(quotes: Quote[]): Quote[] {
  return quotes.filter(q => QUOTE_STATUSES.includes(q.status || 'pending'));
}

// Get confirmed bookings sorted by pickup date
export function getBookings(quotes: Quote[]): Quote[] {
  return quotes
    .filter(q => q.status === 'confirmed')
    .sort((a, b) => getPickupTime(a) - getPickupTime(b));
}

// Get history (completed and cancelled)
export function getHistory(quotes: Quote[]): Quote[] {
  return quotes
    .filter(q => q.status === 'completed' || q.status === 'cancelled')
    .sort((a, b) => getPickupTime(b) - getPickupTime(a)); // Most recent first
}

