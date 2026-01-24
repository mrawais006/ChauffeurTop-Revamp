'use client';

import { memo, useState } from 'react';
import type { Quote } from '@/types/admin';
import { format, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Trash2, Bell } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SendReminderDialog } from './SendReminderDialog';
import { updateQuoteStatus } from '@/lib/admin';
import { toast } from 'sonner';

interface QuoteCardProps {
  quote: Quote;
  onViewDetails: () => void;
  onDelete?: () => void;
  onQuoteUpdate?: (quoteId: string, updates: Partial<Quote>) => void;
  showReminder?: boolean;
}

// Melbourne timezone constant
const MELBOURNE_TIMEZONE = 'Australia/Melbourne';

// Safe date formatter with timezone support
const safeFormatDate = (dateStr: string, formatStr: string, timezone?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (!isValid(date)) return 'Invalid Date';
    
    if (timezone) {
      return formatInTimeZone(date, timezone, formatStr);
    }
    return format(date, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};

function QuoteCard({ quote, onViewDetails, onDelete, onQuoteUpdate, showReminder = false }: QuoteCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  // Format pickup date and time
  const formatPickupDateTime = () => {
    if (quote.melbourne_datetime) {
      return safeFormatDate(quote.melbourne_datetime, "dd/MM/yyyy HH:mm", MELBOURNE_TIMEZONE);
    }
    
    if (quote.date && quote.time) {
      const dateStr = quote.date.includes('T') ? quote.date.split('T')[0] : quote.date;
      const timeStr = quote.time.substring(0, 8);
      const combinedDateTime = `${dateStr}T${timeStr}Z`;
      const formattedDate = safeFormatDate(combinedDateTime, 'dd/MM/yyyy', MELBOURNE_TIMEZONE);
      const formattedTime = safeFormatDate(combinedDateTime, 'HH:mm', MELBOURNE_TIMEZONE);
      return `${formattedDate} ${formattedTime}`;
    }
    
    return 'TBD';
  };

  const formatServiceDateTime = () => {
    if (quote.melbourne_datetime) {
      return safeFormatDate(quote.melbourne_datetime, "MMMM do, yyyy 'at' HH:mm", MELBOURNE_TIMEZONE);
    }
    
    if (quote.date && quote.time) {
      const dateStr = quote.date.includes('T') ? quote.date.split('T')[0] : quote.date;
      const timeStr = quote.time.substring(0, 8);
      const combinedDateTime = `${dateStr}T${timeStr}Z`;
      return safeFormatDate(combinedDateTime, "MMMM do, yyyy 'at' HH:mm", MELBOURNE_TIMEZONE);
    }
    
    return 'TBD';
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const previousStatus = quote.status;
    
    try {
      if (onQuoteUpdate) {
        onQuoteUpdate(quote.id, { status: newStatus as any });
      }
      
      await updateQuoteStatus(quote.id, newStatus);
      toast.success('Status updated successfully');
    } catch (error) {
      if (onQuoteUpdate) {
        onQuoteUpdate(quote.id, { status: previousStatus });
      }
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'contacted': return 'Contacted';
      case 'quoted': return 'Quoted';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'quoted': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCardBackground = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'contacted': return 'bg-blue-50 border-blue-200';
      case 'quoted': return 'bg-purple-50 border-purple-200';
      case 'confirmed': return 'bg-green-50 border-green-200';
      case 'completed': return 'bg-green-50 border-green-200';
      case 'cancelled': return 'bg-red-50 border-red-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className={`rounded-lg p-4 shadow-sm border ${getCardBackground(quote.status)}`}>
      {/* Pickup */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Pickup:</p>
        <p className="text-sm font-semibold text-gray-900">{formatPickupDateTime()}</p>
      </div>

      {/* Name */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Name:</p>
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-gray-900">{quote.name}</p>
          {quote.trip_leg === 'outbound' && (
            <span className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-700 border border-purple-200">
              ⇒ Outbound
            </span>
          )}
          {quote.trip_leg === 'return' && (
            <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 border border-blue-200">
              ↩ Return
            </span>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Contact:</p>
        <p className="text-sm text-gray-700">{quote.email || 'N/A'}</p>
        <p className="text-sm text-gray-700">{quote.phone}</p>
      </div>

      {/* Service */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Service:</p>
        <p className="text-sm font-medium text-gray-900">{quote.vehicle_type || quote.vehicle_name || 'N/A'}</p>
        <p className="text-xs text-gray-600">{formatServiceDateTime()}</p>
        {quote.follow_up_count && quote.follow_up_count > 0 && (
          <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 border border-blue-200">
            {quote.follow_up_count} follow-up
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Status:</p>
        <Select
          value={quote.status || 'pending'}
          onValueChange={handleStatusChange}
          disabled={isUpdating}
        >
          <SelectTrigger 
            className={`w-full border-2 font-medium text-sm ${getStatusColor(quote.status)}`}
          >
            <SelectValue>
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
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Actions:</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
              onClick={onDelete}
              className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reminder Dialog */}
      {showReminder && onQuoteUpdate && (
        <SendReminderDialog
          open={showReminderDialog}
          onOpenChange={setShowReminderDialog}
          booking={quote}
          onSuccess={() => {
            onQuoteUpdate(quote.id, {
              reminder_count: (quote.reminder_count || 0) + 1,
              last_reminder_sent: new Date().toISOString()
            });
          }}
        />
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(QuoteCard, (prevProps, nextProps) => {
  if (prevProps.quote.id !== nextProps.quote.id) return false;
  if (prevProps.quote.status !== nextProps.quote.status) return false;
  if (prevProps.quote.quoted_price !== nextProps.quote.quoted_price) return false;
  if (prevProps.quote.follow_up_count !== nextProps.quote.follow_up_count) return false;
  if (prevProps.quote.last_follow_up_at !== nextProps.quote.last_follow_up_at) return false;
  if (prevProps.showReminder !== nextProps.showReminder) return false;
  return true;
});

