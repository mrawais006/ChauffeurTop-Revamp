'use client';

import { useState, memo } from 'react';
import type { Quote } from '@/types/admin';
import { format, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SendReminderDialog } from './SendReminderDialog';
import { updateQuoteStatus } from '@/lib/admin';
import { toast } from 'sonner';

// Melbourne timezone constant
const MELBOURNE_TIMEZONE = 'Australia/Melbourne';

// Safe date formatter with timezone support
const safeFormatDate = (dateStr: string, formatStr: string, timezone?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (!isValid(date)) return 'Invalid Date';

    // If timezone provided, convert from UTC to that timezone
    if (timezone) {
      return formatInTimeZone(date, timezone, formatStr);
    }
    return format(date, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};

interface QuoteRowProps {
  quote: Quote;
  index: number;
  onViewDetails: (quote: Quote) => void;
  onDelete?: (quoteId: string) => void;
  showReminder?: boolean;
  onQuoteUpdate?: (quoteId: string, updates: Partial<Quote>) => void;
}

function QuoteRow({
  quote,
  index,
  onViewDetails,
  onDelete,
  showReminder = false,
  onQuoteUpdate
}: QuoteRowProps) {
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatPickupDate = () => {
    try {
      if (!quote.date) return 'No date set';
      
      // Handle various date formats
      let dateStr: string;
      const date = new Date(quote.date);
      
      if (isValid(date)) {
        dateStr = format(date, 'dd/MM/yyyy');
      } else {
        // Try parsing as ISO string
        const isoDate = new Date(quote.date + 'T00:00:00');
        if (isValid(isoDate)) {
          dateStr = format(isoDate, 'dd/MM/yyyy');
        } else {
          dateStr = String(quote.date);
        }
      }
      
      const timeStr = quote.time ? String(quote.time).substring(0, 5) : '';
      return timeStr ? `${dateStr} ${timeStr}` : dateStr;
    } catch {
      return quote.date ? `${quote.date} ${quote.time || ''}` : 'No date';
    }
  };

  // Format destination for display
  const formatDestination = () => {
    try {
      if (Array.isArray(quote.destinations) && quote.destinations.length > 0) {
        return quote.destinations[0];
      }
      if (quote.dropoff_location) {
        return quote.dropoff_location;
      }
      if (typeof quote.destinations === 'object' && quote.destinations !== null) {
        // Handle return trip structure
        const dests = quote.destinations as any;
        if (dests.outbound?.destinations?.[0]) {
          return dests.outbound.destinations[0];
        }
      }
      return 'N/A';
    } catch {
      return 'N/A';
    }
  };

  const formatServiceDate = () => {
    try {
      // If melbourne_datetime exists, use it with proper timezone conversion
      if (quote.melbourne_datetime) {
        const result = safeFormatDate(
          quote.melbourne_datetime,
          "MMM do 'at' HH:mm",
          MELBOURNE_TIMEZONE
        );
        return result !== 'Invalid Date' ? result : 'Date pending';
      }

      // Fallback: If only date and time fields exist, combine them
      if (quote.date && quote.time) {
        // Combine date and time into ISO format
        const dateStr = String(quote.date).includes('T') ? String(quote.date).split('T')[0] : String(quote.date);
        const timeStr = String(quote.time).substring(0, 8); // HH:mm:ss
        const combinedDateTime = `${dateStr}T${timeStr}`;

        const result = safeFormatDate(
          combinedDateTime,
          "MMM do 'at' HH:mm",
          MELBOURNE_TIMEZONE
        );
        return result !== 'Invalid Date' ? result : 'Date pending';
      }

      if (quote.date) {
        const result = safeFormatDate(String(quote.date), "MMM do, yyyy", MELBOURNE_TIMEZONE);
        return result !== 'Invalid Date' ? result : 'Date pending';
      }

      return 'Date pending';
    } catch (error) {
      console.error('Error formatting service date:', error);
      return 'Date pending';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const previousStatus = quote.status;

    try {
      // Optimistically update in parent state immediately
      if (onQuoteUpdate) {
        onQuoteUpdate(quote.id, { status: newStatus as any });
      }

      // Save to database in background
      await updateQuoteStatus(quote.id, newStatus);
      toast.success('Status updated successfully');

    } catch (error) {
      // Revert on error
      if (onQuoteUpdate) {
        onQuoteUpdate(quote.id, { status: previousStatus });
      }
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm';
      case 'quoted':
        return 'bg-purple-100 text-purple-800 border-purple-300 shadow-sm';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300 shadow-sm';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300 shadow-sm';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300 shadow-sm';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 shadow-sm';
    }
  };

  // Row background color based on status
  const getRowBackground = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50';
      case 'contacted':
        return 'bg-blue-50';
      case 'quoted':
        return 'bg-purple-50';
      case 'confirmed':
        return 'bg-green-50';
      case 'completed':
        return 'bg-green-100';
      case 'cancelled':
        return 'bg-red-50';
      default:
        return 'bg-white';
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'contacted':
        return 'Contacted';
      case 'quoted':
        return 'Quoted';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  // Source badge colors
  const getSourceBadge = (source: string | null | undefined) => {
    if (!source) {
      return { color: 'bg-gray-100 text-gray-600', label: 'Website' };
    }
    switch (source) {
      case 'landing_airport':
        return { color: 'bg-blue-100 text-blue-700', label: 'Airport Ad' };
      case 'landing_corporate':
        return { color: 'bg-purple-100 text-purple-700', label: 'Corporate Ad' };
      case 'landing_family':
        return { color: 'bg-green-100 text-green-700', label: 'Family Ad' };
      case 'homepage_widget':
        return { color: 'bg-amber-100 text-amber-700', label: 'Widget' };
      case 'vehicle_selection':
        return { color: 'bg-cyan-100 text-cyan-700', label: 'Fleet' };
      case 'service_selection':
        return { color: 'bg-indigo-100 text-indigo-700', label: 'Service' };
      case 'website':
        return { color: 'bg-gray-100 text-gray-600', label: 'Website' };
      default:
        return { color: 'bg-gray-100 text-gray-600', label: source };
    }
  };

  const rowBg = getRowBackground(quote.status);

  return (
    <>
      <tr className={`border-b border-gray-200 ${rowBg}`}>
        {/* Pickup Date */}
        <td className="px-4 py-4 text-sm text-gray-900">
          {formatPickupDate()}
        </td>

        {/* Name */}
        <td className="px-4 py-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-medium">{quote.name}</span>
            {quote.trip_leg === 'outbound' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                ⇒ Outbound
              </span>
            )}
            {quote.trip_leg === 'return' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                ↩ Return
              </span>
            )}
          </div>
        </td>

        {/* Contact */}
        <td className="px-4 py-4 text-sm">
          <div className="text-gray-900">{quote.email || 'N/A'}</div>
          <div className="text-gray-600">{quote.phone}</div>
        </td>

        {/* Service */}
        <td className="px-4 py-4 text-sm">
          <div className="text-gray-900 font-medium">{quote.vehicle_type || quote.vehicle_name || 'N/A'}</div>
          <div className="text-gray-500 text-xs truncate max-w-[200px]" title={formatDestination()}>
            📍 {formatDestination()}
          </div>
          <div className="text-gray-400 text-xs mt-0.5">{formatServiceDate()}</div>
          {quote.follow_up_count && quote.follow_up_count > 0 && (
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                {quote.follow_up_count} follow-up
              </span>
            </div>
          )}
        </td>

        {/* Source */}
        <td className="px-4 py-4 text-sm">
          {(() => {
            const source = quote.lead_source?.source;
            const badge = getSourceBadge(source);
            return (
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                {badge.label}
              </span>
            );
          })()}
        </td>

        {/* Status */}
        <td className="px-4 py-4 text-sm">
          <Select
            value={quote.status || 'pending'}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger
              className={`w-[140px] border-2 font-bold text-base px-4 py-2 ${getStatusColor(quote.status)}`}
            >
              <SelectValue className="font-bold">
                {getStatusLabel(quote.status)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </td>

        {/* Actions */}
        <td className="px-4 py-4 text-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(quote)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View Details
            </button>
            {/* Reminder Button - only show for upcoming confirmed bookings */}
            {showReminder && quote.status === 'confirmed' && (
              <button
                onClick={() => setShowReminderDialog(true)}
                className="p-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                title="Send Reminder"
              >
                <Bell className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(quote.id)}
                className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Reminder Dialog */}
      {showReminder && onQuoteUpdate && (
        <SendReminderDialog
          open={showReminderDialog}
          onOpenChange={setShowReminderDialog}
          booking={quote}
          onSuccess={() => {
            // Update the quote with new reminder data
            onQuoteUpdate(quote.id, {
              reminder_count: (quote.reminder_count || 0) + 1,
              last_reminder_sent: new Date().toISOString()
            });
          }}
        />
      )}
    </>
  );
}

// Memoize to prevent unnecessary re-renders of individual rows
// Only re-render when the quote data actually changes
export default memo(QuoteRow, (prevProps, nextProps) => {
  // Re-render if quote ID changed (shouldn't happen but be safe)
  if (prevProps.quote.id !== nextProps.quote.id) return false;

  // Re-render if status changed
  if (prevProps.quote.status !== nextProps.quote.status) return false;

  // Re-render if quoted price changed
  if (prevProps.quote.quoted_price !== nextProps.quote.quoted_price) return false;

  // Re-render if follow-up data changed
  if (prevProps.quote.follow_up_count !== nextProps.quote.follow_up_count) return false;
  if (prevProps.quote.last_follow_up_at !== nextProps.quote.last_follow_up_at) return false;

  // Re-render if any key fields changed
  if (prevProps.quote.name !== nextProps.quote.name) return false;
  if (prevProps.quote.email !== nextProps.quote.email) return false;
  if (prevProps.quote.phone !== nextProps.quote.phone) return false;

  // Re-render if showReminder prop changed
  if (prevProps.showReminder !== nextProps.showReminder) return false;

  return true; // Props are equal, skip re-render
});
