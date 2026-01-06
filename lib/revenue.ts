import type { Quote } from '@/types/admin';

export interface RevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
  confirmedCount: number;
}

/**
 * Calculate revenue statistics from quotes
 */
export function calculateRevenueStats(quotes: Quote[]): RevenueStats {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Start of week (Sunday)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  // Start of month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filter only confirmed and completed bookings with quoted price
  const confirmedBookings = quotes.filter(
    (q) => (q.status === 'confirmed' || q.status === 'completed') && q.quoted_price
  );

  // Helper to calculate revenue from a date range
  const calculateRevenue = (startDate?: Date): number => {
    return confirmedBookings
      .filter((booking) => {
        if (!startDate) return true;
        
        // Use quote_accepted_at if available, otherwise created_at
        const confirmedAt = booking.quote_accepted_at
          ? new Date(booking.quote_accepted_at)
          : booking.created_at
          ? new Date(booking.created_at)
          : null;
        
        return confirmedAt && confirmedAt >= startDate;
      })
      .reduce((sum, booking) => sum + (Number(booking.quoted_price) || 0), 0);
  };

  return {
    today: calculateRevenue(today),
    thisWeek: calculateRevenue(weekStart),
    thisMonth: calculateRevenue(monthStart),
    allTime: calculateRevenue(),
    confirmedCount: confirmedBookings.length,
  };
}

/**
 * Format currency in Australian dollars
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate revenue growth percentage
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

