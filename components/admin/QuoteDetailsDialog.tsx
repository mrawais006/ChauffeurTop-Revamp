'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Quote } from '@/types/admin';
import StatusBadge from './StatusBadge';
import { format, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { vehiclePricing } from '@/lib/vehicles';

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
import { 
  User, 
  Mail, 
  Phone, 
  Users, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Plane, 
  Building2,
  FileText,
  DollarSign,
  MessageSquare,
  Bell,
  Send,
  X,
  UserCheck,
  XCircle,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { QuoteResponseDialog } from './QuoteResponseDialog';
import { FollowUpDialog } from './FollowUpDialog';
import { EditPriceDialog } from './EditPriceDialog';
import { CompleteBookingDialog } from './CompleteBookingDialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface QuoteDetailsDialogProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updates?: Partial<Quote>) => void;
}

export default function QuoteDetailsDialog({
  quote,
  open,
  onOpenChange,
  onSuccess,
}: QuoteDetailsDialogProps) {
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [showEditPriceDialog, setShowEditPriceDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!quote) return null;

  const isConfirmedBooking = quote.status === 'confirmed';
  const isCompletedBooking = quote.status === 'completed';
  const isCancelledBooking = quote.status === 'cancelled';

  // Get vehicle starting price if available
  const vehicleStartingPrice = quote.vehicle_type ? vehiclePricing[quote.vehicle_type] : undefined;

  const handleCancelBooking = async () => {
    if (!confirm(`Are you sure you want to cancel ${quote.name}'s booking?`)) {
      return;
    }

    setCancelling(true);
    
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'cancelled' })
        .eq('id', quote.id);

      if (error) throw error;

      toast.success('Booking cancelled');
      if (onSuccess) onSuccess({ status: 'cancelled' });
      onOpenChange(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleAddToGoogleCalendar = () => {
    // Format dates for Google Calendar
    const startDate = new Date(`${quote.date}T${quote.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // Create event description
    const description = `Service Type: ${quote.service_type || 'N/A'}
Vehicle: ${quote.vehicle_name || quote.vehicle_type}
Pickup: ${quote.pickup_location}
Passengers: ${quote.passengers}
Phone: ${quote.phone}${quote.flight_number ? `
Flight: ${quote.flight_number}` : ''}${quote.quoted_price ? `
Price: $${quote.quoted_price.toFixed(2)}` : ''}`;

    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Chauffeur Service - ${quote.name}`)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(quote.pickup_location)}&sf=true&output=xml`;
    
    // Open Google Calendar in new tab
    window.open(googleCalendarUrl, '_blank');
  };

  const handleSendWhatsApp = () => {
    // Format message for WhatsApp
    const message = `Hello ${quote.name}! 👋

*Chauffeur Top Melbourne - Booking Details*

📅 *Date:* ${formatDate(quote.date)}
🕐 *Time:* ${formatTime(quote)}
🚗 *Vehicle:* ${quote.vehicle_name || quote.vehicle_type}
👥 *Passengers:* ${quote.passengers}
📍 *Pickup:* ${quote.pickup_location}
${quote.flight_number ? `✈️ *Flight:* ${quote.flight_number}` : ''}
${quote.quoted_price ? `💰 *Price:* $${quote.quoted_price.toFixed(2)}` : ''}

Looking forward to serving you!

Best regards,
Chauffeur Top Melbourne Team`;

    // Create WhatsApp link
    const phoneNumber = quote.phone.replace(/\D/g, ''); // Remove non-numeric characters
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), 'EEEE, MMMM do, yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return safeFormatDate(dateStr, "MMM dd, yyyy • h:mm a", MELBOURNE_TIMEZONE);
    } catch {
      return dateStr;
    }
  };

  // Format time with Melbourne timezone
  const formatTime = (quote: Quote) => {
    if (!quote) return 'N/A';
    
    // If melbourne_datetime exists, extract time from it
    if (quote.melbourne_datetime) {
      return safeFormatDate(quote.melbourne_datetime, 'HH:mm', MELBOURNE_TIMEZONE);
    }
    
    // Otherwise combine date + time and convert to Melbourne
    if (quote.date && quote.time) {
      const dateStr = quote.date.includes('T') ? quote.date.split('T')[0] : quote.date;
      const timeStr = quote.time.substring(0, 8);
      const combinedDateTime = `${dateStr}T${timeStr}Z`;
      return safeFormatDate(combinedDateTime, 'HH:mm', MELBOURNE_TIMEZONE);
    }
    
    return quote.time || 'N/A';
  };

  const formatDestinations = (destinations: any) => {
    if (Array.isArray(destinations)) {
      return destinations.join(' → ');
    }
    if (typeof destinations === 'object' && destinations?.type === 'return_trip') {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Outbound</span>
            <span>{destinations.outbound?.destinations?.join(' → ') || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Return</span>
            <span>{destinations.return?.destination || 'N/A'}</span>
          </div>
        </div>
      );
    }
    return 'N/A';
  };

  const getTripType = () => {
    if (quote.trip_leg === 'return') return { label: 'Return Trip', color: 'bg-blue-100 text-blue-700' };
    if (quote.trip_leg === 'outbound') return { label: 'Outbound', color: 'bg-purple-100 text-purple-700' };
    return { label: 'One Way', color: 'bg-gray-100 text-gray-700' };
  };

  const tripType = getTripType();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 gap-0 w-[calc(100vw-1rem)] sm:w-full">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-3 sm:px-6 py-5 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="h-6 w-6" />
                Quote Details
              </DialogTitle>
              <p className="text-amber-100 text-sm mt-1">ID: {quote.id.slice(0, 8)}...</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${tripType.color}`}>
                {tripType.label}
              </span>
              <StatusBadge status={quote.status} />
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="h-3.5 w-3.5" />
                  <span className="text-xs">Name</span>
                </div>
                <p className="font-semibold text-gray-900">{quote.name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-xs">Email</span>
                </div>
                <a href={`mailto:${quote.email}`} className="font-semibold text-blue-600 hover:underline text-sm break-all">
                  {quote.email || 'N/A'}
                </a>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="text-xs">Phone</span>
                </div>
                <a href={`tel:${quote.phone}`} className="font-semibold text-blue-600 hover:underline">
                  {quote.phone}
                </a>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-xs">Passengers</span>
                </div>
                <p className="font-semibold text-gray-900">{quote.passengers} person(s)</p>
              </div>
            </div>
          </div>

          {/* Trip Details Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Trip Details
            </h3>
            
            {/* Service Type & Vehicle */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-gray-500">Service Type</span>
                <p className="font-semibold text-gray-900">{quote.service_type || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-gray-500">Vehicle</span>
                <p className="font-semibold text-gray-900">
                  {quote.vehicle_name || quote.vehicle_type}
                  {quote.vehicle_model && <span className="text-gray-500 font-normal"> • {quote.vehicle_model}</span>}
                </p>
                {vehicleStartingPrice && (
                  <p className="text-sm text-amber-600 font-medium mt-1">
                    Starting from ${vehicleStartingPrice}
                  </p>
                )}
                {quote.passengers && (
                  <p className="text-xs text-gray-500 mt-1">
                    Passengers: {quote.passengers}
                  </p>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Pickup Location</span>
                  <p className="font-medium text-gray-900">{quote.pickup_location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Destination(s)</span>
                  <div className="font-medium text-gray-900">{formatDestinations(quote.destinations)}</div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
                <Calendar className="h-5 w-5 text-amber-600" />
                <div>
                  <span className="text-xs text-gray-500">Date</span>
                  <p className="font-semibold text-gray-900">{formatDate(quote.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <span className="text-xs text-gray-500">Time</span>
                  <p className="font-semibold text-gray-900">{formatTime(quote)}</p>
                </div>
              </div>
            </div>

            {/* Flight & Terminal (if applicable) */}
            {(quote.flight_number || quote.terminal_type) && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {quote.flight_number && (
                  <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                    <Plane className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-xs text-gray-500">Flight Number</span>
                      <p className="font-semibold text-gray-900">{quote.flight_number}</p>
                    </div>
                  </div>
                )}
                {quote.terminal_type && (
                  <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-xs text-gray-500">Terminal</span>
                      <p className="font-semibold text-gray-900">{quote.terminal_type}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Driver Instructions */}
            {quote.driver_instructions && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-700 mb-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs font-medium">Driver Instructions</span>
                </div>
                <p className="text-sm text-gray-800">{quote.driver_instructions}</p>
              </div>
            )}
          </div>

          

          {/* Admin Comments */}
          {quote.admin_comments && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Admin Comments
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{quote.admin_comments}</p>
            </div>
          )}

          {/* Activity History Section */}
          {((quote.reminder_count && quote.reminder_count > 0) || (quote.follow_up_count && quote.follow_up_count > 0)) && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Activity History</h3>
              <div className="space-y-3">
                {quote.follow_up_count && quote.follow_up_count > 0 && (
                  <div className="inline-block bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                    <p className="text-sm font-semibold text-blue-700">
                      {quote.follow_up_count} Follow-up sent
                    </p>
                    {(quote.last_follow_up_at || quote.last_reminder_sent) && (
                      <p className="text-xs text-blue-600 mt-1">
                        Last: {format(new Date(quote.last_follow_up_at || quote.last_reminder_sent || ''), 'M/d/yyyy, h:mm:ss a')}
                      </p>
                    )}
                  </div>
                )}
                {quote.reminder_count && quote.reminder_count > 0 && (
                  <div className="inline-block bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                    <p className="text-sm font-semibold text-blue-700">
                      {quote.reminder_count} Reminder{quote.reminder_count > 1 ? 's' : ''} sent
                    </p>
                    {quote.last_reminder_sent && (
                      <p className="text-xs text-blue-600 mt-1">
                        Last: {format(new Date(quote.last_reminder_sent), 'M/d/yyyy, h:mm:ss a')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
            
            {/* CONFIRMED BOOKING ACTIONS */}
            {isConfirmedBooking && (
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmed Booking
                    {quote.quoted_price && (
                      <span className="ml-auto">${Number(quote.quoted_price).toFixed(2)}</span>
                    )}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setShowEditPriceDialog(true)}
                    variant="outline"
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Edit Price
                  </Button>
                  <Button
                    onClick={handleCancelBooking}
                    variant="outline"
                    disabled={cancelling}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
                
                <Button
                  onClick={() => setShowCompleteDialog(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            )}

            {/* COMPLETED BOOKING INFO */}
            {isCompletedBooking && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                  {quote.quoted_price && (
                    <span className="ml-auto">${Number(quote.quoted_price).toFixed(2)}</span>
                  )}
                </p>
              </div>
            )}

            {/* CANCELLED BOOKING INFO */}
            {isCancelledBooking && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Cancelled
                  {quote.quoted_price && (
                    <span className="ml-auto line-through text-red-400">${Number(quote.quoted_price).toFixed(2)}</span>
                  )}
                </p>
              </div>
            )}
            
            {/* Send Quote Button - only if email exists and quote not sent yet */}
            {quote.email && !quote.quoted_price && !isConfirmedBooking && !isCompletedBooking && !isCancelledBooking && (
              <Button 
                onClick={() => setShowQuoteDialog(true)}
                className="w-full mb-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold shadow-md"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Quote with Pricing
              </Button>
            )}
            
            

            {/* Show quote sent confirmation below pricing */}
            {quote.quoted_price && quote.quote_sent_at && !isConfirmedBooking && !isCompletedBooking && !isCancelledBooking && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-800">
                  ✓ Quote sent: ${Number(quote.quoted_price).toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Sent on {format(new Date(quote.quote_sent_at), 'M/d/yyyy, h:mm:ss a')}
                </p>
              </div>
            )}
            
            {/* Follow-up Button - show if quote sent but not confirmed */}
            {quote.quoted_price && !isConfirmedBooking && !isCompletedBooking && !isCancelledBooking && (
              <Button 
                onClick={() => setShowFollowUpDialog(true)}
                className="w-full mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold shadow-md"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Follow Up with Customer
              </Button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-3 sm:px-6 py-4 bg-gray-50 rounded-b-lg">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleAddToGoogleCalendar}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-white border-blue-500 text-blue-600 hover:bg-blue-50 px-2 sm:px-4"
            >
              <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-600 font-medium text-xs sm:text-sm truncate">
                <span className="hidden sm:inline">Add to Google Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={handleSendWhatsApp}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-white border-green-500 text-green-700 hover:bg-green-50 px-2 sm:px-4"
            >
              <MessageCircle className="h-4 w-4 text-green-700 flex-shrink-0" />
              <span className="text-green-700 font-medium text-xs sm:text-sm truncate">
                <span className="hidden sm:inline">Send WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Dialog Components */}
      {showQuoteDialog && (
        <QuoteResponseDialog
          quote={quote}
          onClose={() => setShowQuoteDialog(false)}
          onSuccess={(updates) => {
            setShowQuoteDialog(false);
            if (onSuccess) onSuccess(updates);
          }}
        />
      )}

      {showFollowUpDialog && (
        <FollowUpDialog
          quote={quote}
          open={showFollowUpDialog}
          onClose={() => setShowFollowUpDialog(false)}
          onSuccess={(updates) => {
            setShowFollowUpDialog(false);
            if (onSuccess) onSuccess(updates);
          }}
        />
      )}

      {showEditPriceDialog && (
        <EditPriceDialog
          open={showEditPriceDialog}
          onOpenChange={setShowEditPriceDialog}
          bookingId={quote.id}
          currentPrice={quote.quoted_price ? Number(quote.quoted_price) : null}
          customerName={quote.name}
          onSuccess={(updates) => {
            if (onSuccess) onSuccess(updates);
          }}
        />
      )}

      {showCompleteDialog && (
        <CompleteBookingDialog
          open={showCompleteDialog}
          onOpenChange={setShowCompleteDialog}
          booking={quote}
          onSuccess={(updates) => {
            if (onSuccess) onSuccess(updates);
            onOpenChange(false);
          }}
        />
      )}
    </Dialog>
  );
}
